import { useMemo, useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import type { Store } from '../store/useStore';
import { LAWS, OVERLAPS, PARAGRAPHS, type LawId } from '../data/paragraphs';

/** Mengendiagramm: drei Gesetze und wo sie zusammenwirken */
function LawVenn({ onOpenTopic, active, setActive }: { onOpenTopic: (id: string) => void; active: LawId | null; setActive: (l: LawId | null) => void }) {
  const C = { enwg: { x: 230, y: 150 }, msbg: { x: 390, y: 150 }, eeg: { x: 310, y: 285 } };
  const R = 125;
  const label = (id: LawId, x: number, y: number) => {
    const l = LAWS.find(l => l.id === id)!;
    return (
      <g style={{ cursor: 'pointer' }} onClick={() => setActive(active === id ? null : id)}>
        <text x={x} y={y} textAnchor="middle" fontSize={17} fontWeight={700} fill="#0f172a">{l.short}</text>
        <text x={x} y={y + 17} textAnchor="middle" fontSize={11} fill="#475569">{id === 'enwg' ? 'Netze & Markt' : id === 'msbg' ? 'Messen & Daten' : 'Erneuerbare'}</text>
      </g>
    );
  };
  const item = (text: string, topic: string, x: number, y: number) => (
    <g style={{ cursor: 'pointer' }} onClick={() => onOpenTopic(topic)}>
      <rect x={x - 62} y={y - 13} width={124} height={22} rx={11} fill="#fff" stroke="#cbd5e1" />
      <text x={x} y={y + 2} textAnchor="middle" fontSize={11} fill="#0f172a">{text}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 620 430" className="w-full h-auto max-w-2xl mx-auto" role="img" aria-label="Überschneidungen von EnWG, MsbG und EEG">
      {(Object.keys(C) as LawId[]).map(id => {
        const l = LAWS.find(x => x.id === id)!;
        const dim = active && active !== id;
        return <circle key={id} cx={C[id].x} cy={C[id].y} r={R} fill={l.color} fillOpacity={dim ? 0.05 : 0.16} stroke={l.color} strokeWidth={2} strokeOpacity={dim ? 0.3 : 1} />;
      })}
      {label('enwg', 160, 110)}
      {label('msbg', 460, 110)}
      {label('eeg', 310, 360)}
      {item('§ 14a-Steuerung', 'par14a', 310, 112)}
      {item('Dynamischer Tarif', 'dyntarif', 310, 140)}
      {item('Solarspitzengesetz', 'solarspitzen', 310, 205)}
      {item('Mieterstrom', 'mieterstrom', 205, 255)}
      {item('Direktvermarktung', 'direktvermarktung', 415, 255)}
    </svg>
  );
}

export default function LawsView({ store }: { store: Store }) {
  const { openTopic } = store;
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<LawId | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return PARAGRAPHS.filter(p => !q || `${p.nr} ${p.title} ${p.text}`.toLowerCase().includes(q));
  }, [query]);

  const laws = active ? LAWS.filter(l => l.id === active) : LAWS;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">EnWG · MsbG · EEG</h1>
        <p className="text-slate-500 mt-1">Drei Gesetze, drei Blickwinkel. Wer die Leitfrage jedes Gesetzes kennt, weiß, wo eine Neuerung hingehört.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {LAWS.map(l => (
          <button key={l.id} onClick={() => setActive(active === l.id ? null : l.id)} className={`text-left rounded-2xl bg-white border p-5 transition-shadow hover:shadow-md ${active === l.id ? 'border-slate-800 shadow-md' : 'border-slate-200'}`} style={{ borderTop: `5px solid ${l.color}` }}>
            <div className="text-xs text-slate-500">{l.title}</div>
            <div className="text-xl font-semibold text-slate-900">{l.short}</div>
            <div className="mt-2 text-sm font-medium text-slate-800">„{l.question}“</div>
            <p className="mt-2 text-sm text-slate-600">{l.scope}</p>
          </button>
        ))}
      </div>

      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900">Wo greifen die Gesetze ineinander?</h2>
        <p className="text-sm text-slate-500 mb-2">Themen in den Überschneidungen werden von mehreren Gesetzen geregelt. Klick öffnet das Thema.</p>
        <LawVenn onOpenTopic={openTopic} active={active} setActive={setActive} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {OVERLAPS.map(o => (
            <button key={o.title} onClick={() => openTopic(o.topic)} className="text-left rounded-xl bg-slate-50 p-3 hover:bg-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 text-sm">{o.title}</span>
                <span className="flex gap-1">{o.laws.map(id => <span key={id} className="w-2.5 h-2.5 rounded-full" style={{ background: LAWS.find(l => l.id === id)!.color }} title={LAWS.find(l => l.id === id)!.short} />)}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{o.text}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <h2 className="font-semibold text-slate-900 mr-auto">Paragrafen-Landkarte</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="z. B. Anschluss, 14a, Daten …" className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm w-64" />
          </div>
        </div>
        <div className={`grid gap-4 ${laws.length === 1 ? '' : 'lg:grid-cols-3'}`}>
          {laws.map(l => {
            const ps = filtered.filter(p => p.law === l.id);
            const groups = [...new Set(ps.map(p => p.group))];
            return (
              <div key={l.id} className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-2 border-b border-slate-100">
                  <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                  <span className="font-semibold text-slate-900">{l.short}</span>
                  <span className="text-xs text-slate-500">{ps.length} Einträge</span>
                </div>
                <div className="p-4 space-y-4">
                  {groups.map(g => (
                    <div key={g}>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1.5">{g}</div>
                      <div className="space-y-1.5">
                        {ps.filter(p => p.group === g).map(p => (
                          <div key={p.nr + p.title} className={`rounded-lg p-2.5 ${p.topic ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer' : 'bg-slate-50'}`} onClick={() => p.topic && openTopic(p.topic)}>
                            <div className="flex items-baseline gap-2">
                              <span className="font-mono text-xs font-semibold text-slate-900 shrink-0">{p.nr}</span>
                              <span className="text-sm font-medium text-slate-800">{p.title}</span>
                              {p.pruefen && <span title="Paragraphennummer bzw. Inhalt vor Verwendung am aktuellen Gesetzestext prüfen" className="ml-auto shrink-0 text-amber-600"><AlertTriangle size={13} /></span>}
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{p.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {ps.length === 0 && <p className="text-sm text-slate-400">Keine Treffer.</p>}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-amber-600" />
          = Paragraphennummer bzw. Zuordnung vor Prüfung oder beruflicher Verwendung am aktuellen Gesetzestext (gesetze-im-internet.de) prüfen. Auswahl, kein vollständiges Inhaltsverzeichnis. Stand Herbst 2026.
        </p>
      </section>
    </div>
  );
}
