import { useState } from 'react';
import { Sparkles, ArrowRight, Network, GitCompare } from 'lucide-react';
import type { Store } from '../store/useStore';
import { CATEGORIES } from '../data/categories';
import { StatusBadge } from './Badges';

const EXAMPLES = [
  'Wie hängen CLS, GWA und § 14a zusammen?',
  'Was ist der Unterschied zwischen präventivem und netzorientiertem Steuern?',
  'Erklär mir das Gartenzaunprinzip an einem Beispielhaushalt.',
  'Wie passt Energy Sharing ins Big Picture?',
];

export default function Dashboard({ store }: { store: Store }) {
  const { kb, openTopic, askAssistant, setView } = store;
  const [q, setQ] = useState('');
  const current = kb.topics.filter(t => t.status === 'neu' || t.status === 'in-umsetzung' || t.status === 'auslaufend');

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-[#0b2540] to-[#16426e] text-white p-8 md:p-10 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-semibold">Was möchtest du heute einordnen?</h1>
        <p className="text-slate-300 mt-2 max-w-2xl">
          Neues Gesetz, neuer Begriff, neue Festlegung? Gib es ein – der Assistent erklärt, wo es im Big Picture liegt, womit es zusammenhängt und worin es sich von Bekanntem unterscheidet.
        </p>
        <form className="mt-6 flex gap-2" onSubmit={e => { e.preventDefault(); if (q.trim()) askAssistant(q.trim()); }}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="z. B. „Was bedeutet die neue BNetzA-Festlegung zu … für § 14a?“"
            className="flex-1 rounded-xl px-4 py-3 text-slate-800 bg-white placeholder:text-slate-400"
          />
          <button className="rounded-xl px-5 bg-amber-400 text-[#0b2540] font-medium flex items-center gap-2 hover:bg-amber-300">
            <Sparkles size={18} /><span className="hidden sm:inline">Einordnen</span>
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map(e => (
            <button key={e} onClick={() => askAssistant(e)} className="text-xs rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20">{e}</button>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <button onClick={() => setView('bigpicture')} className="text-left rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <Network className="text-sky-600" />
          <div className="mt-3 font-medium text-slate-800">Big Picture ansehen</div>
          <div className="text-sm text-slate-500">{kb.topics.length} Themen, {kb.relations.length} Verbindungen</div>
        </button>
        <button onClick={() => setView('vergleich')} className="text-left rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <GitCompare className="text-rose-600" />
          <div className="mt-3 font-medium text-slate-800">Zusammenhänge finden</div>
          <div className="text-sm text-slate-500">Zwei Themen wählen – Weg und Unterschied sehen</div>
        </button>
        <button onClick={() => askAssistant('')} className="text-left rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-md transition-shadow">
          <Sparkles className="text-amber-500" />
          <div className="mt-3 font-medium text-slate-800">Mit dem Assistenten sprechen</div>
          <div className="text-sm text-slate-500">Fragen, vertiefen, neue Themen eintragen</div>
        </button>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Die Ebenen der Energiewirtschaft</h2>
        <p className="text-sm text-slate-500 mb-4">Jedes Thema liegt auf einer Ebene. Neues lässt sich leichter verstehen, wenn klar ist, auf welcher es liegt.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {CATEGORIES.map(c => {
            const topics = kb.topics.filter(t => t.category === c.id);
            return (
              <div key={c.id} className="rounded-2xl bg-white border border-slate-200 p-5" style={{ borderTop: `4px solid ${c.color}` }}>
                <div className="font-medium text-slate-800">{c.label}</div>
                <div className="text-sm text-slate-500 mb-3">{c.description}</div>
                <div className="flex flex-wrap gap-2">
                  {topics.map(t => (
                    <button key={t.id} onClick={() => openTopic(t.id)} className="text-xs rounded-full px-3 py-1 border hover:shadow-sm" style={{ borderColor: `${c.color}55`, color: c.color }}>
                      {t.short ?? t.title}
                    </button>
                  ))}
                  {topics.length === 0 && <span className="text-xs text-slate-400">Noch keine Themen</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {current.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Gerade in Bewegung</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {current.map(t => (
              <button key={t.id} onClick={() => openTopic(t.id)} className="text-left rounded-xl bg-white border border-slate-200 p-4 hover:shadow-md transition-shadow flex gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-800">{t.title}</span>
                    <StatusBadge status={t.status} />
                    {t.since && <span className="text-xs text-slate-400">seit {t.since}</span>}
                  </div>
                  <div className="text-sm text-slate-500 mt-1 line-clamp-2">{t.summary}</div>
                </div>
                <ArrowRight size={16} className="text-slate-300 mt-1" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
