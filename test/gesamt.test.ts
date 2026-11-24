import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("korrekt.pdf liefert Exit-Code 0 und keine Abweichung", () => {
  const lauf = spawnSync(process.execPath, ["src/pruefe.ts", "beispiele/korrekt.pdf"]);
  assert.equal(lauf.status, 0);
  assert.ok(lauf.stdout.toString().includes("keine Abweichung"));
});

test("iban-abweichend.pdf liefert Exit-Code 1 und meldet ABWEICHUNG", () => {
  const lauf = spawnSync(process.execPath, ["src/pruefe.ts", "beispiele/iban-abweichend.pdf"]);
  assert.equal(lauf.status, 1);
  assert.ok(lauf.stdout.toString().includes("ABWEICHUNG"));
});
