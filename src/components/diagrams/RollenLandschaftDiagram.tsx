import { useState } from 'react';
import type { DiagramProps } from './registry';

/* ───────────── Elemente ───────────── */

interface El { id: string; x: number; y: number; w: number; h: number; title: string; sub?: string; topic?: string; tone?: 'dark' | 'soft' }

const EL: El[] = [
  // Regulierung & Recht
  { id: 'bnetza', x: 30, y: 34, w: 170, h: 48, title: 'BNetzA', sub: 'Markt- & Netzregeln', topic: 'bnetza' },
  { id: 'bsi', x: 215, y: 34, w: 170, h: 48, title: 'BSI', sub: 'Sicherheit SMGW & GWA', topic: 'bsi' },
  { id: 'enwg', x: 640, y: 34, w: 160, h: 48, title: 'EnWG', sub: 'Netze & Markt', topic: 'enwg' },
  { id: 'msbg', x: 815, y: 34, w: 160, h: 48, title: 'MsbG', sub: 'Messen & Daten', topic: 'msbg' },
  { id: 'eeg', x: 990, y: 34, w: 160, h: 48, title: 'EEG', sub: 'Erneuerbare', topic: 'eeg' },
  // Markt, Netz, Messwesen
  { id: 'lieferant', x: 30, y: 132, w: 190, h: 50, title: 'Lieferant', sub: 'Belieferung · pEMT', topic: 'lieferant' },
  { id: 'aggregator', x: 30, y: 196, w: 190, h: 50, title: 'Direktvermarkter / Aggregator', sub: 'optional · aEMT', topic: 'direktvermarktung' },
  { id: 'vnb', x: 300, y: 128, w: 270, h: 62, title: 'Verteilnetzbetreiber (VNB)', sub: 'Netz · § 14a: aEMT · Daten: pEMT', topic: 'vnb', tone: 'dark' },
  { id: 'ons', x: 365, y: 214, w: 140, h: 38, title: 'Ortsnetzstation', sub: 'Netzzustand', topic: 'netzzustand' },
  { id: 'gmsb', x: 640, y: 128, w: 240, h: 52, title: 'gMSB', sub: 'meist Tochter des VNB · Rollout, Preisobergrenzen', topic: 'gmsb' },
  { id: 'gwa1', x: 640, y: 194, w: 240, h: 40, title: 'GWA des gMSB', topic: 'gwa' },
  { id: 'wmsb', x: 920, y: 128, w: 250, h: 52, title: 'wMSB', sub: 'vom Eigentümer gewählt (§ 6 MsbG)', topic: 'wmsb' },
  { id: 'gwa2', x: 920, y: 194, w: 250, h: 40, title: 'GWA des wMSB', topic: 'gwa' },
  // Einfamilienhaus
  { id: 'hak1', x: 220, y: 328, w: 160, h: 34, title: 'Hausanschluss', sub: '= Gartenzaun', topic: 'gartenzaun', tone: 'soft' },
  { id: 'smgw1', x: 55, y: 400, w: 125, h: 44, title: 'SMGW', sub: 'Kommunikation', topic: 'smgw', tone: 'dark' },
  { id: 'mme1', x: 55, y: 452, w: 125, h: 38, title: 'Zähler (mME)', topic: 'mme' },
  { id: 'stb1', x: 200, y: 400, w: 125, h: 44, title: 'Steuerbox', sub: 'CLS-Gerät', topic: 'steuerbox' },
  { id: 'pv1', x: 390, y: 392, w: 170, h: 48, title: 'PV 10 kWp', sub: 'EEG · Solarspitzen', topic: 'pv' },
  { id: 'ems1', x: 390, y: 466, w: 170, h: 48, title: 'HEMS', sub: 'verteilt hinter dem Zaun', topic: 'ems' },
  { id: 'wp1', x: 40, y: 600, w: 160, h: 52, title: 'Wärmepumpe', sub: 'SteuVE', topic: 'waermepumpe' },
  { id: 'wb1', x: 215, y: 600, w: 160, h: 52, title: 'Wallbox 11 kW', sub: 'SteuVE', topic: 'wallbox' },
  { id: 'sp1', x: 390, y: 600, w: 170, h: 52, title: 'Batteriespeicher', sub: 'SteuVE beim Netzbezug', topic: 'speicher' },
  { id: 'hh1', x: 40, y: 680, w: 250, h: 42, title: 'Haushaltsstrom', sub: 'wird nie gesteuert' },
  // Mehrfamilienhaus
  { id: 'hak2', x: 820, y: 328, w: 160, h: 34, title: 'Hausanschluss', sub: '= Gartenzaun', topic: 'gartenzaun', tone: 'soft' },
  { id: 'smgw2', x: 655, y: 400, w: 125, h: 44, title: 'SMGW', sub: 'für viele Zähler', topic: 'smgw', tone: 'dark' },
  { id: 'meters2', x: 800, y: 396, w: 160, h: 100, title: '', topic: 'mme' },
  { id: 'stb2', x: 655, y: 454, w: 125, h: 40, title: 'Steuerbox', sub: 'CLS-Gerät', topic: 'steuerbox' },
  { id: 'pv2', x: 990, y: 392, w: 170, h: 48, title: 'PV-Dach', sub: 'Mieterstrom oder GGV', topic: 'mieterstrom' },
  { id: 'ems2', x: 990, y: 466, w: 170, h: 48, title: 'Lastmanagement / EMS', sub: 'verteilt hinter dem Zaun', topic: 'ems' },
  { id: 'wb2', x: 640, y: 600, w: 230, h: 52, title: 'Tiefgarage: 8 Wallboxen', sub: 'SteuVE · Lastmanagement', topic: 'wallbox' },
  { id: 'wp2', x: 885, y: 600, w: 130, h: 52, title: 'Zentrale WP', sub: 'SteuVE', topic: 'waermepumpe' },
  { id: 'flats', x: 1030, y: 600, w: 130, h: 52, title: '6 Wohnungen', sub: 'Anschlussnutzer', topic: 'wmsb' },
];
const E = Object.fromEntries(EL.map(e => [e.id, e]));

