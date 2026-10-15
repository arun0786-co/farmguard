"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChatStore } from "@/store/chat-state";
import { Message } from "./Message";
import { TypingIndicator } from "./TypingIndicator";
import { QuickActions } from "./ActionButtons";
import { Send, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { make_reply } from "@/lib/reply";

export function ChatWindow() {
    const { messages, isTyping, addMessage, setTyping, context, updateContext } = useChatStore();
    const [input, set_input] = useState("");
    const [picked_file, set_picked_file] = useState<File | null>(null);
    const end_ref = useRef<HTMLDivElement>(null);
    const file_ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        end_ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handle_send = async () => {
        if (isTyping || (!input.trim() && !picked_file)) return;
        const text = input.trim();
        const file = picked_file;
        const is_pdf = file?.type === "application/pdf";

        addMessage({
            role: "user",
            content: text || (is_pdf ? "📄 [Soil report uploaded]" : "📷 [Photo uploaded]"),
            imageUrl: file && !is_pdf ? URL.createObjectURL(file) : undefined,
        });
        set_input("");
        set_picked_file(null);
        setTyping(true);

        try {
            const answer = await make_reply(text, file, context);
            updateContext(answer.ctx);
            addMessage({ role: "bot", content: answer.text });
        } catch (error) {
            console.error("reply failed:", error);
            addMessage({ role: "bot", content: "Sorry, something went wrong. Please try again." });
        } finally {
            setTyping(false);
        }
    };

    const handle_file = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        const is_image = file.type.startsWith("image/");
        const is_pdf = file.type === "application/pdf";
        if (!is_image && !is_pdf) {
            toast.error("Please upload a photo (JPG, PNG) or a soil report PDF");
            return;
        }
        const max = is_pdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > max) {
            toast.error(`File too large! Maximum size is ${is_pdf ? "10MB" : "5MB"}.`);
            return;
        }
        set_picked_file(file);
        toast.success(`${is_pdf ? "Soil report" : "Photo"} added. Press send.`);
    };

    const handle_key = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handle_send();
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
                <div ref={end_ref} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
                <div className="px-4">
                    <QuickActions onActionClick={set_input} />
                </div>
            )}

            {/* Input Area */}
            <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
                {picked_file && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 flex items-center gap-2 glass rounded-lg px-3 py-2"
                    >
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm flex-1 truncate">{picked_file.name}</span>
                        <button
                            onClick={() => set_picked_file(null)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Remove
                        </button>
                    </motion.div>
                )}

                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={file_ref}
                        onChange={handle_file}
                        accept="image/*,application/pdf"
                        className="hidden"
                    />

                    <button
                        onClick={() => file_ref.current?.click()}
                        className="glass hover:bg-primary/10 transition-colors rounded-xl px-3 py-2 flex items-center justify-center"
                        title="Upload image or PDF"
                    >
                        <ImageIcon className="w-5 h-5 text-primary" />
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => set_input(e.target.value)}
                        onKeyDown={handle_key}
                        placeholder="Ask me anything about farming..."
                        className="flex-1 glass rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        rows={1}
                        style={{
                            minHeight: "44px",
                            maxHeight: "120px",
                        }}
                    />

                    <button
                        onClick={handle_send}
                        disabled={!input.trim() && !picked_file}
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
