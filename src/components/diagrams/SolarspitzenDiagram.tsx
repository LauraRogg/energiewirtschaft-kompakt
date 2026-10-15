import { useState } from 'react';

// Sonniger Frühlingstag, PV-Anlage 10 kWp, Werte je 30 min (illustrativ)
const N = 48;
const PV = Array.from({ length: N }, (_, i) => {
  const h = i / 2;
  return h < 6 || h > 20 ? 0 : +(8.6 * Math.exp(-((h - 13) ** 2) / 8)).toFixed(1);
});
const KWP = 10;
const CAP = 0.6 * KWP;
const NEG_FROM = 11, NEG_TO = 15.5; // Stunden mit negativem Börsenpreis

const W = 680, H = 260, L = 40, R = 10, T = 16, B = 30;
const x = (i: number) => L + (i / (N - 1)) * (W - L - R);
const y = (v: number) => T + (1 - v / 10) * (H - T - B);

type Mode = 'alt' | 'neu';

export default function SolarspitzenDiagram() {
  const [mode, setMode] = useState<Mode>('neu');
  const fed = PV.map(v => (mode === 'neu' ? Math.min(v, CAP) : v));
  const area = (vals: number[]) => `M${x(0)},${y(0)} ` + vals.map((v, i) => `L${x(i)},${y(v)}`).join(' ') + ` L${x(N - 1)},${y(0)} Z`;
  const capped = PV.reduce((s, v) => s + Math.max(0, v - CAP), 0) / 2;
  const total = PV.reduce((s, v) => s + v, 0) / 2;

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-sm">
        <button onClick={() => setMode('alt')} className={`px-3 py-1.5 ${mode === 'alt' ? 'bg-[#0b2540] text-white' : 'bg-white text-slate-700'}`}>Ohne Begrenzung</button>
        <button onClick={() => setMode('neu')} className={`px-3 py-1.5 ${mode === 'neu' ? 'bg-[#0b2540] text-white' : 'bg-white text-slate-700'}`}>Neue Anlage ohne iMSys/Steuerung</button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="PV-Einspeisung mit 60-Prozent-Begrenzung">
        {[0, 2.5, 5, 7.5, 10].map(v => (
          <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#eef2f7" /><text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v} kW</text></g>
        ))}
        {[0, 6, 12, 18, 24].map(h => <text key={h} x={x(Math.min(h * 2, N - 1))} y={H - 10} textAnchor={h === 24 ? "end" : h === 0 ? "start" : "middle"} fontSize={10} fill="#94a3b8">{h} Uhr</text>)}

        <rect x={x(NEG_FROM * 2)} y={T} width={x(NEG_TO * 2) - x(NEG_FROM * 2)} height={H - T - B} fill="#e87ba4" opacity={0.14} />
        <text x={(x(NEG_FROM * 2) + x(NEG_TO * 2)) / 2} y={T + 12} textAnchor="middle" fontSize={10} fill="#334155">negative Börsenpreise → keine Vergütung</text>

        {mode === 'neu' && <path d={area(PV)} fill="#eda100" opacity={0.22} />}
        <path d={area(fed)} fill="#eda100" opacity={0.75} />
        {mode === 'neu' && (
          <g>
            <line x1={L} x2={W - R} y1={y(CAP)} y2={y(CAP)} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="5 4" />
            <text x={W - R} y={y(CAP) - 6} textAnchor="end" fontSize={10} fill="#0f172a">60 % von {KWP} kWp = {CAP} kW</text>
          </g>
        )}
      </svg>
      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3"><div className="text-slate-500">Erzeugung des Tages</div><div className="text-xl font-semibold text-slate-900">{total.toLocaleString('de-DE', { maximumFractionDigits: 0 })} kWh</div></div>
        <div className="rounded-xl bg-slate-50 p-3"><div className="text-slate-500">Nicht eingespeist (Kappung)</div><div className="text-xl font-semibold text-slate-900">{mode === 'neu' ? `${capped.toLocaleString('de-DE', { maximumFractionDigits: 1 })} kWh` : '–'}</div></div>
        <div className="rounded-xl bg-slate-50 p-3 text-slate-700">Die Kappung trifft nur die Mittagsspitze. Mit Eigenverbrauch oder Speicher lässt sich der Verlust oft vermeiden – und mit iMSys + Steuerung entfällt die Begrenzung.</div>
      </div>
      <p className="text-xs text-slate-400">Illustrative Werte. Hellere Fläche = Erzeugung, die wegen der 60-%-Regel nicht eingespeist werden darf.</p>
    </div>
  );
}
