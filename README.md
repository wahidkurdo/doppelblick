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

Kommt bald. Die Beispielrechnungen haben erfundene Daten.

## Lizenz

Der Code steht unter der Apache License 2.0 (siehe `LICENSE`). Die Beispieldateien im Ordner `beispiele/` stehen unter CC0.
