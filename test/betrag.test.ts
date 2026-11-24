import { test } from "node:test";
import assert from "node:assert/strict";
import { baueBetragVarianten } from "../src/betrag.ts";

test("erzeugt Tausenderpunkt bei großen Beträgen", () => {
  const varianten = baueBetragVarianten("1190.00");
  assert.ok(varianten.includes("1.190,00"));
  assert.ok(varianten.includes("1190,00"));
});

test("ergänzt fehlende zweite Nachkommastelle", () => {
  const varianten = baueBetragVarianten("678.3");
  assert.deepEqual(varianten, ["678,30"]);
});
