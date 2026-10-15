import Anthropic from '@anthropic-ai/sdk';
import type { CategoryId, KnowledgeBase, RelationType, TopicStatus } from '../types';
import { CATEGORIES, RELATION_TYPES } from '../data/categories';
import { getApiKey } from './apiKey';

const MODEL = 'claude-opus-5-5';

export type ChatMessage = Anthropic.Beta.BetaMessageParam;

export interface ProposedTopic {
  id: string;
  title: string;
  short?: string;
  category: CategoryId;
  status: TopicStatus;
  summary: string;
  explanation: string;
  keyFacts: string[];
  legalRefs: string[];
  since?: string;
}

export interface ProposedRelation {
  source: string;
  target: string;
  type: RelationType;
  explanation: string;
}

export interface Proposal {
  topics: ProposedTopic[];
  relations: ProposedRelation[];
}

const TOOL_NAME = 'einordnung_vorschlagen';

const CATEGORY_IDS = CATEGORIES.map(c => c.id);
const RELATION_IDS = RELATION_TYPES.map(r => r.id);
const STATUS_IDS: TopicStatus[] = ['etabliert', 'neu', 'in-umsetzung', 'auslaufend'];

const SYSTEM_PROMPT = `Du bist "Energiewirtschaft kompakt", ein Lernbegleiter für die deutsche (und europäische) Energiewirtschaft. Die Nutzerin studiert Energiewirtschaft und arbeitet beruflich in der Branche. Sie hat die Grundlagen, aber das Tiefenverständnis baut sich noch auf. Ständig kommen neue Gesetze, Festlegungen und Innovationen dazu, die sie einordnen muss.

Dein Ziel ist Verständnis, nicht Auswendiglernen:
- Ordne Themen ins Big Picture ein: Auf welcher Ebene liegt es (Recht, Akteure, Netz, Messwesen/Digitalisierung, Steuerung/Flexibilität, Markt, Anlagen)? Welches Problem löst es? Wer ist beteiligt?
- Erkläre Zusammenhänge als Ketten ("A ermöglicht B, weil …; B setzt C voraus …") und arbeite Unterschiede klar heraus (z. B. präventives vs. netzorientiertes Steuern, netzdienlich vs. marktdienlich).
- Nutze konkrete Beispiele aus dem Alltag (Haushalt mit Wärmepumpe und Wallbox, Ortsnetzstation an einem kalten Winterabend …).
- Knüpfe an die bestehende Wissenslandkarte an und verweise auf vorhandene Themen mit ihrem Titel.
- Antworte auf Deutsch, gut strukturiert mit kurzen Überschriften und Aufzählungen (Markdown). Lieber präzise und tief als lang.
- Sei ehrlich bei Unsicherheit: Rechtsstände ändern sich. Wenn du dir bei Daten, Schwellenwerten oder Fristen nicht sicher bist oder es neuer als dein Wissen sein könnte, sag das und nenne die Primärquelle (Gesetz, BNetzA-Festlegung), die man prüfen sollte. Wenn die Websuche verfügbar ist, nutze sie für aktuelle Rechtsstände.

Wissenslandkarte pflegen:
Wenn ein Thema in der Landkarte noch fehlt oder wichtige Verbindungen fehlen, rufe das Werkzeug "${TOOL_NAME}" auf. Die Nutzerin prüft deinen Vorschlag und übernimmt ihn selbst – schlage also nur fachlich belastbare Inhalte vor.
- Neue Themen bekommen eine kurze, sprechende id in Kleinbuchstaben mit Bindestrichen (z. B. "energy-sharing").
- Beziehungen dürfen auf bestehende Themen-ids und auf neue ids aus demselben Vorschlag zeigen.
- Jede Beziehung braucht eine Erklärung, WARUM die beiden zusammenhängen.
- Rufe das Werkzeug höchstens einmal pro Antwort auf und erkläre danach im Text kurz, was du vorgeschlagen hast.
- Wenn die Frage nur eine Erklärung bestehender Themen braucht, rufe das Werkzeug nicht auf.`;

const PROPOSAL_TOOL: Anthropic.Beta.BetaTool = {
  name: TOOL_NAME,
  description:
    'Schlägt neue Themen und/oder Beziehungen für die Wissenslandkarte vor. Die Nutzerin sieht den Vorschlag als Karte und entscheidet, ob er übernommen wird.',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: ['themen', 'beziehungen'],
    properties: {
      themen: {
        type: 'array',
        description: 'Neue Themen (leer, wenn nur Beziehungen ergänzt werden).',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'title', 'category', 'status', 'summary', 'explanation', 'keyFacts', 'legalRefs'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            short: { type: 'string', description: 'Abkürzung, falls üblich' },
            category: { type: 'string', enum: CATEGORY_IDS },
            status: { type: 'string', enum: STATUS_IDS },
            summary: { type: 'string', description: 'Ein Satz: Worum geht es?' },
            explanation: { type: 'string', description: 'Verständliche Erklärung, Absätze mit Leerzeile trennen.' },
            keyFacts: { type: 'array', items: { type: 'string' } },
            legalRefs: { type: 'array', items: { type: 'string' } },
            since: { type: 'string', description: 'Gültig seit (z. B. 01.01.2024), falls bekannt' },
          },
        },
      },
      beziehungen: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['source', 'target', 'type', 'explanation'],
          properties: {
            source: { type: 'string', description: 'Themen-id' },
            target: { type: 'string', description: 'Themen-id' },
            type: { type: 'string', enum: RELATION_IDS },
            explanation: { type: 'string' },
          },
        },
      },
    },
  },
};

