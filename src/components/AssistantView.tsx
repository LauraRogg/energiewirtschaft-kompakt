import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, Globe, RotateCcw, Check, X, KeyRound, Loader2 } from 'lucide-react';
import Anthropic from '@anthropic-ai/sdk';
import type { Store } from '../store/useStore';
import { getApiKey } from '../services/apiKey';
import { parseProposal, runAssistant, type ChatMessage, type Proposal } from '../services/assistant';
import { CATEGORY_BY_ID, RELATION_TYPE_BY_ID } from '../data/categories';

interface Props { store: Store; onOpenSettings: () => void }

function errorText(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'Der Claude-API-Schlüssel ist ungültig. Bitte in den Einstellungen prüfen.';
  if (e instanceof Anthropic.RateLimitError) return 'Zu viele Anfragen – bitte kurz warten und erneut versuchen.';
  if (e instanceof Anthropic.APIConnectionError) return 'Keine Verbindung zur Claude-API.';
  if (e instanceof Anthropic.APIError) return `API-Fehler ${e.status}: ${e.message}`;
  return e instanceof Error ? e.message : String(e);
}

export default function AssistantView({ store, onOpenSettings }: Props) {
  const { kb, chat, setChat, accepted, applyProposal, dismissProposal, assistantDraft, setAssistantDraft, openTopic } = store;
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [streaming, setStreaming] = useState('');
  const [error, setError] = useState('');
  const [webSearch, setWebSearch] = useState(true);
  const bottom = useRef<HTMLDivElement>(null);
  const hasKey = !!getApiKey();

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setError('');
    setInput('');
    const history: ChatMessage[] = [...chat, { role: 'user', content: text.trim() }];
    setChat(history);
    setBusy(true);
    setStreaming('');
    try {
      const result = await runAssistant({ kb, history, webSearch, onText: d => setStreaming(s => s + d), onStatus: setStatus });
      setChat(result);
    } catch (e) {
      setError(errorText(e));
      // Fehlgeschlagene Nutzerfrage wieder ins Eingabefeld, Verlauf unverändert lassen
      setChat(chat);
      setInput(text);
    } finally {
      setBusy(false);
      setStreaming('');
      setStatus('');
    }
  };

  // Vorbefüllte Frage aus anderen Ansichten übernehmen
  useEffect(() => {
    if (assistantDraft === '') return;
    if (hasKey) void send(assistantDraft); else setInput(assistantDraft);
    setAssistantDraft('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantDraft]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat, streaming]);

  return (
    <div className="h-[calc(100svh-3rem)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {chat.length === 0 && !busy && (
            <div className="text-center py-12">
              <Sparkles className="mx-auto text-amber-500" size={36} />
              <h1 className="text-xl font-semibold text-slate-800 mt-3">Einordnungs-Assistent</h1>
              <p className="text-slate-500 mt-2 max-w-lg mx-auto">
                Frag nach neuen Gesetzen, Begriffen oder Zusammenhängen. Der Assistent kennt deine Wissenslandkarte, erklärt im Big Picture und schlägt neue Themen und Verbindungen vor, die du mit einem Klick übernimmst.
              </p>
            </div>
          )}

          {chat.map((m, i) => <MessageView key={i} msg={m} store={{ kb, accepted, applyProposal, dismissProposal, openTopic }} />)}

          {busy && (
            <div className="rounded-2xl bg-white border border-slate-200 p-5">
              {streaming ? <Markdown text={streaming} /> : null}
              {status && <div className="text-sm text-slate-400 flex items-center gap-2 mt-2"><Loader2 size={14} className="animate-spin" />{status}</div>}
            </div>
          )}
          {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm p-4">{error}</div>}
          <div ref={bottom} />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <div className="max-w-3xl mx-auto">
          {!hasKey && (
            <button onClick={onOpenSettings} className="w-full mb-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm p-3 flex items-center gap-2">
              <KeyRound size={16} />Für den Assistenten brauchst du einen Claude-API-Schlüssel – hier hinterlegen.
            </button>
          )}
          <form onSubmit={e => { e.preventDefault(); void send(input); }} className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(input); } }}
              rows={2}
              placeholder="Was möchtest du verstehen oder einordnen?"
              className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm"
              disabled={!hasKey}
            />
            <button disabled={busy || !hasKey || !input.trim()} className="rounded-xl p-3 bg-[#0b2540] text-white disabled:opacity-40"><Send size={18} /></button>
          </form>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={webSearch} onChange={e => setWebSearch(e.target.checked)} />
              <Globe size={13} />Websuche für aktuelle Rechtsstände
            </label>
            {chat.length > 0 && (
              <button onClick={() => setChat([])} disabled={busy} className="flex items-center gap-1 hover:text-slate-700"><RotateCcw size={13} />Neues Gespräch</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Markdown({ text }: { text: string }) {
  return (
    <div className="md text-sm text-slate-700 leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

type MsgStore = Pick<Store, 'kb' | 'accepted' | 'applyProposal' | 'dismissProposal' | 'openTopic'>;

function MessageView({ msg, store }: { msg: ChatMessage; store: MsgStore }) {
  if (msg.role === 'user') {
    if (typeof msg.content !== 'string') return null; // Werkzeug-Ergebnisse nicht anzeigen
    return (
      <div className="flex justify-end">
        <div className="rounded-2xl rounded-br-sm bg-[#0b2540] text-white px-4 py-3 text-sm max-w-[85%] whitespace-pre-wrap">{msg.content}</div>
      </div>
    );
  }
  if (typeof msg.content === 'string') return <div className="rounded-2xl bg-white border border-slate-200 p-5"><Markdown text={msg.content} /></div>;

  const parts = msg.content.flatMap((b, i) => {
    if (b.type === 'text' && b.text.trim()) return [<Markdown key={i} text={b.text} />];
    if (b.type === 'server_tool_use' && b.name === 'web_search') {
      const q = (b.input as { query?: string }).query;
      return [<div key={i} className="text-xs text-slate-400 flex items-center gap-1.5"><Globe size={12} />Websuche: {q}</div>];
    }
    if (b.type === 'tool_use') {
      const proposal = parseProposal(b.input, store.kb);
      return proposal ? [<ProposalCard key={i} id={b.id} proposal={proposal} store={store} />] : [];
    }
    return [];
  });
  if (parts.length === 0) return null;
  return <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">{parts}</div>;
}

function ProposalCard({ id, proposal, store }: { id: string; proposal: Proposal; store: MsgStore }) {
  const state = store.accepted[id];
  const title = (tid: string) => store.kb.topics.find(t => t.id === tid)?.title ?? proposal.topics.find(t => t.id === tid)?.title ?? tid;
  return (
    <div className={`rounded-xl border-2 p-4 space-y-3 ${state === 'accepted' ? 'border-emerald-300 bg-emerald-50' : state === 'dismissed' ? 'border-slate-200 bg-slate-50 opacity-60' : 'border-amber-300 bg-amber-50'}`}>
      <div className="text-sm font-medium text-slate-800 flex items-center gap-2"><Sparkles size={16} className="text-amber-500" />Vorschlag für deine Wissenslandkarte</div>
      {proposal.topics.map(t => (
        <div key={t.id} className="rounded-lg bg-white p-3 border border-slate-200">
          <div className="text-xs font-medium" style={{ color: CATEGORY_BY_ID[t.category].color }}>Neues Thema · {CATEGORY_BY_ID[t.category].label}</div>
          <div className="font-medium text-slate-800">{t.title}{t.short ? ` (${t.short})` : ''}</div>
          <div className="text-sm text-slate-600">{t.summary}</div>
        </div>
      ))}
      {proposal.relations.length > 0 && (
        <ul className="text-sm space-y-1">
          {proposal.relations.map((r, i) => (
            <li key={i} className="text-slate-700">
              <span className="font-medium">{title(r.source)}</span> <span className="text-sky-700">{RELATION_TYPE_BY_ID[r.type].label}</span> <span className="font-medium">{title(r.target)}</span>
              <span className="text-slate-500"> – {r.explanation}</span>
            </li>
          ))}
        </ul>
      )}
      {!state && (
        <div className="flex gap-2">
          <button onClick={() => store.applyProposal(id, proposal)} className="text-sm rounded-lg px-3 py-1.5 bg-emerald-600 text-white flex items-center gap-1"><Check size={14} />Übernehmen</button>
          <button onClick={() => store.dismissProposal(id)} className="text-sm rounded-lg px-3 py-1.5 text-slate-600 hover:bg-white flex items-center gap-1"><X size={14} />Verwerfen</button>
        </div>
      )}
      {state === 'accepted' && (
        <div className="text-sm text-emerald-700 flex items-center gap-2">
          <Check size={14} />Übernommen
          {proposal.topics[0] && <button onClick={() => store.openTopic(proposal.topics[0].id)} className="underline">ansehen</button>}
        </div>
      )}
      {state === 'dismissed' && <div className="text-sm text-slate-500">Verworfen</div>}
    </div>
  );
}
