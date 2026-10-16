"use client";

import React from "react";
import { Message as MessageType } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface MessageProps {
    message: MessageType;
}

// **bold**, _small note_ and `code` inside a line
function inline(line: string) {
    return line.split(/(\*\*[^*]+\*\*|_[^_\s][^_]*_|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="px-1 rounded bg-black/5">{part.slice(1, -1)}</code>;
        if (part.length > 2 && part.startsWith("_") && part.endsWith("_")) return <em key={i} className="text-muted-foreground">{part.slice(1, -1)}</em>;
        return part;
    });
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
                            if (!line.trim()) return <br key={i} />;
                            const list = line.startsWith("•") || /^\d+\./.test(line);
                            return (
                                <p key={i} className={list ? "ml-2 mb-1" : "mb-1"}>
                                    {inline(line)}
                                </p>
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
