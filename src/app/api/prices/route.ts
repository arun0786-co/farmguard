// live mandi prices from data.gov.in (agmarknet). needs DATA_GOV_KEY (free from data.gov.in).
// key stays on the server, the browser never sees it.
import { to_row } from "@/lib/prices";

const RES = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

async function ask(key: string, crop: string, state: string, field_tail: string) {
    const q = new URLSearchParams({ "api-key": key, format: "json", limit: "50" });
    q.set(`filters[commodity${field_tail}]`, crop);
    if (state) q.set(`filters[state${field_tail}]`, state);
    const res = await fetch(`${RES}?${q}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`data.gov.in said ${res.status}`);
    const data = await res.json();
    return (data.records || []) as Record<string, string>[];
}

export async function GET(req: Request) {
    const key = process.env.DATA_GOV_KEY;
    if (!key) return Response.json({ live: false });

    const url = new URL(req.url);
    const crop = (url.searchParams.get("crop") || "").trim();
    const state = (url.searchParams.get("state") || "").trim();
    if (!crop) return Response.json({ live: true, rows: [] });

    try {
        // the api has used both "commodity" and "commodity.keyword" as filter names, so try both
        let recs = await ask(key, crop, state, "");
        if (!recs.length) recs = await ask(key, crop, state, ".keyword");
        const rows = recs.map(to_row).filter((r) => r.modal > 0).sort((a, b) => b.modal - a.modal);
        return Response.json({ live: true, rows });
    } catch {
        return Response.json({ live: false, error: "could not reach data.gov.in" });
    }
}
