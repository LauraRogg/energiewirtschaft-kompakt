import type { KnowledgeBase, Relation, Topic } from '../types';

/**
 * Startwissen. Stand: Herbst 2026. Inhalte sind bewusst als Lern-Zusammenfassung
 * formuliert – für verbindliche Aussagen immer die Originalquelle prüfen.
 */

const STAMP = '2026-10-15';

type Seed = Omit<Topic, 'createdAt' | 'updatedAt' | 'source'>;

const seeds: Seed[] = [
  // ── Recht & Regulierung ────────────────────────────────────────────────
  {
    id: 'enwg',
    title: 'Energiewirtschaftsgesetz',
    short: 'EnWG',
    category: 'recht',
    status: 'etabliert',
    summary: 'Das "Grundgesetz" der Energiewirtschaft: regelt Netze, Netzzugang, Netzbetreiberpflichten, Lieferung und Regulierung.',
    explanation:
      'Das EnWG ist der zentrale Rechtsrahmen für Strom- und Gasversorgung in Deutschland. Es legt fest, wer Netze betreiben darf, wie Dritte Zugang zu den Netzen bekommen (regulierter Netzzugang), wie Netzentgelte gebildet werden und welche Pflichten Lieferanten gegenüber Kunden haben.\n\nViele der aktuellen Neuerungen sind einzelne Paragrafen im EnWG, z. B. § 14a (steuerbare Verbrauchseinrichtungen), § 14c (marktgestützte Flexibilität), § 13/13a (Redispatch) oder § 41a (dynamische Tarife). Die Details setzt häufig die Bundesnetzagentur per Festlegung um.',
    keyFacts: [
      'Rahmen für Netzbetrieb, Netzzugang, Netzentgelte und Belieferung',
      'Viele Neuerungen = einzelne Paragrafen im EnWG',
      'Details regelt oft die BNetzA per Festlegung',
    ],
    legalRefs: ['EnWG'],
  },
  {
    id: 'par14a',
    title: '§ 14a EnWG – Steuerbare Verbrauchseinrichtungen',
    short: '§ 14a',
    category: 'recht',
    status: 'in-umsetzung',
    since: '01.01.2024',
    summary: 'Deal zwischen Netzbetreiber und Kunde: Netzanschluss für Wärmepumpe, Wallbox & Co. darf nicht verweigert werden – dafür darf der Netzbetreiber den Bezug im Engpass auf mindestens 4,2 kW dimmen; der Kunde zahlt weniger Netzentgelt.',
    explanation:
      'Mit der Neufassung zum 01.01.2024 hat die Bundesnetzagentur die Regeln per Festlegung konkretisiert (Netzzugang: BK6-22-300, Netzentgelte: BK8-22/010-A). Betroffen sind neu installierte steuerbare Verbrauchseinrichtungen (SteuVE) mit mehr als 4,2 kW Bezugsleistung: Wärmepumpen, nicht-öffentliche Ladepunkte (Wallboxen), Klimaanlagen und Stromspeicher (beim Laden aus dem Netz).\n\nDer Deal: Der Netzbetreiber muss diese Anlagen anschließen und darf das nicht mit Verweis auf fehlende Netzkapazität verzögern. Im Gegenzug darf er bei drohender Überlastung den Netzbezug "dimmen" – aber nie unter 4,2 kW je Anlage; komplettes Abschalten ist nicht vorgesehen. Für diese Steuerbarkeit gibt es ein reduziertes Netzentgelt (Modul 1, 2 oder 3).\n\nWie gesteuert wird, ist zweistufig: Übergangsweise ist präventives Steuern erlaubt, Zielbild ist das netzorientierte Steuern auf Basis echter Netzzustandsdaten. Technisch läuft die Steuerung über das intelligente Messsystem (Smart-Meter-Gateway mit CLS-Kanal und Steuerbox). Hat der Kunde mehrere Anlagen und ein Energiemanagementsystem, gilt das Gartenzaunprinzip: Der Netzbetreiber gibt einen Wert für den gesamten Netzanschluss vor, das EMS verteilt.',
    keyFacts: [
      'Gilt für neue SteuVE > 4,2 kW (Wärmepumpe, Wallbox, Klimaanlage, Speicher)',
      'Netzbetreiber darf Anschluss nicht wegen Engpass verweigern',
      'Dimmen im Engpass erlaubt – Mindestleistung 4,2 kW bleibt garantiert',
      'Gegenleistung: reduziertes Netzentgelt (Module 1–3)',
      'Präventiv nur übergangsweise, Ziel: netzorientiertes Steuern',
    ],
    legalRefs: ['§ 14a EnWG', 'BNetzA BK6-22-300', 'BNetzA BK8-22/010-A'],
  },
  {
    id: 'par14c',
    title: '§ 14c EnWG – Marktgestützte Beschaffung von Flexibilität',
    short: '§ 14c',
    category: 'recht',
    status: 'in-umsetzung',
    summary: 'Verteilnetzbetreiber sollen Flexibilität marktgestützt einkaufen können – freiwillig und gegen Bezahlung, statt per Anordnung.',
    explanation:
      '§ 14c EnWG schafft die Grundlage dafür, dass Verteilnetzbetreiber Flexibilitätsdienstleistungen (z. B. Lastverschiebung, Einspeisereduktion) über transparente, diskriminierungsfreie und marktgestützte Verfahren beschaffen. Anbieter machen freiwillig mit und werden bezahlt.\n\nDas ist der Gegenpol zu § 14a: Dort ist die Steuerung regulatorisch vorgegeben (Dimmen gegen pauschal reduziertes Netzentgelt), bei § 14c entscheidet der Anbieter am Markt, ob und zu welchem Preis er Flexibilität anbietet. Die konkrete Ausgestaltung durch die BNetzA ist noch in Entwicklung.',
    keyFacts: [
      'Freiwillig und vergütet – Marktmechanismus',
      'Gegenstück zur regulatorischen Steuerung nach § 14a',
      'Ausgestaltung noch in Entwicklung',
    ],
    legalRefs: ['§ 14c EnWG'],
  },
  {
    id: 'par41a',
    title: '§ 41a EnWG – Dynamische Stromtarife',
    short: '§ 41a',
    category: 'recht',
    status: 'etabliert',
    since: '01.01.2025',
    summary: 'Alle Stromlieferanten müssen Kunden mit intelligentem Messsystem einen dynamischen, an den Börsenpreis gekoppelten Tarif anbieten.',
    explanation:
      'Seit 01.01.2025 sind alle Stromlieferanten verpflichtet, einen dynamischen Stromtarif anzubieten (vorher nur große Lieferanten). Voraussetzung auf Kundenseite ist ein intelligentes Messsystem, weil der Verbrauch viertelstündlich gemessen und abgerechnet werden muss.\n\nDer Tarif gibt das Preissignal des Strommarkts (Day-Ahead) an den Kunden weiter und schafft so einen Anreiz, Verbrauch in günstige Stunden zu verschieben – also marktdienliche Flexibilität.',
    keyFacts: [
      'Pflicht für alle Lieferanten seit 2025',
      'Setzt intelligentes Messsystem voraus (Viertelstundenwerte)',
      'Gibt Börsenpreissignal an Endkunden weiter',
    ],
    legalRefs: ['§ 41a EnWG'],
  },
  {
    id: 'msbg',
    title: 'Messstellenbetriebsgesetz',
    short: 'MsbG',
    category: 'recht',
    status: 'etabliert',
    summary: 'Regelt Rollout, Betrieb, Sicherheit und Preisobergrenzen von modernen Messeinrichtungen und intelligenten Messsystemen.',
    explanation:
      'Das MsbG regelt, wer Messstellen betreibt (grundzuständiger oder wettbewerblicher Messstellenbetreiber), welche Messtechnik wo eingebaut werden muss und was der Kunde dafür maximal zahlt (Preisobergrenzen). Es schreibt außerdem die hohen Sicherheitsanforderungen an das Smart-Meter-Gateway vor (BSI-Schutzprofil und Technische Richtlinie TR-03109).\n\nMit dem Gesetz zum Neustart der Digitalisierung der Energiewende (GNDEW, 2023) wurde der Rollout beschleunigt: gesetzlicher Rollout-Fahrplan mit Pflichteinbaufällen (u. a. Verbrauch über 6.000 kWh/Jahr, steuerbare Verbrauchseinrichtungen nach § 14a, PV-Anlagen über 7 kW), "agiler Rollout" und gedeckelte Kosten für Kunden.',
    keyFacts: [
      'Regelt Rollout von mME und iMSys',
      'Sicherheit: BSI-Schutzprofil, TR-03109',
      'GNDEW 2023: Rollout-Fahrplan und Pflichteinbaufälle',
      'Preisobergrenzen schützen Kunden',
    ],
    legalRefs: ['MsbG', 'GNDEW (2023)', 'BSI TR-03109'],
  },
  {
    id: 'solarspitzen',
    title: 'Solarspitzengesetz',
    category: 'recht',
    status: 'neu',
    since: '25.02.2025',
    summary: 'Antwort auf zu viel PV-Einspeisung in Mittagsspitzen: keine Vergütung bei negativen Preisen für Neuanlagen und Einspeisebegrenzung, solange keine Steuerbarkeit hergestellt ist.',
    explanation:
      'Mit dem schnellen PV-Zubau entstehen an sonnigen Mittagen Erzeugungsspitzen, negative Börsenpreise und lokale Netzprobleme. Das Solarspitzengesetz (Änderungen an EEG, EnWG und MsbG) setzt dort an: Neue Anlagen erhalten bei negativen Preisen keine Einspeisevergütung (die Zeit wird hinten angehängt), und neue Anlagen ohne intelligentes Messsystem und Steuerungseinrichtung dürfen nur 60 % ihrer Leistung einspeisen.\n\nDamit wird die Brücke geschlagen zwischen Erzeugung, Messwesen (iMSys/Steuerbox als Voraussetzung für volle Einspeisung) und Markt (Preissignal negativer Preise).',
    keyFacts: [
      'Keine Vergütung bei negativen Preisen (Neuanlagen)',
      '60 %-Einspeisebegrenzung bis iMSys + Steuerung vorhanden',
      'Verknüpft PV, Messwesen und Marktpreis',
    ],
    legalRefs: ['EEG', 'EnWG', 'MsbG'],
  },
  {
    id: 'redispatch',
    title: 'Redispatch 2.0',
    category: 'recht',
    status: 'etabliert',
    since: '01.10.2021',
    summary: 'Netzbetreiber greifen bei Engpässen in die Fahrweise von Erzeugungsanlagen ab 100 kW ein – planbasiert und bilanziell ausgeglichen.',
    explanation:
      'Redispatch bedeutet: Ein Netzbetreiber ändert die geplante Einspeisung von Anlagen, um einen Netzengpass zu beheben – vor dem Engpass wird abgeregelt, dahinter hochgefahren. Mit Redispatch 2.0 wurden seit Oktober 2021 auch Erneuerbare-Energien- und KWK-Anlagen ab 100 kW (sowie fernsteuerbare Anlagen) einbezogen, und der Prozess läuft planbasiert über Daten zwischen Netzbetreibern und Anlagenbetreibern.\n\nRedispatch ist netzdienliche Flexibilität auf der Erzeugungsseite und für größere Anlagen – § 14a ist das Pendant auf der Verbrauchsseite im Niederspannungsnetz.',
    keyFacts: [
      'Erzeugungsanlagen ab 100 kW',
      'Planbasierter, bilanziell ausgeglichener Eingriff',
      'Netzdienlich – Gegenstück zu § 14a auf Erzeugungsseite',
    ],
    legalRefs: ['§§ 13, 13a, 14 EnWG'],
  },

  // ── Akteure & Rollen ───────────────────────────────────────────────────
  {
    id: 'bnetza',
    title: 'Bundesnetzagentur',
    short: 'BNetzA',
    category: 'akteure',
    status: 'etabliert',
    summary: 'Regulierungsbehörde: konkretisiert Gesetze per Festlegung und überwacht Netzbetreiber.',
    explanation:
      'Die BNetzA reguliert die Netzbetreiber (natürliche Monopole) und legt per Festlegung fest, wie gesetzliche Vorgaben im Detail umzusetzen sind. Seit einem EuGH-Urteil von 2021 hat sie mehr Unabhängigkeit gegenüber dem Gesetzgeber; viele Details, die früher in Verordnungen standen, entscheidet sie heute selbst.\n\nBeispiel: Die konkreten Regeln zu § 14a (Mindestleistung 4,2 kW, Module 1–3, präventives vs. netzorientiertes Steuern) stammen aus BNetzA-Festlegungen.',
    keyFacts: [
      'Reguliert Netzbetreiber',
      'Konkretisiert Gesetze per Festlegung (z. B. zu § 14a)',
      'Gestärkte Unabhängigkeit seit EuGH-Urteil 2021',
    ],
    legalRefs: ['EnWG'],
  },
  {
    id: 'vnb',
    title: 'Verteilnetzbetreiber',
    short: 'VNB',
    category: 'akteure',
    status: 'etabliert',
    summary: 'Betreibt die regionalen Strom-Verteilnetze bis zum Hausanschluss – und ist damit derjenige, der nach § 14a steuert.',
    explanation:
      'Der Verteilnetzbetreiber verantwortet Nieder-, Mittel- und teils Hochspannungsnetze und damit den Anschluss fast aller Haushalte. Er muss Engpässe erkennen und beheben. Bisher hatte er im Niederspannungsnetz kaum Messdaten – mit der Netzzustandsermittlung über intelligente Messsysteme ändert sich das.\n\nIm § 14a-Kontext ist der VNB der Akteur, der dimmt; bei § 14c der Käufer von Flexibilität; beim Redispatch einer der Anweisenden.',
    keyFacts: [
      'Verantwortet Netze bis zum Hausanschluss',
      'Steuert SteuVE nach § 14a',
      'Braucht Netzzustandsdaten für netzorientiertes Steuern',
    ],
    legalRefs: ['EnWG'],
  },
  {
    id: 'msb',
    title: 'Messstellenbetreiber',
    short: 'MSB',
    category: 'akteure',
    status: 'etabliert',
    summary: 'Baut und betreibt Zähler und intelligente Messsysteme. Grundzuständig (gMSB) ist meist der örtliche Netzbetreiber, Kunden können einen wettbewerblichen MSB (wMSB) wählen.',
    explanation:
      'Der Messstellenbetreiber ist für Einbau, Betrieb und Wartung der Messtechnik und für die Messwertübermittlung zuständig. Grundzuständiger MSB ist standardmäßig der örtliche Verteilnetzbetreiber bzw. eine Tochter. Kunden können stattdessen einen wettbewerblichen MSB beauftragen.\n\nBeim intelligenten Messsystem braucht der MSB zusätzlich einen Gateway-Administrator – das kann er selbst sein oder ein beauftragter Dienstleister.',
    keyFacts: [
      'gMSB (grundzuständig) vs. wMSB (wettbewerblich)',
      'Verantwortet Rollout und Betrieb der iMSys',
      'Bedient sich eines Gateway-Administrators',
    ],
    legalRefs: ['MsbG'],
  },
  {
    id: 'gwa',
    title: 'Gateway-Administrator',
    short: 'GWA',
    category: 'akteure',
    status: 'etabliert',
    summary: 'Die vertrauenswürdige Stelle, die Smart-Meter-Gateways technisch verwaltet: Konfiguration, Zertifikate, Updates und Freischaltung von Kommunikationswegen (z. B. CLS).',
    explanation:
      'Der GWA ist eine Rolle, kein Gerät. Er richtet das Smart-Meter-Gateway ein, hinterlegt Zertifikate, spielt Firmware-Updates ein und legt fest, wer welche Daten bekommt und wer über den CLS-Kanal auf Anlagen zugreifen darf. Er selbst sieht dabei keine Messwerte im Klartext – das Gateway setzt die Regeln durch.\n\nGWAs müssen nach BSI-Vorgaben zertifiziert sein (ISO 27001 auf Basis IT-Grundschutz und TR-03109-6). Wenn ein Netzbetreiber nach § 14a steuern möchte, braucht er also einen GWA, der seinen Zugriff über den CLS-Kanal freischaltet.',
    keyFacts: [
      'Rolle im Auftrag des Messstellenbetreibers',
      'Verwaltet SMGW: Profile, Zertifikate, Updates',
      'Schaltet CLS-Verbindungen für externe Marktteilnehmer frei',
      'BSI-zertifiziert (TR-03109-6)',
    ],
    legalRefs: ['MsbG', 'BSI TR-03109-6'],
  },
  {
    id: 'emt',
    title: 'Externer Marktteilnehmer',
    short: 'EMT',
    category: 'akteure',
    status: 'etabliert',
    summary: 'Jeder, der über das Smart-Meter-Gateway Daten empfängt oder Anlagen steuert – z. B. Netzbetreiber, Lieferant, Direktvermarkter.',
    explanation:
      'Externe Marktteilnehmer (EMT) sind die "Kunden" des Smart-Meter-Gateways: Sie bekommen Messwerte oder bauen über den CLS-Kanal eine gesicherte Verbindung zu Anlagen auf. Welcher EMT was darf, konfiguriert der Gateway-Administrator.\n\nIm Kontext von § 14a ist der Verteilnetzbetreiber der EMT, der steuert; beim dynamischen Tarif ist der Lieferant der EMT, der die Messwerte bekommt.',
    keyFacts: [
      'Empfängt Daten oder steuert über das SMGW',
      'Rechte werden vom GWA konfiguriert',
      'Beispiele: VNB, Lieferant, Direktvermarkter',
    ],
    legalRefs: ['MsbG'],
  },
  {
    id: 'lieferant',
    title: 'Energielieferant',
    category: 'akteure',
    status: 'etabliert',
    summary: 'Verkauft Strom an Endkunden und gibt Preissignale weiter, z. B. über dynamische Tarife.',
    explanation:
      'Der Lieferant beschafft Strom am Großhandelsmarkt und verkauft ihn an Endkunden. Er ist vom Netzbetreiber getrennt (Unbundling). Über Tarife – etwa den dynamischen Tarif nach § 41a EnWG – gibt er Marktpreissignale an Kunden weiter und setzt damit Anreize für marktdienliche Flexibilität.',
    keyFacts: [
      'Getrennt vom Netzbetrieb (Unbundling)',
      'Gibt Marktpreissignale weiter',
      'Pflicht zum dynamischen Tarif seit 2025',
    ],
    legalRefs: ['EnWG'],
  },

  // ── Netz & Netzbetrieb ─────────────────────────────────────────────────
  {
    id: 'netzengpass',
    title: 'Netzengpass',
    category: 'netz',
    status: 'etabliert',
    summary: 'Eine Leitung oder ein Transformator würde überlastet – der Auslöser für alle netzdienlichen Eingriffe.',
    explanation:
      'Ein Netzengpass entsteht, wenn mehr Leistung über ein Betriebsmittel fließen soll, als es tragen kann. Im Niederspannungsnetz passiert das zunehmend durch Gleichzeitigkeit: Viele Wallboxen und Wärmepumpen laufen gleichzeitig (z. B. abends oder wenn ein dynamischer Tarif günstige Stunden signalisiert).\n\nEngpässe lassen sich durch Netzausbau dauerhaft lösen oder kurzfristig durch Flexibilität managen – § 14a-Dimmen, Redispatch oder marktgestützte Flexibilität nach § 14c.',
    keyFacts: [
      'Überlastung von Leitung oder Trafo',
      'Ursache oft Gleichzeitigkeit vieler Verbraucher',
      'Lösungen: Netzausbau oder Flexibilität',
    ],
    legalRefs: [],
  },
  {
    id: 'netzzustand',
    title: 'Netzzustandsermittlung',
    category: 'netz',
    status: 'in-umsetzung',
    summary: 'Der Netzbetreiber misst bzw. berechnet in (nahezu) Echtzeit, wie belastet sein Niederspannungsnetz tatsächlich ist.',
    explanation:
      'Historisch war das Niederspannungsnetz "blind": Netzbetreiber wussten wenig über die aktuelle Auslastung. Für netzorientiertes Steuern nach § 14a müssen sie aber nachweisen, dass ein Engpass tatsächlich droht. Dafür nutzen sie Messwerte aus intelligenten Messsystemen, Messungen in Ortsnetzstationen und Netzberechnungen.\n\nDie Netzzustandsermittlung ist damit die Brücke zwischen Messwesen (Daten) und Steuerung (Eingriff).',
    keyFacts: [
      'Echtzeitnahe Sicht auf Netzauslastung',
      'Datenbasis: iMSys, Ortsnetzstationen, Netzberechnung',
      'Pflicht-Grundlage für netzorientiertes Steuern',
    ],
    legalRefs: ['BNetzA BK6-22-300'],
  },
  {
    id: 'netzentgelte',
    title: 'Netzentgelte',
    category: 'netz',
    status: 'etabliert',
    summary: 'Was Netznutzer für Bau und Betrieb der Netze zahlen – bei § 14a gibt es dafür Rabatte über drei Module.',
    explanation:
      'Netzentgelte finanzieren die Netze und sind ein großer Teil des Strompreises. Für steuerbare Verbrauchseinrichtungen nach § 14a gibt es Reduzierungen:\n\nModul 1: pauschale Reduktion (jährlicher Betrag, netzbetreiberabhängig).\nModul 2: prozentuale Reduktion des Arbeitspreises (60 %), setzt einen separaten Zählpunkt für die SteuVE voraus.\nModul 3: zeitvariables Netzentgelt (seit 01.04.2025) – zusätzlich zu Modul 1 wählbar, mit günstigen und teuren Zeitfenstern.',
    keyFacts: [
      'Finanzieren Bau und Betrieb der Netze',
      '§ 14a: Module 1 (pauschal), 2 (60 % Arbeitspreis), 3 (zeitvariabel)',
      'Modul 3 seit April 2025, kombinierbar mit Modul 1',
    ],
    legalRefs: ['BNetzA BK8-22/010-A'],
  },
  {
    id: 'zvne',
    title: 'Zeitvariable Netzentgelte (Modul 3)',
    category: 'netz',
    status: 'neu',
    since: '01.04.2025',
    summary: 'Netzentgelt, das je nach Tageszeit günstiger oder teurer ist – ein netzseitiges Preissignal.',
    explanation:
      'Beim Modul 3 legt der Netzbetreiber Zeitfenster mit Niedrig-, Standard- und Hochtarif fest. Es setzt ein intelligentes Messsystem voraus. Anders als der dynamische Stromtarif (Marktpreis, ändert sich täglich) ist das zeitvariable Netzentgelt statisch geplant und spiegelt typische Netzbelastung wider.\n\nSpannend: Beide Signale können sich widersprechen – der Marktpreis ist mittags günstig (viel PV), das Netz kann abends knapp sein.',
    keyFacts: [
      'Statische Zeitfenster pro Netzbetreiber',
      'Setzt iMSys voraus',
      'Netzsignal ≠ Marktpreissignal',
    ],
    legalRefs: ['BNetzA BK8-22/010-A'],
  },

  // ── Messwesen & Digitalisierung ────────────────────────────────────────
  {
    id: 'imsys',
    title: 'Intelligentes Messsystem',
    short: 'iMSys',
    category: 'messwesen',
    status: 'in-umsetzung',
    summary: 'Digitaler Zähler (mME) plus Smart-Meter-Gateway: misst, kommuniziert sicher und ermöglicht Steuerung.',
    explanation:
      'Ein intelligentes Messsystem besteht aus einer modernen Messeinrichtung (digitaler Zähler) und einem Smart-Meter-Gateway als Kommunikationseinheit. Erst diese Kombination kann Messwerte sicher nach außen senden und – über den CLS-Kanal – Steuerbefehle an Anlagen weiterleiten.\n\nDas iMSys ist damit die Grundvoraussetzung für fast alle neuen Themen: netzorientiertes Steuern nach § 14a, dynamische Tarife, zeitvariable Netzentgelte, volle Einspeisung neuer PV-Anlagen und die Netzzustandsermittlung.',
    keyFacts: [
      'iMSys = mME + SMGW',
      'Sichere Kommunikation nach BSI-Standard',
      'Voraussetzung für § 14a-Steuerung, dyn. Tarife, Modul 3',
    ],
    legalRefs: ['MsbG'],
  },
  {
    id: 'mme',
    title: 'Moderne Messeinrichtung',
    short: 'mME',
    category: 'messwesen',
    status: 'etabliert',
    summary: 'Digitaler Stromzähler ohne Kommunikationsanbindung – zeigt Verbrauch an, sendet aber nichts.',
    explanation:
      'Die moderne Messeinrichtung ersetzt den alten Ferraris-Zähler. Sie speichert Verbrauchswerte, kann sie aber nicht selbst übertragen. Erst zusammen mit einem Smart-Meter-Gateway wird daraus ein intelligentes Messsystem.',
    keyFacts: ['Digitaler Zähler ohne Kommunikation', 'Mit SMGW wird sie zum iMSys'],
    legalRefs: ['MsbG'],
  },
  {
    id: 'smgw',
    title: 'Smart-Meter-Gateway',
    short: 'SMGW',
    category: 'messwesen',
    status: 'in-umsetzung',
    summary: 'Die hochsichere Kommunikationszentrale im Zählerschrank: verbindet Zähler, Anlagen im Haus und die Außenwelt.',
    explanation:
      'Das SMGW hat drei Netzwerkseiten: das LMN (Local Metrological Network) zu den Zählern, das HAN (Home Area Network) ins Haus – dort hängen CLS-Geräte wie die Steuerbox – und das WAN (Wide Area Network) zu den externen Marktteilnehmern und dem Gateway-Administrator.\n\nEs ist nach BSI-Schutzprofil zertifiziert und setzt Regeln durch: Wer welche Daten bekommt und wer Anlagen erreichen darf, ist fest konfiguriert. Gesteuert wird nicht "durch" das Gateway selbst, sondern über einen gesicherten Kanal (CLS), den das Gateway bereitstellt.',
    keyFacts: [
      'Drei Seiten: LMN (Zähler), HAN (Haus/CLS), WAN (außen)',
      'BSI-zertifiziert, verwaltet vom GWA',
      'Stellt den CLS-Kanal für Steuerung bereit',
    ],
    legalRefs: ['MsbG', 'BSI TR-03109-1'],
  },
  {
    id: 'cls',
    title: 'Controllable Local Systems',
    short: 'CLS',
    category: 'messwesen',
    status: 'in-umsetzung',
    summary: 'Steuerbare Anlagen im Haus – und der gesicherte Kommunikationskanal, über den externe Marktteilnehmer sie über das SMGW erreichen.',
    explanation:
      'CLS bezeichnet zum einen die steuerbaren Geräte bzw. Steuereinheiten im Heimnetz (HAN) des Smart-Meter-Gateways, zum anderen den Kommunikationsweg dorthin: Das Gateway baut als Proxy einen verschlüsselten Tunnel zwischen einem berechtigten externen Marktteilnehmer (z. B. Netzbetreiber) und dem CLS-Gerät auf.\n\nDer Gateway-Administrator schaltet diesen Kanal frei. So wird aus dem Messsystem ein Steuerungssystem – das ist der technische Kern hinter "Steuerung über das intelligente Messsystem" bei § 14a und beim Solarspitzengesetz.',
    keyFacts: [
      'Kanal vom EMT über das SMGW zum Gerät im Haus',
      'Verschlüsselter Proxy-Tunnel, freigeschaltet durch GWA',
      'Technische Basis für § 14a-Steuerung',
    ],
    legalRefs: ['BSI TR-03109-1'],
  },
  {
    id: 'steuerbox',
    title: 'Steuerbox',
    category: 'messwesen',
    status: 'in-umsetzung',
    summary: 'CLS-Gerät hinter dem SMGW, das Steuerbefehle des Netzbetreibers in Schaltsignale oder digitale Vorgaben (z. B. EEBUS) für Anlage oder EMS übersetzt.',
    explanation:
      'Die Steuerbox (z. B. nach FNN-Lastenheft) empfängt über den CLS-Kanal Befehle und setzt sie um: entweder über Relaiskontakte direkt an der Anlage oder digital über eine Schnittstelle wie EEBUS an ein Energiemanagementsystem.\n\nSie ersetzt langfristig alte Rundsteuerempfänger und ist das "letzte Glied" der Kette Netzbetreiber → SMGW → Steuerbox → Anlage/EMS.',
    keyFacts: [
      'Empfängt Befehle über CLS',
      'Schaltet per Relais oder digital (EEBUS)',
      'Ersetzt langfristig Rundsteuerempfänger',
    ],
    legalRefs: [],
  },
  {
    id: 'eebus',
    title: 'EEBUS',
    category: 'messwesen',
    status: 'etabliert',
    summary: 'Herstellerübergreifende Kommunikationssprache für Energiegeräte – u. a. zum Übermitteln von Leistungsgrenzen zwischen Steuerbox, EMS und Geräten.',
    explanation:
      'EEBUS definiert Anwendungsfälle (Use Cases) für die Kommunikation zwischen Geräten im Haus, etwa "Begrenzung der Leistungsaufnahme" (LPC). So kann eine Steuerbox einem Energiemanagementsystem oder direkt einer Wallbox/Wärmepumpe eine Leistungsgrenze vorgeben, ohne Relais zu schalten.',
    keyFacts: ['Herstellerübergreifender Standard', 'Use Case LPC: Leistungsbegrenzung', 'Digitale Alternative zum Relais'],
    legalRefs: [],
  },

  // ── Steuerung & Flexibilität ───────────────────────────────────────────
  {
    id: 'flexibilitaet',
    title: 'Flexibilität',
    category: 'steuerung',
    status: 'etabliert',
    summary: 'Die Fähigkeit, Verbrauch oder Erzeugung zeitlich zu verschieben oder anzupassen – und die zentrale Frage: wem dient sie?',
    explanation:
      'Flexibilität ist der rote Faden durch viele Neuerungen. Entscheidend ist der Zweck:\n\nNetzdienlich: Sie entlastet das Netz vor Ort (z. B. § 14a-Dimmen, Redispatch, § 14c).\nMarktdienlich: Sie reagiert auf Preise und senkt Kosten (z. B. dynamischer Tarif).\nSystemdienlich: Sie stabilisiert das Gesamtsystem (z. B. Regelenergie).\n\nDie Signale können sich widersprechen: Ein günstiger Börsenpreis lockt viele Wallboxen gleichzeitig ins Netz und erzeugt so erst einen lokalen Engpass. Genau dafür braucht es Regeln, wer im Konfliktfall Vorrang hat – bei § 14a geht die Netzsicherheit vor.',
    keyFacts: [
      'Netzdienlich vs. marktdienlich vs. systemdienlich',
      'Signale können sich widersprechen',
      'Bei Konflikt hat Netzsicherheit Vorrang (§ 14a)',
    ],
    legalRefs: [],
  },
  {
    id: 'steuve',
    title: 'Steuerbare Verbrauchseinrichtung',
    short: 'SteuVE',
    category: 'steuerung',
    status: 'in-umsetzung',
    summary: 'Eine Anlage mit > 4,2 kW Netzbezug, die unter § 14a fällt: Wärmepumpe, Wallbox, Klimaanlage oder Stromspeicher.',
    explanation:
      'SteuVE ist der Sammelbegriff für die Geräte, die nach § 14a EnWG steuerbar sein müssen. Neu angeschlossene Anlagen dieser Typen mit mehr als 4,2 kW Bezugsleistung fallen seit 2024 automatisch darunter. Für Bestandsanlagen gelten Übergangsregeln.\n\nWichtig: Nicht die einzelne Anlage zählt allein – hat ein Haushalt mehrere SteuVE und ein EMS, wird über das Gartenzaunprinzip der gesamte Netzanschluss betrachtet.',
    keyFacts: [
      'Wärmepumpe, Wallbox, Klimaanlage, Speicher',
      'Schwelle: > 4,2 kW Bezugsleistung',
      'Neuanlagen seit 2024, Übergangsregeln für Bestand',
    ],
    legalRefs: ['§ 14a EnWG', 'BNetzA BK6-22-300'],
  },
  {
    id: 'praeventiv',
    title: 'Präventives Steuern',
    category: 'steuerung',
    status: 'auslaufend',
    summary: 'Übergangslösung: Der Netzbetreiber dimmt vorsorglich nach Plan bzw. Prognose, ohne den Engpass in Echtzeit nachweisen zu müssen – zeitlich eng begrenzt.',
    explanation:
      'Solange ein Netzbetreiber noch keine Netzzustandsermittlung hat, darf er übergangsweise präventiv steuern: Er dimmt auf Basis von Prognosen bzw. festgelegten Zeitfenstern, typischerweise in Zeiten hoher erwarteter Last. Das ist zeitlich begrenzt (maximal zwei Stunden pro Tag) und nur als Übergangslösung (längstens bis Ende 2028) erlaubt.\n\nDer Nachteil: Es wird ggf. gedimmt, obwohl gar kein Engpass auftritt. Deshalb ist es nur eine Brücke zum netzorientierten Steuern.',
    keyFacts: [
      'Prognose-/zeitfensterbasiert, ohne Echtzeit-Nachweis',
      'Max. 2 Stunden pro Tag',
      'Nur übergangsweise (längstens bis Ende 2028)',
    ],
    legalRefs: ['BNetzA BK6-22-300'],
  },
  {
    id: 'netzorientiert',
    title: 'Netzorientiertes Steuern',
    category: 'steuerung',
    status: 'in-umsetzung',
    summary: 'Zielmodell: Gedimmt wird nur, wenn die Netzzustandsermittlung eine tatsächliche oder unmittelbar drohende Überlastung zeigt – so kurz und so wenig wie möglich.',
    explanation:
      'Beim netzorientierten Steuern reagiert der Netzbetreiber auf den gemessenen bzw. berechneten Netzzustand. Er dimmt nur die Anlagen im betroffenen Netzbereich, nur so lange wie nötig und nie unter die garantierte Mindestleistung von 4,2 kW. Eingriffe müssen dokumentiert und veröffentlicht werden.\n\nDer Unterschied zum präventiven Steuern in einem Satz: Präventiv = "sicherheitshalber nach Plan", netzorientiert = "nur wenn das Netz es wirklich braucht".',
    keyFacts: [
      'Basis: Netzzustandsermittlung',
      'Nur bei tatsächlicher/drohender Überlastung',
      'Mindestens 4,2 kW bleiben garantiert',
      'Eingriffe werden dokumentiert/veröffentlicht',
    ],
    legalRefs: ['BNetzA BK6-22-300'],
  },
  {
    id: 'gartenzaun',
    title: 'Gartenzaunprinzip',
    category: 'steuerung',
    status: 'in-umsetzung',
    summary: 'Der Netzbetreiber steuert nur "bis zum Gartenzaun": Er gibt eine Leistungsgrenze für den gesamten Netzanschluss vor – wie diese im Haus verteilt wird, entscheidet der Kunde bzw. sein EMS.',
    explanation:
      'Statt jede Wärmepumpe und jede Wallbox einzeln zu dimmen, gibt der Netzbetreiber eine Grenze für den Netzanschlusspunkt vor. Hinter dem "Gartenzaun" entscheidet das Energiemanagementsystem, welche Anlage wie viel bekommt – etwa Wärmepumpe voll laufen lassen und die Wallbox stärker drosseln. Haushaltsstrom (Licht, Kochen) bleibt unberührt.\n\nDie Mindestleistung skaliert mit der Anzahl der SteuVE (nicht einfach 4,2 kW gesamt). Das Prinzip trennt sauber Zuständigkeiten: Der Netzbetreiber kümmert sich ums Netz, der Kunde behält die Hoheit über seine Geräte.',
    keyFacts: [
      'Vorgabe für den Netzanschlusspunkt, nicht pro Gerät',
      'EMS verteilt die Leistung hinter dem Anschluss',
      'Haushaltsstrom bleibt unberührt',
      'Klare Rollentrennung Netz ↔ Kunde',
    ],
    legalRefs: ['BNetzA BK6-22-300'],
  },
  {
    id: 'ems',
    title: 'Energiemanagementsystem',
    short: 'EMS / HEMS',
    category: 'steuerung',
    status: 'etabliert',
    summary: 'Die "Schaltzentrale" hinter dem Netzanschluss: optimiert Verbrauch, Erzeugung und Speicher – und setzt Leistungsgrenzen des Netzbetreibers intelligent um.',
    explanation:
      'Ein (Home-)Energiemanagementsystem koordiniert PV, Speicher, Wärmepumpe und Wallbox. Es kann gleichzeitig mehrere Ziele verfolgen: Eigenverbrauch maximieren, auf dynamische Preise reagieren und Leistungsgrenzen nach § 14a einhalten.\n\nGenau hier treffen marktdienliche und netzdienliche Flexibilität zusammen – das EMS ist der Ort, an dem der Konflikt aufgelöst wird.',
    keyFacts: [
      'Koordiniert PV, Speicher, WP, Wallbox',
      'Setzt Gartenzaunprinzip um',
      'Verbindet Preis- und Netzsignale',
    ],
    legalRefs: [],
  },

  // ── Markt & Tarife ─────────────────────────────────────────────────────
  {
    id: 'dyntarif',
    title: 'Dynamischer Stromtarif',
    category: 'markt',
    status: 'etabliert',
    summary: 'Strompreis, der sich stündlich bzw. viertelstündlich am Börsenpreis orientiert – Anreiz, Verbrauch in günstige Zeiten zu legen.',
    explanation:
      'Beim dynamischen Tarif zahlt der Kunde den jeweils aktuellen Day-Ahead-Börsenpreis plus Abgaben, Netzentgelte und Marge. Günstig ist Strom typischerweise, wenn viel Wind und Sonne einspeisen.\n\nDas ist marktdienliche Flexibilität. Die Kehrseite: Wenn alle gleichzeitig auf denselben günstigen Preis reagieren, steigt die lokale Netzlast – ein Grund, warum § 14a-Steuerung und dynamische Tarife zusammen gedacht werden müssen.',
    keyFacts: [
      'Orientiert sich am Day-Ahead-Börsenpreis',
      'Setzt iMSys voraus',
      'Marktdienlich – kann Gleichzeitigkeit im Netz erhöhen',
    ],
    legalRefs: ['§ 41a EnWG'],
  },
  {
    id: 'negpreise',
    title: 'Negative Strompreise',
    category: 'markt',
    status: 'etabliert',
    summary: 'Zeitweise mehr Angebot als Nachfrage am Strommarkt – Erzeuger zahlen dafür, einspeisen zu dürfen.',
    explanation:
      'Negative Preise entstehen vor allem an sonnigen, windigen Tagen mit geringer Nachfrage, wenn unflexible Erzeugung weiterläuft. Sie sind ein starkes Signal für fehlende Flexibilität. Das Solarspitzengesetz setzt hier an, indem neue PV-Anlagen bei negativen Preisen keine Vergütung mehr bekommen.',
    keyFacts: ['Überangebot am Markt', 'Signal fehlender Flexibilität', 'Anlass für das Solarspitzengesetz'],
    legalRefs: ['EEG'],
  },

  // ── Anlagen & Verbraucher ──────────────────────────────────────────────
  {
    id: 'waermepumpe',
    title: 'Wärmepumpe',
    category: 'anlagen',
    status: 'etabliert',
    summary: 'Elektrische Heizung mit hoher Effizienz – wegen thermischer Trägheit gut verschiebbar und typische SteuVE.',
    explanation:
      'Wärmepumpen sind ein Kernbaustein der Wärmewende. Weil Gebäude und Pufferspeicher Wärme halten, kann ihr Betrieb für einige Zeit verschoben oder gedrosselt werden, ohne dass es kalt wird – ideal für Flexibilität.',
    keyFacts: ['Thermische Trägheit = Flexibilität', 'Typische SteuVE nach § 14a'],
    legalRefs: [],
  },
  {
    id: 'wallbox',
    title: 'Wallbox / E-Mobilität',
    category: 'anlagen',
    status: 'etabliert',
    summary: 'Private Ladepunkte für E-Autos – hohe Leistung, aber meist lange Standzeiten und daher gut steuerbar.',
    explanation:
      'Eine Wallbox lädt typischerweise mit 11 kW – deutlich mehr als ein Haushalt sonst braucht. Gleichzeitiges Laden vieler Fahrzeuge kann Ortsnetze überlasten. Weil Autos oft viele Stunden stehen, lässt sich das Laden gut verschieben oder drosseln.',
    keyFacts: ['Typisch 11 kW', 'Lange Standzeiten = gut verschiebbar', 'Typische SteuVE nach § 14a'],
    legalRefs: [],
  },
  {
    id: 'speicher',
    title: 'Batteriespeicher',
    category: 'anlagen',
    status: 'etabliert',
    summary: 'Speichert Strom zwischen – kann je nach Steuerung eigenverbrauchs-, markt- oder netzdienlich arbeiten.',
    explanation:
      'Heimspeicher werden meist für den PV-Eigenverbrauch genutzt. Beim Laden aus dem Netz fallen sie unter § 14a. Mit dynamischen Tarifen oder netzdienlicher Steuerung können sie deutlich mehr Wert schaffen, als nur mittags PV-Strom aufzunehmen.',
    keyFacts: ['Netzbezug > 4,2 kW → SteuVE', 'Kann mehreren Zwecken dienen'],
    legalRefs: [],
  },
  {
    id: 'pv',
    title: 'PV-Anlage',
    category: 'anlagen',
    status: 'etabliert',
    summary: 'Photovoltaik auf Dach oder Freifläche – treibt Mittagsspitzen und ist Gegenstand von Solarspitzengesetz und iMSys-Pflicht.',
    explanation:
      'PV erzeugt gleichzeitig mit allen anderen PV-Anlagen – das führt zu Erzeugungsspitzen und negativen Preisen. Anlagen über 7 kW sind Pflichteinbaufälle für intelligente Messsysteme; neue Anlagen ohne Steuerbarkeit dürfen nur begrenzt einspeisen.',
    keyFacts: ['Gleichzeitige Erzeugung → Spitzen', 'iMSys-Pflicht ab 7 kW', 'Solarspitzengesetz: 60 %-Regel ohne Steuerung'],
    legalRefs: ['EEG', 'MsbG'],
  },
];

