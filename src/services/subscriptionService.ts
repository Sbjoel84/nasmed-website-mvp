import supabase from '../lib/supabaseClient';

export interface Subscription {
  id: string;
  created_at: string;
  member_id?: string;
  tier?: string;
  start_date?: string;
  expiry_date?: string;
  status: string;
  amount?: string;
}

export const subscriptionService = {
  async getAll(): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(sub: Omit<Subscription, 'id' | 'created_at'>): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(sub)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  subscribeToChanges(callback: (payload: unknown) => void) {
    return supabase
      .channel('subscriptions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, callback)
      .subscribe();
  },
};

export default subscriptionService;
