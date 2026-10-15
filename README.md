# Energiewirtschaft kompakt

Interaktive Wissenslandkarte der Energiewirtschaft mit KI-Einordnungsassistent.
Ziel: neue Gesetze, Festlegungen und Innovationen schnell **einordnen**, **verknüpfen** und **tief verstehen** – kein Karteikartensystem, sondern ein Big Picture.

## Ansichten

| Ansicht | Wofür |
|---|---|
| **Übersicht** | Einstieg: Frage stellen, Ebenen der Energiewirtschaft, Themen „in Bewegung“ |
| **Big Picture** | Netzwerk aller Themen, farbig nach Ebene – frei oder nach Ebenen geordnet; Klick zeigt Verbindungen mit Erklärung |
| **Themen** | Erklärung, „Zum Merken“, Abgrenzungen, Zusammenhänge, Rechtsgrundlagen, eigene Notizen |
| **Zusammenhänge** | Zwei Themen wählen → Weg durch die Landkarte + direkte Abgrenzung |
| **Schaubilder** | Interaktive Darstellungen: Gartenzaunprinzip, Steuerungskette (SMGW/CLS/GWA), präventiv vs. netzorientiert, § 14a-Deal, Netzentgelt-Module, Flexibilitätssignale, Solarspitzengesetz – auch direkt auf den passenden Themenseiten |
| **Zeitstrahl** | Was gilt seit wann, welche Fristen kommen |
| **Einordnen (KI)** | Claude erklärt im Kontext der Landkarte und schlägt neue Themen/Verbindungen vor (per Klick übernehmen) |

Startwissen u. a.: § 14a EnWG, präventives vs. netzorientiertes Steuern, Gartenzaunprinzip, SteuVE, iMSys/mME/SMGW, GWA, CLS, Steuerbox, EEBUS, MsbG, Netzzustandsermittlung, Netzentgelt-Module, dynamische Tarife, § 14c, Redispatch 2.0, Solarspitzengesetz.

## Aufbau (wie die IEC-Roadmap)

- React + TypeScript + Vite, Tailwind CSS
- **Speicherung im Repo:** Die Landkarte liegt in `data/knowledge.json` und wird über die GitHub-API gelesen/geschrieben (jede Änderung = ein Commit). Ohne GitHub-Token wird nur lokal im Browser gespeichert.
- **KI-Assistent:** ruft die Claude-API direkt aus dem Browser auf (`@anthropic-ai/sdk`, Modell `claude-opus-5-5`, optional mit Websuche für aktuelle Rechtsstände). Der API-Schlüssel wird nur im Browser (localStorage) gespeichert.
- **Deployment:** GitHub Actions → GitHub Pages bei Push auf `main` (`.github/workflows/deploy.yml`).

## Einrichtung

1. In der App unter **Einstellungen**:
   - GitHub Fine-grained Token mit *Contents: Read and write* für dieses Repo
   - Claude-API-Schlüssel (https://platform.claude.com/settings/keys)
2. GitHub Pages: *Settings → Pages → Source: GitHub Actions*. Hinweis: Pages für **private** Repos erfordert GitHub Pro. Alternativ lokal starten.

## Lokal starten

```bash
npm install
npm run dev
```

## Struktur

```
src/
  data/initialKnowledge.ts   Startwissen (Themen + Beziehungen)
  data/categories.ts         Ebenen und Beziehungstypen
  data/milestones.ts         Stichtage für den Zeitstrahl
  components/diagrams/       Interaktive Schaubilder + registry.ts (welches Schaubild zu welchem Thema)
  services/assistant.ts      Claude-Anbindung, System-Prompt, Vorschlags-Werkzeug
  services/githubStorage.ts  Laden/Speichern im Repo
  store/useStore.ts          App-Zustand
  components/                Ansichten
```

> Inhalte sind Lern-Zusammenfassungen (Stand Herbst 2026). Für verbindliche Aussagen immer Primärquellen (Gesetzestext, BNetzA-Festlegung) prüfen.
