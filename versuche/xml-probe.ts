import { holeXml } from "../src/xml-holen.ts";

const xml = await holeXml("beispiele/iban-abweichend.pdf");

console.log("Erste 100 Zeichen:");
console.log(xml.slice(0, 100));

console.log("Enthält IBAN B?:", xml.includes("DE54999000229876543210"));
