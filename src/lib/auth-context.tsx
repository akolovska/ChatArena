import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuth,
  getStoredAuth,
  setStoredAuth,
  type Role,
  type StoredAuth,
} from "./auth-storage";
import * as authApi from "@/api/auth";

interface AuthContextValue {
  auth: StoredAuth | null;
  isAuthenticated: boolean;
  role: Role | null;
  login: (username: string, password: string) => Promise<StoredAuth>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAuth: (patch: Partial<StoredAuth>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => getStoredAuth());

  useEffect(() => {
    const handler = () => setAuth(getStoredAuth());
    window.addEventListener("mk-auth-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mk-auth-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      isAuthenticated: !!auth,
      role: auth?.role ?? null,
      async login(username, password) {
        const res = await authApi.login(username, password);
        const stored: StoredAuth = {
          token: res.token,
          role: res.role,
          username,
        };
        setStoredAuth(stored);
        return stored;
      },
      async register(username, email, password) {
        await authApi.register(username, email, password);
      },
      logout() {
        clearAuth();
      },
      updateAuth(patch) {
        const cur = getStoredAuth();
        if (!cur) return;
        setStoredAuth({ ...cur, ...patch });
      },
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function hasAccess(role: Role | null, allowed: Role[]): boolean {
  if (!role) return false;
  return allowed.includes(role);
}
