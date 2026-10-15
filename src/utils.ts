import type { KnowledgeBase, Relation, Topic } from './types';
import { RELATION_TYPE_BY_ID } from './data/categories';

export interface Connection {
  relation: Relation;
  other: Topic;
  /** Beschriftung aus Sicht des betrachteten Themas */
  label: string;
}

export function connectionsOf(kb: KnowledgeBase, id: string): Connection[] {
  const byId = new Map(kb.topics.map(t => [t.id, t]));
  const out: Connection[] = [];
  for (const r of kb.relations) {
    const info = RELATION_TYPE_BY_ID[r.type];
    if (r.source === id && byId.has(r.target)) out.push({ relation: r, other: byId.get(r.target)!, label: info.label });
    else if (r.target === id && byId.has(r.source)) out.push({ relation: r, other: byId.get(r.source)!, label: info.inverse });
  }
  return out;
}

export interface PathStep {
  from: Topic;
  to: Topic;
  relation: Relation;
  label: string;
}

/** Kürzester Weg zwischen zwei Themen (Breitensuche, Richtung egal). */
export function shortestPath(kb: KnowledgeBase, a: string, b: string): PathStep[] | null {
  if (a === b) return [];
  const prev = new Map<string, { node: string; rel: Relation }>();
  const seen = new Set([a]);
  const queue = [a];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const r of kb.relations) {
      const next = r.source === cur ? r.target : r.target === cur ? r.source : null;
      if (!next || seen.has(next)) continue;
      seen.add(next);
      prev.set(next, { node: cur, rel: r });
      if (next === b) {
        const byId = new Map(kb.topics.map(t => [t.id, t]));
        const steps: PathStep[] = [];
        let n = b;
        while (n !== a) {
          const p = prev.get(n)!;
          const info = RELATION_TYPE_BY_ID[p.rel.type];
          const forward = p.rel.source === p.node;
          steps.unshift({ from: byId.get(p.node)!, to: byId.get(n)!, relation: p.rel, label: forward ? info.label : info.inverse });
          n = p.node;
        }
        return steps.every(s => s.from && s.to) ? steps : null;
      }
      queue.push(next);
    }
  }
  return null;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/§/g, 'par')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function matches(t: Topic, q: string): boolean {
  if (!q) return true;
  const s = q.toLowerCase();
  return [t.title, t.short ?? '', t.summary, ...t.legalRefs].some(x => x.toLowerCase().includes(s));
}
