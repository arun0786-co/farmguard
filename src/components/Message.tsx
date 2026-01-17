"use client";

import React from "react";
import { Message as MessageType } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface MessageProps {
    message: MessageType;
}

export function Message({ message }: MessageProps) {
    const isBot = message.role === "bot";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-3 mb-4 ${!isBot ? "flex-row-reverse" : ""}`}
        >
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${isBot
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    }`}
            >
                {isBot ? "K" : "Y"}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col ${!isBot ? "items-end" : ""} max-w-[80%]`}>
                <div
                    className={`rounded-2xl px-4 py-3 ${isBot
                            ? "glass rounded-tl-none"
                            : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-none"
                        }`}
                >
                    {message.imageUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden">
                            <Image
                                src={message.imageUrl}
                                alt="Uploaded image"
                                width={300}
                                height={200}
                                className="w-full h-auto"
                            />
                        </div>
                    )}
                    <div className="prose prose-sm max-w-none">
                        {message.content.split("\n").map((line, i) => {
                            // Handle bold text
                            if (line.startsWith("**") && line.endsWith("**")) {
                                return (
                                    <p key={i} className="font-bold mb-1">
                                        {line.replace(/\*\*/g, "")}
                                    </p>
                                );
                            }
                            // Handle bullet points
                            if (line.startsWith("•")) {
                                return (
                                    <p key={i} className="ml-2 mb-1">
                                        {line}
                                    </p>
                                );
                            }
                            // Handle numbered lists
                            if (/^\d+\./.test(line)) {
                                return (
                                    <p key={i} className="ml-2 mb-1">
                                        {line}
                                    </p>
                                );
                            }
                            // Regular text
                            return line ? (
                                <p key={i} className="mb-1">
                                    {line}
                                </p>
                            ) : (
                                <br key={i} />
                            );
                        })}
                    </div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-2">
                    {formatDate(message.timestamp)}
                </span>
            </div>
        </motion.div>
    );
}
