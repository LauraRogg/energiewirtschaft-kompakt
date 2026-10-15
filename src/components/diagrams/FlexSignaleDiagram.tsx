import { useState } from 'react';
import type { DiagramProps } from './registry';

// Illustrativer windiger Wintertag: Börsenpreis (ct/kWh) und Ortsnetzlast (% Kapazität) je Stunde
const PREIS = [9, 8, 7, 7, 7, 8, 11, 14, 13, 12, 10, 9, 9, 10, 11, 13, 16, 19, 18, 14, 10, 6, 4, 3];
const LAST_OHNE = [40, 37, 35, 34, 35, 40, 52, 60, 55, 50, 48, 47, 46, 47, 49, 55, 66, 82, 88, 80, 68, 58, 50, 44];
// Viele E-Autos reagieren gleichzeitig auf den günstigen Preis ab 21 Uhr
const EV_ZUSATZ: Record<number, number> = { 21: 38, 22: 52, 23: 44 };
const LAST_MIT = LAST_OHNE.map((v, h) => v + (EV_ZUSATZ[h] ?? 0));

const GRUPPEN = [
  { title: 'netzdienlich', text: 'entlastet das Netz vor Ort', items: [['§ 14a', 'par14a'], ['§ 14c', 'par14c'], ['Redispatch 2.0', 'redispatch'], ['zeitvar. Netzentgelt', 'zvne']] },
  { title: 'marktdienlich', text: 'reagiert auf Preise, senkt Kosten', items: [['Dynamischer Tarif', 'dyntarif'], ['Negative Preise', 'negpreise']] },
  { title: 'systemdienlich', text: 'stabilisiert das Gesamtsystem', items: [['Regelenergie', ''], ['Frequenzhaltung', '']] },
] as const;

const W = 680, Hc = 150, L = 44, R = 10, T = 14, B = 24;
const x = (h: number) => L + (h / 23) * (W - L - R);

function Chart({ vals, max, unit, color, title, hover, setHover, ref2, limit }: {
  vals: number[]; max: number; unit: string; color: string; title: string;
  hover: number | null; setHover: (h: number | null) => void; ref2?: number[]; limit?: number;
}) {
  const y = (v: number) => T + (1 - v / max) * (Hc - T - B);
  const path = (a: number[]) => a.map((v, h) => `${h ? 'L' : 'M'}${x(h)},${y(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${Hc}`} className="w-full h-auto" role="img" aria-label={title}
      onMouseLeave={() => setHover(null)}
      onMouseMove={e => {
        const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
        const h = Math.round((((e.clientX - r.left) / r.width) * W - L) / (W - L - R) * 23);
        setHover(h >= 0 && h <= 23 ? h : null);
      }}>
      <text x={L} y={10} fontSize={11} fontWeight={600} fill="#0f172a">{title}</text>
      {[0, max / 2, max].map(v => (
        <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#eef2f7" /><text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}{unit}</text></g>
      ))}
      {[0, 6, 12, 18, 23].map(h => <text key={h} x={x(h)} y={Hc - 6} textAnchor={h === 23 ? "end" : h === 0 ? "start" : "middle"} fontSize={10} fill="#94a3b8">{h} Uhr</text>)}
      {limit !== undefined && <line x1={L} x2={W - R} y1={y(limit)} y2={y(limit)} stroke="#e34948" strokeWidth={2} />}
      {ref2 && <path d={path(ref2)} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 4" />}
      <path d={path(vals)} fill="none" stroke={color} strokeWidth={2} />
      {hover !== null && (
        <g pointerEvents="none">
          <line x1={x(hover)} x2={x(hover)} y1={T} y2={Hc - B} stroke="#94a3b8" />
          <circle cx={x(hover)} cy={y(vals[hover])} r={4} fill={color} stroke="#fff" strokeWidth={2} />
          <text x={Math.min(x(hover) + 8, W - 80)} y={y(vals[hover]) - 8} fontSize={11} fontWeight={600} fill="#0f172a">{vals[hover]}{unit}</text>
        </g>
      )}
    </svg>
  );
}

export default function FlexSignaleDiagram({ onOpenTopic }: DiagramProps) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-3 gap-3">
        {GRUPPEN.map(g => (
          <div key={g.title} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-900">{g.title}</div>
            <div className="text-xs text-slate-500">{g.text}</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {g.items.map(([label, id]) => id
                ? <button key={label} onClick={() => onOpenTopic?.(id)} className="text-xs rounded-full px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200">{label}</button>
                : <span key={label} className="text-xs rounded-full px-2.5 py-1 border border-dashed border-slate-300 text-slate-500">{label}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        <div className="text-sm font-medium text-slate-800">Wenn sich Signale widersprechen</div>
        <p className="text-sm text-slate-600">Abends weht viel Wind, der Börsenpreis fällt. Mit dynamischem Tarif starten viele Wallboxen gleichzeitig um 21 Uhr – markt-, aber nicht netzdienlich.</p>
        <Chart vals={PREIS} max={20} unit=" ct" color="#e87ba4" title="Börsenpreis (Signal für den dynamischen Tarif)" hover={hover} setHover={setHover} />
        <Chart vals={LAST_MIT} ref2={LAST_OHNE} limit={100} max={120} unit=" %" color="#2a78d6" title="Auslastung Ortsnetztrafo" hover={hover} setHover={setHover} />
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-dashed border-slate-400" />Last ohne Reaktion auf Preis</span>
          <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-[#2a78d6]" />Last mit vielen dynamischen Tarifen</span>
          <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-[#e34948]" />Kapazität</span>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-950">
          <strong>Auflösung:</strong> Bei Konflikt hat die Netzsicherheit Vorrang – der Netzbetreiber dimmt nach § 14a. Ein EMS kann beide Signale zusammenführen und das Laden über die Nacht verteilen.
        </div>
        <p className="text-xs text-slate-400">Illustrative Werte, keine Marktdaten.</p>
      </div>
    </div>
  );
}
