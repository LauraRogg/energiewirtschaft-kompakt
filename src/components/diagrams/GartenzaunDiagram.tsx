import { useState } from 'react';

interface Device { id: string; label: string; max: number; color: string }

// Beispielhaushalt – Werte sind illustrativ
const DEVICES: Device[] = [
  { id: 'wp', label: 'Wärmepumpe', max: 9, color: '#2a78d6' },
  { id: 'wb', label: 'Wallbox', max: 11, color: '#eb6834' },
  { id: 'sp', label: 'Speicher (laden)', max: 5, color: '#1baf7a' },
];
const HAUSHALT = 1.5;
const MIN_PER_DEVICE = 4.2;
const TOTAL_MAX = DEVICES.reduce((s, d) => s + d.max, 0);

type Mode = 'einzeln' | 'gartenzaun';

/** Verteilt eine Summenvorgabe in Prioritätsreihenfolge auf die Geräte (so wie ein EMS es könnte). */
function distribute(limit: number, order: string[]): Record<string, number> {
  let rest = limit;
  const out: Record<string, number> = {};
  for (const id of order) {
    const d = DEVICES.find(x => x.id === id)!;
    out[id] = Math.max(0, Math.min(d.max, rest));
    rest -= out[id];
  }
  return out;
}

const fmt = (v: number) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 });

