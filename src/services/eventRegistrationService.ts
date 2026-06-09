import supabase from '../lib/supabaseClient';

export interface EventRegistration {
  id: string;
  created_at: string;
  event_id?: string;
  event_title: string;
  full_name: string;
  email: string;
  organisation?: string;
  dues_status: 'member' | 'non-member';
  registration_fee: number;
  payment_status: 'free' | 'pending' | 'paid';
  payment_ref?: string;
  payment_method?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export const eventRegistrationService = {
  async getAll(): Promise<EventRegistration[]> {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(reg: Omit<EventRegistration, 'id' | 'created_at'>): Promise<EventRegistration> {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert(reg)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: EventRegistration['status']): Promise<void> {
    const { error } = await supabase
      .from('event_registrations')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  subscribeToChanges(callback: (payload: unknown) => void) {
    return supabase
      .channel('event-registrations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, callback)
      .subscribe();
  },
};

export default eventRegistrationService;
