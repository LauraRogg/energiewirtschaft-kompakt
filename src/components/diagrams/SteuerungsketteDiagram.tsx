import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiagramProps } from './registry';

interface Box { id: string; topic?: string; label: string; sub: string; x: number; y: number; w: number }

const BOXES: Box[] = [
  { id: 'vnb', topic: 'vnb', label: 'Netzbetreiber', sub: 'als EMT', x: 20, y: 150, w: 120 },
  { id: 'gwa', topic: 'gwa', label: 'Gateway-Admin.', sub: 'GWA', x: 230, y: 30, w: 130 },
  { id: 'smgw', topic: 'smgw', label: 'Smart-Meter-', sub: 'Gateway (SMGW)', x: 230, y: 150, w: 130 },
  { id: 'mme', topic: 'mme', label: 'Zähler', sub: 'mME', x: 230, y: 270, w: 130 },
  { id: 'steuerbox', topic: 'steuerbox', label: 'Steuerbox', sub: 'CLS-Gerät', x: 440, y: 150, w: 120 },
  { id: 'ems', topic: 'ems', label: 'EMS', sub: 'oder direkt', x: 620, y: 90, w: 110 },
  { id: 'geraet', topic: 'steuve', label: 'Wärmepumpe,', sub: 'Wallbox …', x: 620, y: 210, w: 110 },
];

const STEPS: { title: string; text: string; active: string[]; edges: string[] }[] = [
  { title: 'Freischaltung', text: 'Der Gateway-Administrator konfiguriert das SMGW und schaltet einen CLS-Kanal für den Netzbetreiber frei. Ohne diese Freigabe kommt niemand an die Anlagen.', active: ['gwa', 'smgw'], edges: ['gwa-smgw'] },
  { title: 'Engpass erkannt', text: 'Der Netzbetreiber erkennt über die Netzzustandsermittlung eine drohende Überlastung und sendet eine Leistungsvorgabe – als externer Marktteilnehmer über das Weitverkehrsnetz (WAN).', active: ['vnb', 'smgw'], edges: ['vnb-smgw'] },
  { title: 'Gesicherter Tunnel', text: 'Das SMGW leitet den Befehl nicht selbst um, sondern stellt über den CLS-Kanal einen verschlüsselten Tunnel ins Heimnetz (HAN) bereit.', active: ['smgw', 'steuerbox'], edges: ['smgw-steuerbox'] },
  { title: 'Umsetzung im Haus', text: 'Die Steuerbox übersetzt die Vorgabe: per Relais direkt an die Anlage oder digital (z. B. EEBUS) an das Energiemanagementsystem – Gartenzaunprinzip.', active: ['steuerbox', 'ems', 'geraet'], edges: ['steuerbox-ems', 'steuerbox-geraet', 'ems-geraet'] },
  { title: 'Messung & Nachweis', text: 'Parallel misst der Zähler (mME) über das lokale Messnetz (LMN). Das SMGW liefert die Werte – Grundlage für Abrechnung und Netzzustand.', active: ['mme', 'smgw', 'vnb'], edges: ['mme-smgw', 'vnb-smgw'] },
];

const EDGES: { id: string; from: string; to: string; label?: string; dashed?: boolean; dx?: number; dy?: number }[] = [
  { id: 'vnb-smgw', from: 'vnb', to: 'smgw', label: 'WAN' },
  { id: 'gwa-smgw', from: 'gwa', to: 'smgw', label: 'administriert', dashed: true, dx: 44, dy: 10 },
  { id: 'mme-smgw', from: 'mme', to: 'smgw', label: 'LMN', dx: 20, dy: 10 },
  { id: 'smgw-steuerbox', from: 'smgw', to: 'steuerbox', label: 'CLS-Kanal', dy: 26 },
  { id: 'steuerbox-ems', from: 'steuerbox', to: 'ems', label: 'EEBUS' },
  { id: 'steuerbox-geraet', from: 'steuerbox', to: 'geraet', label: 'Relais' },
  { id: 'ems-geraet', from: 'ems', to: 'geraet' },
];

const H = 50;
const center = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + H / 2 });

