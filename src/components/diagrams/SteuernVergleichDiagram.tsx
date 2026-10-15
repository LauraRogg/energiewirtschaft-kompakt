import { useMemo, useState } from 'react';

type Mode = 'ohne' | 'praeventiv' | 'netzorientiert';

// Illustrative Auslastung eines Ortsnetztrafos an einem Winterwerktag (in % der Kapazität), 15-min-Raster
const LOAD: number[] = Array.from({ length: 96 }, (_, i) => {
  const h = i / 4;
  const base = 38 + 10 * Math.sin(((h - 6) / 24) * 2 * Math.PI);
  const morning = 14 * Math.exp(-((h - 7.5) ** 2) / 1.2);
  const evening = 76 * Math.exp(-((h - 18.6) ** 2) / 1.1); // Wallboxen + Wärmepumpen nach Feierabend
  const night = 10 * Math.exp(-((h - 22.5) ** 2) / 1.5);
  return Math.round(base + morning + evening + night);
});

const LIMIT = 100;
const PRAEV_FROM = 17 * 4, PRAEV_TO = 19 * 4; // festes 2-h-Fenster
const PRAEV_FACTOR = 0.82; // pauschales Dimmen im Fenster

function controlled(mode: Mode): number[] {
  if (mode === 'praeventiv') return LOAD.map((v, i) => (i >= PRAEV_FROM && i < PRAEV_TO ? Math.round(v * PRAEV_FACTOR) : v));
  if (mode === 'netzorientiert') return LOAD.map(v => Math.min(v, LIMIT - 2));
  return LOAD;
}

const W = 720, H = 300, L = 44, R = 12, T = 16, B = 36;
const x = (i: number) => L + (i / 96) * (W - L - R);
const y = (v: number) => T + (1 - v / 130) * (H - T - B);
const line = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
const time = (i: number) => `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`;

const TEXT: Record<Mode, { title: string; body: string }> = {
  ohne: { title: 'Ohne Steuerung', body: 'Am Abend laden Wallboxen und Wärmepumpen gleichzeitig – der Trafo wird kurz über seine Kapazität belastet.' },
  praeventiv: { title: 'Präventives Steuern (Übergang)', body: 'Der Netzbetreiber dimmt vorsorglich in einem festen Zeitfenster (hier 17–19 Uhr, max. 2 h/Tag). Ein Teil der Spitze liegt außerhalb des Fensters, und im Fenster wird auch gedimmt, wo es nicht nötig wäre.' },
  netzorientiert: { title: 'Netzorientiertes Steuern (Ziel)', body: 'Gedimmt wird nur, wenn die Netzzustandsermittlung eine Überlastung zeigt – genau so lange und so stark wie nötig. Dafür braucht es Messdaten aus dem Netz.' },
};

