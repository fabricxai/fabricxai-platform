'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface UserSession {
  email: string;
  name: string;
  company: string;
  role: string;
}

interface AppContextValue {
  user: UserSession | null;
  isAIPanelOpen: boolean;
  setIsAIPanelOpen: (open: boolean) => void;
  aiPanelPrompt: string | undefined;
  setAIPanelPrompt: (prompt: string | undefined) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  handleAskMarbim: (prompt: string) => void;
  /** Re-read the session (e.g. right after sign-in). */
  refreshSession: () => void;
  handleLogout: () => void;
  isAuthChecked: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [aiPanelPrompt, setAIPanelPrompt] = useState<string | undefined>(undefined);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const loadUser = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setIsAuthChecked(true);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, role, companies(name)')
      .eq('id', authUser.id)
      .single();

    const company = (profile?.companies as { name?: string } | null)?.name ?? '';
    setUser({
      email: profile?.email ?? authUser.email ?? '',
      name: profile?.full_name ?? authUser.email?.split('@')[0] ?? '',
      company,
      role: profile?.role ?? 'owner',
    });
    setIsAuthChecked(true);
  }, [supabase]);

  useEffect(() => {
    loadUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });
    return () => subscription.unsubscribe();
  }, [loadUser, supabase]);

  const refreshSession = useCallback(() => {
    void loadUser();
  }, [loadUser]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace('/login');
  }, [supabase, router]);

  const handleAskMarbim = useCallback((prompt: string) => {
    setAIPanelPrompt(prompt);
    setIsAIPanelOpen(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAIPanelOpen,
        setIsAIPanelOpen,
        aiPanelPrompt,
        setAIPanelPrompt,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        handleAskMarbim,
        refreshSession,
        handleLogout,
        isAuthChecked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
