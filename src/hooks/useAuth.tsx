import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  refreshRole: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = session?.user ?? null;

  const refreshRole = async () => {
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (!currentUser) {
      setIsAdmin(false);
      return false;
    }

    const { data } = await supabase.from("user_roles").select("role").eq("user_id", currentUser.id).eq("role", "admin").maybeSingle();
    const nextIsAdmin = data?.role === "admin";
    setIsAdmin(nextIsAdmin);
    return nextIsAdmin;
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      setTimeout(() => void refreshRole(), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      setTimeout(() => void refreshRole(), 0);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ user, session, isAdmin, loading, refreshRole }), [user, session, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};