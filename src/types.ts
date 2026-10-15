export type CategoryId =
  | 'recht'
  | 'akteure'
  | 'netz'
  | 'messwesen'
  | 'steuerung'
  | 'markt'
  | 'anlagen';

export interface Category {
  id: CategoryId;
  label: string;
  /** Kurzbeschreibung der Ebene im Big Picture */
  description: string;
  color: string;
}

export type TopicStatus = 'etabliert' | 'neu' | 'in-umsetzung' | 'auslaufend';

export interface Topic {
  id: string;
  title: string;
  /** Abkürzung, z. B. "GWA" */
  short?: string;
  category: CategoryId;
  status: TopicStatus;
  /** Ein Satz: Worum geht es? */
  summary: string;
  /** Ausführlichere Erklärung, Absätze durch Leerzeilen getrennt */
  explanation: string;
  /** Die wichtigsten Punkte zum Merken */
  keyFacts: string[];
  /** Rechtsgrundlagen, z. B. "§ 14a EnWG", "BK6-22-300" */
  legalRefs: string[];
  /** Seit wann gilt / existiert das Thema (frei, z. B. "01.01.2024") */
  since?: string;
  /** Eigene Notizen */
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /** Herkunft: Startwissen, manuell oder vom Assistenten vorgeschlagen */
  source: 'basis' | 'manuell' | 'assistent';
}

export type RelationType =
  | 'regelt'
  | 'setzt-voraus'
  | 'teil-von'
  | 'ermoeglicht'
  | 'abgrenzung'
  | 'betreibt'
  | 'beeinflusst'
  | 'loest-aus';

export interface RelationTypeInfo {
  id: RelationType;
  /** Leserichtung Quelle → Ziel */
  label: string;
  /** Leserichtung Ziel → Quelle */
  inverse: string;
}

export interface Relation {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  /** Warum / wie hängen die beiden zusammen? */
  explanation: string;
}

export interface KnowledgeBase {
  version: number;
  topics: Topic[];
  relations: Relation[];
}

export type View = 'dashboard' | 'bigpicture' | 'thema' | 'vergleich' | 'assistent';
