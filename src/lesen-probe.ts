import { holeXml } from "./xml-holen.ts";
import { leseRechnungsdaten } from "./xml-lesen.ts";

const xmlKorrekt = await holeXml("beispiele/korrekt.pdf");
console.log("korrekt.pdf:", leseRechnungsdaten(xmlKorrekt));

const xmlAbweichend = await holeXml("beispiele/iban-abweichend.pdf");
console.log("iban-abweichend.pdf:", leseRechnungsdaten(xmlAbweichend));
