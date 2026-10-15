import { useState } from 'react';

// Beispiel-Zeitfenster für Modul 3 – jeder Netzbetreiber legt eigene Fenster fest
type Stufe = 'niedrig' | 'standard' | 'hoch';
const FENSTER: Stufe[] = Array.from({ length: 24 }, (_, h) =>
  h < 6 ? 'niedrig' : h >= 17 && h < 20 ? 'hoch' : h >= 22 ? 'niedrig' : 'standard',
);
// Ordinale Abstufung einer Farbfamilie: hell = günstig, dunkel = teuer
const FARBE: Record<Stufe, string> = { niedrig: '#86b6ef', standard: '#2a78d6', hoch: '#104281' };
const LABEL: Record<Stufe, string> = { niedrig: 'Niedrigtarif', standard: 'Standardtarif', hoch: 'Hochtarif' };

const MODULE = [
  { id: 1, title: 'Modul 1', subtitle: 'Pauschale Reduzierung', text: 'Fester jährlicher Rabatt auf das Netzentgelt – unabhängig vom Verbrauch. Kein separater Zähler nötig.', need: 'Standard' },
  { id: 2, title: 'Modul 2', subtitle: '60 % weniger Arbeitspreis', text: 'Der Arbeitspreis für die steuerbare Anlage sinkt um 60 %. Lohnt sich bei hohem Verbrauch der Anlage.', need: 'separater Zählpunkt für die SteuVE' },
  { id: 3, title: 'Modul 3', subtitle: 'Zeitvariables Netzentgelt', text: 'Zusätzlich zu Modul 1 wählbar (seit 01.04.2025): Netzentgelt je nach Tageszeit niedrig, standard oder hoch.', need: 'intelligentes Messsystem' },
];

export default function NetzentgeltModuleDiagram() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-3 gap-3">
        {MODULE.map(m => (
          <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#0b2540] text-white text-sm flex items-center justify-center font-semibold">{m.id}</span>
              <div>
                <div className="font-semibold text-slate-900 leading-tight">{m.title}</div>
                <div className="text-xs text-slate-500">{m.subtitle}</div>
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3">{m.text}</p>
            <div className="text-xs text-slate-500 mt-3">Voraussetzung: <span className="text-slate-800">{m.need}</span></div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-sm font-medium text-slate-800 mb-2">Modul 3 – ein Beispieltag</div>
        <div className="flex gap-[2px]" onMouseLeave={() => setHover(null)}>
          {FENSTER.map((s, h) => (
            <div key={h} onMouseEnter={() => setHover(h)} className="flex-1 h-10 first:rounded-l-md last:rounded-r-md cursor-default" style={{ background: FARBE[s], opacity: hover === null || hover === h ? 1 : 0.6 }} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>0 Uhr</span><span>6</span><span>12</span><span>18</span><span>24 Uhr</span></div>
        <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2 items-center">
          {(Object.keys(FARBE) as Stufe[]).map(s => <span key={s} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: FARBE[s] }} />{LABEL[s]}</span>)}
          <span className="text-slate-800 font-medium ml-auto">{hover !== null ? `${hover}–${hover + 1} Uhr: ${LABEL[FENSTER[hover]]}` : 'Über die Stunden fahren für Details'}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Beispielhafte Zeitfenster. Jeder Netzbetreiber legt seine Fenster und Preise selbst fest und veröffentlicht sie.</p>
      </div>
    </div>
  );
}