export default function SteuernVergleichDiagram() {
  const [mode, setMode] = useState<Mode>('praeventiv');
  const [hover, setHover] = useState<number | null>(null);
  const ctrl = useMemo(() => controlled(mode), [mode]);

  const dimmedIdx = ctrl.map((v, i) => (v < LOAD[i] ? i : -1)).filter(i => i >= 0);
  const overIdx = ctrl.map((v, i) => (v > LIMIT ? i : -1)).filter(i => i >= 0);

  const spans = (idx: number[]) => {
    const out: [number, number][] = [];
    idx.forEach(i => {
      const last = out[out.length - 1];
      if (last && last[1] === i) last[1] = i + 1; else out.push([i, i + 1]);
    });
    return out;
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-sm">
        {(['ohne', 'praeventiv', 'netzorientiert'] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 ${mode === m ? 'bg-[#0b2540] text-white' : 'bg-white text-slate-700'}`}>{TEXT[m].title.split(' (')[0]}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-dashed border-slate-400" />Last ohne Steuerung</span>
        {mode !== 'ohne' && <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-[#2a78d6]" />Last mit Steuerung</span>}
        <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-[#e34948]" />Kapazität Trafo (dick = überlastet)</span>
        {mode !== 'ohne' && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#2a78d6]/15" />Zeit mit Dimmung</span>}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Tageslastkurve mit Steuerungseingriffen"
        onMouseLeave={() => setHover(null)}
        onMouseMove={e => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - L) / (W - L - R)) * 96);
          setHover(i >= 0 && i < 96 ? i : null);
        }}>
        {[0, 25, 50, 75, 100, 125].map(v => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#eef2f7" />
            <text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v} %</text>
          </g>
        ))}
        {[0, 6, 12, 18, 24].map(h => (
          <text key={h} x={x(Math.min(h * 4, 95))} y={H - 14} textAnchor={h === 24 ? 'end' : h === 0 ? 'start' : 'middle'} fontSize={10} fill="#94a3b8">{h} Uhr</text>
        ))}

        {mode === 'praeventiv' && (
          <g>
            <rect x={x(PRAEV_FROM)} y={T} width={x(PRAEV_TO) - x(PRAEV_FROM)} height={H - T - B} fill="#2a78d6" opacity={0.12} />
            <text x={(x(PRAEV_FROM) + x(PRAEV_TO)) / 2} y={T + 12} textAnchor="middle" fontSize={10} fill="#334155">festes Fenster</text>
          </g>
        )}
        {mode === 'netzorientiert' && spans(dimmedIdx).map(([a, b]) => (
          <rect key={a} x={x(a)} y={T} width={x(b) - x(a)} height={H - T - B} fill="#2a78d6" opacity={0.12} />
        ))}
        <line x1={L} x2={W - R} y1={y(LIMIT)} y2={y(LIMIT)} stroke="#e34948" strokeWidth={2} />
        {spans(overIdx).map(([a, b]) => (
          <line key={`o${a}`} x1={x(a)} x2={x(Math.min(b, 95))} y1={y(LIMIT)} y2={y(LIMIT)} stroke="#e34948" strokeWidth={7} strokeLinecap="round" />
        ))}

        <text x={W - R} y={y(LIMIT) - 6} textAnchor="end" fontSize={10} fill="#334155">Kapazität 100 %</text>
        <path d={line(LOAD)} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 4" />
        {mode !== 'ohne' && <path d={line(ctrl)} fill="none" stroke="#2a78d6" strokeWidth={2} />}

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="#94a3b8" />
            <circle cx={x(hover)} cy={y(ctrl[hover])} r={4} fill="#2a78d6" stroke="#fff" strokeWidth={2} />
            <g transform={`translate(${Math.min(x(hover) + 10, W - 170)}, ${T + 10})`}>
              <rect width={160} height={mode === 'ohne' ? 40 : 56} rx={6} fill="#0f172a" opacity={0.92} />
              <text x={10} y={17} fontSize={11} fill="#fff" fontWeight={600}>{time(hover)} Uhr</text>
              <text x={10} y={33} fontSize={11} fill="#cbd5e1">ohne Steuerung: {LOAD[hover]} %</text>
              {mode !== 'ohne' && <text x={10} y={48} fontSize={11} fill="#cbd5e1">mit Steuerung: {ctrl[hover]} %</text>}
            </g>
          </g>
        )}
      </svg>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-slate-500">Minuten mit Dimmung</div>
          <div className="text-xl font-semibold text-slate-900">{dimmedIdx.length * 15}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-slate-500">Minuten über Kapazität</div>
          <div className={`text-xl font-semibold ${overIdx.length ? 'text-red-700' : 'text-slate-900'}`}>{overIdx.length * 15}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
          <div className="font-medium text-slate-900">{TEXT[mode].title}</div>
          {TEXT[mode].body}
        </div>
      </div>
      <p className="text-xs text-slate-400">Vereinfachte Beispielkurve zur Veranschaulichung, keine Messdaten.</p>
    </div>
  );
}
