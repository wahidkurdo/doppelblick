export function baueBetragVarianten(xmlBetrag: string): string[] {
  const [vorkomma, nachkomma = "00"] = xmlBetrag.split(".");
  const nachkommaZwei = nachkomma.padEnd(2, "0").slice(0, 2);

  const einfach = `${vorkomma},${nachkommaZwei}`;
  const formatiertVorkomma = new Intl.NumberFormat("de-DE").format(BigInt(vorkomma));
  const mitTausender = `${formatiertVorkomma},${nachkommaZwei}`;

  return einfach === mitTausender ? [einfach] : [einfach, mitTausender];
}
