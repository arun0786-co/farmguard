import { test } from "node:test";
import assert from "node:assert/strict";
import { advice, rate, read_soil, soil_text } from "./soil.ts";

// text like it comes out of a soil health card pdf
const CARD = `
SOIL HEALTH CARD
Sl.No Parameter Test Value Unit Rating
1 pH 8.9 Strongly alkaline
2 EC 0.42 dS/m
3 Organic Carbon (OC) 0.38 %
4 Available Nitrogen (N) 215 kg/ha
5 Available Phosphorus (P) 31.5 kg/ha
6 Available Potassium (K) 180 kg/ha
7 Available Sulphur (S) 8.2 ppm
8 Available Zinc (Zn) 0.45 ppm
9 Available Boron (B) 0.7 ppm
10 Available Iron (Fe) 6.1 ppm
`;

test("reads a soil health card", () => {
    const v = read_soil(CARD);
    assert.deepEqual(v, { ph: 8.9, ec: 0.42, oc: 0.38, n: 215, p: 31.5, k: 180, s: 8.2, zn: 0.45, b: 0.7, fe: 6.1 });
});

test("reads values typed in chat", () => {
    assert.deepEqual(read_soil("pH 6.8, N 240, P 18, K 150, OC 0.45, Zn 0.5"),
        { ph: 6.8, n: 240, p: 18, k: 150, oc: 0.45, zn: 0.5 });
    assert.deepEqual(read_soil("nitrogen: 300 potassium=90"), { n: 300, k: 90 });
});

test("does not grab random letters", () => {
    assert.deepEqual(read_soil("my name is Ravi and I have 5 acres in Pune"), {});
});

test("ratings", () => {
    assert.equal(rate("n", 200), "low");
    assert.equal(rate("n", 400), "medium");
    assert.equal(rate("n", 600), "high");
    assert.equal(rate("zn", 0.4), "low");
});

test("advice follows the values", () => {
    const tips = advice(read_soil(CARD)).join(" ");
    assert.match(tips, /alkaline/);
    assert.match(tips, /Nitrogen \(N\) is low/);
    assert.match(tips, /Phosphorus \(P\) is high/);
    assert.match(tips, /Zinc is low/);
    assert.match(tips, /Sulphur is low/);
    assert.doesNotMatch(tips, /Boron is low/);
});

test("all normal says so", () => {
    assert.match(advice({ ph: 7, n: 300, p: 15, k: 200 })[0], /normal range/);
});

test("report text", () => {
    const t = soil_text({ ph: 6.9, n: 250 });
    assert.match(t, /pH:\*\* 6.9 - normal/);
    assert.match(t, /Nitrogen \(N\):\*\* 250 kg\/ha - 🔴 low/);
});
