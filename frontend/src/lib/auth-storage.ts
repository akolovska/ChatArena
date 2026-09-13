export type Role = "ROLE_USER" | "ROLE_EVALUATOR" | "ROLE_ADMIN";

export interface StoredAuth {
  token: string;
  role: Role;
  username: string;
}

const KEY = "mk-llm-arena:auth";

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth) {
  window.localStorage.setItem(KEY, JSON.stringify(auth));
  window.dispatchEvent(new Event("mk-auth-change"));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("mk-auth-change"));
}

export function getToken(): string | null {
  return getStoredAuth()?.token ?? null;
}
