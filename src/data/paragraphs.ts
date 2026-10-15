export type LawId = 'enwg' | 'msbg' | 'eeg';

export interface Law {
  id: LawId;
  short: string;
  title: string;
  question: string;
  scope: string;
  color: string;
}

export const LAWS: Law[] = [
  {
    id: 'enwg', short: 'EnWG', title: 'Energiewirtschaftsgesetz',
    question: 'Nach welchen Spielregeln funktionieren Netze und Strommarkt?',
    scope: 'Netzbetrieb, Netzanschluss und -zugang, Netzentgelte, Entflechtung, Systemsicherheit, Belieferung von Kunden, Befugnisse der BNetzA.',
    color: '#6250d6',
  },
  {
    id: 'msbg', short: 'MsbG', title: 'Messstellenbetriebsgesetz',
    question: 'Wer misst wie – und wie kommen Daten und Steuerbefehle sicher ans Ziel?',
    scope: 'Messstellenbetrieb (gMSB/wMSB), Smart-Meter-Rollout, Preisobergrenzen, Sicherheitsanforderungen an SMGW und GWA, Datenkommunikation.',
    color: '#eda100',
  },
  {
    id: 'eeg', short: 'EEG', title: 'Erneuerbare-Energien-Gesetz',
    question: 'Wie werden Erneuerbare ausgebaut, angeschlossen und bezahlt?',
    scope: 'Ausbauziele, Anschluss- und Abnahmevorrang, Einspeisevergütung, Marktprämie/Direktvermarktung, Ausschreibungen, technische Vorgaben für EE-Anlagen.',
    color: '#1baf7a',
  },
];

export interface Paragraph {
  law: LawId;
  nr: string;
  title: string;
  text: string;
  group: string;
  topic?: string;
  /** Nummer/Zuordnung vor Verwendung in Prüfung oder Job gegen den aktuellen Gesetzestext prüfen */
  pruefen?: boolean;
}

