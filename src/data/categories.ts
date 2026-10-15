import type { Category, RelationTypeInfo } from '../types';

/** Die Ebenen des Big Picture – von "Regeln" über "Wer" bis "Was passiert physisch/kommerziell". */
export const CATEGORIES: Category[] = [
  { id: 'recht', label: 'Recht & Regulierung', description: 'Gesetze, Verordnungen und Festlegungen, die den Rahmen setzen.', color: '#6250d6' },
  { id: 'akteure', label: 'Akteure & Rollen', description: 'Wer macht was im Energiesystem – Behörden, Netzbetreiber, Messstellenbetreiber, Lieferanten.', color: '#2a78d6' },
  { id: 'netz', label: 'Netz & Netzbetrieb', description: 'Physik und Betrieb der Stromnetze: Engpässe, Netzzustand, Netzentgelte.', color: '#008300' },
  { id: 'messwesen', label: 'Messwesen & Digitalisierung', description: 'Zähler, Smart-Meter-Gateway, sichere Kommunikation – die digitale Infrastruktur.', color: '#eda100' },
  { id: 'steuerung', label: 'Steuerung & Flexibilität', description: 'Wie Verbrauch und Erzeugung gezielt verschoben oder begrenzt werden.', color: '#eb6834' },
  { id: 'markt', label: 'Markt & Tarife', description: 'Preise, Tarife und Anreize – das kommerzielle Signal.', color: '#e87ba4' },
  { id: 'anlagen', label: 'Anlagen & Verbraucher', description: 'Die Geräte vor Ort: Wärmepumpe, Wallbox, Speicher, PV.', color: '#1baf7a' },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c])) as Record<Category['id'], Category>;

export const RELATION_TYPES: RelationTypeInfo[] = [
  { id: 'regelt', label: 'regelt', inverse: 'wird geregelt durch' },
  { id: 'setzt-voraus', label: 'setzt voraus', inverse: 'ist Voraussetzung für' },
  { id: 'teil-von', label: 'ist Teil von', inverse: 'umfasst' },
  { id: 'ermoeglicht', label: 'ermöglicht', inverse: 'wird ermöglicht durch' },
  { id: 'abgrenzung', label: 'grenzt sich ab von', inverse: 'grenzt sich ab von' },
  { id: 'betreibt', label: 'betreibt / verantwortet', inverse: 'wird betrieben / verantwortet von' },
  { id: 'beeinflusst', label: 'beeinflusst', inverse: 'wird beeinflusst von' },
  { id: 'loest-aus', label: 'löst aus', inverse: 'wird ausgelöst durch' },
];

export const RELATION_TYPE_BY_ID = Object.fromEntries(RELATION_TYPES.map(r => [r.id, r])) as Record<RelationTypeInfo['id'], RelationTypeInfo>;

export const STATUS_LABEL: Record<string, string> = {
  'etabliert': 'etabliert',
  'neu': 'neu',
  'in-umsetzung': 'in Umsetzung',
  'auslaufend': 'auslaufend / Übergang',
};
