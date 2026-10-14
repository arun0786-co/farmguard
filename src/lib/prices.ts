// mandi prices. live data comes from data.gov.in (agmarknet) through /api/prices when a key is set.
// without a key we only show reference prices and SAY that they are not live.

export type mandi_row = {
    market: string;
    district: string;
    state: string;
    commodity: string;
    variety: string;
    date: string;
    min: number;
    max: number;
    modal: number; // most common price, rs per quintal
};

export const STATES = [
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "NCT of Delhi", "Goa",
];

export function find_in(text: string, names: string[]) {
    const t = text.toLowerCase();
    // longest first so "uttar pradesh" wins over "pradesh" style partials
    return [...names].sort((a, b) => b.length - a.length).find((n) => t.includes(n.toLowerCase())) || "";
}

export function to_row(r: Record<string, string>): mandi_row {
    const num = (v: string) => Number(String(v ?? "").replace(/,/g, "")) || 0;
    return {
        market: r.market ?? r.Market ?? "",
        district: r.district ?? r.District ?? "",
        state: r.state ?? r.State ?? "",
        commodity: r.commodity ?? r.Commodity ?? "",
        variety: r.variety ?? r.Variety ?? "",
        date: r.arrival_date ?? r.Arrival_Date ?? "",
        min: num(r.min_price ?? r.Min_Price),
        max: num(r.max_price ?? r.Max_Price),
        modal: num(r.modal_price ?? r.Modal_Price),
    };
}

export function live_text(crop: string, state: string, rows: mandi_row[]) {
    const where = state ? ` in ${state}` : "";
    if (!rows.length) return `No mandi prices found for **${crop}**${where} today. Try another crop or state name.`;
    const lines = [`**💰 ${crop} mandi prices${where}** (₹ per quintal = 100 kg)`, ""];
    for (const r of rows.slice(0, 8)) {
        lines.push(`• **${r.market}**, ${r.district}: ₹${r.modal} (range ₹${r.min}-${r.max})${r.variety ? ` - ${r.variety}` : ""} _(${r.date})_`);
    }
    const avg = Math.round(rows.reduce((s, r) => s + r.modal, 0) / rows.length);
    lines.push("", `Average: about ₹${avg}/quintal = ₹${(avg / 100).toFixed(1)}/kg`, "", "_source: agmarknet via data.gov.in_");
    return lines.join("\n");
}

export function reference_text(crops: { name: string; marketPrice: number }[], crop = "") {
    const list = crop ? crops.filter((c) => c.name.toLowerCase().includes(crop.toLowerCase())) : crops;
    const missing = crop && !list.length;
    const lines = [
        "**💰 Reference prices (NOT live)**",
        "",
        "Live mandi prices are not switched on in this app yet, so these are only rough average prices from our crop list.",
        missing ? `We don't have a reference price for **${crop}**. Other crops:` : "",
        "",
        ...(list.length ? list : crops).slice(0, 10).map((c) => `• ${c.name}: about ₹${c.marketPrice}/kg`),
        "",
        "For today's real price check **agmarknet.gov.in** or the **eNAM** app, or ask at your nearest mandi.",
    ];
    return lines.join("\n");
}
