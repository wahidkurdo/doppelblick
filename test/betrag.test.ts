import { test } from "node:test";
import assert from "node:assert/strict";
import { baueBetragVarianten, enthaeltBetrag } from "../src/betrag.ts";

test("erzeugt Tausenderpunkt bei großen Beträgen", () => {
  const varianten = baueBetragVarianten("1190.00");
  assert.ok(varianten.includes("1.190,00"));
  assert.ok(varianten.includes("1190,00"));
});

test("ergänzt fehlende zweite Nachkommastelle", () => {
  const varianten = baueBetragVarianten("678.3");
  assert.deepEqual(varianten, ["678,30"]);
});

test("findet keinen Teiltreffer mitten in einer größeren Zahl", () => {
  assert.equal(enthaeltBetrag("Summe 678,30 EUR", "78,30"), false);
  assert.equal(enthaeltBetrag("Summe 1.678,30 EUR", "8,30"), false);
});

test("findet den vollständigen Betrag im Text", () => {
  assert.equal(enthaeltBetrag("Summe 678,30 EUR", "678,30"), true);
});
