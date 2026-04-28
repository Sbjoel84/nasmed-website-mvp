import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import authService, { AuthUser } from '../lib/authService';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, membershipType: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  markPasswordChanged: () => Promise<{ error: string | null }>;
  refreshUser: () => Promise<void>;
  setUserField: (updates: Partial<AuthUser>) => void;
  isAdmin: boolean;
  isMember: boolean;
  mustChangePassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const timer = setTimeout(() => { if (mounted) setLoading(false); }, 1500);
      try {
        const session = await authService.getSession();
        if (session && mounted) {
          setSession(session);
          const currentUser = await authService.getCurrentUser();
          if (mounted) setUser(currentUser);
        }
      } finally {
        clearTimeout(timer);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Only fetch the profile when the context has no user yet (e.g. a tab
        // that regains focus or an external auth trigger). Explicit logins go
        // through AuthContext.signIn which already sets both user and session,
        // so re-fetching here would just be a wasted round-trip.
        if (mounted) setSession(session);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        if (mounted) setSession(session);
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user, session, error } = await authService.signIn(email, password);
    if (error) return { error };
    if (user) {
      setUser(user);
      if (session) setSession(session);
    }
    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    return authService.updatePassword(newPassword);
  };

  const markPasswordChanged = async () => {
    const result = await authService.markPasswordChanged();
    if (!result.error && user) {
      setUser({ ...user, must_change_password: false });
    }
    return result;
  };

  const signUp = async (email: string, password: string, fullName: string, membershipType: string) => {
    const { user, error } = await authService.signUp(email, password, fullName, membershipType);
    if (error) return { error };
    if (user) setUser(user);
    return { error: null };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const refreshUser = async () => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
  };

  const setUserField = (updates: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  const isAdmin = user?.role === 'admin';
  const isMember = user?.role === 'member' || isAdmin;
  const mustChangePassword = user?.must_change_password === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updatePassword,
        markPasswordChanged,
        refreshUser,
        setUserField,
        isAdmin,
        isMember,
        mustChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
