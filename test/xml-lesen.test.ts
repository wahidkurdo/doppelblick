import { test } from "node:test";
import assert from "node:assert/strict";
import { leseRechnungsdaten } from "../src/xml-lesen.ts";

test("liest Betrag und IBAN aus einem minimalen CII-XML", () => {
  const miniXml = `<?xml version="1.0" encoding="UTF-8"?>
  <rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100">
    <rsm:SupplyChainTradeTransaction>
      <ram:ApplicableHeaderTradeSettlement>
        <ram:SpecifiedTradeSettlementPaymentMeans>
          <ram:PayeePartyCreditorFinancialAccount>
            <ram:IBANID>DE89370400440532013000</ram:IBANID>
          </ram:PayeePartyCreditorFinancialAccount>
        </ram:SpecifiedTradeSettlementPaymentMeans>
        <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
          <ram:DuePayableAmount currencyID="EUR">249.90</ram:DuePayableAmount>
        </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
      </ram:ApplicableHeaderTradeSettlement>
    </rsm:SupplyChainTradeTransaction>
  </rsm:CrossIndustryInvoice>`;

  const ergebnis = leseRechnungsdaten(miniXml);
  assert.equal(ergebnis.betrag, "249.90");
  assert.deepEqual(ergebnis.ibans, ["DE89370400440532013000"]);
});

test("lehnt XML mit großgeschriebenem <!DOCTYPE ab", () => {
  const boesesXml = `<?xml version="1.0"?><!DOCTYPE foo><CrossIndustryInvoice/>`;
  assert.throws(() => leseRechnungsdaten(boesesXml), /Sicherheitsabbruch/);
});

test("lehnt XML mit kleingeschriebenem <!doctype ab", () => {
  const boesesXmlKlein = `<?xml version="1.0"?><!doctype foo><CrossIndustryInvoice/>`;
  assert.throws(() => leseRechnungsdaten(boesesXmlKlein), /Sicherheitsabbruch/);
});
