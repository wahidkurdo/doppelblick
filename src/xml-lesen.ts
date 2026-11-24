import { XMLParser } from "fast-xml-parser";

export interface Rechnungsdaten {
  betrag: string;
  ibans: string[];
}

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
  if (/<!doctype/i.test(xml)) {
    throw new Error("Sicherheitsabbruch: XML enthält eine unzulässige <!DOCTYPE>-Deklaration.");
  }

  const parser = new XMLParser({
    processEntities: false,
    removeNSPrefix: true,
    ignoreAttributes: false,
    parseTagValue: false,
  });

  const daten = parser.parse(xml);

  if (!daten?.CrossIndustryInvoice) {
    throw new Error("Nicht unterstütztes Format: Nur CII (CrossIndustryInvoice) wird unterstützt.");
  }

  const settlement =
    daten.CrossIndustryInvoice?.SupplyChainTradeTransaction?.ApplicableHeaderTradeSettlement;

  if (!settlement) {
    throw new Error("Strukturfehler: ApplicableHeaderTradeSettlement fehlt im XML.");
  }

  const rawBetrag =
    settlement.SpecifiedTradeSettlementHeaderMonetarySummation?.DuePayableAmount;
  const betrag = holeTextWert(rawBetrag);

  if (!betrag) {
    throw new Error("Strukturfehler: DuePayableAmount (Zahlbetrag) konnte nicht gelesen werden.");
  }

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
