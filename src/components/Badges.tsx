import type { CategoryId, TopicStatus } from '../types';
import { CATEGORY_BY_ID, STATUS_LABEL } from '../data/categories';

export function CategoryBadge({ id }: { id: CategoryId }) {
  const c = CATEGORY_BY_ID[id];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${c.color}1a`, color: c.color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  );
}

const STATUS_STYLE: Record<TopicStatus, string> = {
  'etabliert': 'bg-slate-100 text-slate-600',
  'neu': 'bg-amber-100 text-amber-800',
  'in-umsetzung': 'bg-sky-100 text-sky-800',
  'auslaufend': 'bg-rose-100 text-rose-700',
};

export function StatusBadge({ status }: { status: TopicStatus }) {
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}
