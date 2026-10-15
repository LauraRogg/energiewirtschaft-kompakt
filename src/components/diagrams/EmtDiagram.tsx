import { useState } from 'react';
import type { DiagramProps } from './registry';

type Mode = 'pemt' | 'aemt';

const INFO: Record<Mode, { title: string; merk: string; points: string[]; examples: string[] }> = {
  pemt: {
    title: 'pEMT – passiver externer Marktteilnehmer',
    merk: '„Bekommt Post aus dem Haus.“',
    points: [
      'Das SMGW verschickt Messwerte nach fest konfigurierten Profilen.',
      'Der pEMT kann keine Verbindung ins Haus aufbauen.',
      'Welche Daten an wen gehen dürfen, regelt das MsbG.',
    ],
    examples: ['Lieferant: Viertelstundenwerte für den dynamischen Tarif', 'VNB: Abrechnungs- und Netzzustandsdaten', 'MSB: Daten für Plausibilisierung und Weitergabe'],
  },
  aemt: {
    title: 'aEMT – aktiver externer Marktteilnehmer',
    merk: '„Spricht in das Haus hinein.“',
    points: [
      'Der aEMT baut über den CLS-Kanal eine gesicherte Verbindung zu einem Gerät auf.',
      'Das SMGW arbeitet dabei als Proxy – es leitet weiter, ohne selbst zu steuern.',
      'Voraussetzung: SM-PKI-Zertifikat und Freischaltung durch den GWA.',
    ],
    examples: ['VNB: Dimmen nach § 14a über die Steuerbox', 'Direktvermarkter: PV-Anlage fernsteuern', 'Aggregator / EMS-Anbieter: Speicher und Wärmepumpe optimieren'],
  },
};

