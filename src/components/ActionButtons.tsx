"use client";

import React from "react";
import { Sprout, FlaskConical, Wheat, TrendingUp, Bug, Droplets } from "lucide-react";
import { motion } from "framer-motion";

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    prompt: string;
}

const quickActions: QuickAction[] = [
    {
        id: "diagnose",
        label: "Diagnose Plant",
        icon: <Sprout className="w-4 h-4" />,
        prompt: "I want to diagnose a plant disease. Let me upload a photo.",
    },
    {
        id: "soil",
        label: "Soil Analysis",
        icon: <FlaskConical className="w-4 h-4" />,
        prompt: "I need soil analysis and fertilizer recommendations.",
    },
    {
        id: "crop",
        label: "Crop Advice",
        icon: <Wheat className="w-4 h-4" />,
        prompt: "What crop should I plant this season?",
    },
    {
        id: "market",
        label: "Market Prices",
        icon: <TrendingUp className="w-4 h-4" />,
        prompt: "Show me current market prices for crops.",
    },
    {
        id: "pest",
        label: "Pest Control",
        icon: <Bug className="w-4 h-4" />,
        prompt: "I'm facing pest problems. How can I control them?",
    },
    {
        id: "irrigation",
        label: "Irrigation",
        icon: <Droplets className="w-4 h-4" />,
        prompt: "What's the best irrigation schedule for my crop?",
    },
];

interface QuickActionsProps {
    onActionClick: (prompt: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
    return (
        <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-3 px-1">Quick Actions:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickActions.map((action, index) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onActionClick(action.prompt)}
                        className="glass hover:bg-primary/10 transition-all duration-200 rounded-xl px-3 py-2.5 flex items-center gap-2 text-sm font-medium group"
                    >
                        <span className="text-primary group-hover:scale-110 transition-transform">
                            {action.icon}
                        </span>
                        <span className="text-foreground">{action.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
