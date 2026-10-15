import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export interface DiagramProps {
  onOpenTopic?: (id: string) => void;
}

export interface DiagramInfo {
  id: string;
  title: string;
  question: string;
  /** Themen, auf deren Seite das Schaubild erscheint */
  topics: string[];
  /** Themen, bei denen es das Hauptschaubild ist (zusätzlich zu topics[0]) */
  primary?: string[];
  Component: LazyExoticComponent<ComponentType<DiagramProps>>;
}

export const DIAGRAMS: DiagramInfo[] = [
  {
    id: 'rollen',
    title: 'Rollen im Energiesystem: EFH & MFH',
    question: 'Wer macht was – vom Gesetz bis zur Wallbox in der Tiefgarage?',
    topics: ['msb', 'vnb', 'gmsb', 'wmsb', 'gwa', 'aemt', 'pemt', 'emt', 'smgw', 'mieterstrom', 'ggv', 'lieferant', 'bsi', 'enwg', 'msbg', 'eeg', 'direktvermarktung', 'steuve'],
    primary: ['msb', 'vnb', 'mieterstrom', 'ggv', 'lieferant', 'bsi', 'enwg', 'msbg', 'eeg', 'direktvermarktung'],
    Component: lazy(() => import('./RollenLandschaftDiagram')),
  },
  {
    id: 'emt',
    title: 'aEMT vs. pEMT',
    question: 'Wer spricht ins Haus hinein – und wer bekommt nur Post?',
    topics: ['aemt', 'pemt', 'emt', 'cls', 'smgw'],
    primary: ['emt'],
    Component: lazy(() => import('./EmtDiagram')),
  },
  {
    id: 'msbrollen',
    title: 'VNB, gMSB, wMSB',
    question: 'Wer ist mein Messstellenbetreiber – und was unterscheidet die Rollen?',
    topics: ['gmsb', 'wmsb', 'msb', 'vnb'],
    Component: lazy(() => import('./MsbRollenDiagram')),
  },
  {
    id: 'gartenzaun',
    title: 'Gartenzaunprinzip',
    question: 'Wer entscheidet was – vor und hinter dem Netzanschluss?',
    topics: ['gartenzaun', 'ems', 'steuve', 'par14a'],
    Component: lazy(() => import('./GartenzaunDiagram')),
  },
  {
    id: 'steuerungskette',
    title: 'Steuerungskette über das intelligente Messsystem',
    question: 'Wie kommt ein Steuerbefehl vom Netzbetreiber zur Wallbox?',
    topics: ['cls', 'smgw', 'gwa', 'steuerbox', 'eebus', 'emt', 'imsys', 'mme', 'msb', 'par14a'],
    Component: lazy(() => import('./SteuerungsketteDiagram')),
  },
  {
    id: 'steuern',
    title: 'Präventiv vs. netzorientiert steuern',
    question: 'Wann wird gedimmt – nach Plan oder nach echtem Bedarf?',
    topics: ['praeventiv', 'netzorientiert', 'netzzustand', 'netzengpass', 'par14a'],
    Component: lazy(() => import('./SteuernVergleichDiagram')),
  },
  {
    id: 'deal14a',
    title: 'Der § 14a-Deal',
    question: 'Was geben Netzbetreiber und Kunde – und was bekommen sie?',
    topics: ['par14a', 'steuve', 'vnb'],
    Component: lazy(() => import('./Deal14aDiagram')),
  },
  {
    id: 'module',
    title: 'Netzentgelt-Module nach § 14a',
    question: 'Welche Rabatte gibt es, und was braucht man dafür?',
    topics: ['netzentgelte', 'zvne', 'par14a'],
    Component: lazy(() => import('./NetzentgeltModuleDiagram')),
  },
  {
    id: 'flex',
    title: 'Flexibilität: wem dient sie?',
    question: 'Netzdienlich, marktdienlich, systemdienlich – und wenn sich Signale widersprechen?',
    topics: ['flexibilitaet', 'dyntarif', 'par14c', 'redispatch', 'netzengpass', 'ems', 'lieferant'],
    Component: lazy(() => import('./FlexSignaleDiagram')),
  },
  {
    id: 'solarspitzen',
    title: 'Solarspitzengesetz',
    question: 'Was passiert mit der Mittagsspitze einer neuen PV-Anlage?',
    topics: ['solarspitzen', 'pv', 'negpreise'],
    Component: lazy(() => import('./SolarspitzenDiagram')),
  },
];

export const diagramsForTopic = (topicId: string) => DIAGRAMS.filter(d => d.topics.includes(topicId));
