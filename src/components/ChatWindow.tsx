"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChatStore } from "@/store/chat-state";
import { Message } from "./Message";
import { TypingIndicator } from "./TypingIndicator";
import { QuickActions } from "./ActionButtons";
import { Send, Image as ImageIcon, Mic } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    analyzePlantImage,
    analyzeSoilReport,
    getCropRecommendation,
    getQuickResponse,
} from "@/lib/ai-engine";

export function ChatWindow() {
    const { messages, isTyping, addMessage, setTyping, context, updateContext } = useChatStore();
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!input.trim() && !selectedFile) return;

        const userMessage = input.trim();
        const file = selectedFile;

        // Add user message
        const isPDF = file?.type === "application/pdf";
        addMessage({
            role: "user",
            content: userMessage || (isPDF ? "📄 [PDF uploaded]" : "📷 [Image uploaded]"),
            imageUrl: file && !isPDF ? URL.createObjectURL(file) : undefined,
        });

        setInput("");
        setSelectedFile(null);
        setTyping(true);

        try {
            let botResponse = "";

            // Check if user wants plant diagnosis
            if (
                file &&
                (userMessage.toLowerCase().includes("diagnose") ||
                    userMessage.toLowerCase().includes("disease") ||
                    userMessage.toLowerCase().includes("plant") ||
                    !userMessage)
            ) {
                const result = await analyzePlantImage(file);
                botResponse = result.diagnosis;
            }
            // Check if user wants soil analysis
            else if (
                file &&
                (userMessage.toLowerCase().includes("soil") ||
                    userMessage.toLowerCase().includes("fertilizer") ||
                    userMessage.toLowerCase().includes("npk"))
            ) {
                const result = await analyzeSoilReport(file);
                botResponse = result.report;
            }
            // Check if in crop recommendation flow
            else if (
                userMessage.toLowerCase().includes("crop") ||
                userMessage.toLowerCase().includes("plant") ||
                userMessage.toLowerCase().includes("sow")
            ) {
                // Start crop recommendation flow
                if (!context.currentFlow) {
                    updateContext({
                        currentFlow: "crop-recommendation",
                        awaitingInput: "month",
                    });
                    botResponse =
                        "I'll help you choose the perfect crop! 🌾\n\n**First, which month are you planning to sow?**\n\nFor example: November, March, July, etc.";
                }
            }
            // Handle crop recommendation flow responses
            else if (context.currentFlow === "crop-recommendation") {
                if (context.awaitingInput === "month") {
                    updateContext({
                        conversationData: { ...context.conversationData, month: userMessage },
                        awaitingInput: "water",
                    });
                    botResponse = `Great! ${userMessage} is a good time.\n\n**How much water is available for irrigation?**\n\nOptions: High, Medium, or Low`;
                } else if (context.awaitingInput === "water") {
                    updateContext({
                        conversationData: { ...context.conversationData, waterAvailability: userMessage },
                        awaitingInput: "soil",
                    });
                    botResponse = `Perfect! ${userMessage} water availability noted.\n\n**What's your soil type?**\n\nFor example: Black soil, Red soil, Loamy, Sandy, Clay, etc.`;
                } else if (context.awaitingInput === "soil") {
                    const { month, waterAvailability } = context.conversationData || {};
                    if (month && waterAvailability) {
                        botResponse = await getCropRecommendation(month, waterAvailability, userMessage);
                        updateContext({ currentFlow: undefined, awaitingInput: undefined, conversationData: {} });
                    }
                }
            }
            // Default: use quick response
            else {
                botResponse = getQuickResponse(userMessage);
            }

            addMessage({
                role: "bot",
                content: botResponse,
            });
        } catch (error) {
            console.error("Error processing message:", error);
            addMessage({
                role: "bot",
                content: "Sorry, I encountered an error. Please try again.",
            });
        } finally {
            setTyping(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type - accept images and PDFs
        const isImage = file.type.startsWith("image/");
        const isPDF = file.type === "application/pdf";

        if (!isImage && !isPDF) {
            toast.error("Please upload an image (JPG, PNG) or PDF file");
            return;
        }

        // Validate file size (10MB max for PDF, 5MB for images)
        const maxSize = isPDF ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(`File too large! Maximum size is ${isPDF ? "10MB" : "5MB"}.`);
            return;
        }

        setSelectedFile(file);
        toast.success(`${isPDF ? "PDF" : "Image"} selected! Add a message or send directly.`);
    };

    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
                <div className="px-4">
                    <QuickActions onActionClick={handleQuickAction} />
                </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 flex items-center gap-2 glass rounded-lg px-3 py-2"
                    >
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Remove
                        </button>
                    </motion.div>
                )}

                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,application/pdf"
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="glass hover:bg-primary/10 transition-colors rounded-xl px-3 py-2 flex items-center justify-center"
                        title="Upload image or PDF"
                    >
                        <ImageIcon className="w-5 h-5 text-primary" />
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me anything about farming..."
                        className="flex-1 glass rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        rows={1}
                        style={{
                            minHeight: "44px",
                            maxHeight: "120px",
                        }}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() && !selectedFile}
                        className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 flex items-center justify-center transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send • Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
