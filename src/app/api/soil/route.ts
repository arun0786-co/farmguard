// takes a soil health card pdf and gives back its text. the numbers are read in the browser (lib/soil.ts).
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX = 10 * 1024 * 1024;

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return Response.json({ error: "no file sent" }, { status: 400 });
    if (file.type !== "application/pdf") return Response.json({ error: "only pdf files" }, { status: 415 });
    if (file.size > MAX) return Response.json({ error: "pdf is bigger than 10 MB" }, { status: 413 });

    const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });
    try {
        const out = await parser.getText();
        // scanned pdfs (just a photo inside) have no text, the chat then asks to type the values
        return Response.json({ text: (out.text || "").slice(0, 50000) });
    } catch {
        return Response.json({ error: "could not read this pdf" }, { status: 422 });
    } finally {
        await parser.destroy();
    }
}