/** Punkt auf dem Rand der Box in Richtung (tx, ty) */
function anchor(b: Box, tx: number, ty: number) {
  const c = center(b);
  const dx = tx - c.x, dy = ty - c.y;
  const sx = dx === 0 ? Infinity : (b.w / 2) / Math.abs(dx);
  const sy = dy === 0 ? Infinity : (H / 2) / Math.abs(dy);
  const s = Math.min(sx, sy);
  return { x: c.x + dx * s, y: c.y + dy * s };
}

export default function SteuerungsketteDiagram({ onOpenTopic }: DiagramProps) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const byId = Object.fromEntries(BOXES.map(b => [b.id, b]));

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 750 340" className="w-full h-auto" role="img" aria-label="Steuerungskette über das intelligente Messsystem">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#0b2540" />
          </marker>
        </defs>
        {/* Zonen */}
        <rect x={5} y={10} width={190} height={320} rx={12} fill="#f8fafc" />
        <rect x={210} y={10} width={170} height={320} rx={12} fill="#fffbeb" />
        <rect x={400} y={10} width={345} height={320} rx={12} fill="#f0fdf4" />
        <text x={100} y={315} textAnchor="middle" fontSize={11} fill="#64748b">Außen · Markt & Netz</text>
        <text x={295} y={315} textAnchor="middle" fontSize={11} fill="#64748b">Zählerschrank</text>
        <text x={572} y={315} textAnchor="middle" fontSize={11} fill="#64748b">Im Haus · hinter dem Gartenzaun</text>

        {EDGES.map(e => {
          const a = byId[e.from], b = byId[e.to];
          const ca = center(a), cb = center(b);
          const p1 = anchor(a, cb.x, cb.y), p2 = anchor(b, ca.x, ca.y);
          const on = s.edges.includes(e.id);
          return (
            <g key={e.id}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={on ? '#0b2540' : '#cbd5e1'} strokeWidth={on ? 3 : 2} strokeDasharray={e.dashed ? '6 4' : undefined} markerEnd={on ? 'url(#arr)' : undefined} />
              {e.label && (
                <text x={(p1.x + p2.x) / 2 + (e.dx ?? 0)} y={(p1.y + p2.y) / 2 - 6 + (e.dy ?? 0)} textAnchor="middle" fontSize={10} fill={on ? '#0f172a' : '#94a3b8'} fontWeight={on ? 600 : 400}>{e.label}</text>
              )}
            </g>
          );
        })}

        {BOXES.map(b => {
          const on = s.active.includes(b.id);
          return (
            <g key={b.id} onClick={() => b.topic && onOpenTopic?.(b.topic)} style={{ cursor: b.topic ? 'pointer' : 'default' }}>
              <rect x={b.x} y={b.y} width={b.w} height={H} rx={10} fill={on ? '#0b2540' : '#fff'} stroke={on ? '#0b2540' : '#cbd5e1'} strokeWidth={1.5} />
              <text x={b.x + b.w / 2} y={b.y + 21} textAnchor="middle" fontSize={12} fontWeight={600} fill={on ? '#fff' : '#0f172a'}>{b.label}</text>
              <text x={b.x + b.w / 2} y={b.y + 37} textAnchor="middle" fontSize={11} fill={on ? '#cbd5e1' : '#64748b'}>{b.sub}</text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-start gap-3">
        <button onClick={() => setStep(i => Math.max(0, i - 1))} disabled={step === 0} className="p-2 rounded-lg border border-slate-300 disabled:opacity-30"><ChevronLeft size={16} /></button>
        <div className="flex-1 rounded-xl bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Schritt {step + 1} von {STEPS.length}</div>
          <div className="font-medium text-slate-900">{s.title}</div>
          <p className="text-sm text-slate-700 mt-1">{s.text}</p>
        </div>
        <button onClick={() => setStep(i => Math.min(STEPS.length - 1, i + 1))} disabled={step === STEPS.length - 1} className="p-2 rounded-lg border border-slate-300 disabled:opacity-30"><ChevronRight size={16} /></button>
      </div>
      <div className="flex gap-1.5 justify-center">
        {STEPS.map((_, i) => <button key={i} onClick={() => setStep(i)} aria-label={`Schritt ${i + 1}`} className={`w-2.5 h-2.5 rounded-full ${i === step ? 'bg-[#0b2540]' : 'bg-slate-300'}`} />)}
      </div>
      <p className="text-xs text-slate-400">Tipp: Kästen anklicken, um das jeweilige Thema zu öffnen.</p>
    </div>
  );
}
