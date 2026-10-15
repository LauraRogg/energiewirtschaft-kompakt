import { Suspense, useState } from 'react';
import type { Store } from '../store/useStore';
import { DIAGRAMS } from './diagrams/registry';

export function DiagramFrame({ id, onOpenTopic, compact }: { id: string; onOpenTopic: (id: string) => void; compact?: boolean }) {
  const d = DIAGRAMS.find(x => x.id === id);
  if (!d) return null;
  const C = d.Component;
  return (
    <section className={`rounded-2xl bg-white border border-slate-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="mb-4">
        <h2 className="font-semibold text-slate-900">{d.title}</h2>
        <p className="text-sm text-slate-500">{d.question}</p>
      </div>
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-slate-100" />}>
        <C onOpenTopic={onOpenTopic} />
      </Suspense>
    </section>
  );
}

export default function DiagramsView({ store }: { store: Store }) {
  const [active, setActive] = useState(DIAGRAMS[0].id);
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Schaubilder</h1>
        <p className="text-slate-500 mt-1">Zum Ausprobieren: Regler bewegen, Modi umschalten, Schritte durchklicken.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {DIAGRAMS.map(d => (
          <button key={d.id} onClick={() => setActive(d.id)} className={`text-sm rounded-full px-3 py-1.5 border ${active === d.id ? 'bg-[#0b2540] text-white border-[#0b2540]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>
            {d.title}
          </button>
        ))}
      </div>
      <DiagramFrame id={active} onOpenTopic={store.openTopic} />
    </div>
  );
}
