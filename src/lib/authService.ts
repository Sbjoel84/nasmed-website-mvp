import supabase from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'member';
  full_name?: string;
  membership_type?: string;
}

export const authService = {
  async signIn(credential: string, password: string): Promise<{ user: AuthUser | null; session: Session | null; error: string | null }> {
    try {
      // Determine if credential is email or username
      const isEmail = credential.includes('@');
      let emailToUse = credential;

      // If it's a username, look up the email from profiles table
      if (!isEmail) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('email')
          .ilike('full_name', `%${credential}%`)
          .or(`email.ilike.%${credential}%`)
          .single();

        if (profileData?.email) {
          emailToUse = profileData.email;
        } else {
          // Try fuzzy match on username or name
          return { user: null, session: null, error: 'Username or email not found' };
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          role: profileData?.role || 'member',
          full_name: profileData?.full_name,
          membership_type: profileData?.membership_type,
        };

        return { user, session: data.session, error: null };
      }

      return { user: null, session: null, error: 'Unknown error occurred' };
    } catch (err) {
      return { user: null, session: null, error: 'An unexpected error occurred' };
    }
  },

  async signUp(email: string, password: string, fullName: string, membershipType: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            membership_type: membershipType,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          membership_type: membershipType,
          role: 'member',
        });

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'member',
          full_name: fullName,
          membership_type: membershipType,
        };

        return { user, error: null };
      }

      return { user: null, error: 'Unknown error occurred' };
    } catch (err) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        role: profileData?.role || 'member',
        full_name: profileData?.full_name,
        membership_type: profileData?.membership_type,
      };
    } catch (err) {
      return null;
    }
  },

  async getSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (err) {
      return null;
    }
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;