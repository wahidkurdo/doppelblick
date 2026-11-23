# Doppelblick

Eine E-Rechnung hat zwei Teile: ein PDF und ein verstecktes XML. Doppelblick prüft, ob die Werte im XML die gleichen sind, die auch im PDF angezeigt werden.

Das hier ist erst eine Skizze, kein fertiges Werkzeug.

## Das Problem

Das kann ausgenutzt werden: Im PDF wird ein anderer Wert angezeigt, als im XML steht. Das PDF liest der Mensch selbst, das XML wird von den Programmen gelesen.

## Was die Skizze kann

Die Skizze prüft zwei Werte: den Betrag, also um wie viel Geld es geht, und die IBAN, also wohin das Geld überwiesen wird.

Das Programm zeigt dem Nutzer, ob die beiden Werte zusammenstimmen oder ob die Datei manipuliert ist. Also ob die IBAN und der Betrag, die im PDF angezeigt werden, auch die gleichen sind, die im XML stehen.

## Was die Skizze noch nicht kann

- Keine eingescannten oder fotografierten Papierrechnungen, weil die nicht im richtigen Format sind.
- Kein QR-Code zum Bezahlen (GiroCode).
- Nur E-Rechnungen im Format ZUGFeRD/Factur-X.
- Nur Betrag und IBAN, keine anderen Werte.

## Ausprobieren

Kommt bald.

## Beispielrechnungen

Die Beispielrechnungen haben erfundene Daten. Die Bankleitzahlen 99900011 und 99900022 in den IBANs gibt es nicht.

In `korrekt.pdf` stimmen die sichtbar abgedruckte IBAN auf dem PDF-Beleg und die im versteckten XML-Anhang hinterlegte IBAN exakt überein. In `iban-abweichend.pdf` wurde die IBAN im XML nachträglich ausgetauscht – das PDF sieht für Menschen noch genau gleich aus, aber eine automatische Rechnungssoftware würde an das falsche Konto überweisen.

So sind die beiden Dateien entstanden (Rechnungsdaten in `beispiele/erzeugen/rechnung.json`, erzeugt mit [openinvoicexml](https://github.com/HongbaeKim/openinvoicexml)):

```
node beispiele/erzeugen/erzeuge.ts
qpdf --show-attachment=factur-x.xml beispiele/korrekt.pdf > beispiele/erzeugen/factur-x-iban-b.xml
sed -i 's/DE52999000111234567890/DE54999000229876543210/' beispiele/erzeugen/factur-x-iban-b.xml
qpdf beispiele/korrekt.pdf --add-attachment beispiele/erzeugen/factur-x-iban-b.xml --key=factur-x.xml --mimetype=text/xml --replace -- beispiele/iban-abweichend.pdf
```

`iban-abweichend.pdf` ist danach kein sauberes PDF/A-3 mehr. Ein echter Angreifer manipuliert Rechnungen ebenfalls ohne Rücksicht auf die strenge PDF/A-3-Norm, weil viele Buchhaltungsprogramme beim Import den PDF/A-Standard gar nicht prüfen, sondern einfach blind das eingebettete XML auslesen. Gerade deshalb muss unser Prüfwerkzeug auch solche „unsauberen“ Dateien akzeptieren und den IBAN-Unterschied erkennen.

## Lizenz

Der Code steht unter der Apache License 2.0 (siehe `LICENSE`). Die Beispieldateien im Ordner `beispiele/` stehen unter CC0.
