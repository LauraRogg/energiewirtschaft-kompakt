export interface Milestone {
  /** ISO-Datum; bei Zielen das Stichtagsende */
  date: string;
  title: string;
  text: string;
  topic: string;
  kind: 'inkraft' | 'frist';
}

/** Zentrale Stichtage. Stand Herbst 2026 – Fristen vor Prüfungen gegen Primärquellen abgleichen. */
export const MILESTONES: Milestone[] = [
  { date: '2021-10-01', title: 'Redispatch 2.0 startet', text: 'EE- und KWK-Anlagen ab 100 kW werden in den Redispatch einbezogen.', topic: 'redispatch', kind: 'inkraft' },
  { date: '2023-05-27', title: 'GNDEW in Kraft', text: 'Neustart der Digitalisierung: Rollout-Fahrplan, agiler Rollout, Kostendeckel für iMSys.', topic: 'msbg', kind: 'inkraft' },
  { date: '2024-01-01', title: '§ 14a-Neuregelung', text: 'BNetzA-Festlegungen gelten: Anschlusspflicht, Dimmen auf mind. 4,2 kW, Netzentgelt-Module 1 und 2.', topic: 'par14a', kind: 'inkraft' },
  { date: '2025-01-01', title: 'Dynamische Tarife für alle', text: 'Alle Stromlieferanten müssen einen dynamischen Tarif anbieten.', topic: 'par41a', kind: 'inkraft' },
  { date: '2025-02-25', title: 'Solarspitzengesetz', text: 'Keine Vergütung bei negativen Preisen für Neuanlagen, 60 %-Begrenzung ohne Steuerbarkeit.', topic: 'solarspitzen', kind: 'inkraft' },
  { date: '2025-04-01', title: 'Modul 3 startet', text: 'Zeitvariable Netzentgelte für steuerbare Verbrauchseinrichtungen.', topic: 'zvne', kind: 'inkraft' },
  { date: '2025-12-31', title: 'Rollout-Ziel 20 %', text: 'Etappenziel des gesetzlichen Rollout-Fahrplans für Pflichteinbaufälle.', topic: 'imsys', kind: 'frist' },
  { date: '2028-12-31', title: 'Ende präventives Steuern', text: 'Spätestes Ende der Übergangsphase; zudem Rollout-Ziel 50 % der Pflichtfälle.', topic: 'praeventiv', kind: 'frist' },
  { date: '2030-12-31', title: 'Rollout-Ziel 95 %', text: 'Pflichteinbaufälle sollen weitgehend mit iMSys ausgestattet sein.', topic: 'imsys', kind: 'frist' },
];
