# Damascius Atlas — Öffentliche bilinguale Edition / Public Bilingual Edition v1.2.0

Eine eigenständige, offline-fähige Einzeldatei-App zu Damascius’ *Philosophischer Geschichte*.
An independent, offline-capable single-file app on Damascius’ *Philosophical History*.

## Neu in v1.2.0 / New in v1.2.0

- geografisch basierter Atlas mit realen Koordinaten, Küstenlinien, Ortsregister und filterbaren Reiserouten;
- geographical atlas with real coordinates, coastlines, a gazetteer, and filterable routes;
- vollständiger deutsch-englischer Feld- und Laufzeitaudit, einschließlich Erzählmodale, Personennamen, Datierungen und Quellenlabels;
- complete German/English field and runtime audit, including story modals, personal names, dates, and source labels;
- erheblich reichere Erzähl-, Personen-, Orts- und Fragmentansichten;
- substantially richer story, person, place, and fragment views;
- ausführliche Einführung zur historischen und gegenwärtigen Relevanz;
- expanded introduction explaining the historical and contemporary relevance;
- originale SVG/CSS-Szenenbilder und neue Kartengestaltung;
- original SVG/CSS scene artwork and redesigned cartography.

## Öffentliche Bereitstellung / Public deployment

Veröffentlicht werden können die Dateien dieses Ordners. **Nicht** veröffentlichen:
Do not publish:

- `Damascius-History.pdf` oder andere Scans / scans;
- extrahierte Seitenbilder oder längere moderne Übersetzungstexte;
- private Notizen oder lokal verbundene Dateien.

`index.html` lädt keine externen Skripte, Fonts, Bilder oder Kartenkacheln. Die Links im Bereich
„Rechte & Quellen / Rights & Sources“ sind normale, erst nach einem Klick geöffnete Referenzlinks.

## Lokal öffnen / Open locally

```bash
open index.html
```

Die optionale Schaltfläche „PDF lokal verbinden / Connect local PDF“ arbeitet nur im aktuellen Browser-Tab.
Die Datei wird nicht hochgeladen oder in der öffentlichen App gespeichert.

## GitHub Pages

Das mitgelieferte Skript kopiert nur in einen Unterordner `damascius-atlas/`, zeigt anschließend den
Git-Diff und führt **keinen** Commit und **keinen** Push aus:

```bash
zsh deploy-to-github-pages.command /vollständiger/pfad/zum/local-ai-testprojects
```

## Lizenzen / Licences

- Programmcode / code: MIT
- eigenständige App-Texte und originale SVG/CSS-Gestaltung / independent app prose and original SVG/CSS design: CC BY 4.0
- eingebettete Natural-Earth-Landgeometrie / embedded Natural Earth land geometry: Public Domain
- antike gemeinfreie Inhalte und bibliographische Fakten / public-domain ancient material and bibliographic facts: not claimed

Vorgeschlagene Namensnennung / Suggested attribution: **Damascius Atlas, 2026**.

Die Schutz- und Quellenhinweise stehen in `COPYRIGHT-AND-SOURCES.md`. Sie dokumentieren eine
konservative Publikationsstrategie und sind keine individuelle Rechtsberatung.
