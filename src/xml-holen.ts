import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const BEKANNTE_NAMEN = [
  "factur-x.xml",
  "zugferd-invoice.xml",
  "ZUGFeRD-invoice.xml",
  "xrechnung.xml",
];

export async function holeXml(pdfPfad: string): Promise<string> {
  // 1. Datei lesen und als Uint8Array verpacken
  const buffer = await readFile(pdfPfad);
  const daten = new Uint8Array(buffer);

  // 2. PDF öffnen
  const dokument = await getDocument({ data: daten }).promise;

  // 3. Anhänge auflisten
  const anhaenge = await dokument.getAttachments();
  if (!anhaenge) {
    throw new Error(`Keine Anhänge im PDF gefunden: ${pdfPfad}`);
  }

  // 4. Nach bekannten XML-Namen suchen
  const treffer = BEKANNTE_NAMEN.filter((name) => anhaenge.has(name));

  if (treffer.length === 0) {
    throw new Error(`Keine bekannte E-Rechnungs-XML im PDF gefunden: ${pdfPfad}`);
  }

  if (treffer.length > 1) {
    console.warn(
      `Warnung: Mehrere E-Rechnungs-XMLs gefunden (${treffer.join(", ")}). Verwende ${treffer[0]}.`
    );
  }

  // 5. Inhalt als Bytes holen
  const bytes = await dokument.getAttachmentContent(treffer[0]);

  // 6. Bytes in UTF-8-Text umwandeln
  return new TextDecoder("utf-8").decode(bytes);
}
