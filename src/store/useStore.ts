import { useCallback, useEffect, useRef, useState } from 'react';
import type { KnowledgeBase, Relation, Topic, View } from '../types';
import { INITIAL_KNOWLEDGE } from '../data/initialKnowledge';
import { getToken, loadFromGitHub, saveToGitHub } from '../services/githubStorage';
import type { ChatMessage, Proposal } from '../services/assistant';

const LOCAL_KEY = 'ewk-knowledge';
const CHAT_KEY = 'ewk-chat';
const ACCEPTED_KEY = 'ewk-accepted-proposals';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'readonly';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLocal(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const now = () => new Date().toISOString().slice(0, 10);
const newId = () => Math.random().toString(36).slice(2, 10);

export function useStore() {
  const [kb, setKb] = useState<KnowledgeBase>(() => readLocal(LOCAL_KEY, INITIAL_KNOWLEDGE));
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(getToken() ? 'idle' : 'readonly');
  const [saveError, setSaveError] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>(() => readLocal(CHAT_KEY, []));
  const [accepted, setAccepted] = useState<Record<string, 'accepted' | 'dismissed'>>(() => readLocal(ACCEPTED_KEY, {}));
  const [assistantDraft, setAssistantDraft] = useState('');

  const sha = useRef<string | null>(null);
  const pendingMessage = useRef('Wissenslandkarte aktualisiert');
  const dirty = useRef(false);
  const saveTimer = useRef<number | undefined>(undefined);

  // Initial laden: GitHub ist die Quelle der Wahrheit, lokal ist Cache/Fallback
  useEffect(() => {
    loadFromGitHub()
      .then(({ data, sha: s }) => {
        sha.current = s;
        if (data) setKb(data);
      })
      .catch(err => console.warn('GitHub-Laden fehlgeschlagen, nutze lokale Daten:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { writeLocal(LOCAL_KEY, kb); }, [kb]);
  useEffect(() => { writeLocal(CHAT_KEY, chat); }, [chat]);
  useEffect(() => { writeLocal(ACCEPTED_KEY, accepted); }, [accepted]);

  const flush = useCallback(async (data: KnowledgeBase) => {
    if (!getToken()) { setSaveStatus('readonly'); return; }
    setSaveStatus('saving');
    try {
      sha.current = await saveToGitHub(data, sha.current, pendingMessage.current);
      dirty.current = false;
      setSaveStatus('saved');
      setSaveError('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === 'CONFLICT') {
        // Jemand anderes (oder ein anderer Tab) hat gespeichert: SHA neu holen und erneut versuchen
        try {
          const latest = await loadFromGitHub();
          sha.current = latest.sha;
          sha.current = await saveToGitHub(data, sha.current, pendingMessage.current);
          setSaveStatus('saved');
          return;
        } catch { /* fällt unten in Fehler */ }
      }
      setSaveStatus('error');
      setSaveError(msg === 'UNAUTHORIZED' ? 'GitHub-Token ungültig' : msg);
    }
  }, []);

  const commit = useCallback((updater: (prev: KnowledgeBase) => KnowledgeBase, message: string) => {
    setKb(prev => {
      const next = updater(prev);
      pendingMessage.current = message;
      dirty.current = true;
      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => flush(next), 1200);
      return next;
    });
  }, [flush]);

  const upsertTopic = useCallback((topic: Topic) => {
    commit(prev => {
      const exists = prev.topics.some(t => t.id === topic.id);
      const t = { ...topic, updatedAt: now() };
      return { ...prev, topics: exists ? prev.topics.map(x => (x.id === t.id ? t : x)) : [...prev.topics, t] };
    }, `Thema "${topic.title}" gespeichert`);
  }, [commit]);

  const deleteTopic = useCallback((id: string) => {
    commit(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t.id !== id),
      relations: prev.relations.filter(r => r.source !== id && r.target !== id),
    }), `Thema ${id} gelöscht`);
  }, [commit]);

  const addRelation = useCallback((rel: Omit<Relation, 'id'>) => {
    commit(prev => ({ ...prev, relations: [...prev.relations, { ...rel, id: newId() }] }), `Beziehung ${rel.source} → ${rel.target}`);
  }, [commit]);

  const deleteRelation = useCallback((id: string) => {
    commit(prev => ({ ...prev, relations: prev.relations.filter(r => r.id !== id) }), 'Beziehung gelöscht');
  }, [commit]);

  const applyProposal = useCallback((toolUseId: string, proposal: Proposal) => {
    commit(prev => {
      const ids = new Set(prev.topics.map(t => t.id));
      const topics = [
        ...prev.topics,
        ...proposal.topics
          .filter(t => !ids.has(t.id))
          .map(t => ({ ...t, createdAt: now(), updatedAt: now(), source: 'assistent' as const })),
      ];
      const known = new Set(topics.map(t => t.id));
      const dup = new Set(prev.relations.map(r => `${r.source}|${r.type}|${r.target}`));
      const relations = [
        ...prev.relations,
        ...proposal.relations
          .filter(r => known.has(r.source) && known.has(r.target) && !dup.has(`${r.source}|${r.type}|${r.target}`))
          .map(r => ({ ...r, id: newId() })),
      ];
      return { ...prev, topics, relations };
    }, `Assistent: ${proposal.topics.map(t => t.title).join(', ') || 'neue Beziehungen'} eingeordnet`);
    setAccepted(a => ({ ...a, [toolUseId]: 'accepted' }));
  }, [commit]);

  const dismissProposal = useCallback((toolUseId: string) => {
    setAccepted(a => ({ ...a, [toolUseId]: 'dismissed' }));
  }, []);

  const openTopic = useCallback((id: string) => {
    setSelectedId(id);
    setView('thema');
  }, []);

  const askAssistant = useCallback((prompt: string) => {
    setAssistantDraft(prompt);
    setView('assistent');
  }, []);

  const resetToBasis = useCallback(() => {
    commit(() => INITIAL_KNOWLEDGE, 'Auf Startwissen zurückgesetzt');
  }, [commit]);

  return {
    kb, loading, view, setView, selectedId, setSelectedId, openTopic,
    saveStatus, saveError,
    upsertTopic, deleteTopic, addRelation, deleteRelation, resetToBasis,
    chat, setChat, accepted, applyProposal, dismissProposal,
    assistantDraft, setAssistantDraft, askAssistant,
  };
}

export type Store = ReturnType<typeof useStore>;
