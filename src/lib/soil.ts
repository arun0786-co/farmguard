// reads numbers from a soil health card (pdf text or typed by the farmer) and rates them.
// ratings are the normal soil health card limits used in india.

export type soil_key = "ph" | "ec" | "oc" | "n" | "p" | "k" | "s" | "zn" | "b" | "fe" | "mn" | "cu";
export type soil_values = Partial<Record<soil_key, number>>;

type part = {
    label: string;
    unit: string;
    words: string[]; // matched in any case
    short: string[]; // symbols, matched exactly (N, Zn...)
    low: number;
    high: number;
};

export const PARTS: Record<soil_key, part> = {
    ph: { label: "pH", unit: "", words: ["soil reaction", "ph"], short: [], low: 6.5, high: 7.5 },
    ec: { label: "EC (salt)", unit: "dS/m", words: ["electrical conductivity"], short: ["EC"], low: 0, high: 1 },
    oc: { label: "Organic carbon", unit: "%", words: ["organic carbon"], short: ["OC"], low: 0.5, high: 0.75 },
    n: { label: "Nitrogen (N)", unit: "kg/ha", words: ["available nitrogen", "nitrogen"], short: ["N"], low: 280, high: 560 },
    p: { label: "Phosphorus (P)", unit: "kg/ha", words: ["available phosphorus", "phosphorus", "phosphorous"], short: ["P"], low: 10, high: 25 },
    k: { label: "Potassium (K)", unit: "kg/ha", words: ["available potassium", "potassium"], short: ["K"], low: 110, high: 280 },
    s: { label: "Sulphur (S)", unit: "ppm", words: ["sulphur", "sulfur"], short: ["S"], low: 10, high: 20 },
    zn: { label: "Zinc (Zn)", unit: "ppm", words: ["zinc"], short: ["Zn"], low: 0.6, high: 1.2 },
    b: { label: "Boron (B)", unit: "ppm", words: ["boron"], short: ["B"], low: 0.5, high: 1 },
    fe: { label: "Iron (Fe)", unit: "ppm", words: ["iron"], short: ["Fe"], low: 4.5, high: 9 },
    mn: { label: "Manganese (Mn)", unit: "ppm", words: ["manganese"], short: ["Mn"], low: 2, high: 4 },
    cu: { label: "Copper (Cu)", unit: "ppm", words: ["copper"], short: ["Cu"], low: 0.2, high: 0.4 },
};

const NUM = "(\\d+(?:\\.\\d+)?)";

function find(text: string, p: part): number | undefined {
    for (const w of p.words) {
        // the word, maybe "(N)" or a unit after it, then the number on the same line
        const m = text.match(new RegExp(`\\b${w}\\b[^0-9\\n]{0,30}?${NUM}`, "i"));
        if (m) return Number(m[1]);
    }
    for (const s of p.short) {
        const m = text.match(new RegExp(`(?:^|[\\s(,;])${s}\\)?\\s*[:=-]?\\s*${NUM}`, "m"));
        if (m) return Number(m[1]);
    }
    return undefined;
}

export function read_soil(text: string): soil_values {
    const out: soil_values = {};
    for (const key of Object.keys(PARTS) as soil_key[]) {
        const v = find(text, PARTS[key]);
        if (v !== undefined && isFinite(v)) out[key] = v;
    }
    // ph can only be 0-14, anything else was a wrong match
    if (out.ph !== undefined && (out.ph <= 0 || out.ph > 14)) delete out.ph;
    return out;
}

export type rating = "low" | "medium" | "high";

export function rate(key: soil_key, v: number): rating {
    const p = PARTS[key];
    if (v < p.low) return "low";
    if (v > p.high) return "high";
    return "medium";
}

function ph_text(v: number) {
    if (v < 5.5) return "strongly acidic";
    if (v < 6.5) return "slightly acidic";
    if (v <= 7.5) return "normal";
    if (v <= 8.5) return "slightly alkaline";
    return "strongly alkaline";
}

// what to do for each result. exact doses depend on the crop, so we talk in "more / less than normal dose".
export function advice(vals: soil_values): string[] {
    const tips: string[] = [];
    const r = (k: soil_key) => (vals[k] === undefined ? undefined : rate(k, vals[k]!));

    if (vals.ph !== undefined) {
        if (vals.ph < 5.5) tips.push("Soil is acidic. Add agricultural lime before sowing. Ask your KVK how much for your soil.");
        if (vals.ph > 8.5) tips.push("Soil is very alkaline. Gypsum helps. Ask your KVK how much for your soil.");
    }
    if (vals.ec !== undefined && vals.ec > 4) tips.push("Soil is salty (high EC). Wash salts out with good water and drainage, pick salt tolerant crops.");
    if (r("oc") === "low") tips.push("Organic carbon is low. Add farmyard manure or compost and try a green manure crop (like dhaincha).");

    const npk: [soil_key, string][] = [["n", "nitrogen (urea, in 2-3 split doses)"], ["p", "phosphate (DAP or SSP)"], ["k", "potash (MOP)"]];
    for (const [k, what] of npk) {
        if (r(k) === "low") tips.push(`${PARTS[k].label} is low: use about 25% MORE ${what} than the normal dose for your crop.`);
        if (r(k) === "high") tips.push(`${PARTS[k].label} is high: you can use about 25% LESS ${what}. saves money.`);
    }

    if (r("zn") === "low") tips.push("Zinc is low: zinc sulphate about 10 kg per acre in the soil (once in 2-3 seasons).");
    if (r("b") === "low") tips.push("Boron is low: borax about 4 kg per acre, mixed with sand for even spreading.");
    if (r("s") === "low") tips.push("Sulphur is low: use gypsum or SSP (it has sulphur).");
    if (r("fe") === "low") tips.push("Iron is low: spray ferrous sulphate 5 g per litre water on the leaves.");
    if (r("mn") === "low") tips.push("Manganese is low: spray manganese sulphate 5 g per litre water on the leaves.");
    if (r("cu") === "low") tips.push("Copper is low: a small amount of copper sulphate helps. Ask your KVK for the dose.");

    if (!tips.length) tips.push("Everything we could read is in the normal range. Use the normal fertilizer dose for your crop.");
    return tips;
}

const MARK: Record<rating, string> = { low: "🔴 low", medium: "🟢 ok", high: "🟡 high" };

export function soil_text(vals: soil_values) {
    const keys = (Object.keys(PARTS) as soil_key[]).filter((k) => vals[k] !== undefined);
    const lines = ["**🧪 Your soil report**", ""];
    for (const k of keys) {
        const v = vals[k]!;
        const p = PARTS[k];
        const tag = k === "ph" ? ph_text(v) : MARK[rate(k, v)];
        lines.push(`• **${p.label}:** ${v}${p.unit ? " " + p.unit : ""} - ${tag}`);
    }
    lines.push("", "**What to do:**", ...advice(vals).map((t) => `• ${t}`));
    lines.push(
        "",
        "💡 The fertilizer amounts on your Soil Health Card are made for your field, follow those first. " +
            "Ratings here use the normal soil health card limits (N, P, K in kg/ha, micro nutrients in ppm).",
    );
    return lines.join("\n");
}

export const TYPE_HELP =
    "Type the values from your soil test like this:\n\n`pH 6.8, N 240, P 18, K 150, OC 0.45, Zn 0.5`\n\n(any of them is fine, N P K in kg/ha)";
