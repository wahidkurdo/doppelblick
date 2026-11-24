import { istGueltig, baueIban } from "../src/iban.ts";

const ibanA = baueIban("99900011", "1234567890");
const ibanB = baueIban("99900022", "9876543210");

console.log("IBAN A:", ibanA, "-> Gültig:", istGueltig(ibanA));
console.log("IBAN B:", ibanB, "-> Gültig:", istGueltig(ibanB));
