// decides what the bot says. chat window just shows it.
import type { ChatContext } from "@/types";
import { diseaseDatabase, getCropRecommendation, getQuickResponse } from "./ai-engine";
import { cropDatabase } from "./crop-database";
import { STATES, find_in, live_text, reference_text, type mandi_row } from "./prices";
import { diagnosis_text, read_numbers, sign_menu } from "./symptoms";
import { TYPE_HELP, read_soil, soil_text } from "./soil";
import { get_forecast, place_from, weather_text } from "./weather";

type answer = { text: string; ctx: Partial<ChatContext> };

const RESET: Partial<ChatContext> = { currentFlow: undefined, awaitingInput: undefined, conversationData: {} };

const CROPS = [...new Set([...cropDatabase.map((c) => c.name),
    "Onion", "Potato", "Tomato", "Rice", "Wheat", "Banana", "Coconut", "Brinjal", "Cabbage", "Cotton",
    "Maize", "Groundnut", "Green Chilli", "Ginger", "Turmeric", "Garlic", "Cauliflower", "Okra", "Mango"])];

const has = (t: string, words: string[]) => words.some((w) => t.includes(w));

const SIGN_ASK =
    "Look closely at the plant and reply with the numbers of what you see (like **2, 5**). " +
    "You can add your crop too (like **tomato 2, 5**):\n\n";

function photo_reply(): answer {
    return {
        text:
            "Thanks for the photo 📷. I can't spot diseases from photos yet. I would only be guessing, " +
            "and a wrong guess can make you buy the wrong medicine.\n\n" + SIGN_ASK + sign_menu(),
        ctx: { currentFlow: "diagnosis", awaitingInput: "signs" },
    };
}

async function soil_from_pdf(file: File): Promise<answer> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/soil", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    const ask_type: answer = { text: "", ctx: { currentFlow: "soil-analysis", awaitingInput: "values" } };
    if (!res.ok) return { ...ask_type, text: `I couldn't read that PDF (${data.error || "error"}).\n\n${TYPE_HELP}` };
    const vals = read_soil(data.text || "");
    if (Object.keys(vals).length < 2) {
        return { ...ask_type, text: `I couldn't find the soil values in this PDF (maybe it is a scanned photo).\n\n${TYPE_HELP}` };
    }
    return { text: soil_text(vals), ctx: RESET };
}

async function weather_for(place: string): Promise<answer> {
    try {
        const f = await get_forecast(place);
        if (!f) return { text: `I couldn't find "${place}". Try a nearby bigger town or your district name.`, ctx: { currentFlow: "weather", awaitingInput: "place" } };
        return { text: weather_text(f), ctx: RESET };
    } catch {
        return { text: "The weather service is not reachable right now. Please try again in a bit.", ctx: RESET };
    }
}

async function prices_for(text: string): Promise<answer> {
    const crop = find_in(text, CROPS);
    const state = find_in(text, STATES);
    if (!crop) {
        return { text: "Which crop? Ask like **price of onion in maharashtra**.", ctx: { currentFlow: "prices", awaitingInput: "crop" } };
    }
    try {
        const res = await fetch(`/api/prices?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}`);
        const data: { live: boolean; rows?: mandi_row[] } = await res.json();
        if (data.live) return { text: live_text(crop, state, data.rows || []), ctx: RESET };
    } catch {
        // fall back to reference prices below
    }
    return { text: reference_text(cropDatabase, crop), ctx: RESET };
}

async function crop_step(text: string, ctx: ChatContext): Promise<answer> {
    const data = ctx.conversationData || {};
    if (ctx.awaitingInput === "month") {
        return {
            text: `Great! ${text} it is.\n\n**How much water do you have for irrigation?**\n\nHigh, Medium or Low`,
            ctx: { conversationData: { ...data, month: text }, awaitingInput: "water" },
        };
    }
    if (ctx.awaitingInput === "water") {
        return {
            text: `Okay, ${text} water.\n\n**What is your soil type?**\n\nFor example: black, red, loamy, sandy, clay, alluvial`,
            ctx: { conversationData: { ...data, waterAvailability: text }, awaitingInput: "soil" },
        };
    }
    return { text: await getCropRecommendation(data.month || "", data.waterAvailability || "", text), ctx: RESET };
}

export async function make_reply(text: string, file: File | null, ctx: ChatContext): Promise<answer> {
    const t = text.toLowerCase();

    if (file?.type === "application/pdf") return soil_from_pdf(file);
    if (file) return photo_reply();

    // in the middle of a question we asked
    if (ctx.currentFlow === "diagnosis") {
        const nums = read_numbers(text);
        if (nums.length) return { text: diagnosis_text(nums, diseaseDatabase, find_in(text, CROPS)), ctx: RESET };
    }
    if (ctx.currentFlow === "soil-analysis") {
        const vals = read_soil(text);
        if (Object.keys(vals).length) return { text: soil_text(vals), ctx: RESET };
    }
    if (ctx.currentFlow === "weather" && text.trim()) return weather_for(place_from(text) || text.trim());
    if (ctx.currentFlow === "prices" && find_in(text, CROPS)) return prices_for(text);
    if (ctx.currentFlow === "crop-recommendation" && text.trim()) return crop_step(text.trim(), ctx);

    // something new
    if (has(t, ["diagnose", "disease", "sick", "spots", "wilt", "pest", "insect", "worm", "fungus", "leaves turning"])) {
        return { text: SIGN_ASK + sign_menu(), ctx: { currentFlow: "diagnosis", awaitingInput: "signs" } };
    }
    if (has(t, ["soil", "fertilizer", "fertiliser", "npk", "urea"])) {
        const vals = read_soil(text);
        if (Object.keys(vals).length >= 2) return { text: soil_text(vals), ctx: RESET };
        return {
            text: `Upload your **Soil Health Card** PDF with the 📎 button, or:\n\n${TYPE_HELP}`,
            ctx: { currentFlow: "soil-analysis", awaitingInput: "values" },
        };
    }
    if (has(t, ["weather", "rain", "forecast", "temperature"])) {
        const place = place_from(text);
        if (place) return weather_for(place);
        return { text: "Which town or district? (like **Thrissur** or **Nashik**)", ctx: { currentFlow: "weather", awaitingInput: "place" } };
    }
    if (has(t, ["price", "rate", "mandi", "market"])) return prices_for(text);
    if (has(t, ["crop", "sow", "what to grow", "what should i grow", "plant this"])) {
        return {
            text: "Let's find a good crop for you 🌾\n\n**Which month do you plan to sow?**\n\nFor example: November, March, July",
            ctx: { currentFlow: "crop-recommendation", awaitingInput: "month" },
        };
    }
    return { text: getQuickResponse(text), ctx: RESET };
}
