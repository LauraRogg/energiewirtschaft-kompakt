import { useState } from 'react';
import { Flag, Gavel } from 'lucide-react';
import type { Store } from '../store/useStore';
import { MILESTONES } from '../data/milestones';
import { CATEGORY_BY_ID } from '../data/categories';

const START = Date.parse('2021-01-01');
const END = Date.parse('2031-06-30');
const TODAY = Date.parse('2026-10-15');
const AXIS = 122;
const pos = (d: string | number) => ((typeof d === 'number' ? d : Date.parse(d)) - START) / (END - START);
const fmt = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function TimelineView({ store }: { store: Store }) {
  const { kb, openTopic } = store;
  const [active, setActive] = useState<number | null>(null);
  const sorted = [...MILESTONES].sort((a, b) => a.date.localeCompare(b.date));
  const years = Array.from({ length: 11 }, (_, i) => 2021 + i);
  // Beschriftungen auf 4 Zeilen (2 oben, 2 unten) verteilen, damit sich nahe Termine nicht überlappen
  const lastInRow = [-1, -1, -1, -1];
  const rows = sorted.map(m => {
    const p = pos(m.date);
    const pref = [0, 2, 1, 3];
    const row = pref.find(r => p - lastInRow[r] > 0.13) ?? pref.reduce((a, r) => (lastInRow[r] < lastInRow[a] ? r : a), 0);
    lastInRow[row] = p;
    return { m, row };
  });
  const topicOf = (id: string) => kb.topics.find(t => t.id === id);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Zeitstrahl</h1>
        <p className="text-slate-500 mt-1">Was gilt seit wann – und welche Fristen kommen noch? Neue Themen lassen sich so auch zeitlich einordnen.</p>
      </div>

      {/* Horizontaler Überblick */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
        <div className="relative min-w-[760px] h-64">
          <div className="absolute left-0 right-0 h-1 rounded bg-slate-200" style={{ top: AXIS }} />
          <div className="absolute h-1 rounded bg-[#0b2540]" style={{ top: AXIS, left: 0, width: `${pos(TODAY) * 100}%` }} />
          {years.map(y => (
            <div key={y} className="absolute -translate-x-1/2 text-[10px] text-slate-400 bg-white px-1" style={{ top: AXIS + 8, left: `${pos(`${y}-01-01`) * 100}%` }}>{y}</div>
          ))}
          <div className="absolute -translate-x-1/2 text-[10px] font-semibold text-white bg-[#0b2540] rounded px-1.5 py-0.5" style={{ top: AXIS - 22, left: `${pos(TODAY) * 100}%` }}>heute</div>
          {rows.map(({ m, row }, i) => {
            const color = CATEGORY_BY_ID[topicOf(m.topic)?.category ?? 'recht'].color;
            const above = row < 2;
            const labelTop = above ? row * 52 : AXIS + 28 + (row - 2) * 52;
            return (
              <button
                key={m.date + m.title}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => openTopic(m.topic)}
                className="absolute -translate-x-1/2 w-28 h-full top-0 group"
                style={{ left: `${pos(m.date) * 100}%` }}
              >
                <span className="absolute left-1/2 w-px bg-slate-300" style={above ? { top: labelTop + 34, height: AXIS - labelTop - 34 } : { top: AXIS + 8, height: labelTop - AXIS - 8 }} />
                <span className={`absolute left-0 right-0 text-[11px] leading-tight text-center ${active === i ? 'text-slate-900 font-medium' : 'text-slate-600'}`} style={{ top: labelTop }}>{m.title}</span>
                <span className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow ${m.kind === 'frist' ? 'ring-2 ring-offset-1 ring-slate-300' : ''}`} style={{ top: AXIS - 6, background: color, transform: active === i ? 'scale(1.3)' : undefined }} />
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 text-xs text-slate-500 mt-6">
          <span className="flex items-center gap-1.5"><Gavel size={13} />Punkt = gilt ab / in Kraft</span>
          <span className="flex items-center gap-1.5"><Flag size={13} />Punkt mit Ring = Frist / Zielmarke</span>
          <span>Farbe = Ebene des Themas</span>
        </div>
      </div>

      {/* Detailliste */}
      <ol className="relative border-l-2 border-slate-200 ml-3 space-y-4">
        {sorted.map((m, i) => {
          const t = topicOf(m.topic);
          const future = Date.parse(m.date) > TODAY;
          return (
            <li key={m.date + m.title} className="ml-6" onMouseEnter={() => setActive(i)}>
              <span className="absolute -left-[9px] w-4 h-4 rounded-full border-2 border-white" style={{ background: CATEGORY_BY_ID[t?.category ?? 'recht'].color, marginTop: 4 }} />
              <div className={`rounded-xl border p-4 ${active === i ? 'border-slate-400 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-slate-800">{fmt(m.date)}</span>
                  <span className={`rounded-full px-2 py-0.5 ${future ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{m.kind === 'frist' ? (future ? 'kommende Frist' : 'Frist') : 'in Kraft'}</span>
                </div>
                <div className="font-medium text-slate-900 mt-1">{m.title}</div>
                <p className="text-sm text-slate-600">{m.text}</p>
                {t && <button onClick={() => openTopic(t.id)} className="text-sm text-sky-700 hover:underline mt-1">→ {t.title}</button>}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-slate-400">Stand Herbst 2026. Fristen und Zielmarken vor Prüfungen oder beruflicher Verwendung gegen Gesetzestext bzw. BNetzA-Festlegung prüfen.</p>
    </div>
  );
}
