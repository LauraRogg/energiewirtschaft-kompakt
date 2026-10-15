import { ArrowRight, ArrowLeft, Plug, PiggyBank, Gauge, ShieldCheck } from 'lucide-react';
import type { DiagramProps } from './registry';

export default function Deal14aDiagram({ onOpenTopic }: DiagramProps) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        <button onClick={() => onOpenTopic?.('vnb')} className="text-left rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500">Netzbetreiber</div>
          <div className="font-semibold text-slate-900 mt-1">gibt dem Kunden …</div>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><Plug size={18} className="text-[#2a78d6] shrink-0" /><span><strong>Anschlussgarantie:</strong> Wärmepumpe & Wallbox dürfen nicht mit Verweis auf Netzengpässe abgelehnt oder verzögert werden.</span></li>
            <li className="flex gap-3"><PiggyBank size={18} className="text-[#2a78d6] shrink-0" /><span><strong>Weniger Netzentgelt:</strong> Modul 1, 2 oder 3.</span></li>
          </ul>
        </button>
        <div className="flex md:flex-col items-center justify-center gap-2 text-slate-400">
          <ArrowRight className="hidden md:block" /><ArrowLeft className="hidden md:block" />
          <span className="text-xs font-medium text-slate-500">Deal</span>
        </div>
        <button onClick={() => onOpenTopic?.('steuve')} className="text-left rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500">Kunde mit SteuVE</div>
          <div className="font-semibold text-slate-900 mt-1">gibt dem Netzbetreiber …</div>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><Gauge size={18} className="text-[#eb6834] shrink-0" /><span><strong>Steuerbarkeit:</strong> Im Engpass darf der Bezug gedimmt werden.</span></li>
            <li className="flex gap-3"><ShieldCheck size={18} className="text-[#eb6834] shrink-0" /><span><strong>Aber nie ganz aus:</strong> Mindestens 4,2 kW bleiben je Anlage garantiert, Haushaltsstrom wird nie gesteuert.</span></li>
          </ul>
        </button>
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-950">
        <strong>Merksatz:</strong> Anschließen statt abwarten – dafür im Notfall kurz dimmen. Netzausbau bleibt Pflicht; die Steuerung überbrückt nur Engpässe.
      </div>
    </div>
  );
}
