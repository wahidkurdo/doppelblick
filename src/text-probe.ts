import { holeText } from "./text-holen.ts";

const { text, ohneLeerraum } = await holeText("beispiele/iban-abweichend.pdf");

console.log("Extrahierter Text:");
console.log(text);
console.log("---");

console.log(
  "IBAN A im sichtbaren Text (ohneLeerraum)?:",
  ohneLeerraum.includes("DE52999000111234567890")
);
console.log(
  "Betrag 678,30 im sichtbaren Text?:",
  text.includes("678,30")
);
