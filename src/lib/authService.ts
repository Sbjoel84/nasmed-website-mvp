import supabase from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'member';
  full_name?: string;
  membership_type?: string;
  username?: string;
  must_change_password?: boolean;
  member_number?: string;
  position?: string;
}

export const authService = {
  async signIn(credential: string, password: string): Promise<{ user: AuthUser | null; session: Session | null; error: string | null }> {
    try {
      const isEmail = credential.includes('@');
      let emailToUse = credential;

      if (!isEmail) {
        // 1. Try exact username match first
        const { data: byUsername } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', credential)
          .maybeSingle();

        if (byUsername?.email) {
          emailToUse = byUsername.email;
        } else {
          // 2. Fallback: fuzzy match on email or full_name
          const { data: byName } = await supabase
            .from('profiles')
            .select('email')
            .or(`email.ilike.%${credential}%,full_name.ilike.%${credential}%`)
            .maybeSingle();

          if (byName?.email) {
            emailToUse = byName.email;
          } else {
            return { user: null, session: null, error: 'Username or email not found' };
          }
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
          username: profileData?.username,
          must_change_password: profileData?.must_change_password ?? false,
          member_number: profileData?.member_number,
          position: profileData?.position,
        };

        return { user, session: data.session, error: null };
      }

      return { user: null, session: null, error: 'Unknown error occurred' };
    } catch {
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
    } catch {
      return { user: null, error: 'An unexpected error occurred' };
    }
  },

  async signUpMember(
    email: string,
    password: string,
    fullName: string,
    membershipType: string,
    username: string,
    memberNumber: string,
    position: string,
  ): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, membership_type: membershipType } },
      });

      if (error) return { user: null, error: error.message };

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          membership_type: membershipType,
          role: 'member',
          username,
          member_number: memberNumber,
          position,
          must_change_password: true,
          status: 'active',
        });

        return {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            role: 'member',
            full_name: fullName,
            membership_type: membershipType,
            username,
            must_change_password: true,
            member_number: memberNumber,
            position,
          },
          error: null,
        };
      }

      return { user: null, error: 'Unknown error occurred' };
    } catch {
      return { user: null, error: 'An unexpected error occurred' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch {
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
        username: profileData?.username,
        must_change_password: profileData?.must_change_password ?? false,
        member_number: profileData?.member_number,
        position: profileData?.position,
      };
    } catch {
      return null;
    }
  },

  async getSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch {
      return null;
    }
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  },

  async markPasswordChanged(): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'Not authenticated' };
      const { error } = await supabase
        .from('profiles')
        .update({ must_change_password: false })
        .eq('id', user.id);
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  },

  async resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default authService;
