import supabase from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

function toUsernameBase(fullName: string): string {
  const cleaned = fullName
    .replace(/^(Dr\.|Prof\.|Mrs\.|Mr\.|Ms\.|PT\.|Pharm\.|Engr\.)\s*/gi, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts[0] || 'member';
  return `${parts[0]}.${parts[parts.length - 1]}`;
}

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
  avatar_url?: string;
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
          // 2. Try firstname.lastname pattern against full_name
          let resolvedEmail: string | null = null;

          if (credential.includes('.')) {
            const [first, ...rest] = credential.split('.');
            const last = rest.join('.');
            if (first && last) {
              const { data: byNameParts } = await supabase
                .from('profiles')
                .select('email')
                .ilike('full_name', `%${first}%`)
                .ilike('full_name', `%${last}%`)
                .maybeSingle();
              if (byNameParts?.email) resolvedEmail = byNameParts.email;
            }
          }

          // 3. Fallback: fuzzy match on email prefix
          if (!resolvedEmail) {
            const { data: byEmail } = await supabase
              .from('profiles')
              .select('email')
              .ilike('email', `${credential}@%`)
              .maybeSingle();
            if (byEmail?.email) resolvedEmail = byEmail.email;
          }

          if (resolvedEmail) {
            emailToUse = resolvedEmail;
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

  async verifyPassword(email: string, password: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return !error;
    } catch {
      return false;
    }
  },

  async generateUniqueUsername(fullName: string): Promise<string> {
    const base = toUsernameBase(fullName);
    const { data } = await supabase.from('profiles').select('username').eq('username', base).maybeSingle();
    if (!data) return base;
    for (let i = 2; i <= 99; i++) {
      const candidate = `${base}${i}`;
      const { data: d } = await supabase.from('profiles').select('username').eq('username', candidate).maybeSingle();
      if (!d) return candidate;
    }
    return `${base}${Date.now()}`;
  },

  async activateMember(
    email: string,
    username: string,
    memberNumber: string,
    position: string,
    membershipType: string,
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username, member_number: memberNumber, position, membership_type: membershipType, must_change_password: true, status: 'active' })
        .eq('email', email);
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  },

  async updateProfile(userId: string, updates: { full_name?: string }): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  },

  async uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: string | null }> {
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const fileName = `${userId}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      if (uploadError) return { url: null, error: uploadError.message };
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return { url: publicUrl, error: null };
    } catch {
      return { url: null, error: 'Upload failed' };
    }
  },

  async setInitialUsername(email: string, fullName: string): Promise<void> {
    try {
      const username = await authService.generateUniqueUsername(fullName);
      await supabase.from('profiles').update({ username }).eq('email', email);
    } catch { /* best-effort */ }
  },
};

export default authService;
