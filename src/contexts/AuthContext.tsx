import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import authService, { AuthUser } from '../lib/authService';

interface AuthContextType {
  user: AuthUser | null;
  session: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, membershipType: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const session = await authService.getSession();
        setSession(session?.user || null);
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user, error } = await authService.signIn(email, password);
    if (error) {
      return { error };
    }
    if (user) {
      setUser(user);
      const session = await authService.getSession();
      setSession(session?.user || null);
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string, membershipType: string) => {
    const { user, error } = await authService.signUp(email, password, fullName, membershipType);
    if (error) {
      return { error };
    }
    if (user) {
      setUser(user);
    }
    return { error: null };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  const isAdmin = user?.role === 'admin';
  const isMember = user?.role === 'member' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        isMember,
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