export default function GartenzaunDiagram() {
  const [mode, setMode] = useState<Mode>('gartenzaun');
  const [limit, setLimit] = useState(14);
  const [priority, setPriority] = useState<string>('wp');

  const order = [priority, ...DEVICES.map(d => d.id).filter(id => id !== priority)];
  const alloc: Record<string, number> =
    mode === 'einzeln'
      ? Object.fromEntries(DEVICES.map(d => [d.id, Math.min(d.max, MIN_PER_DEVICE)]))
      : distribute(limit, order);
  const sum = DEVICES.reduce((s, d) => s + alloc[d.id], 0);

  // SVG-Geometrie
  const W = 760, H = 330;
  const fenceX = 250;
  const barX = 420, barW = 260, rowH = 54, rowY0 = 92;
  const scale = (kW: number) => (kW / 11) * barW;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-sm">
          <button onClick={() => setMode('einzeln')} className={`px-3 py-1.5 ${mode === 'einzeln' ? 'bg-[#0b2540] text-white' : 'bg-white text-slate-700'}`}>Ohne Gartenzaun: jedes Gerät einzeln</button>
          <button onClick={() => setMode('gartenzaun')} className={`px-3 py-1.5 ${mode === 'gartenzaun' ? 'bg-[#0b2540] text-white' : 'bg-white text-slate-700'}`}>Mit Gartenzaun: Vorgabe am Anschluss</button>
        </div>
      </div>

      {mode === 'gartenzaun' && (
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <label className="block">
            <span className="text-slate-600">Vorgabe des Netzbetreibers am Netzanschluss: <strong className="text-slate-900">{fmt(limit)} kW</strong></span>
            <input type="range" min={MIN_PER_DEVICE} max={TOTAL_MAX} step={0.5} value={limit} onChange={e => setLimit(Number(e.target.value))} className="w-full accent-[#0b2540]" />
          </label>
          <label className="block">
            <span className="text-slate-600">Dein EMS gibt Vorrang für:</span>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-1.5">
              {DEVICES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </label>
        </div>
      )}

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Schaubild Gartenzaunprinzip">
        {/* Netz */}
        <g>
          <rect x={20} y={130} width={110} height={70} rx={10} fill="#f1f5f9" stroke="#cbd5e1" />
          <text x={75} y={160} textAnchor="middle" fontSize={13} fontWeight={600} fill="#0f172a">Ortsnetz</text>
          <text x={75} y={178} textAnchor="middle" fontSize={11} fill="#64748b">Verteilnetzbetreiber</text>
          <line x1={130} y1={165} x2={fenceX} y2={165} stroke="#94a3b8" strokeWidth={3} />
          {mode === 'gartenzaun' ? (
            <g>
              <rect x={142} y={120} width={96} height={30} rx={6} fill="#0b2540" />
              <text x={190} y={140} textAnchor="middle" fontSize={12} fill="#fff" fontWeight={600}>≤ {fmt(limit)} kW</text>
              <text x={190} y={200} textAnchor="middle" fontSize={11} fill="#64748b">eine Vorgabe</text>
              <text x={190} y={214} textAnchor="middle" fontSize={11} fill="#64748b">für den Anschluss</text>
            </g>
          ) : (
            <g>
              <text x={190} y={140} textAnchor="middle" fontSize={11} fill="#64748b">Befehl je Gerät</text>
              <text x={190} y={200} textAnchor="middle" fontSize={11} fill="#64748b">greift einzeln</text>
              <text x={190} y={214} textAnchor="middle" fontSize={11} fill="#64748b">durch den Zaun</text>
            </g>
          )}
        </g>

        {/* Gartenzaun */}
        <g>
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={fenceX - 5} y={40 + i * 19} width={10} height={14} rx={2} fill="#a16207" opacity={0.75} />
          ))}
          <line x1={fenceX - 8} y1={60} x2={fenceX + 8} y2={60} stroke="#a16207" strokeWidth={3} />
          <line x1={fenceX - 8} y1={290} x2={fenceX + 8} y2={290} stroke="#a16207" strokeWidth={3} />
          <text x={fenceX} y={28} textAnchor="middle" fontSize={12} fontWeight={600} fill="#0f172a">Gartenzaun = Netzanschlusspunkt</text>
        </g>

        {/* Haus */}
        <rect x={fenceX + 30} y={50} width={W - fenceX - 50} height={270} rx={14} fill="#fff" stroke="#cbd5e1" />
        <text x={fenceX + 50} y={76} fontSize={12} fill="#64748b">Hinter dem Zaun entscheidet der Kunde</text>

        {/* EMS */}
        <rect x={fenceX + 45} y={140} width={95} height={50} rx={8} fill={mode === 'gartenzaun' ? '#fff7ed' : '#f8fafc'} stroke={mode === 'gartenzaun' ? '#eb6834' : '#cbd5e1'} strokeDasharray={mode === 'gartenzaun' ? undefined : '4 3'} />
        <text x={fenceX + 92} y={162} textAnchor="middle" fontSize={13} fontWeight={600} fill="#0f172a">EMS</text>
        <text x={fenceX + 92} y={178} textAnchor="middle" fontSize={10} fill="#64748b">{mode === 'gartenzaun' ? 'verteilt' : 'nicht beteiligt'}</text>
        <line x1={fenceX} y1={165} x2={fenceX + 45} y2={165} stroke="#94a3b8" strokeWidth={3} />

        {/* Geräte */}
        {DEVICES.map((d, i) => {
          const y = rowY0 + i * rowH;
          const v = alloc[d.id];
          return (
            <g key={d.id}>
              <path d={`M ${fenceX + 140} 165 C ${fenceX + 160} 165, ${barX - 40} ${y + 14}, ${barX - 4} ${y + 14}`} fill="none" stroke="#cbd5e1" strokeWidth={2} />
              <text x={barX} y={y + 2} fontSize={12} fill="#334155">{d.label}</text>
              <rect x={barX} y={y + 8} width={scale(d.max)} height={14} rx={4} fill="#f1f5f9" />
              <rect x={barX} y={y + 8} width={Math.max(0, scale(v))} height={14} rx={4} fill={d.color} />
              <text x={barX + scale(d.max) + 8} y={y + 20} fontSize={12} fill="#0f172a" fontWeight={600}>{fmt(v)} / {fmt(d.max)} kW</text>
            </g>
          );
        })}

        {/* Haushaltsstrom */}
        <g>
          <text x={barX} y={rowY0 + 3 * rowH + 2} fontSize={12} fill="#334155">Haushaltsstrom (Licht, Kochen …)</text>
          <rect x={barX} y={rowY0 + 3 * rowH + 8} width={scale(HAUSHALT)} height={14} rx={4} fill="#94a3b8" />
          <text x={barX + scale(HAUSHALT) + 8} y={rowY0 + 3 * rowH + 20} fontSize={12} fill="#64748b">{fmt(HAUSHALT)} kW · wird nie gesteuert</text>
        </g>
      </svg>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-slate-500">Steuerbare Geräte gesamt</div>
          <div className="text-xl font-semibold text-slate-900">{fmt(sum)} kW</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2 text-slate-700">
          {mode === 'einzeln'
            ? 'Jedes Gerät wird auf 4,2 kW begrenzt – auch wenn eine andere Anlage gar nicht läuft. Der Spielraum im Haus bleibt ungenutzt.'
            : `Der Netzbetreiber kennt nur die Summe am Anschluss. Dein EMS entscheidet: zuerst ${DEVICES.find(d => d.id === priority)!.label}, der Rest bekommt, was übrig bleibt.`}
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Beispielwerte. Der garantierte Mindestwert am Anschluss hängt von der Anzahl der steuerbaren Verbrauchseinrichtungen ab (Gleichzeitigkeitsfaktor laut BNetzA-Festlegung BK6-22-300) – Details dort prüfen.
      </p>
    </div>
  );
}
