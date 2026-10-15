import type { ReactNode } from 'react';
import { LayoutDashboard, Network, BookOpen, GitCompare, Sparkles, Shapes, CalendarRange, Settings, CheckCircle2, Loader2, AlertCircle, Eye, Zap } from 'lucide-react';
import type { View } from '../types';
import type { SaveStatus } from '../store/useStore';

const NAV: { id: View; label: string; icon: typeof Network }[] = [
  { id: 'dashboard', label: 'Übersicht', icon: LayoutDashboard },
  { id: 'bigpicture', label: 'Big Picture', icon: Network },
  { id: 'thema', label: 'Themen', icon: BookOpen },
  { id: 'vergleich', label: 'Zusammenhänge', icon: GitCompare },
  { id: 'schaubilder', label: 'Schaubilder', icon: Shapes },
  { id: 'zeitstrahl', label: 'Zeitstrahl', icon: CalendarRange },
  { id: 'assistent', label: 'Einordnen (KI)', icon: Sparkles },
];

interface Props {
  view: View;
  setView: (v: View) => void;
  saveStatus: SaveStatus;
  saveError: string;
  onOpenSettings: () => void;
  children: ReactNode;
}

function SaveBadge({ status, error }: { status: SaveStatus; error: string }) {
  if (status === 'saving') return <span className="flex items-center gap-1 text-xs text-slate-500"><Loader2 size={14} className="animate-spin" />Speichert …</span>;
  if (status === 'saved') return <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={14} />Gespeichert</span>;
  if (status === 'error') return <span className="flex items-center gap-1 text-xs text-red-600" title={error}><AlertCircle size={14} />Fehler beim Speichern</span>;
  if (status === 'readonly') return <span className="flex items-center gap-1 text-xs text-slate-500" title="Ohne GitHub-Token wird nur lokal im Browser gespeichert"><Eye size={14} />Nur lokal</span>;
  return null;
}

export default function Layout({ view, setView, saveStatus, saveError, onOpenSettings, children }: Props) {
  return (
    <div className="min-h-svh flex flex-col md:flex-row">
      <aside className="md:w-60 shrink-0 bg-[#0b2540] text-white flex md:flex-col">
        <div className="hidden md:flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-amber-400 text-[#0b2540] flex items-center justify-center"><Zap size={20} /></div>
          <div className="leading-tight">
            <div className="font-semibold">Energiewirtschaft</div>
            <div className="text-xs text-amber-300 tracking-wide">kompakt</div>
          </div>
        </div>
        <nav className="flex md:flex-col flex-1 overflow-x-auto md:overflow-visible md:py-3">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center gap-3 px-4 md:px-5 py-3 text-sm whitespace-nowrap transition-colors ${
                view === id ? 'bg-white/10 text-white md:border-l-4 md:border-amber-400' : 'text-slate-300 hover:bg-white/5 md:border-l-4 md:border-transparent'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
        <button onClick={onOpenSettings} className="flex items-center gap-3 px-4 md:px-5 py-3 md:py-4 text-sm text-slate-300 hover:bg-white/5 md:border-t md:border-white/10">
          <Settings size={18} /><span className="hidden md:inline">Einstellungen</span>
        </button>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-12 px-6 flex items-center justify-end border-b border-slate-200 bg-white">
          <SaveBadge status={saveStatus} error={saveError} />
        </header>
        <div className="flex-1 min-h-0">{children}</div>
      </main>
    </div>
  );
}
