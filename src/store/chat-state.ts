import { create } from "zustand";
import { Message, ChatContext } from "@/types";

interface ChatStore {
    messages: Message[];
    isTyping: boolean;
    context: ChatContext;
    addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
    setTyping: (typing: boolean) => void;
    updateContext: (context: Partial<ChatContext>) => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [
        {
            id: "welcome",
            role: "bot",
            content: `🌾 **Namaste! I'm KrishiMitra, your AI farming advisor.**

I can help you with:
• 🌱 Plant disease diagnosis
• 🧪 Soil analysis & fertilizer recommendations
• 🌾 Crop selection based on season & soil
• 💰 Market prices & trends
• 🌤️ Weather-based farming advice
• 🐛 Pest identification & treatment

How can I assist you today?`,
            timestamp: new Date(),
        },
    ],
    isTyping: false,
    context: {},

    addMessage: (message) =>
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    ...message,
                    id: `msg-${Date.now()}-${Math.random()}`,
                    timestamp: new Date(),
                },
            ],
        })),

    setTyping: (typing) => set({ isTyping: typing }),

    updateContext: (context) =>
        set((state) => ({
            context: { ...state.context, ...context },
        })),

    clearChat: () =>
        set({
            messages: [],
            context: {},
        }),
}));
