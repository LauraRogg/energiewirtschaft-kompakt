import { useState } from 'react';
import { ArrowDown, Sparkles, ArrowLeftRight } from 'lucide-react';
import type { Store } from '../store/useStore';
import type { Topic } from '../types';
import { CATEGORY_BY_ID } from '../data/categories';
import { shortestPath } from '../utils';
import { CategoryBadge, StatusBadge } from './Badges';

function TopicCard({ t, onOpen }: { t: Topic; onOpen: () => void }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 flex-1 min-w-0" style={{ borderTop: `4px solid ${CATEGORY_BY_ID[t.category].color}` }}>
      <div className="flex gap-2 flex-wrap"><CategoryBadge id={t.category} /><StatusBadge status={t.status} /></div>
      <button onClick={onOpen} className="block text-lg font-semibold text-slate-800 mt-2 text-left hover:underline">{t.title}</button>
      <p className="text-sm text-slate-600 mt-1">{t.summary}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">
        {t.keyFacts.slice(0, 4).map(f => <li key={f} className="flex gap-2"><span style={{ color: CATEGORY_BY_ID[t.category].color }}>●</span>{f}</li>)}
      </ul>
    </div>
  );
}

export default function CompareView({ store }: { store: Store }) {
  const { kb, openTopic, askAssistant } = store;
  const sorted = [...kb.topics].sort((x, y) => x.title.localeCompare(y.title));
  const [a, setA] = useState('praeventiv');
  const [b, setB] = useState('netzorientiert');
  const ta = kb.topics.find(t => t.id === a);
  const tb = kb.topics.find(t => t.id === b);
  const path = ta && tb ? shortestPath(kb, ta.id, tb.id) : null;
  const direct = kb.relations.filter(r => (r.source === a && r.target === b) || (r.source === b && r.target === a));

  const select = (value: string, set: (v: string) => void) => (
    <select value={value} onChange={e => set(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
      {sorted.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
    </select>
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Wie hängt das zusammen?</h1>
        <p className="text-slate-500 mt-1">Wähle zwei Themen. Du siehst den Weg durch die Wissenslandkarte und – falls hinterlegt – die direkte Abgrenzung.</p>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        {select(a, setA)}
        <button onClick={() => { setA(b); setB(a); }} className="p-2 text-slate-400 hover:text-slate-700" title="Tauschen"><ArrowLeftRight size={18} /></button>
        {select(b, setB)}
      </div>

      {ta && tb && (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <TopicCard t={ta} onOpen={() => openTopic(ta.id)} />
            <TopicCard t={tb} onOpen={() => openTopic(tb.id)} />
          </div>

          {direct.length > 0 && (
            <section className="rounded-2xl bg-rose-50 border border-rose-200 p-5 space-y-2">
              <h2 className="font-medium text-rose-900">Direkte Beziehung</h2>
              {direct.map(r => <p key={r.id} className="text-sm text-rose-950">{r.explanation}</p>)}
            </section>
          )}

          <section>
            <h2 className="font-medium text-slate-800 mb-3">Der Weg dazwischen</h2>
            {path === null && <p className="text-sm text-slate-500">Noch keine Verbindung in der Landkarte – ein guter Kandidat für den Assistenten.</p>}
            {path && path.length > 0 && (
              <ol className="space-y-1">
                <li className="rounded-xl bg-white border border-slate-200 px-4 py-3 font-medium text-slate-800">{path[0].from.title}</li>
                {path.map((s, i) => (
                  <li key={i} className="space-y-1">
                    <div className="flex items-start gap-3 pl-4 py-1">
                      <ArrowDown size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="text-sm"><span className="font-medium text-sky-700">{s.label}</span><span className="text-slate-500"> – {s.relation.explanation}</span></div>
                    </div>
                    <button onClick={() => openTopic(s.to.id)} className="flex items-center gap-2 w-full text-left rounded-xl bg-white border border-slate-200 px-4 py-3 font-medium text-slate-800 hover:shadow-sm"><span className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_BY_ID[s.to.category].color }} />{s.to.title}</button>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <button
            onClick={() => askAssistant(`Wie hängen "${ta.title}" und "${tb.title}" zusammen und worin unterscheiden sie sich? Erkläre die Verbindung Schritt für Schritt und mit einem konkreten Beispiel.`)}
            className="rounded-xl px-5 py-3 bg-amber-400 text-[#0b2540] font-medium flex items-center gap-2 hover:bg-amber-300"
          >
            <Sparkles size={18} />Vom Assistenten erklären lassen
          </button>
        </>
      )}
    </div>
  );
}