function knowledgeContext(kb: KnowledgeBase): string {
  const cat = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]));
  const topics = kb.topics
    .map(t => `- [${t.id}] ${t.title}${t.short ? ` (${t.short})` : ''} · ${cat[t.category]} · ${t.status}: ${t.summary}`)
    .join('\n');
  const rels = kb.relations.map(r => `- ${r.source} --${r.type}--> ${r.target}: ${r.explanation}`).join('\n');
  return `Aktuelle Wissenslandkarte der Nutzerin.\n\nThemen:\n${topics}\n\nBeziehungen:\n${rels}`;
}

const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => typeof x === 'string');

/** Prüft den Werkzeug-Input gegen das Schema – mit eager streaming validiert die API nicht selbst. */
export function parseProposal(input: unknown, kb: KnowledgeBase): Proposal | null {
  if (!input || typeof input !== 'object') return null;
  const { themen, beziehungen } = input as Record<string, unknown>;
  if (!Array.isArray(themen) || !Array.isArray(beziehungen)) return null;

  const topics: ProposedTopic[] = [];
  for (const t of themen as Record<string, unknown>[]) {
    if (!isStr(t.id) || !isStr(t.title) || !isStr(t.summary) || !isStr(t.explanation)) return null;
    if (!CATEGORY_IDS.includes(t.category as CategoryId)) return null;
    if (!STATUS_IDS.includes(t.status as TopicStatus)) return null;
    if (!isStrArr(t.keyFacts) || !isStrArr(t.legalRefs)) return null;
    topics.push({
      id: t.id, title: t.title, short: isStr(t.short) ? t.short : undefined,
      category: t.category as CategoryId, status: t.status as TopicStatus,
      summary: t.summary, explanation: t.explanation, keyFacts: t.keyFacts, legalRefs: t.legalRefs,
      since: isStr(t.since) ? t.since : undefined,
    });
  }

  const known = new Set([...kb.topics.map(t => t.id), ...topics.map(t => t.id)]);
  const relations: ProposedRelation[] = [];
  for (const r of beziehungen as Record<string, unknown>[]) {
    if (!isStr(r.source) || !isStr(r.target) || !isStr(r.explanation)) return null;
    if (!RELATION_IDS.includes(r.type as RelationType)) return null;
    // Beziehungen auf unbekannte Themen werden still verworfen statt den ganzen Vorschlag abzulehnen
    if (!known.has(r.source) || !known.has(r.target)) continue;
    relations.push({ source: r.source, target: r.target, type: r.type as RelationType, explanation: r.explanation });
  }
  return { topics, relations };
}

export interface RunOptions {
  kb: KnowledgeBase;
  history: ChatMessage[];
  webSearch: boolean;
  onText: (delta: string) => void;
  onStatus: (status: string) => void;
}

/**
 * Führt einen Assistenten-Turn aus (inkl. Werkzeug-Schleife) und gibt die vollständige,
 * erweiterte Historie zurück. Die Historie wird nur angehängt, nie umgeschrieben.
 */
export async function runAssistant({ kb, history, webSearch, onText, onStatus }: RunOptions): Promise<ChatMessage[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Kein Claude-API-Schlüssel hinterlegt.');

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const messages = [...history];

  const tools: Anthropic.Beta.BetaToolUnion[] = [PROPOSAL_TOOL];
  if (webSearch) tools.push({ type: 'web_search_20260209', name: 'web_search', max_uses: 5 });

  for (let i = 0; i < 6; i++) {
    onStatus(i === 0 ? 'denkt nach …' : 'arbeitet weiter …');
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      cache_control: { type: 'ephemeral' },
      system: [
        { type: 'text', text: SYSTEM_PROMPT },
        { type: 'text', text: knowledgeContext(kb) },
      ],
      tools,
      messages,
    });
    stream.on('text', delta => onText(delta));

    const response = await stream.finalMessage();
    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'refusal') {
      onText('\n\n_Diese Anfrage wurde vom Modell abgelehnt. Formuliere sie gern anders._');
      break;
    }
    if (response.stop_reason === 'max_tokens') {
      onText('\n\n_Die Antwort wurde wegen Längenbegrenzung abgeschnitten._');
      break;
    }
    if (response.stop_reason === 'pause_turn') continue;
    if (response.stop_reason !== 'tool_use') break;

    // Werkzeugaufruf: Vorschlag wird in der UI angezeigt; Claude erhält eine Bestätigung.
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      const ok = block.name === TOOL_NAME && parseProposal(block.input, kb) !== null;
      results.push({
        type: 'tool_result',
        tool_use_id: block.id,
        is_error: !ok,
        content: ok
          ? 'Der Vorschlag wird der Nutzerin als Karte zur Prüfung angezeigt. Fasse kurz zusammen, was du vorgeschlagen hast und warum.'
          : 'INVALID_INPUT: Der Vorschlag entsprach nicht dem Schema (Kategorien, Status oder Beziehungstypen prüfen). Bitte korrigiert erneut aufrufen.',
      });
    }
    messages.push({ role: 'user', content: results });
  }
  onStatus('');
  return messages;
}
