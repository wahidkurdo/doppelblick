# Doppelblick

Eine E-Rechnung hat zwei Teile: ein PDF und ein verstecktes XML. Doppelblick prüft, ob die Werte im XML die gleichen sind, die auch im PDF angezeigt werden.

Das hier ist erst eine Skizze, kein fertiges Werkzeug.

## Das Problem

Das kann ausgenutzt werden: Im PDF wird ein anderer Wert angezeigt, als im XML steht. Das PDF liest der Mensch selbst, das XML wird von den Programmen gelesen.

Bei E-Rechnungen im hybriden Format (wie ZUGFeRD oder Factur-X) gilt im Zweifel der strukturierte XML-Datensatz als das maßgebliche Original – nicht die visuelle PDF-Ansicht (vgl. [BMF-Schreiben vom 15.10.2025](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/Umsatzsteuer-Anwendungserlass/2025-10-15-einfuehrung-obligatorische-e-rechnung.html) zur Einführung der obligatorischen E-Rechnung). Weicht die IBAN im unsichtbaren XML-Anhang vom sichtbaren PDF-Beleg ab, überweist eine automatisierte Buchhaltung an das falsche Konto, ohne dass es bei einer reinen Sichtprüfung auffällt.

## Was die Skizze kann

Die Skizze prüft zwei Werte: den Betrag, also um wie viel Geld es geht, und die IBAN, also wohin das Geld überwiesen wird.

Das Programm zeigt dem Nutzer, ob die beiden Werte zusammenstimmen oder ob sie voneinander abweichen. Eine Abweichung kann Betrug sein, aber auch ein Programmfehler. Also ob die IBAN und der Betrag, die im PDF angezeigt werden, auch die gleichen sind, die im XML stehen.

## Was die Skizze noch nicht kann

- Keine eingescannten oder fotografierten Papierrechnungen, weil die nicht im richtigen Format sind.
- Kein QR-Code zum Bezahlen (GiroCode).
- Nur E-Rechnungen im Format ZUGFeRD/Factur-X.
- Nur Betrag und IBAN, keine anderen Werte.
- Kein Kontext beim Betrag: Der Rechnungsbetrag gilt bereits als gefunden, sobald die passende Zahlenfolge irgendwo im sichtbaren PDF-Text auftaucht – es wird noch nicht geprüft, ob sie wirklich beim Gesamtbetrag steht und nicht zufällig bei einer Einzelposition.
- Nur deutsche IBANs bei der Gegenprüfung: Die Rückwärtssuche im sichtbaren PDF sucht gezielt nach dem Muster DE plus 20 Ziffern. Ausländische IBANs werden dabei noch nicht erkannt.
- Nur ein XML-Anhang: Die Skizze liest nur den ersten gefundenen bekannten Anhang (hier factur-x.xml). In iban-abweichend.pdf hängt über /AF noch das ursprüngliche XML; mehrere XML-Dateien in der normalen Anhangliste meldet sie mit einer Warnung, ein zusätzliches XML, das nur über /AF eingebunden ist, aber noch nicht.

## Ausprobieren

Voraussetzung: Node.js ab Version 22.18 (führt TypeScript-Dateien direkt ohne Build-Schritt aus).

```bash
git clone https://github.com/wahidkurdo/doppelblick.git
cd doppelblick
npm ci
```

Unveränderte Rechnung prüfen (Exit-Code 0):

```bash
node src/pruefe.ts beispiele/korrekt.pdf
```

Ausgabe:

```text
Betrag: ok (678,30)
IBAN: ok (DE52999000111234567890)
keine Abweichung
```

Manipulierte Rechnung mit abweichender XML-IBAN prüfen (Exit-Code 1):

```bash
node src/pruefe.ts beispiele/iban-abweichend.pdf
```

Ausgabe:

```text
Betrag: ok (678,30)
IBAN: ABWEICHUNG – PDF zeigt DE52999000111234567890, XML nennt DE54999000229876543210
ABWEICHUNG
```

Automatisierte Tests ausführen:

```bash
npm test
```

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

`iban-abweichend.pdf` ist danach kein sauberes PDF/A-3 mehr. Ein echter Angreifer verändert Rechnungen ebenfalls ohne Rücksicht auf die strenge PDF/A-3-Norm, weil manche Buchhaltungsprogramme beim Import den PDF/A-Standard gar nicht prüfen, sondern einfach blind das eingebettete XML auslesen. Gerade deshalb muss das Prüfwerkzeug auch solche „unsauberen“ Dateien akzeptieren und den IBAN-Unterschied trotzdem zuverlässig erkennen.

## Lizenz

Der Code steht unter der Apache License 2.0 (siehe `LICENSE`). Die Beispieldateien im Ordner `beispiele/` stehen unter CC0.
