function berechneRest(iban: string): bigint {
  const clean = iban.replaceAll(" ", "").toUpperCase();
  const rotated = clean.slice(4) + clean.slice(0, 4);
  let digits = "";

  for (const char of rotated) {
    const code = char.charCodeAt(0);
    digits += code >= 65 && code <= 90 ? (code - 55).toString() : char;
  }

  return BigInt(digits) % 97n;
}

export function istGueltig(iban: string): boolean {
  const clean = iban.replaceAll(" ", "").toUpperCase();
  if (clean.length < 15) return false;
  if (!/^[A-Z0-9]+$/.test(clean)) return false;

  return berechneRest(clean) === 1n;
}

export function baueIban(blz: string, konto: string): string {
  const dummy = "DE00" + blz + konto;
  const rest = berechneRest(dummy);
  const pruefziffer = (98n - rest).toString().padStart(2, "0");

  return "DE" + pruefziffer + blz + konto;
}
