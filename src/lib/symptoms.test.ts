import { test } from "node:test";
import assert from "node:assert/strict";
import { SIGNS, diagnosis_text, match_signs, read_numbers } from "./symptoms.ts";

const db = [
    { id: "powdery-mildew", name: "Powdery Mildew", symptoms: [], causes: [], solutions: ["spray sulphur"], severity: "Medium", affectedCrops: ["Cucumber"], preventiveMeasures: ["space plants"] },
    { id: "aphid-infestation", name: "Aphid Infestation", symptoms: [], causes: [], solutions: ["neem oil"], severity: "Medium", affectedCrops: ["Cotton"], preventiveMeasures: ["ladybugs"] },
    { id: "whitefly-infestation", name: "Whitefly Infestation", symptoms: [], causes: [], solutions: ["yellow traps"], severity: "High", affectedCrops: ["Tomato"], preventiveMeasures: ["traps"] },
] as any;

const num = (text: string) => SIGNS.findIndex((s) => s.text === text) + 1;

test("reads numbers", () => {
    assert.deepEqual(read_numbers("1, 4 and 7"), [1, 4, 7]);
    assert.deepEqual(read_numbers("tomato 2 2 99"), [2]);
    assert.deepEqual(read_numbers("no idea"), []);
});

test("best match first", () => {
    const picked = [num("small soft insects in groups on new shoots"), num("leaves curled or twisted")];
    const m = match_signs(picked, db);
    assert.equal(m[0].disease.id, "aphid-infestation");
    assert.equal(m[0].hits.length, 2);
});

test("crop pushes a match up", () => {
    const picked = [num("leaves sticky, black sooty layer on them")];
    assert.equal(match_signs(picked, db, "tomato")[0].disease.id, "whitefly-infestation");
    assert.equal(match_signs(picked, db, "cotton")[0].disease.id, "aphid-infestation");
});

test("text has a warning and helpline", () => {
    const t = diagnosis_text([num("white powder on leaves")], db);
    assert.match(t, /Most likely: Powdery Mildew/);
    assert.match(t, /not a lab test/);
    assert.match(t, /1800-180-1551/);
});

test("no match is honest", () => {
    assert.match(diagnosis_text([num("dark sunken spots on fruits")], db), /could not match/);
});