let n = 0;
const r = (source: string, type: Relation['type'], target: string, explanation: string): Relation => ({
  id: `r${++n}`, source, target, type, explanation,
});

const relations: Relation[] = [
  // Recht → Rahmen
  r('par14a', 'teil-von', 'enwg', '§ 14a ist ein Paragraf des EnWG.'),
  r('par14c', 'teil-von', 'enwg', '§ 14c ist ein Paragraf des EnWG.'),
  r('par41a', 'teil-von', 'enwg', '§ 41a ist ein Paragraf des EnWG.'),
  r('redispatch', 'teil-von', 'enwg', 'Redispatch ist in §§ 13, 13a, 14 EnWG geregelt.'),
  r('bnetza', 'regelt', 'par14a', 'Die konkreten Regeln (4,2 kW, Module, Steuerungsarten) stammen aus BNetzA-Festlegungen.'),
  r('bnetza', 'regelt', 'vnb', 'Die BNetzA reguliert die Netzbetreiber.'),

  // § 14a Kern
  r('par14a', 'regelt', 'steuve', '§ 14a definiert, welche Anlagen steuerbar sein müssen und welche Rechte/Pflichten gelten.'),
  r('par14a', 'regelt', 'praeventiv', 'Präventives Steuern ist nach § 14a nur übergangsweise und zeitlich begrenzt zulässig.'),
  r('par14a', 'regelt', 'netzorientiert', 'Netzorientiertes Steuern ist das Zielmodell der § 14a-Festlegung.'),
  r('par14a', 'regelt', 'gartenzaun', 'Bei mehreren SteuVE mit EMS wird der Netzanschluss als Ganzes gesteuert.'),
  r('par14a', 'beeinflusst', 'netzentgelte', 'Als Gegenleistung für die Steuerbarkeit sinkt das Netzentgelt (Module 1–3).'),
  r('zvne', 'teil-von', 'netzentgelte', 'Das zeitvariable Netzentgelt ist Modul 3 der § 14a-Netzentgeltreduzierung.'),
  r('vnb', 'betreibt', 'netzorientiert', 'Der Verteilnetzbetreiber führt die Steuerung durch und muss sie dokumentieren.'),
  r('praeventiv', 'abgrenzung', 'netzorientiert', 'Präventiv: vorsorglich nach Prognose/Zeitfenster, ohne Echtzeitnachweis, übergangsweise. Netzorientiert: nur bei gemessener bzw. berechneter Überlastung, so gezielt wie möglich, dauerhaftes Zielmodell.'),
  r('netzorientiert', 'setzt-voraus', 'netzzustand', 'Ohne Netzzustandsermittlung kann der Netzbetreiber nicht nachweisen, dass ein Engpass droht.'),
  r('netzengpass', 'loest-aus', 'netzorientiert', 'Eine tatsächliche oder drohende Überlastung ist der Auslöser für das Dimmen.'),
  r('netzzustand', 'setzt-voraus', 'imsys', 'Messwerte aus intelligenten Messsystemen sind eine zentrale Datenquelle für den Netzzustand.'),
  r('vnb', 'betreibt', 'netzzustand', 'Der VNB baut die Netzzustandsermittlung für sein Netz auf.'),

  // Gartenzaun / EMS
  r('gartenzaun', 'setzt-voraus', 'ems', 'Damit hinter dem Netzanschluss sinnvoll verteilt werden kann, braucht es ein EMS.'),
  r('ems', 'betreibt', 'steuve', 'Das EMS verteilt die vorgegebene Leistung auf Wärmepumpe, Wallbox, Speicher.'),
  r('steuerbox', 'ermoeglicht', 'gartenzaun', 'Die Steuerbox übergibt die Leistungsgrenze am Netzanschluss an das EMS.'),
  r('steuerbox', 'setzt-voraus', 'eebus', 'Digitale Übergabe der Leistungsgrenze an EMS/Geräte erfolgt z. B. per EEBUS.'),

  // Messwesen-Kette
  r('mme', 'teil-von', 'imsys', 'Der digitale Zähler ist ein Bestandteil des intelligenten Messsystems.'),
  r('smgw', 'teil-von', 'imsys', 'Das Gateway ist die Kommunikationseinheit des intelligenten Messsystems.'),
  r('msbg', 'regelt', 'imsys', 'Das MsbG regelt Rollout, Sicherheit und Kosten der iMSys.'),
  r('msbg', 'regelt', 'gwa', 'Das MsbG definiert die Rolle und Pflichten des Gateway-Administrators.'),
  r('msb', 'betreibt', 'imsys', 'Der Messstellenbetreiber baut und betreibt die intelligenten Messsysteme.'),
  r('msb', 'betreibt', 'gwa', 'Der MSB übernimmt die GWA-Rolle selbst oder beauftragt einen Dienstleister.'),
  r('gwa', 'betreibt', 'smgw', 'Der GWA konfiguriert das Gateway, pflegt Zertifikate und spielt Updates ein.'),
  r('gwa', 'ermoeglicht', 'cls', 'Erst wenn der GWA den CLS-Kanal freischaltet, kann ein EMT Anlagen erreichen.'),
  r('cls', 'teil-von', 'smgw', 'Der CLS-Kanal ist eine Funktion des Gateways (HAN-Seite, Proxy-Tunnel).'),
  r('steuerbox', 'setzt-voraus', 'cls', 'Die Steuerbox ist ein CLS-Gerät und empfängt Befehle über den CLS-Kanal.'),
  r('emt', 'setzt-voraus', 'cls', 'Um Anlagen zu steuern, braucht ein externer Marktteilnehmer einen freigeschalteten CLS-Kanal.'),
  r('vnb', 'teil-von', 'emt', 'Wenn der VNB nach § 14a steuert, tritt er gegenüber dem SMGW als externer Marktteilnehmer auf.'),
  r('par14a', 'setzt-voraus', 'steuerbox', 'Die Steuerung nach § 14a läuft technisch über SMGW + Steuerbox (Kette VNB → SMGW → CLS → Steuerbox → Anlage/EMS).'),

  // Flexibilität
  r('par14a', 'teil-von', 'flexibilitaet', '§ 14a ist netzdienliche, regulatorisch vorgegebene Flexibilität.'),
  r('par14c', 'teil-von', 'flexibilitaet', '§ 14c ist netzdienliche, marktgestützt beschaffte Flexibilität.'),
  r('dyntarif', 'teil-von', 'flexibilitaet', 'Der dynamische Tarif erzeugt marktdienliche Flexibilität.'),
  r('redispatch', 'teil-von', 'flexibilitaet', 'Redispatch ist netzdienliche Flexibilität auf der Erzeugungsseite.'),
  r('par14a', 'abgrenzung', 'par14c', '§ 14a: verpflichtend, Dimmen gegen pauschal reduziertes Netzentgelt. § 14c: freiwillig, Flexibilität wird am Markt angeboten und bezahlt.'),
  r('par14a', 'abgrenzung', 'redispatch', '§ 14a: Verbrauchsseite, Niederspannung, kleine Anlagen. Redispatch 2.0: v. a. Erzeugungsseite, Anlagen ab 100 kW, planbasiert.'),
  r('dyntarif', 'beeinflusst', 'netzengpass', 'Reagieren viele Kunden gleichzeitig auf günstige Preise, steigt die Gleichzeitigkeit und damit das Engpassrisiko.'),
  r('netzengpass', 'loest-aus', 'redispatch', 'Engpässe im Übertragungs- und Verteilnetz lösen Redispatch-Maßnahmen aus.'),
  r('ems', 'ermoeglicht', 'flexibilitaet', 'Im EMS werden Markt- und Netzsignale zusammengeführt und Flexibilität tatsächlich gehoben.'),

  // Markt
  r('par41a', 'regelt', 'dyntarif', '§ 41a verpflichtet alle Lieferanten zum Angebot dynamischer Tarife.'),
  r('dyntarif', 'setzt-voraus', 'imsys', 'Abrechnung nach Viertelstundenwerten erfordert ein intelligentes Messsystem.'),
  r('zvne', 'setzt-voraus', 'imsys', 'Zeitvariable Netzentgelte brauchen zeitaufgelöste Messung.'),
  r('lieferant', 'betreibt', 'dyntarif', 'Der Lieferant bietet den dynamischen Tarif an.'),
  r('dyntarif', 'abgrenzung', 'zvne', 'Dynamischer Tarif = Marktpreis, täglich neu. Zeitvariables Netzentgelt = Netzsignal, feste Zeitfenster. Beide können sich widersprechen.'),
  r('negpreise', 'loest-aus', 'solarspitzen', 'Häufige negative Preise durch PV-Spitzen waren ein Anlass für das Solarspitzengesetz.'),

  // Solarspitzen / PV
  r('solarspitzen', 'regelt', 'pv', 'Neue PV-Anlagen: keine Vergütung bei negativen Preisen, 60 %-Begrenzung ohne Steuerbarkeit.'),
  r('solarspitzen', 'setzt-voraus', 'imsys', 'Volle Einspeisung erst mit iMSys und Steuerungseinrichtung.'),
  r('pv', 'beeinflusst', 'negpreise', 'Gleichzeitige PV-Erzeugung treibt Überangebot zur Mittagszeit.'),

  // Anlagen
  r('waermepumpe', 'teil-von', 'steuve', 'Wärmepumpen über 4,2 kW sind steuerbare Verbrauchseinrichtungen.'),
  r('wallbox', 'teil-von', 'steuve', 'Nicht-öffentliche Ladepunkte über 4,2 kW sind steuerbare Verbrauchseinrichtungen.'),
  r('speicher', 'teil-von', 'steuve', 'Speicher sind beim Netzbezug über 4,2 kW steuerbare Verbrauchseinrichtungen.'),
  r('steuve', 'beeinflusst', 'netzengpass', 'Hohe, gleichzeitige Bezugsleistung vieler SteuVE kann Ortsnetze überlasten.'),
];

export const INITIAL_KNOWLEDGE: KnowledgeBase = {
  version: 1,
  topics: seeds.map(s => ({ ...s, createdAt: STAMP, updatedAt: STAMP, source: 'basis' as const })),
  relations,
};
