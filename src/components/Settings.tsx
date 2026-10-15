import { useState } from 'react';
import { X, Database, Sparkles, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { clearToken, getToken, saveToken, validateToken } from '../services/githubStorage';
import { clearApiKey, getApiKey, saveApiKey } from '../services/apiKey';

interface Props {
  onClose: () => void;
  onReset: () => void;
}

export default function Settings({ onClose, onReset }: Props) {
  const [gh, setGh] = useState(getToken());
  const [ghStatus, setGhStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [key, setKey] = useState(getApiKey());
  const [keySaved, setKeySaved] = useState(false);

  const checkGh = async () => {
    if (!gh.trim()) { clearToken(); setGhStatus('idle'); return; }
    setGhStatus('checking');
    const ok = await validateToken(gh.trim()).catch(() => false);
    if (ok) saveToken(gh);
    setGhStatus(ok ? 'ok' : 'error');
  };

  const saveKey = () => {
    if (key.trim()) saveApiKey(key); else clearApiKey();
    setKeySaved(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Einstellungen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 font-medium text-slate-700"><Database size={18} />GitHub-Token (Speichern im Repo)</h3>
          <p className="text-sm text-slate-500">
            Damit Änderungen an der Wissenslandkarte dauerhaft im Repository landen (<code>data/knowledge.json</code>). Benötigt ein Fine-grained Token mit
            <em> Contents: Read and write</em> für <code>energiewirtschaft-kompakt</code>. Ohne Token wird nur lokal im Browser gespeichert.
          </p>
          <a className="text-sm text-sky-700 inline-flex items-center gap-1 hover:underline" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">
            Token erstellen <ExternalLink size={12} />
          </a>
          <div className="flex gap-2">
            <input type="password" value={gh} onChange={e => { setGh(e.target.value); setGhStatus('idle'); }} placeholder="github_pat_…" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            <button onClick={checkGh} className="px-4 py-2 rounded-lg bg-[#0b2540] text-white text-sm">Prüfen & speichern</button>
          </div>
          {ghStatus === 'checking' && <p className="text-sm text-slate-500 flex items-center gap-1"><Loader2 size={14} className="animate-spin" />Prüfe …</p>}
          {ghStatus === 'ok' && <p className="text-sm text-emerald-600 flex items-center gap-1"><CheckCircle size={14} />Token gültig – lade die Seite neu, um aus dem Repo zu laden.</p>}
          {ghStatus === 'error' && <p className="text-sm text-red-600 flex items-center gap-1"><XCircle size={14} />Token ungültig oder kein Zugriff aufs Repo.</p>}
        </section>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 font-medium text-slate-700"><Sparkles size={18} />Claude-API-Schlüssel (KI-Assistent)</h3>
          <p className="text-sm text-slate-500">
            Der Einordnungs-Assistent ruft Claude direkt aus deinem Browser auf. Der Schlüssel bleibt nur in diesem Browser gespeichert – teile die Seite nicht mit hinterlegtem Schlüssel.
          </p>
          <a className="text-sm text-sky-700 inline-flex items-center gap-1 hover:underline" href="https://platform.claude.com/settings/keys" target="_blank" rel="noreferrer">
            API-Schlüssel erstellen <ExternalLink size={12} />
          </a>
          <div className="flex gap-2">
            <input type="password" value={key} onChange={e => { setKey(e.target.value); setKeySaved(false); }} placeholder="sk-ant-…" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            <button onClick={saveKey} className="px-4 py-2 rounded-lg bg-[#0b2540] text-white text-sm">Speichern</button>
          </div>
          {keySaved && <p className="text-sm text-emerald-600 flex items-center gap-1"><CheckCircle size={14} />Gespeichert.</p>}
        </section>

        <section className="pt-4 border-t border-slate-200">
          <button
            onClick={() => { if (confirm('Wissenslandkarte wirklich auf das Startwissen zurücksetzen? Eigene Themen gehen verloren.')) { onReset(); onClose(); } }}
            className="text-sm text-red-600 hover:underline"
          >
            Auf Startwissen zurücksetzen
          </button>
        </section>
      </div>
    </div>
  );
}
