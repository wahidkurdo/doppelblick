export function baueBetragVarianten(xmlBetrag: string): string[] {
  const [vorkomma, nachkomma = "00"] = xmlBetrag.split(".");
  const nachkommaZwei = nachkomma.padEnd(2, "0").slice(0, 2);

  const einfach = `${vorkomma},${nachkommaZwei}`;
  const formatiertVorkomma = new Intl.NumberFormat("de-DE").format(BigInt(vorkomma));
  const mitTausender = `${formatiertVorkomma},${nachkommaZwei}`;

  return einfach === mitTausender ? [einfach] : [einfach, mitTausender];
}

export function enthaeltBetrag(text: string, betrag: string): boolean {
  let start = 0;

  while (true) {
    const pos = text.indexOf(betrag, start);
    if (pos === -1) return false;

    const davor = text[pos - 1] ?? "";
    const danach = text[pos + betrag.length] ?? "";

    const davorBlockiert = /[0-9.,]/.test(davor);
    const danachBlockiert = /[0-9]/.test(danach);

    if (!davorBlockiert && !danachBlockiert) {
      return true;
    }

    start = pos + 1;
  }
}
