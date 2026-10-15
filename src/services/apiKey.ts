const KEY_STORAGE = 'ewk-anthropic-key';

export function getApiKey(): string {
  try { return localStorage.getItem(KEY_STORAGE) ?? ''; } catch { return ''; }
}
export function saveApiKey(key: string): void {
  try { localStorage.setItem(KEY_STORAGE, key.trim()); } catch {}
}
export function clearApiKey(): void {
  try { localStorage.removeItem(KEY_STORAGE); } catch {}
}
