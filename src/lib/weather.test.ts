import { test } from "node:test";
import assert from "node:assert/strict";
import { farm_tips, place_from } from "./weather.ts";

const day = (o = {}) => ({ date: "2026-10-11", max: 30, min: 22, rain: 0, rain_chance: 10, wind: 10, ...o });

test("place from text", () => {
    assert.equal(place_from("weather in Thrissur"), "Thrissur");
    assert.equal(place_from("what is the weather at nashik tomorrow?"), "nashik");
    assert.equal(place_from("weather"), "");
});

test("rain soon means no spraying", () => {
    const tips = farm_tips([day({ rain: 12 }), day(), day(), day(), day()]).join(" ");
    assert.match(tips, /don't spray/);
});

test("hot and dry", () => {
    const tips = farm_tips([day({ max: 40 }), day(), day(), day(), day()]).join(" ");
    assert.match(tips, /Very hot/);
    assert.match(tips, /No rain for 5 days/);
});
