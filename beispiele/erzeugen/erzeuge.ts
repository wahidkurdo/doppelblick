import { readFileSync, writeFileSync } from "node:fs";
import { generateFacturXPdf } from "openinvoicexml/adapters";

// 1. Datei lesen und in ein Objekt umwandeln
const rohdaten = readFileSync("beispiele/erzeugen/rechnung.json", "utf8");
const rechnungsDaten = JSON.parse(rohdaten);

// 2. Rechnung erzeugen
const ergebnis = await generateFacturXPdf(rechnungsDaten);

// 3. Ergebnis prüfen
console.log(ergebnis.issues);

if (ergebnis.pdf === null) {
  console.error("Abbruch: PDF konnte nicht erzeugt werden.");
  process.exit(1);
}

// 4. Speichern
writeFileSync("beispiele/korrekt.pdf", ergebnis.pdf);
console.log("Fertig: beispiele/korrekt.pdf wurde gespeichert.");
