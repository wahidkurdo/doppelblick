import { test } from "node:test";
import assert from "node:assert/strict";
import { istGueltig } from "../src/iban.ts";

test("gültige deutsche Standard-IBAN wird erkannt", () => {
  assert.equal(istGueltig("DE89370400440532013000"), true);
});

test("IBAN mit geänderter Ziffer wird als ungültig erkannt", () => {
  assert.equal(istGueltig("DE89370400440532013001"), false);
});

test("IBAN mit Bindestrichen stürzt nicht ab und ergibt false", () => {
  assert.equal(istGueltig("DE89-3704-0044-0532-0130-00"), false);
});
