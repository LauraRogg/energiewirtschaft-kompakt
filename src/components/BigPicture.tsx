import { useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D, { type ForceGraphMethods } from 'react-force-graph-2d';
import { Search, X, ArrowRight } from 'lucide-react';
import type { Store } from '../store/useStore';
import type { CategoryId } from '../types';
import { CATEGORIES, CATEGORY_BY_ID } from '../data/categories';
import { connectionsOf, matches } from '../utils';
import { CategoryBadge, StatusBadge } from './Badges';

interface GNode { id: string; label: string; color: string; degree: number; x?: number; y?: number }
interface GLink { source: string | GNode; target: string | GNode; label: string }

const endId = (e: string | GNode) => (typeof e === 'string' ? e : e.id);

export default function BigPicture({ store }: { store: Store }) {
  const { kb, openTopic } = store;
  const wrap = useRef<HTMLDivElement>(null);
  const fg = useRef<ForceGraphMethods<GNode, GLink> | undefined>(undefined);
  const fitted = useRef(false);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hidden, setHidden] = useState<Set<CategoryId>>(new Set());
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  const data = useMemo(() => {
    const visible = kb.topics.filter(t => !hidden.has(t.category));
    const ids = new Set(visible.map(t => t.id));
    const links: GLink[] = kb.relations
      .filter(r => ids.has(r.source) && ids.has(r.target))
      .map(r => ({ source: r.source, target: r.target, label: r.type }));
    const degree = new Map<string, number>();
    links.forEach(l => {
      degree.set(endId(l.source), (degree.get(endId(l.source)) ?? 0) + 1);
      degree.set(endId(l.target), (degree.get(endId(l.target)) ?? 0) + 1);
    });
    const nodes: GNode[] = visible.map(t => ({ id: t.id, label: t.short ?? t.title, color: CATEGORY_BY_ID[t.category].color, degree: degree.get(t.id) ?? 0 }));
    return { nodes, links };
  }, [kb, hidden]);

  // Mehr Abstand zwischen den Knoten, damit Beschriftungen lesbar bleiben
  useEffect(() => {
    const g = fg.current;
    if (!g) return;
    g.d3Force('charge')?.strength(-420);
    g.d3Force('link')?.distance(75);
    fitted.current = false;
    g.d3ReheatSimulation();
  }, [data]);

  const focus = hover ?? selected;
  const neighbors = useMemo(() => {
    if (!focus) return null;
    const s = new Set([focus]);
    kb.relations.forEach(r => {
      if (r.source === focus) s.add(r.target);
      if (r.target === focus) s.add(r.source);
    });
    return s;
  }, [focus, kb.relations]);

  const searchHits = useMemo(() => (query ? new Set(kb.topics.filter(t => matches(t, query)).map(t => t.id)) : null), [kb.topics, query]);
  const sel = selected ? kb.topics.find(t => t.id === selected) : undefined;
  const conns = sel ? connectionsOf(kb, sel.id) : [];

  const toggle = (id: CategoryId) => setHidden(h => {
    const n = new Set(h);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  return (
    <div className="relative h-[calc(100svh-3rem)] flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Thema suchen …" className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm w-56" />
        </div>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`text-xs rounded-full px-3 py-1.5 border flex items-center gap-1.5 transition-opacity ${hidden.has(c.id) ? 'opacity-40' : ''}`}
            style={{ borderColor: c.color, color: c.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.label}
          </button>
        ))}
      </div>

      <div ref={wrap} className="flex-1 min-h-0 bg-slate-50">
        <ForceGraph2D
          ref={fg}
          onEngineStop={() => { if (!fitted.current) { fg.current?.zoomToFit(400, 60); fitted.current = true; } }}
          width={size.w}
          height={size.h}
          graphData={data}
          cooldownTicks={120}
          linkColor={(l: GLink) => (neighbors && !(neighbors.has(endId(l.source)) && neighbors.has(endId(l.target))) ? '#e2e8f0' : '#94a3b8')}
          linkWidth={(l: GLink) => (focus && (endId(l.source) === focus || endId(l.target) === focus) ? 2 : 1)}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          onNodeHover={(n: GNode | null) => setHover(n?.id ?? null)}
          onNodeClick={(n: GNode) => setSelected(n.id)}
          onBackgroundClick={() => setSelected(null)}
          nodeCanvasObject={(n: GNode, ctx: CanvasRenderingContext2D, scale: number) => {
            const dim = (neighbors && !neighbors.has(n.id)) || (searchHits && !searchHits.has(n.id));
            const r = 5 + Math.sqrt(n.degree) * 2.2;
            ctx.globalAlpha = dim ? 0.2 : 1;
            ctx.beginPath();
            ctx.arc(n.x!, n.y!, r, 0, 2 * Math.PI);
            ctx.fillStyle = n.color;
            ctx.fill();
            if (n.id === selected) { ctx.lineWidth = 3 / scale; ctx.strokeStyle = '#0b2540'; ctx.stroke(); }
            const fontSize = Math.max(11 / scale, 3);
            ctx.font = `${n.id === focus ? '600 ' : ''}${fontSize}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#0f172a';
            ctx.fillText(n.label, n.x!, n.y! + r + 2);
            ctx.globalAlpha = 1;
          }}
          nodePointerAreaPaint={(n: GNode, color: string, ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(n.x!, n.y!, 10 + Math.sqrt(n.degree) * 2.2, 0, 2 * Math.PI);
            ctx.fill();
          }}
        />
      </div>

      {sel && (
        <aside className="absolute right-4 top-20 bottom-4 w-[min(380px,calc(100%-2rem))] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-800">{sel.title}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap"><CategoryBadge id={sel.category} /><StatusBadge status={sel.status} /></div>
            <p className="text-sm text-slate-600 mt-3">{sel.summary}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Verbindungen</div>
            {conns.map(c => (
              <button key={c.relation.id} onClick={() => setSelected(c.other.id)} className="block text-left w-full rounded-lg p-3 bg-slate-50 hover:bg-slate-100">
                <div className="text-sm"><span className="text-slate-500">{c.label} </span><span className="font-medium text-slate-800">{c.other.title}</span></div>
                <div className="text-xs text-slate-500 mt-1">{c.relation.explanation}</div>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100">
            <button onClick={() => openTopic(sel.id)} className="w-full rounded-lg py-2 bg-[#0b2540] text-white text-sm flex items-center justify-center gap-2">
              Thema öffnen <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
