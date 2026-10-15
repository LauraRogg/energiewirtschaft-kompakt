import { useState } from 'react';
import type { DiagramProps } from './registry';

type Answer = 'keiner' | 'nutzer' | 'nehmer';

const RESULT: Record<Answer, { who: string; topic: string; text: string; law: string }> = {
  keiner: { who: 'gMSB', topic: 'gmsb', law: 'MsbG § 3', text: 'Niemand hat gewählt → der grundzuständige MSB ist zuständig. In der Regel der örtliche VNB bzw. seine Messstellen-Tochter. Er baut nach Rollout-Fahrplan ein und verlangt höchstens die Preisobergrenze.' },
  nutzer: { who: 'wMSB (gewählt vom Anschlussnutzer)', topic: 'wmsb', law: 'MsbG § 5', text: 'Die Person, die den Strom verbraucht (z. B. Mieterin), beauftragt selbst einen wettbewerblichen MSB für ihre Messstelle – etwa für ein bestimmtes Smart-Meter-Produkt.' },
  nehmer: { who: 'wMSB (gewählt vom Anschlussnehmer)', topic: 'wmsb', law: 'MsbG § 6', text: 'Die Eigentümerin wählt für die ganze Liegenschaft einen MSB – typisch im Mehrfamilienhaus, oft gebündelt mit Gas/Wärme oder für Mieterstrom bzw. GGV. Bedingungen u. a.: keine Mehrkosten für die Anschlussnutzer.' },
};

const ROWS: [string, string, string, string][] = [
  ['Aufgabe', 'Netz betreiben, anschließen, Engpässe managen', 'Messstelle betreiben, Rollout', 'Messstelle betreiben'],
  ['Wird zuständig …', 'durch das Netzgebiet', 'automatisch (Standard)', 'durch Wahl (§ 5 / § 6 MsbG)'],
  ['Rollout-Pflicht', '–', 'ja, nach Fahrplan', 'nein (aber Pflichten beim Betrieb)'],
  ['Preisobergrenzen', '–', 'ja', 'nein, freie Preise'],
  ['Gateway-Administration', '–', 'ja (selbst oder Dienstleister)', 'ja (selbst oder Dienstleister)'],
  ['Rolle am SMGW', 'pEMT (Daten) und aEMT (§ 14a)', 'betreibt das SMGW', 'betreibt das SMGW'],
  ['Typisch', 'Stadtwerke-Netzgesellschaft', 'Messstellen-Tochter des VNB', 'Messdienstleister, Energiedienstleister'],
];

export default function MsbRollenDiagram({ onOpenTopic }: DiagramProps) {
  const [answer, setAnswer] = useState<Answer>('keiner');
  const r = RESULT[answer];

  const opt = (a: Answer, label: string) => (
    <button onClick={() => setAnswer(a)} className={`text-left rounded-xl border p-3 text-sm ${answer === a ? 'border-[#0b2540] bg-[#0b2540] text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>{label}</button>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-800 mb-2">Wer ist der Messstellenbetreiber? – Hat jemand einen MSB gewählt?</div>
        <div className="grid sm:grid-cols-3 gap-2">
          {opt('keiner', 'Nein, niemand hat gewählt')}
          {opt('nutzer', 'Ja, der Anschlussnutzer (z. B. Mieterin)')}
          {opt('nehmer', 'Ja, der Anschlussnehmer für die ganze Liegenschaft')}
        </div>
        <button onClick={() => onOpenTopic?.(r.topic)} className="mt-3 w-full text-left rounded-xl bg-slate-50 border border-slate-200 p-4 hover:bg-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Ergebnis</span>
            <span className="font-semibold text-slate-900">{r.who}</span>
            <span className="text-xs rounded px-1.5 py-0.5 bg-violet-50 text-violet-800 border border-violet-200">{r.law}</span>
          </div>
          <p className="text-sm text-slate-700 mt-1">{r.text}</p>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="text-left p-2 text-slate-500 font-medium" />
              {[['VNB', 'vnb', '#2a78d6'], ['gMSB', 'gmsb', '#eda100'], ['wMSB', 'wmsb', '#1baf7a']].map(([l, id, c]) => (
                <th key={id} className="text-left p-2">
                  <button onClick={() => onOpenTopic?.(id)} className="flex items-center gap-1.5 font-semibold text-slate-900 hover:underline"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row[0]}>
                <td className="p-2 border-t border-slate-100 text-slate-500 align-top whitespace-nowrap">{row[0]}</td>
                {row.slice(1).map((c, i) => <td key={i} className="p-2 border-t border-slate-100 text-slate-800 align-top">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-950">
        <strong>Häufiger Denkfehler:</strong> „Der Netzbetreiber liest meinen Zähler ab.“ – Messen ist seit dem MsbG eine eigene Rolle. Oft sitzt der gMSB im selben Konzern wie der VNB, rechtlich sind es aber getrennte Aufgaben.
      </div>
    </div>
  );
}