export default function EmtDiagram({ onOpenTopic }: DiagramProps) {
  const [mode, setMode] = useState<Mode>('aemt');
  const info = INFO[mode];
  const blue = '#2a78d6', orange = '#eb6834';
  const color = mode === 'pemt' ? blue : orange;

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden text-sm">
        <button onClick={() => setMode('pemt')} className={`px-3 py-1.5 ${mode === 'pemt' ? 'bg-[#0b2540] text-white' : 'bg-white text-slate-700'}`}>pEMT (passiv)</button>
        <button onClick={() => setMode('aemt')} className={`px-3 py-1.5 ${mode === 'aemt' ? 'bg-[#0b2540] text-white' : 'bg-white text-slate-700'}`}>aEMT (aktiv)</button>
      </div>

      <svg viewBox="0 0 720 230" className="w-full h-auto" role="img" aria-label={info.title}>
        <defs>
          <marker id="emt-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={color} /></marker>
        </defs>
        <rect x={10} y={10} width={230} height={210} rx={12} fill="#f8fafc" />
        <text x={125} y={205} textAnchor="middle" fontSize={11} fill="#64748b">Außen (WAN)</text>
        <rect x={270} y={10} width={180} height={210} rx={12} fill="#fffbeb" />
        <text x={360} y={205} textAnchor="middle" fontSize={11} fill="#64748b">Zählerschrank</text>
        <rect x={480} y={10} width={230} height={210} rx={12} fill="#f0fdf4" />
        <text x={595} y={205} textAnchor="middle" fontSize={11} fill="#64748b">Im Haus (HAN)</text>

        {/* EMT */}
        <g style={{ cursor: 'pointer' }} onClick={() => onOpenTopic?.(mode)}>
          <rect x={40} y={70} width={170} height={64} rx={10} fill="#fff" stroke={color} strokeWidth={2} />
          <text x={125} y={98} textAnchor="middle" fontSize={14} fontWeight={700} fill="#0f172a">{mode === 'pemt' ? 'pEMT' : 'aEMT'}</text>
          <text x={125} y={116} textAnchor="middle" fontSize={11} fill="#475569">{mode === 'pemt' ? 'z. B. Lieferant' : 'z. B. VNB nach § 14a'}</text>
        </g>
        {/* GWA */}
        <g style={{ cursor: 'pointer' }} onClick={() => onOpenTopic?.('gwa')}>
          <rect x={290} y={20} width={140} height={36} rx={8} fill="#fff" stroke="#cbd5e1" />
          <text x={360} y={43} textAnchor="middle" fontSize={11} fill="#0f172a">GWA konfiguriert</text>
          <line x1={360} y1={56} x2={360} y2={78} stroke="#6250d6" strokeWidth={1.5} strokeDasharray="4 3" />
        </g>
        {/* SMGW */}
        <g style={{ cursor: 'pointer' }} onClick={() => onOpenTopic?.('smgw')}>
          <rect x={295} y={78} width={130} height={50} rx={10} fill="#0b2540" />
          <text x={360} y={101} textAnchor="middle" fontSize={13} fontWeight={600} fill="#fff">SMGW</text>
          <text x={360} y={117} textAnchor="middle" fontSize={10} fill="#cbd5e1">{mode === 'pemt' ? 'sendet Messwerte' : 'CLS-Proxy'}</text>
        </g>
        {/* Haus */}
        {mode === 'pemt' ? (
          <g style={{ cursor: 'pointer' }} onClick={() => onOpenTopic?.('mme')}>
            <rect x={300} y={145} width={120} height={40} rx={8} fill="#fff" stroke="#cbd5e1" />
            <text x={360} y={170} textAnchor="middle" fontSize={12} fill="#0f172a">Zähler (mME)</text>
            <line x1={360} y1={145} x2={360} y2={128} stroke="#94a3b8" strokeWidth={2} />
          </g>
        ) : null}
        <g opacity={mode === 'pemt' ? 0.35 : 1} style={{ cursor: 'pointer' }} onClick={() => onOpenTopic?.('steuerbox')}>
          <rect x={510} y={78} width={170} height={50} rx={10} fill="#fff" stroke={mode === 'aemt' ? orange : '#cbd5e1'} strokeWidth={mode === 'aemt' ? 2 : 1} />
          <text x={595} y={101} textAnchor="middle" fontSize={13} fontWeight={600} fill="#0f172a">CLS-Gerät</text>
          <text x={595} y={117} textAnchor="middle" fontSize={10} fill="#475569">Steuerbox, EMS, Wechselrichter</text>
        </g>

        {mode === 'pemt' ? (
          <g>
            <line x1={295} y1={103} x2={214} y2={103} stroke={blue} strokeWidth={3} markerEnd="url(#emt-arr)" />
            <text x={252} y={94} textAnchor="middle" fontSize={11} fontWeight={600} fill="#0f172a">Daten</text>
            <text x={595} y={160} textAnchor="middle" fontSize={11} fill="#64748b">kein Zugriff für pEMT</text>
          </g>
        ) : (
          <g>
            <line x1={210} y1={103} x2={291} y2={103} stroke={orange} strokeWidth={3} markerEnd="url(#emt-arr)" />
            <line x1={425} y1={103} x2={506} y2={103} stroke={orange} strokeWidth={3} markerEnd="url(#emt-arr)" />
            <text x={252} y={94} textAnchor="middle" fontSize={11} fontWeight={600} fill="#0f172a">baut auf</text>
            <text x={466} y={94} textAnchor="middle" fontSize={11} fontWeight={600} fill="#0f172a">CLS-Kanal</text>
            <text x={360} y={160} textAnchor="middle" fontSize={11} fill="#475569">TLS-gesicherter Tunnel</text>
          </g>
        )}
      </svg>

      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="font-medium text-slate-900">{info.title}</div>
          <div className="text-slate-500 italic mt-0.5">{info.merk}</div>
          <ul className="mt-2 space-y-1 text-slate-700">{info.points.map(p => <li key={p} className="flex gap-2"><span className="text-slate-400">•</span>{p}</li>)}</ul>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="font-medium text-slate-900">Typische Beispiele</div>
          <ul className="mt-2 space-y-1 text-slate-700">{info.examples.map(p => <li key={p} className="flex gap-2"><span className="text-slate-400">•</span>{p}</li>)}</ul>
        </div>
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-950">
        <strong>Rolle ≠ Unternehmen:</strong> Der VNB ist pEMT, wenn er Messwerte bekommt, und aEMT, wenn er nach § 14a steuert. aEMT/pEMT beschreiben, <em>wie</em> jemand mit dem Gateway kommuniziert – nicht, wer er ist.
      </div>
    </div>
  );
}
