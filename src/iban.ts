export function istGueltig(iban: string): boolean {
  const clean = iban.replaceAll(" ", "").toUpperCase();
  if (clean.length < 15) return false;

  const rotated = clean.slice(4) + clean.slice(0, 4);
  let digits = "";

  for (const char of rotated) {
    const code = char.charCodeAt(0);
    digits += code >= 65 && code <= 90 ? (code - 55).toString() : char;
  }

  return BigInt(digits) % 97n === 1n;
}
