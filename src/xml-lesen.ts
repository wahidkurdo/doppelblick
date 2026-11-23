import { XMLParser } from "fast-xml-parser";

export interface Rechnungsdaten {
  betrag: string;
  ibans: string[];
}

// Hilfsfunktion für Stolperfalle 2: Falls ein Tag Attribute hat (z. B. currencyID="EUR"),
// liegt der eigentliche Wert unter "#text", sonst direkt als Text vor.
function holeTextWert(knoten: unknown): string | undefined {
  if (typeof knoten === "string") {
    return knoten.trim();
  }
  if (typeof knoten === "object" && knoten !== null && "#text" in knoten) {
    return String((knoten as { "#text": unknown })["#text"]).trim();
  }
  return undefined;
}

export function leseRechnungsdaten(xml: string): Rechnungsdaten {
  // 1. Sicherheit zuerst: XXE-Schutz
  if (xml.includes("<!DOCTYPE")) {
    throw new Error("Sicherheitsabbruch: XML enthält eine unzulässige <!DOCTYPE>-Deklaration.");
  }

  // 2. Parser einstellen und ausführen
  const parser = new XMLParser({
    processEntities: false,
    removeNSPrefix: true,
    ignoreAttributes: false,
    parseTagValue: false,
  });

  const daten = parser.parse(xml);

  // 3. Nur CII unterstützen
  if (!daten?.CrossIndustryInvoice) {
    throw new Error("Nicht unterstütztes Format: Nur CII (CrossIndustryInvoice) wird unterstützt.");
  }

  // 4. Den Weg entlanggehen (gemeinsamer Start)
  const settlement =
    daten.CrossIndustryInvoice?.SupplyChainTradeTransaction?.ApplicableHeaderTradeSettlement;

  if (!settlement) {
    throw new Error("Strukturfehler: ApplicableHeaderTradeSettlement fehlt im XML.");
  }

  // Betrag auslesen
  const rawBetrag =
    settlement.SpecifiedTradeSettlementHeaderMonetarySummation?.DuePayableAmount;
  const betrag = holeTextWert(rawBetrag);

  if (!betrag) {
    throw new Error("Strukturfehler: DuePayableAmount (Zahlbetrag) konnte nicht gelesen werden.");
  }

  // 5. Stolperfalle 1: Zahlungswege können ein einzelnes Objekt oder eine Liste sein
  const rawPaymentMeans = settlement.SpecifiedTradeSettlementPaymentMeans;
  const zahlungswege = Array.isArray(rawPaymentMeans)
    ? rawPaymentMeans
    : rawPaymentMeans
      ? [rawPaymentMeans]
      : [];

  const ibans: string[] = [];

  for (const weg of zahlungswege) {
    const rawIban = weg?.PayeePartyCreditorFinancialAccount?.IBANID;
    const iban = holeTextWert(rawIban);
    if (iban) {
      ibans.push(iban);
    }
  }

  return { betrag, ibans };
}
