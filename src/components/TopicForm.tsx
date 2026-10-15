import { useState } from 'react';
import type { CategoryId, Topic, TopicStatus } from '../types';
import { CATEGORIES, STATUS_LABEL } from '../data/categories';
import { slugify } from '../utils';

interface Props {
  initial?: Topic;
  existingIds: string[];
  onCancel: () => void;
  onSave: (t: Topic) => void;
}

const lines = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean);

export default function TopicForm({ initial, existingIds, onCancel, onSave }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [short, setShort] = useState(initial?.short ?? '');
  const [category, setCategory] = useState<CategoryId>(initial?.category ?? 'recht');
  const [status, setStatus] = useState<TopicStatus>(initial?.status ?? 'neu');
  const [since, setSince] = useState(initial?.since ?? '');
  const [summary, setSummary] = useState(initial?.summary ?? '');
  const [explanation, setExplanation] = useState(initial?.explanation ?? '');
  const [keyFacts, setKeyFacts] = useState((initial?.keyFacts ?? []).join('\n'));
  const [legalRefs, setLegalRefs] = useState((initial?.legalRefs ?? []).join('\n'));

  const submit = () => {
    if (!title.trim() || !summary.trim()) return;
    let id = initial?.id ?? slugify(title);
    if (!initial) { const base = id || 'thema'; let i = 2; while (existingIds.includes(id)) id = `${base}-${i++}`; }
    const today = new Date().toISOString().slice(0, 10);
    onSave({
      id, title: title.trim(), short: short.trim() || undefined, category, status, since: since.trim() || undefined,
      summary: summary.trim(), explanation: explanation.trim(), keyFacts: lines(keyFacts), legalRefs: lines(legalRefs),
      notes: initial?.notes, customized: initial ? true : undefined, createdAt: initial?.createdAt ?? today, updatedAt: today, source: initial?.source ?? 'manuell',
    });
  };

  const field = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm';
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <form onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); submit(); }} className="bg-white rounded-2xl p-6 w-full max-w-2xl space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="font-semibold text-slate-800">{initial ? 'Thema bearbeiten' : 'Neues Thema'}</h2>
        <div className="grid sm:grid-cols-[1fr_8rem] gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" className={field} required />
          <input value={short} onChange={e => setShort(e.target.value)} placeholder="Kürzel" className={field} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <select value={category} onChange={e => setCategory(e.target.value as CategoryId)} className={field}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value as TopicStatus)} className={field}>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input value={since} onChange={e => setSince(e.target.value)} placeholder="gilt seit (optional)" className={field} />
        </div>
        <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="Ein Satz: Worum geht es?" className={field} required />
        <textarea value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Erklärung (Absätze mit Leerzeile trennen)" className={`${field} min-h-36`} />
        <div className="grid sm:grid-cols-2 gap-3">
          <textarea value={keyFacts} onChange={e => setKeyFacts(e.target.value)} placeholder="Zum Merken – ein Punkt pro Zeile" className={`${field} min-h-24`} />
          <textarea value={legalRefs} onChange={e => setLegalRefs(e.target.value)} placeholder="Rechtsgrundlagen – eine pro Zeile" className={`${field} min-h-24`} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600">Abbrechen</button>
          <button className="px-4 py-2 text-sm rounded-lg bg-[#0b2540] text-white">Speichern</button>
        </div>
      </form>
    </div>
  );
}