/* ───────────── Verbindungen ───────────── */

type Kind = 'strom' | 'daten' | 'steuer' | 'admin' | 'intern';
interface Edge { id: string; from: string; to: string; kind: Kind; fs?: Side; ts?: Side; label?: string; dashed?: boolean; fo?: number; to_?: number }
type Side = 't' | 'b' | 'l' | 'r';

const EDGES: Edge[] = [
  { id: 'vnb-ons', from: 'vnb', to: 'ons', kind: 'strom', fs: 'b', ts: 't' },
  { id: 'ons-hak1', from: 'ons', to: 'hak1', kind: 'strom', fs: 'b', ts: 't' },
  { id: 'ons-hak2', from: 'ons', to: 'hak2', kind: 'strom', fs: 'b', ts: 't' },
  { id: 'hak1-mme1', from: 'hak1', to: 'mme1', kind: 'strom', fs: 'l', ts: 'r', fo: 8, to_: 0 },
  { id: 'hak2-meters2', from: 'hak2', to: 'meters2', kind: 'strom', fs: 'b', ts: 't' },
  { id: 'gwa1-smgw1', from: 'gwa1', to: 'smgw1', kind: 'admin', fs: 'b', ts: 't', fo: -60, to_: -30, dashed: true },
  { id: 'gwa2-smgw2', from: 'gwa2', to: 'smgw2', kind: 'admin', fs: 'b', ts: 't', fo: -70, to_: -30, dashed: true },
  { id: 'smgw1-lief', from: 'smgw1', to: 'lieferant', kind: 'daten', fs: 'l', ts: 'b', fo: -8, to_: -40 },
  { id: 'smgw2-lief', from: 'smgw2', to: 'lieferant', kind: 'daten', fs: 't', ts: 'b', fo: -45, to_: 40 },
  { id: 'smgw1-vnb', from: 'smgw1', to: 'vnb', kind: 'daten', fs: 't', ts: 'b', fo: 0, to_: -100 },
  { id: 'smgw2-vnb', from: 'smgw2', to: 'vnb', kind: 'daten', fs: 't', ts: 'b', fo: -15, to_: 115 },
  { id: 'vnb-smgw1', from: 'vnb', to: 'smgw1', kind: 'steuer', fs: 'b', ts: 't', fo: -80, to_: 25, label: '§ 14a' },
  { id: 'vnb-smgw2', from: 'vnb', to: 'smgw2', kind: 'steuer', fs: 'b', ts: 't', fo: 125, to_: 15, label: '§ 14a' },
  { id: 'agg-smgw1', from: 'aggregator', to: 'smgw1', kind: 'steuer', fs: 'b', ts: 't', fo: 40, to_: 50, dashed: true },
  { id: 'smgw1-stb1', from: 'smgw1', to: 'stb1', kind: 'steuer', fs: 'r', ts: 'l' },
  { id: 'smgw2-stb2', from: 'smgw2', to: 'stb2', kind: 'steuer', fs: 'b', ts: 't' },
  { id: 'stb1-ems1', from: 'stb1', to: 'ems1', kind: 'steuer', fs: 'b', ts: 'l', label: 'EEBUS' },
  { id: 'stb2-ems2', from: 'stb2', to: 'ems2', kind: 'steuer', fs: 'r', ts: 'l', label: 'EEBUS' },
  { id: 'ems1-wp1', from: 'ems1', to: 'wp1', kind: 'intern', fs: 'b', ts: 't' },
  { id: 'ems1-wb1', from: 'ems1', to: 'wb1', kind: 'intern', fs: 'b', ts: 't' },
  { id: 'ems1-sp1', from: 'ems1', to: 'sp1', kind: 'intern', fs: 'b', ts: 't' },
  { id: 'ems2-wb2', from: 'ems2', to: 'wb2', kind: 'intern', fs: 'b', ts: 't' },
  { id: 'ems2-wp2', from: 'ems2', to: 'wp2', kind: 'intern', fs: 'b', ts: 't' },
  { id: 'smgw1-mme1', from: 'smgw1', to: 'mme1', kind: 'intern', fs: 'b', ts: 't', label: 'LMN' },
  { id: 'smgw2-meters2', from: 'smgw2', to: 'meters2', kind: 'intern', fs: 'r', ts: 'l' },
];

