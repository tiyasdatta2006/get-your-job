import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { AuthProvider, Credits, User } from "~/types/auth";
import type { Resume } from "~/types/resume";
import { createSampleResumes } from "~/data/sample-resume";

const STORAGE_KEY = "getyourjob-state-v1";

const FREE_OPTIMIZE_CREDITS = 10;
const FREE_EXECUTIVE_CREDITS = 1;

export interface AppState {
  user: User | null;
  credits: Credits;
  resumes: Resume[];
}

interface AppContextValue extends AppState {
  login: (provider: AuthProvider, name: string, email: string) => void;
  logout: () => void;
  addResume: (resume: Resume) => void;
  updateResume: (id: string, updater: (r: Resume) => Resume) => void;
  deleteResume: (id: string) => void;
  getResume: (id: string) => Resume | undefined;
  spendOptimizeCredit: () => boolean;
  spendExecutiveCredit: () => boolean;
}

function defaultCredits(): Credits {
  return {
    optimizeRemaining: FREE_OPTIMIZE_CREDITS,
    optimizeTotal: FREE_OPTIMIZE_CREDITS,
    executiveRemaining: FREE_EXECUTIVE_CREDITS,
    executiveTotal: FREE_EXECUTIVE_CREDITS,
    atsBuilds: 0,
  };
}

function loadState(): AppState {
  const fallback: AppState = {
    user: null,
    credits: defaultCredits(),
    resumes: createSampleResumes(),
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as AppState;
    return {
      user: parsed.user ?? null,
      credits: parsed.credits ?? defaultCredits(),
      resumes: parsed.resumes?.length ? parsed.resumes : createSampleResumes(),
    };
  } catch {
    return fallback;
  }
}

const AppContext = createContext<AppContextValue | null>(null);

const AVATAR_SEED = "https://api.dicebear.com/9.x/initials/svg?backgroundType=gradientLinear&seed=";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    user: null,
    credits: defaultCredits(),
    resumes: createSampleResumes(),
  }));

  // Hydrate from localStorage on mount (client only) to avoid SSR mismatch.
  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = useCallback((provider: AuthProvider, name: string, email: string) => {
    setState((s) => ({
      ...s,
      user: {
        id: Math.random().toString(36).slice(2),
        name,
        email,
        avatar: `${AVATAR_SEED}${encodeURIComponent(name)}`,
        provider,
        plan: "free",
      },
    }));
  }, []);

  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), []);

  const addResume = useCallback((resume: Resume) => {
    setState((s) => ({ ...s, resumes: [resume, ...s.resumes] }));
  }, []);

  const updateResume = useCallback((id: string, updater: (r: Resume) => Resume) => {
    setState((s) => ({
      ...s,
      resumes: s.resumes.map((r) => (r.id === id ? updater(r) : r)),
    }));
  }, []);

  const deleteResume = useCallback((id: string) => {
    setState((s) => ({ ...s, resumes: s.resumes.filter((r) => r.id !== id) }));
  }, []);

  const getResume = useCallback(
    (id: string) => state.resumes.find((r) => r.id === id),
    [state.resumes]
  );

  const spendOptimizeCredit = useCallback((): boolean => {
    let ok = false;
    setState((s) => {
      if (s.credits.optimizeRemaining <= 0) return s;
      ok = true;
      return {
        ...s,
        credits: { ...s.credits, optimizeRemaining: s.credits.optimizeRemaining - 1 },
      };
    });
    return ok;
  }, []);

  const spendExecutiveCredit = useCallback((): boolean => {
    let ok = false;
    setState((s) => {
      if (s.credits.executiveRemaining <= 0) return s;
      ok = true;
      return {
        ...s,
        credits: { ...s.credits, executiveRemaining: s.credits.executiveRemaining - 1 },
      };
    });
    return ok;
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      login,
      logout,
      addResume,
      updateResume,
      deleteResume,
      getResume,
      spendOptimizeCredit,
      spendExecutiveCredit,
    }),
    [state, login, logout, addResume, updateResume, deleteResume, getResume, spendOptimizeCredit, spendExecutiveCredit]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