export const PARAGRAPHS: Paragraph[] = [
  // ── EnWG ──
  { law: 'enwg', group: 'Grundlagen', nr: '§ 1', title: 'Zweck und Ziele', text: 'Sichere, preisgünstige, verbraucherfreundliche, effiziente und umweltverträgliche, zunehmend erneuerbare Versorgung.' },
  { law: 'enwg', group: 'Grundlagen', nr: '§ 3', title: 'Begriffsbestimmungen', text: 'Definitionen von Netzbetreiber, Letztverbraucher, Lieferant usw. – erste Anlaufstelle bei Begriffsfragen.' },
  { law: 'enwg', group: 'Netzbetrieb', nr: '§§ 6–10e', title: 'Entflechtung (Unbundling)', text: 'Netzbetrieb muss von Erzeugung und Vertrieb getrennt sein – deshalb sind VNB und Lieferant verschiedene Rollen.' },
  { law: 'enwg', group: 'Netzbetrieb', nr: '§ 11', title: 'Betrieb von Energieversorgungsnetzen', text: 'Pflicht, ein sicheres, zuverlässiges und leistungsfähiges Netz zu betreiben und bedarfsgerecht auszubauen.' },
  { law: 'enwg', group: 'Netzbetrieb', nr: '§ 13', title: 'Systemverantwortung der ÜNB', text: 'Übertragungsnetzbetreiber müssen Gefährdungen des Systems beseitigen – netz- und marktbezogene Maßnahmen.', topic: 'redispatch' },
  { law: 'enwg', group: 'Netzbetrieb', nr: '§ 13a', title: 'Erzeugungsanpassung (Redispatch)', text: 'Anpassung von Erzeugung zur Engpassbehebung inkl. bilanziellem und finanziellem Ausgleich – Kern von Redispatch 2.0.', topic: 'redispatch' },
  { law: 'enwg', group: 'Netzbetrieb', nr: '§ 14', title: 'Aufgaben der Verteilnetzbetreiber', text: 'Überträgt Systemverantwortung sinngemäß auf VNB; Grundlage für deren Mitwirkung am Redispatch.', topic: 'vnb' },
  { law: 'enwg', group: 'Flexibilität', nr: '§ 14a', title: 'Steuerbare Verbrauchseinrichtungen', text: 'Anschlusspflicht für SteuVE, Dimmen im Engpass (mind. 4,2 kW), reduziertes Netzentgelt. Details per BNetzA-Festlegung.', topic: 'par14a' },
  { law: 'enwg', group: 'Flexibilität', nr: '§ 14c', title: 'Marktgestützte Flexibilitätsbeschaffung', text: 'VNB beschaffen Flexibilität transparent und marktgestützt – freiwillig und vergütet.', topic: 'par14c' },
  { law: 'enwg', group: 'Netzbetrieb', nr: '§ 14d', title: 'Netzausbaupläne der VNB', text: 'Größere VNB müssen regelmäßig Netzausbaupläne erstellen und veröffentlichen.' },
  { law: 'enwg', group: 'Anschluss & Zugang', nr: '§ 17', title: 'Netzanschluss', text: 'Netzbetreiber müssen Letztverbraucher, Erzeuger, Speicher usw. zu angemessenen, diskriminierungsfreien Bedingungen anschließen.' },
  { law: 'enwg', group: 'Anschluss & Zugang', nr: '§ 18', title: 'Allgemeine Anschlusspflicht', text: 'Anschlusspflicht in Niederspannung für Haushalte – Grundlage für den Hausanschluss.' },
  { law: 'enwg', group: 'Anschluss & Zugang', nr: '§ 20', title: 'Zugang zu den Energieversorgungsnetzen', text: 'Diskriminierungsfreier Netzzugang für alle – Grundlage dafür, dass jeder Lieferant jeden Kunden beliefern kann.' },
  { law: 'enwg', group: 'Anschluss & Zugang', nr: '§ 21', title: 'Bedingungen und Entgelte für den Netzzugang', text: 'Netzentgelte müssen angemessen und diskriminierungsfrei sein; Details setzt die BNetzA fest.', topic: 'netzentgelte' },
  { law: 'enwg', group: 'Regulierung', nr: '§ 29', title: 'Verfahren zur Festlegung', text: 'Befugnis der Regulierungsbehörde, per Festlegung Regeln zu treffen – so entstehen z. B. die § 14a-Details.', topic: 'bnetza' },
  { law: 'enwg', group: 'Belieferung', nr: '§ 20a', title: 'Lieferantenwechsel', text: 'Regeln für einen schnellen, kostenlosen Lieferantenwechsel.' },
  { law: 'enwg', group: 'Belieferung', nr: '§ 36', title: 'Grundversorgungspflicht', text: 'Der Grundversorger muss jeden Haushaltskunden in seinem Gebiet zu veröffentlichten Bedingungen beliefern.' },
  { law: 'enwg', group: 'Belieferung', nr: '§ 41', title: 'Energielieferverträge mit Letztverbrauchern', text: 'Mindestinhalte und Transparenzpflichten für Lieferverträge.' },
  { law: 'enwg', group: 'Belieferung', nr: '§ 41a', title: 'Lastvariable, tageszeitabhängige oder dynamische Tarife', text: 'Pflicht für alle Lieferanten, dynamische Tarife für Kunden mit iMSys anzubieten.', topic: 'par41a' },
  { law: 'enwg', group: 'Gebäude', nr: '§ 42a', title: 'Mieterstromverträge', text: 'Mieterstrom: nicht Teil des Mietvertrags, Preisdeckel 90 % des Grundversorgungstarifs, Vollversorgung.', topic: 'mieterstrom' },
  { law: 'enwg', group: 'Gebäude', nr: '§ 42b', title: 'Gemeinschaftliche Gebäudeversorgung', text: 'Aufteilung von Gebäude-PV-Strom nach Schlüssel, ohne Vollversorgungspflicht.', topic: 'ggv' },
  { law: 'enwg', group: 'Gebäude', nr: '§ 42c', title: 'Gemeinsame Nutzung (Energy Sharing)', text: 'Gemeinsame Nutzung von EE-Strom über das öffentliche Netz innerhalb eines Gebiets – neu eingeführt.', pruefen: true },

  // ── MsbG ──
  { law: 'msbg', group: 'Grundlagen', nr: '§ 1', title: 'Anwendungsbereich', text: 'Ausstattung von Messstellen, Messstellenbetrieb und Datenkommunikation in intelligenten Energienetzen.' },
  { law: 'msbg', group: 'Grundlagen', nr: '§ 2', title: 'Begriffsbestimmungen', text: 'Definiert u. a. grundzuständigen MSB, intelligentes Messsystem, moderne Messeinrichtung, SMGW, GWA, Anschlussnehmer/-nutzer.', topic: 'gmsb' },
  { law: 'msbg', group: 'Rollen', nr: '§ 3', title: 'Messstellenbetrieb', text: 'Messstellenbetrieb ist Aufgabe des grundzuständigen MSB, sofern nicht nach §§ 5, 6 ein Dritter beauftragt wird.', topic: 'gmsb' },
  { law: 'msbg', group: 'Rollen', nr: '§ 5', title: 'Auswahlrecht des Anschlussnutzers', text: 'Wer den Strom nutzt (z. B. Mieter), darf einen wettbewerblichen MSB beauftragen.', topic: 'wmsb' },
  { law: 'msbg', group: 'Rollen', nr: '§ 6', title: 'Auswahlrecht des Anschlussnehmers', text: 'Eigentümer dürfen für die ganze Liegenschaft einen MSB wählen (Liegenschaftsmodell), u. a. ohne Mehrkosten für Anschlussnutzer.', topic: 'wmsb' },
  { law: 'msbg', group: 'Rollen', nr: '§§ 41 ff.', title: 'Übertragung der Grundzuständigkeit', text: 'Verfahren, mit dem ein Netzbetreiber die Grundzuständigkeit auf ein anderes Unternehmen übertragen kann.', topic: 'gmsb', pruefen: true },
  { law: 'msbg', group: 'Technik & Sicherheit', nr: '§§ 19 ff.', title: 'Technische Vorgaben, Datenschutz und Datensicherheit', text: 'Mindestanforderungen an iMSys und SMGW; Bezug auf BSI-Schutzprofile und Technische Richtlinien.', topic: 'smgw' },
  { law: 'msbg', group: 'Technik & Sicherheit', nr: '§ 25', title: 'Smart-Meter-Gateway-Administrator', text: 'Anforderungen an den GWA: zuverlässiger, sicherer Betrieb, Zertifizierung.', topic: 'gwa', pruefen: true },
  { law: 'msbg', group: 'Rollout', nr: '§ 29', title: 'Ausstattung von Messstellen', text: 'Wer bekommt ein iMSys oder eine mME? Pflichteinbaufälle u. a. > 6.000 kWh, SteuVE nach § 14a, PV > 7 kW.', topic: 'imsys' },
  { law: 'msbg', group: 'Rollout', nr: '§§ 30 ff.', title: 'Preisobergrenzen', text: 'Was der gMSB je Einbaufall maximal verlangen darf – aufgeteilt zwischen Anschlussnutzer und Netzbetreiber.', topic: 'gmsb', pruefen: true },
  { law: 'msbg', group: 'Rollout', nr: '§ 45', title: 'Rollout-Fahrplan', text: 'Zeitliche Zielmarken für den Pflicht-Rollout (u. a. 20 % / 50 % / 95 %).', topic: 'imsys', pruefen: true },
  { law: 'msbg', group: 'Daten', nr: '§§ 49 ff.', title: 'Datenkommunikation', text: 'Welche Stellen welche Daten erhalten dürfen (berechtigte Stellen, Zweckbindung) – Grundlage für pEMT-Datenflüsse.', topic: 'pemt' },
  { law: 'msbg', group: 'Daten', nr: '§ 60', title: 'Datenübermittlung', text: 'Wie und an wen Messwerte übermittelt werden.', topic: 'pemt', pruefen: true },

  // ── EEG ──
  { law: 'eeg', group: 'Grundlagen', nr: '§ 1', title: 'Zweck und Ziel', text: 'Ausbauziel: mindestens 80 % Erneuerbare am Bruttostromverbrauch bis 2030.', topic: 'eeg' },
  { law: 'eeg', group: 'Grundlagen', nr: '§ 2', title: 'Besondere Bedeutung der Erneuerbaren', text: 'EE liegen im überragenden öffentlichen Interesse – wichtig für Genehmigungen und Abwägungen.' },
  { law: 'eeg', group: 'Grundlagen', nr: '§ 3', title: 'Begriffsbestimmungen', text: 'Anlage, Anlagenbetreiber, Inbetriebnahme, installierte Leistung usw.' },
  { law: 'eeg', group: 'Anschluss & Technik', nr: '§ 8', title: 'Anschluss', text: 'Netzbetreiber müssen EE-Anlagen unverzüglich vorrangig anschließen.', topic: 'pv' },
  { law: 'eeg', group: 'Anschluss & Technik', nr: '§ 9', title: 'Technische Vorgaben', text: 'Steuerbarkeit und Messung von EE-Anlagen; hier greift u. a. die Einspeisebegrenzung des Solarspitzengesetzes.', topic: 'solarspitzen' },
  { law: 'eeg', group: 'Anschluss & Technik', nr: '§ 10b', title: 'Vorgaben zur Direktvermarktung', text: 'Anlagen in der Direktvermarktung müssen fernsteuerbar sein.', topic: 'direktvermarktung' },
  { law: 'eeg', group: 'Anschluss & Technik', nr: '§ 11', title: 'Abnahme, Übertragung und Verteilung', text: 'Vorrangige Abnahme des EE-Stroms durch den Netzbetreiber.' },
  { law: 'eeg', group: 'Förderung', nr: '§ 19', title: 'Zahlungsanspruch', text: 'Grundnorm: Anspruch auf Marktprämie oder Einspeisevergütung.' },
  { law: 'eeg', group: 'Förderung', nr: '§ 20', title: 'Marktprämie', text: 'Förderung in der Direktvermarktung: Markterlös plus Prämie.', topic: 'direktvermarktung' },
  { law: 'eeg', group: 'Förderung', nr: '§ 21', title: 'Einspeisevergütung und Mieterstromzuschlag', text: 'Feste Vergütung für kleinere Anlagen; Zuschlag für Mieterstrom.', topic: 'mieterstrom' },
  { law: 'eeg', group: 'Förderung', nr: '§§ 28 ff.', title: 'Ausschreibungen', text: 'Ausschreibungsvolumen und -verfahren für Wind, große PV, Biomasse.' },
  { law: 'eeg', group: 'Förderung', nr: '§ 48', title: 'Solare Strahlungsenergie', text: 'Anzulegende Werte für PV-Anlagen.', topic: 'pv' },
  { law: 'eeg', group: 'Förderung', nr: '§ 51', title: 'Verringerung bei negativen Preisen', text: 'Keine Förderung in Zeiten negativer Preise – durch das Solarspitzengesetz auf neue Anlagen jeder Größe ausgeweitet.', topic: 'negpreise' },
];