const KIND: Record<Kind, { color: string; width: number; label: string }> = {
  strom: { color: '#94a3b8', width: 4, label: 'Strom (physikalisch)' },
  daten: { color: '#2a78d6', width: 2, label: 'Messdaten an pEMT' },
  steuer: { color: '#eb6834', width: 2, label: 'Steuerung durch aEMT (CLS)' },
  admin: { color: '#6250d6', width: 2, label: 'Administration durch GWA' },
  intern: { color: '#cbd5e1', width: 1.5, label: 'intern im Gebäude' },
};

function anchor(id: string, side: Side = 'b', off = 0) {
  const e = E[id];
  if (side === 't') return { x: e.x + e.w / 2 + off, y: e.y };
  if (side === 'b') return { x: e.x + e.w / 2 + off, y: e.y + e.h };
  if (side === 'l') return { x: e.x, y: e.y + e.h / 2 + off };
  return { x: e.x + e.w, y: e.y + e.h / 2 + off };
}

function pathFor(ed: Edge) {
  const a = anchor(ed.from, ed.fs, ed.fo ?? 0);
  const b = anchor(ed.to, ed.ts, ed.to_ ?? 0);
  const vert = (s?: Side) => s === 't' || s === 'b';
  const k = 0.5;
  const c1 = vert(ed.fs) ? { x: a.x, y: a.y + (b.y - a.y) * k } : { x: a.x + (b.x - a.x) * k, y: a.y };
  const c2 = vert(ed.ts) ? { x: b.x, y: b.y - (b.y - a.y) * k } : { x: b.x - (b.x - a.x) * k, y: b.y };
  return { d: `M${a.x},${a.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
}

/* ───────────── Rollen-Fokus ───────────── */

interface Focus { id: string; label: string; els: string[]; edges: (string | Kind)[]; title: string; text: string; refs: string[]; topic?: string }

const FOCUS: Focus[] = [
  { id: 'alle', label: 'Gesamtbild', els: [], edges: [], title: 'Gesamtbild', text: 'Oben die Regelsetzer, in der Mitte Netz, Markt und Messwesen, unten zwei Gebäude. Wähle eine Rolle, um ihre Verbindungen hervorzuheben. Jeder Kasten öffnet das passende Thema.', refs: [] },
  { id: 'vnb', label: 'VNB', topic: 'vnb', els: ['vnb', 'ons', 'hak1', 'hak2', 'smgw1', 'smgw2', 'stb1', 'stb2'], edges: ['strom', 'vnb-smgw1', 'vnb-smgw2', 'smgw1-vnb', 'smgw2-vnb', 'smgw1-stb1', 'smgw2-stb2'], title: 'Verteilnetzbetreiber', text: 'Betreibt das Netz bis zum Hausanschluss beider Gebäude. Er muss die Wärmepumpen und Wallboxen anschließen (§ 14a) und darf im Engpass über SMGW und Steuerbox dimmen – dabei ist er aEMT. Für Abrechnung und Netzzustand bekommt er Messwerte – dabei ist er pEMT. Er misst nicht selbst: Das macht der MSB.', refs: ['EnWG §§ 11, 14, 14a, 17, 20'] },
  { id: 'gmsb', label: 'gMSB', topic: 'gmsb', els: ['gmsb', 'gwa1', 'smgw1', 'mme1'], edges: ['gwa1-smgw1', 'smgw1-mme1'], title: 'Grundzuständiger MSB – im Einfamilienhaus', text: 'Im EFH hat niemand gewählt, also ist der gMSB zuständig – meist eine Tochter des VNB. Er hat das iMSys (Zähler + SMGW) eingebaut, weil Wärmepumpe/Wallbox nach § 14a und die PV-Anlage Pflichteinbaufälle sind, und darf höchstens die Preisobergrenze verlangen. Sein GWA administriert das Gateway.', refs: ['MsbG §§ 2, 3, 29, 30 ff.'] },
  { id: 'wmsb', label: 'wMSB', topic: 'wmsb', els: ['wmsb', 'gwa2', 'smgw2', 'meters2', 'flats', 'pv2'], edges: ['gwa2-smgw2', 'smgw2-meters2'], title: 'Wettbewerblicher MSB – im Mehrfamilienhaus', text: 'Die Eigentümerin (Anschlussnehmerin) hat für die ganze Liegenschaft einen wMSB gewählt – sinnvoll, weil Mieterstrom bzw. GGV ein Messkonzept mit vielen Zählern braucht. Ein SMGW bindet über das LMN alle Zähler an. Die Mieter (Anschlussnutzer) hätten grundsätzlich ein eigenes Wahlrecht nach § 5.', refs: ['MsbG §§ 5, 6'] },
  { id: 'gwa', label: 'GWA', topic: 'gwa', els: ['gwa1', 'gwa2', 'smgw1', 'smgw2', 'bsi'], edges: ['admin'], title: 'Gateway-Administratoren', text: 'Jeder MSB braucht einen GWA – hier also zwei verschiedene. Der GWA konfiguriert das SMGW: wer welche Daten bekommt (pEMT) und wer über den CLS-Kanal steuern darf (aEMT). Er ist nach BSI-Vorgaben zertifiziert.', refs: ['MsbG §§ 19 ff., 25', 'BSI TR-03109'] },
  { id: 'aemt', label: 'aEMT', topic: 'aemt', els: ['vnb', 'aggregator', 'smgw1', 'smgw2', 'stb1', 'stb2', 'ems1', 'ems2'], edges: ['steuer'], title: 'Aktive externe Marktteilnehmer', text: 'Wer steuert, baut über das SMGW einen CLS-Kanal zur Steuerbox bzw. zum EMS auf: der VNB für § 14a in beiden Gebäuden, optional ein Direktvermarkter oder Aggregator im EFH (gestrichelt). Das SMGW leitet nur weiter.', refs: ['MsbG', 'BSI TR-03109-1'] },
  { id: 'pemt', label: 'pEMT', topic: 'pemt', els: ['lieferant', 'vnb', 'smgw1', 'smgw2'], edges: ['daten'], title: 'Passive externe Marktteilnehmer', text: 'Die SMGWs schicken Messwerte an berechtigte Empfänger: an den Lieferanten (z. B. für den dynamischen Tarif) und an den VNB (Abrechnung, Netzzustand). Ein pEMT kann nichts im Haus schalten.', refs: ['MsbG §§ 49 ff.', 'EnWG § 41a'] },
  { id: 'steuve', label: 'SteuVE & Gartenzaun', topic: 'gartenzaun', els: ['hak1', 'hak2', 'stb1', 'stb2', 'ems1', 'ems2', 'wp1', 'wb1', 'sp1', 'wb2', 'wp2'], edges: ['smgw1-stb1', 'smgw2-stb2', 'stb1-ems1', 'stb2-ems2', 'intern'], title: 'Steuerbare Verbrauchseinrichtungen hinter dem Gartenzaun', text: 'EFH: Wärmepumpe, Wallbox und Speicher sind SteuVE. MFH: 8 Wallboxen und die zentrale WP. In beiden Fällen gibt der VNB über die Steuerbox eine Grenze für den Netzanschluss vor; das (H)EMS bzw. Lastmanagement verteilt sie. Haushaltsstrom und Wohnungen werden nicht gesteuert.', refs: ['EnWG § 14a', 'BK6-22-300'] },
  { id: 'gebaeude', label: 'Mieterstrom / GGV', topic: 'ggv', els: ['pv2', 'flats', 'meters2', 'smgw2', 'wmsb'], edges: ['smgw2-meters2'], title: 'PV im Mehrfamilienhaus', text: 'Mieterstrom (§ 42a EnWG, Zuschlag § 21 EEG): Anbieter liefert PV- und Reststrom. GGV (§ 42b EnWG): PV-Strom wird viertelstündlich nach Schlüssel verteilt, Reststrom kommt vom eigenen Lieferanten. Beides braucht ein passendes Messkonzept – Aufgabe des MSB.', refs: ['EnWG §§ 42a, 42b', 'EEG § 21'] },
  { id: 'recht', label: 'Gesetze & Behörden', topic: 'enwg', els: ['bnetza', 'bsi', 'enwg', 'msbg', 'eeg'], edges: [], title: 'Wer setzt die Regeln?', text: 'EnWG: VNB, Netzanschluss, § 14a, Lieferung, Mieterstrom, GGV. MsbG: gMSB/wMSB, SMGW, GWA, Datenflüsse. EEG: PV-Anlage, Vergütung, Direktvermarktung, negative Preise. Die BNetzA konkretisiert per Festlegung, das BSI setzt die Sicherheitsstandards.', refs: ['EnWG', 'MsbG', 'EEG'] },
];

export default function RollenLandschaftDiagram({ onOpenTopic }: DiagramProps) {
  const [focus, setFocus] = useState('alle');
  const f = FOCUS.find(x => x.id === focus)!;
  const all = focus === 'alle';
  const elOn = (id: string) => all || f.els.includes(id);
  const edgeOn = (ed: Edge) => all || f.edges.includes(ed.id) || f.edges.includes(ed.kind);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FOCUS.map(x => (
          <button key={x.id} onClick={() => setFocus(x.id)} className={`text-sm rounded-full px-3 py-1.5 border ${focus === x.id ? 'bg-[#0b2540] text-white border-[#0b2540]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}>{x.label}</button>
        ))}
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <svg viewBox="0 0 1200 750" className="w-full min-w-[820px] h-auto" role="img" aria-label="Rollen im Energiesystem am Beispiel Einfamilienhaus und Mehrfamilienhaus">
          <defs>
            {(['daten', 'steuer', 'admin'] as Kind[]).map(k => (
              <marker key={k} id={`rl-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={KIND[k].color} /></marker>
            ))}
          </defs>

          {/* Bänder */}
          <rect x={10} y={10} width={1180} height={84} rx={14} fill="#f5f3ff" />
          <text x={410} y={64} fontSize={11} fill="#6d28d9" fontWeight={600}>REGELN</text>
          <rect x={10} y={104} width={1180} height={160} rx={14} fill="#f8fafc" />
          <text x={22} y={122} fontSize={11} fill="#64748b" fontWeight={600}>MARKT · NETZ · MESSWESEN</text>
          <rect x={20} y={290} width={560} height={450} rx={16} fill="#fff" stroke="#cbd5e1" />
          <text x={36} y={316} fontSize={14} fontWeight={700} fill="#0f172a">Einfamilienhaus</text>
          <text x={566} y={316} textAnchor="end" fontSize={11} fill="#64748b">Eigentümer = Anschlussnehmer = Anschlussnutzer</text>
          <rect x={620} y={290} width={560} height={450} rx={16} fill="#fff" stroke="#cbd5e1" />
          <text x={636} y={316} fontSize={14} fontWeight={700} fill="#0f172a">Mehrfamilienhaus</text>
          <text x={1166} y={316} textAnchor="end" fontSize={11} fill="#64748b">Eigentümerin = Anschlussnehmerin · Mieter = Anschlussnutzer</text>

          {/* Zählerschränke */}
          <rect x={45} y={378} width={290} height={137} rx={10} fill="#fffbeb" stroke="#fde68a" />
          <text x={53} y={508} fontSize={10} fill="#92400e">Zählerschrank · iMSys = mME + SMGW</text>
          <rect x={645} y={378} width={325} height={137} rx={10} fill="#fffbeb" stroke="#fde68a" />
          <text x={653} y={508} fontSize={10} fill="#92400e">Zählerschrank · ein SMGW, viele Zähler</text>

          {/* Linien */}
          {EDGES.map(ed => {
            const { d, mid } = pathFor(ed);
            const k = KIND[ed.kind];
            const on = edgeOn(ed);
            return (
              <g key={ed.id} opacity={on ? 1 : 0.12}>
                <path d={d} fill="none" stroke={k.color} strokeWidth={on && !all ? k.width + 1 : k.width} strokeDasharray={ed.dashed ? '6 4' : undefined} markerEnd={ed.kind === 'daten' || ed.kind === 'steuer' || ed.kind === 'admin' ? `url(#rl-${ed.kind})` : undefined} />
                {ed.label && on && (
                  <g>
                    <rect x={mid.x - 20} y={mid.y - 9} width={40} height={16} rx={8} fill="#fff" stroke={k.color} />
                    <text x={mid.x} y={mid.y + 3} textAnchor="middle" fontSize={9} fill="#0f172a">{ed.label}</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Kästen */}
          {EL.map(e => {
            const on = elOn(e.id);
            const dark = e.tone === 'dark';
            const fill = dark ? '#0b2540' : e.tone === 'soft' ? '#fef3c7' : '#fff';
            return (
              <g key={e.id} opacity={on ? 1 : 0.25} style={{ cursor: e.topic ? 'pointer' : 'default' }} onClick={() => e.topic && onOpenTopic?.(e.topic)}>
                <rect x={e.x} y={e.y} width={e.w} height={e.h} rx={10} fill={fill} stroke={!all && on ? '#0b2540' : dark ? '#0b2540' : '#cbd5e1'} strokeWidth={!all && on ? 2 : 1} />
                {e.id === 'meters2' ? (
                  <g>
                    {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'Allg.', 'WP', 'Laden'].map((m, i) => (
                      <g key={m}>
                        <rect x={e.x + 8 + (i % 3) * 50} y={e.y + 8 + Math.floor(i / 3) * 31} width={44} height={25} rx={5} fill="#f8fafc" stroke="#cbd5e1" />
                        <text x={e.x + 30 + (i % 3) * 50} y={e.y + 25 + Math.floor(i / 3) * 31} textAnchor="middle" fontSize={10} fill="#0f172a">{m}</text>
                      </g>
                    ))}
                  </g>
                ) : (
                  <g>
                    <text x={e.x + e.w / 2} y={e.y + (e.sub ? e.h / 2 - 3 : e.h / 2 + 4)} textAnchor="middle" fontSize={12} fontWeight={600} fill={dark ? '#fff' : '#0f172a'}>{e.title}</text>
                    {e.sub && <text x={e.x + e.w / 2} y={e.y + e.h / 2 + 13} textAnchor="middle" fontSize={10} fill={dark ? '#cbd5e1' : '#475569'}>{e.sub}</text>}
                  </g>
                )}
              </g>
            );
          })}

          {/* Gartenzaun-Markierung */}
          {[1, 2].map(i => {
            const h = E[`hak${i}`];
            return <line key={i} x1={h.x - 30} x2={h.x + h.w + 30} y1={h.y + h.h + 5} y2={h.y + h.h + 5} stroke="#a16207" strokeWidth={3} strokeDasharray="3 5" opacity={elOn(`hak${i}`) ? 1 : 0.25} />;
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
        {(Object.keys(KIND) as Kind[]).map(k => (
          <span key={k} className="flex items-center gap-1.5"><span className="w-6" style={{ borderTop: `${Math.min(KIND[k].width, 3)}px solid ${KIND[k].color}` }} />{KIND[k].label}</span>
        ))}
        <span className="flex items-center gap-1.5"><span className="w-6 border-t-2 border-dashed border-slate-500" />gestrichelt = optional bzw. Verwaltung</span>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-slate-900">{f.title}</h3>
          {f.refs.map(r => <span key={r} className="text-xs rounded px-1.5 py-0.5 bg-violet-50 text-violet-800 border border-violet-200">{r}</span>)}
        </div>
        <p className="text-sm text-slate-700 mt-2 max-w-4xl">{f.text}</p>
        {f.topic && <button onClick={() => onOpenTopic?.(f.topic!)} className="text-sm text-sky-700 hover:underline mt-2">→ Thema öffnen</button>}
      </div>
    </div>
  );
}
