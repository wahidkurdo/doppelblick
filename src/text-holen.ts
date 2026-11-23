import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PdfText {
  text: string;
  ohneLeerraum: string;
}

export async function holeText(pdfPfad: string): Promise<PdfText> {
  // 1. PDF öffnen
  const buffer = await readFile(pdfPfad);
  const daten = new Uint8Array(buffer);
  const dokument = await getDocument({ data: daten }).promise;

  const stuecke: string[] = [];

  // 2. Alle Seiten durchgehen (1 bis numPages)
  for (let i = 1; i <= dokument.numPages; i++) {
    // 3. Text der Seite holen
    const seite = await dokument.getPage(i);
    const inhalt = await seite.getTextContent();

    // 4. Textstücke einsammeln
    for (const item of inhalt.items) {
      if ("str" in item) {
        stuecke.push(item.str);
      }
    }
  }

  // Alle Stücke mit Leerzeichen verbinden
  const text = stuecke.join(" ");

  // 5. Fassung ohne jeglichen Leerraum (Leerzeichen, Zeilenumbrüche, geschützte Leerzeichen)
  const ohneLeerraum = text.replace(/\s+/g, "");

  // 6. Beides zurückgeben
  return { text, ohneLeerraum };
}
