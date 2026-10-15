import type { KnowledgeBase } from '../types';

const REPO_OWNER = 'LauraRogg';
const REPO_NAME = 'energiewirtschaft-kompakt';
const DATA_PATH = 'data/knowledge.json';
const TOKEN_KEY = 'ewk-github-token';

export function getToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) ?? ''; } catch { return ''; }
}

export function saveToken(token: string): void {
  try { localStorage.setItem(TOKEN_KEY, token.trim()); } catch {}
}

export function clearToken(): void {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

function apiHeaders(token?: string): HeadersInit {
  const h: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
  const t = token ?? getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

const BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_PATH}`;

export async function loadFromGitHub(): Promise<{ data: KnowledgeBase | null; sha: string | null }> {
  const res = await fetch(BASE, { headers: apiHeaders() });
  if (res.status === 404) return { data: null, sha: null };
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  const json = await res.json();
  const decoded = JSON.parse(decodeURIComponent(escape(atob(json.content.replace(/\n/g, '')))));
  return { data: decoded, sha: json.sha };
}

export async function saveToGitHub(data: KnowledgeBase, sha: string | null, message: string): Promise<string> {
  const token = getToken();
  if (!token) throw new Error('NO_TOKEN');

  const raw = JSON.stringify(data, null, 2);
  const body: Record<string, unknown> = {
    message: `chore: ${message} [${new Date().toISOString().slice(0, 16)}]`,
    content: btoa(unescape(encodeURIComponent(raw))),
  };
  if (sha) body.sha = sha;

  const res = await fetch(BASE, {
    method: 'PUT',
    headers: { ...apiHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 409) throw new Error('CONFLICT');
    if (res.status === 401 || res.status === 403) throw new Error('UNAUTHORIZED');
    throw new Error(err.message ?? `GitHub API ${res.status}`);
  }

  const result = await res.json();
  return result.content.sha as string;
}

export async function validateToken(token: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, { headers: apiHeaders(token) });
  return res.ok;
}
