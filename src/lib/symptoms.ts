// symptom checker. the farmer tells us what they see, we match it with the disease list.
// we dont guess from photos, that needs a real trained model (see readme todo).
import type { Disease } from "@/types";

export type sign = { text: string; ids: string[] };

// plain words a farmer would use -> diseases that show this sign
export const SIGNS: sign[] = [
    { text: "white powder on leaves", ids: ["powdery-mildew"] },
    { text: "brown spots with rings, like a target", ids: ["early-blight"] },
    { text: "brown spots or patches with a yellow edge", ids: ["leaf-blight", "early-blight"] },
    { text: "dark wet looking patches, white fuzz under the leaf", ids: ["late-blight"] },
    { text: "yellow patches on top, grey or purple fuzz under the leaf", ids: ["downy-mildew"] },
    { text: "old (lower) leaves turning yellow, plant looks pale", ids: ["nitrogen-deficiency", "fusarium-wilt"] },
    { text: "new leaves yellow but the veins stay green", ids: ["iron-deficiency"] },
    { text: "plant wilts suddenly even after watering", ids: ["bacterial-wilt", "root-rot", "fusarium-wilt"] },
    { text: "wilting only on one side of the plant", ids: ["fusarium-wilt"] },
    { text: "roots brown or black, soil smells bad", ids: ["root-rot"] },
    { text: "milky liquid comes out when a cut stem is put in water", ids: ["bacterial-wilt"] },
    { text: "leaves sticky, black sooty layer on them", ids: ["aphid-infestation", "whitefly-infestation"] },
    { text: "small soft insects in groups on new shoots", ids: ["aphid-infestation"] },
    { text: "tiny white flies fly up when you shake the plant", ids: ["whitefly-infestation"] },
    { text: "leaves curled or twisted", ids: ["aphid-infestation", "whitefly-infestation", "powdery-mildew"] },
    { text: "holes in the stem, centre shoot dried up", ids: ["stem-borer"] },
    { text: "holes in fruits, worms inside", ids: ["fruit-borer"] },
    { text: "dark sunken spots on fruits", ids: ["anthracnose"] },
];

export const HELPLINE = "Kisan Call Centre 1800-180-1551 (free, many languages)";

export function sign_menu() {
    const lines = SIGNS.map((s, i) => `${i + 1}. ${s.text}`);
    return lines.join("\n");
}

// "1, 4 and 7" -> [1, 4, 7]
export function read_numbers(text: string) {
    const nums = (text.match(/\d+/g) || []).map(Number);
    return [...new Set(nums)].filter((n) => n >= 1 && n <= SIGNS.length);
}

export type match = { disease: Disease; hits: string[]; score: number };

export function match_signs(picked: number[], db: Disease[], crop = ""): match[] {
    const chosen = picked.map((n) => SIGNS[n - 1]);
    const c = crop.trim().toLowerCase();
    const out: match[] = [];
    for (const d of db) {
        const hits = chosen.filter((s) => s.ids.includes(d.id)).map((s) => s.text);
        if (!hits.length) continue;
        let score = hits.length / chosen.length;
        // small push if this disease is known on the farmers crop
        if (c && d.affectedCrops.some((a) => a.toLowerCase().includes(c) || a === "All crops")) score += 0.1;
        out.push({ disease: d, hits, score });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function diagnosis_text(picked: number[], db: Disease[], crop = "") {
    const found = match_signs(picked, db, crop);
    if (!found.length) {
        return `I could not match those signs with the problems I know.\n\nPlease show the plant to your nearest Krishi Vigyan Kendra (KVK) or call the ${HELPLINE}.`;
    }
    const top = found[0];
    const d = top.disease;
    const others = found.slice(1).map((m) => m.disease.name);
    const lines = [
        `**🔍 Most likely: ${d.name}**`,
        `matches: ${top.hits.join("; ")}`,
        "",
        `**What to do:**`,
        ...d.solutions.map((s) => `• ${s}`),
        "",
        `**Stop it next time:**`,
        ...d.preventiveMeasures.slice(0, 3).map((s) => `• ${s}`),
    ];
    if (others.length) lines.push("", `**Could also be:** ${others.join(", ")}`);
    lines.push(
        "",
        "⚠️ **This is a guess from the signs you picked, not a lab test.** Before you buy or spray any chemical, " +
            `show a sample to your KVK / agriculture officer or call the ${HELPLINE}. ` +
            "Always follow the dose on the label and wear gloves and a mask when spraying.",
    );
    return lines.join("\n");
}
