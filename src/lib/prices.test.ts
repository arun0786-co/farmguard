import { test } from "node:test";
import assert from "node:assert/strict";
import { STATES, find_in, live_text, reference_text, to_row } from "./prices.ts";

test("finds crop and state in a question", () => {
    assert.equal(find_in("price of onion in maharashtra", ["Onion", "Potato"]), "Onion");
    assert.equal(find_in("rate in uttar pradesh", STATES), "Uttar Pradesh");
    assert.equal(find_in("hello", STATES), "");
});

test("maps api rows", () => {
    const r = to_row({ market: "Lasalgaon", district: "Nashik", state: "Maharashtra", commodity: "Onion",
        variety: "Red", arrival_date: "10/10/2026", min_price: "1,800", max_price: "2400", modal_price: "2100" });
    assert.equal(r.modal, 2100);
    assert.equal(r.min, 1800);
    assert.match(live_text("Onion", "Maharashtra", [r]), /Lasalgaon/);
});

test("reference prices say they are not live", () => {
    assert.match(reference_text([{ name: "Onion", marketPrice: 25 }], "Onion"), /NOT live/);
});

test("says when a crop has no reference price", () => {
    assert.match(reference_text([{ name: "Wheat", marketPrice: 25 }], "Onion"), /don't have a reference price for \*\*Onion/);
    assert.match(reference_text([{ name: "Rice (Paddy)", marketPrice: 22 }], "Rice"), /Rice \(Paddy\): about ₹22/);
});