/** Wo die Gesetze ineinandergreifen */
export const OVERLAPS: { title: string; laws: LawId[]; text: string; topic: string }[] = [
  { title: '§ 14a-Steuerung', laws: ['enwg', 'msbg'], text: 'Das EnWG regelt, dass gedimmt werden darf; das MsbG regelt die Infrastruktur (iMSys, SMGW, CLS), über die gesteuert wird.', topic: 'par14a' },
  { title: 'Solarspitzengesetz', laws: ['enwg', 'msbg', 'eeg'], text: 'Ein Artikelgesetz: ändert EEG (negative Preise, 60 %-Regel), MsbG (Einbau von iMSys/Steuerung) und EnWG.', topic: 'solarspitzen' },
  { title: 'Mieterstrom', laws: ['enwg', 'eeg'], text: 'Vertrag und Preisdeckel im EnWG (§ 42a), Zuschlag im EEG (§ 21).', topic: 'mieterstrom' },
  { title: 'Dynamischer Tarif', laws: ['enwg', 'msbg'], text: 'Angebotspflicht im EnWG (§ 41a), Messung und Datenübermittlung über das MsbG.', topic: 'dyntarif' },
  { title: 'Direktvermarktung', laws: ['eeg', 'msbg'], text: 'Marktprämie und Fernsteuerbarkeit im EEG; Steuerung über das iMSys als aEMT nach MsbG.', topic: 'direktvermarktung' },
];
