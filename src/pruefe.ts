import { holeXml } from "./xml-holen.ts";
import { leseRechnungsdaten } from "./xml-lesen.ts";
import { holeText } from "./text-holen.ts";
import { istGueltig } from "./iban.ts";
import { baueBetragVarianten } from "./betrag.ts";

const pdfPfad = process.argv[2];

if (!pdfPfad) {
  console.error("Fehler: Bitte einen PDF-Pfad angeben.");
  console.error("Aufruf: node src/pruefe.ts <pfad-zur-rechnung.pdf>");
  process.exitCode = 2;
} else {
  try {
    const xml = await holeXml(pdfPfad);
    const { betrag, ibans: xmlIbans } = leseRechnungsdaten(xml);
    const { text, ohneLeerraum } = await holeText(pdfPfad);

    let hatAbweichung = false;

    const betragVarianten = baueBetragVarianten(betrag);
    const gefundenerBetrag = betragVarianten.find((variante) =>
      text.includes(variante)
    );

    if (gefundenerBetrag) {
      console.log(`Betrag: ok (${gefundenerBetrag})`);
    } else {
      console.log(
        `Betrag: ABWEICHUNG – XML nennt ${betragVarianten[0]}, im PDF nicht gefunden`
      );
      hatAbweichung = true;
    }

    const fehlendeXmlIbans: string[] = [];
    for (const xmlIban of xmlIbans) {
      const sauber = xmlIban.replace(/\s+/g, "").toUpperCase();
      if (!ohneLeerraum.toUpperCase().includes(sauber)) {
        fehlendeXmlIbans.push(sauber);
      }
    }

    const treffer = ohneLeerraum.toUpperCase().matchAll(/DE\d{20}/g);
    const pdfIbans = new Set<string>();

    for (const match of treffer) {
      const kandidat = match[0];
      if (istGueltig(kandidat)) {
        pdfIbans.add(kandidat);
      }
    }

    const xmlIbanSet = new Set(
      xmlIbans.map((i) => i.replace(/\s+/g, "").toUpperCase())
    );
    const zusaetzlichePdfIbans = [...pdfIbans].filter(
      (iban) => !xmlIbanSet.has(iban)
    );

    if (fehlendeXmlIbans.length === 0 && zusaetzlichePdfIbans.length === 0) {
      console.log(`IBAN: ok (${[...xmlIbanSet].join(", ")})`);
    } else {
      hatAbweichung = true;
      const pdfAnzeige =
        zusaetzlichePdfIbans.length > 0
          ? zusaetzlichePdfIbans.join(", ")
          : "keine abweichende IBAN";
      const xmlAnzeige =
        fehlendeXmlIbans.length > 0
          ? fehlendeXmlIbans.join(", ")
          : [...xmlIbanSet].join(", ");

      console.log(
        `IBAN: ABWEICHUNG – PDF zeigt ${pdfAnzeige}, XML nennt ${xmlAnzeige}`
      );
    }

    if (hatAbweichung) {
      console.log("ABWEICHUNG");
      process.exitCode = 1;
    } else {
      console.log("keine Abweichung");
      process.exitCode = 0;
    }
  } catch (fehler) {
    const meldung = fehler instanceof Error ? fehler.message : String(fehler);
    console.error(`Fehler bei der Prüfung: ${meldung}`);
    process.exitCode = 2;
  }
}
