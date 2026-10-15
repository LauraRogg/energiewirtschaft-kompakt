import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Sparkles, Scale, Lightbulb, Link2, X } from 'lucide-react';
import type { Store } from '../store/useStore';
import type { Topic, RelationType } from '../types';
import { CATEGORIES, CATEGORY_BY_ID, RELATION_TYPES } from '../data/categories';
import { connectionsOf, matches } from '../utils';
import { CategoryBadge, StatusBadge } from './Badges';
import TopicForm from './TopicForm';
import { DiagramFrame } from './DiagramsView';
import { diagramsForTopic } from './diagrams/registry';

export default function TopicView({ store }: { store: Store }) {
  const { kb, selectedId, setSelectedId, askAssistant, deleteTopic, upsertTopic, addRelation, deleteRelation } = store;
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Topic | 'new' | null>(null);
  const [linking, setLinking] = useState(false);
  const [extraDiagram, setExtraDiagram] = useState<string | null>(null);

  const topic = kb.topics.find(t => t.id === selectedId) ?? kb.topics[0];
  const grouped = useMemo(
    () => CATEGORIES.map(c => ({ c, topics: kb.topics.filter(t => t.category === c.id && matches(t, query)).sort((a, b) => a.title.localeCompare(b.title)) })),
    [kb.topics, query],
  );
  const conns = topic ? connectionsOf(kb, topic.id) : [];
  const diagrams = topic ? diagramsForTopic(topic.id) : [];
  // Hauptschaubild: das, dessen erstes Thema dieses ist – sonst das erste passende
  const mainDiagram = diagrams.find(d => d.topics[0] === topic?.id) ?? diagrams[0];
  const otherDiagrams = diagrams.filter(d => d !== mainDiagram);
  const abgrenzungen = conns.filter(c => c.relation.type === 'abgrenzung');
  const others = conns.filter(c => c.relation.type !== 'abgrenzung');

  return (
    <div className="flex h-[calc(100svh-3rem)]">
      <aside className="w-72 shrink-0 border-r border-slate-200 bg-white hidden md:flex flex-col">
        <div className="p-3 border-b border-slate-100 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Suchen …" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm" />
          </div>
          <button onClick={() => setEditing('new')} title="Neues Thema" className="px-3 rounded-lg bg-[#0b2540] text-white"><Plus size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {grouped.filter(g => g.topics.length).map(({ c, topics }) => (
            <div key={c.id} className="mb-2">
              <div className="px-4 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.label}</div>
              {topics.map(t => (
                <button key={t.id} onClick={() => setSelectedId(t.id)} className={`block w-full text-left px-4 py-1.5 text-sm truncate ${t.id === topic?.id ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {t.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto">
        {topic && (
          <article className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
            <header style={{ borderLeft: `5px solid ${CATEGORY_BY_ID[topic.category].color}` }} className="pl-5">
              <div className="flex gap-2 flex-wrap items-center">
                <CategoryBadge id={topic.category} />
                <StatusBadge status={topic.status} />
                {topic.since && <span className="text-xs text-slate-400">seit {topic.since}</span>}
                {topic.source === 'assistent' && <span className="text-xs text-amber-600 flex items-center gap-1"><Sparkles size={12} />vom Assistenten eingeordnet</span>}
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">{topic.title}</h1>
              <p className="text-lg text-slate-600 mt-2">{topic.summary}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={() => askAssistant(`Erklär mir "${topic.title}" in der Tiefe: Welches Problem löst es, wie funktioniert es konkret, und wo liegen typische Missverständnisse?`)} className="text-sm rounded-lg px-3 py-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 flex items-center gap-1.5"><Sparkles size={14} />Tiefer erklären</button>
                <button onClick={() => askAssistant(`Gibt es aktuelle Neuerungen oder Änderungen zu "${topic.title}"? Prüfe den aktuellen Rechtsstand und ordne ein, was sich für die bestehenden Zusammenhänge ändert.`)} className="text-sm rounded-lg px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"><Sparkles size={14} />Auf Neuerungen prüfen</button>
                <button onClick={() => setEditing(topic)} className="text-sm rounded-lg px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"><Pencil size={14} />Bearbeiten</button>
                <button onClick={() => { if (confirm(`"${topic.title}" und alle Verbindungen löschen?`)) { deleteTopic(topic.id); setSelectedId(null); } }} className="text-sm rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-1.5"><Trash2 size={14} />Löschen</button>
              </div>
            </header>

            <section className="prose-sm text-slate-700 space-y-3 leading-relaxed">
              {topic.explanation.split(/\n\s*\n/).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
            </section>

            {mainDiagram && <DiagramFrame key={`${topic.id}-${mainDiagram.id}`} id={mainDiagram.id} onOpenTopic={setSelectedId} compact />}

            {otherDiagrams.length > 0 && (
              <section className="space-y-3">
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <span className="text-slate-500">Weitere Schaubilder:</span>
                  {otherDiagrams.map(d => (
                    <button key={d.id} onClick={() => setExtraDiagram(extraDiagram === d.id ? null : d.id)} className={`rounded-full px-3 py-1 border ${extraDiagram === d.id ? 'bg-[#0b2540] text-white border-[#0b2540]' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{d.title}</button>
                  ))}
                </div>
                {extraDiagram && otherDiagrams.some(d => d.id === extraDiagram) && <DiagramFrame id={extraDiagram} onOpenTopic={setSelectedId} compact />}
              </section>
            )}

            {topic.keyFacts.length > 0 && (
              <section className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                <h2 className="flex items-center gap-2 font-medium text-amber-900 mb-3"><Lightbulb size={18} />Zum Merken</h2>
                <ul className="space-y-1.5 text-sm text-amber-950">
                  {topic.keyFacts.map(f => <li key={f} className="flex gap-2"><span className="text-amber-500">●</span>{f}</li>)}
                </ul>
              </section>
            )}

            {abgrenzungen.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 font-medium text-slate-800 mb-3"><Scale size={18} />Abgrenzung – nicht verwechseln mit</h2>
                <div className="space-y-2">
                  {abgrenzungen.map(c => (
                    <div key={c.relation.id} className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                      <button onClick={() => setSelectedId(c.other.id)} className="font-medium text-rose-900 hover:underline">{c.other.title}</button>
                      <p className="text-sm text-rose-950 mt-1">{c.relation.explanation}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 font-medium text-slate-800"><Link2 size={18} />Wie es zusammenhängt</h2>
                <button onClick={() => setLinking(true)} className="text-sm text-sky-700 hover:underline flex items-center gap-1"><Plus size={14} />Verbindung</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {others.map(c => (
                  <div key={c.relation.id} className="group rounded-xl border border-slate-200 bg-white p-4 relative">
                    <div className="text-xs text-slate-500">{topic.short ?? topic.title} {c.label}</div>
                    <button onClick={() => setSelectedId(c.other.id)} className="font-medium text-left text-slate-800 hover:underline flex items-center gap-1.5"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_BY_ID[c.other.category].color }} />{c.other.title}</button>
                    <p className="text-sm text-slate-600 mt-1">{c.relation.explanation}</p>
                    <button onClick={() => deleteRelation(c.relation.id)} title="Verbindung entfernen" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><X size={14} /></button>
                  </div>
                ))}
                {others.length === 0 && <p className="text-sm text-slate-400">Noch keine Verbindungen.</p>}
              </div>
            </section>

            {topic.legalRefs.length > 0 && (
              <section>
                <h2 className="font-medium text-slate-800 mb-2">Rechtsgrundlagen & Quellen</h2>
                <div className="flex flex-wrap gap-2">
                  {topic.legalRefs.map(r => <span key={r} className="text-xs rounded-md px-2 py-1 bg-violet-50 text-violet-800 border border-violet-200">{r}</span>)}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-medium text-slate-800 mb-2">Meine Notizen</h2>
              <textarea
                key={topic.id}
                defaultValue={topic.notes ?? ''}
                onBlur={e => { if (e.target.value !== (topic.notes ?? '')) upsertTopic({ ...topic, notes: e.target.value }); }}
                placeholder="Eigene Gedanken, Beispiele aus Vorlesung oder Job, offene Fragen …"
                className="w-full min-h-28 rounded-xl border border-slate-300 p-3 text-sm"
              />
            </section>
          </article>
        )}
      </div>

      {editing && (
        <TopicForm
          initial={editing === 'new' ? undefined : editing}
          existingIds={kb.topics.map(t => t.id)}
          onCancel={() => setEditing(null)}
          onSave={t => { upsertTopic(t); setSelectedId(t.id); setEditing(null); }}
        />
      )}

      {linking && topic && (
        <LinkDialog
          topic={topic}
          topics={kb.topics.filter(t => t.id !== topic.id)}
          onCancel={() => setLinking(false)}
          onSave={(type, target, explanation) => { addRelation({ source: topic.id, target, type, explanation }); setLinking(false); }}
        />
      )}
    </div>
  );
}

function LinkDialog({ topic, topics, onCancel, onSave }: {
  topic: Topic;
  topics: Topic[];
  onCancel: () => void;
  onSave: (type: RelationType, target: string, explanation: string) => void;
}) {
  const [type, setType] = useState<RelationType>('beeinflusst');
  const [target, setTarget] = useState(topics[0]?.id ?? '');
  const [explanation, setExplanation] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <form onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); if (target && explanation.trim()) onSave(type, target, explanation.trim()); }} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
        <h2 className="font-semibold text-slate-800">Verbindung hinzufügen</h2>
        <div className="text-sm text-slate-600 font-medium">{topic.title}</div>
        <select value={type} onChange={e => setType(e.target.value as RelationType)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          {RELATION_TYPES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <select value={target} onChange={e => setTarget(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <textarea value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Warum hängen die beiden zusammen?" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm min-h-20" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600">Abbrechen</button>
          <button className="px-4 py-2 text-sm rounded-lg bg-[#0b2540] text-white">Speichern</button>
        </div>
      </form>
    </div>
  );
}
