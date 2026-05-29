import supabase from '../lib/supabaseClient';

export interface Application {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  profession: string;
  membership_type: string;
  state: string;
  qualifications: string;
  workplace: string;
  referee1_name: string;
  referee1_email: string;
  referee1_phone: string;
  referee2_name: string;
  referee2_email: string;
  referee2_phone: string;
  statement: string;
  status: 'pending' | 'approved' | 'rejected';
  payment_status: 'pending' | 'paid';
  payment_receipt_url?: string;
}

export const applicationService = {
  async getAll(): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async checkTableExists(): Promise<{ exists: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .limit(1);

      if (error) {
        console.error('Table check error:', error.message, error.code, error.hint);
        return { exists: false, error: error.message };
      }
      return { exists: true };
    } catch (err) {
      console.error('Table check failed:', err);
      return { exists: false, error: String(err) };
    }
  },

  async getById(id: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async getPending(): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(application: Omit<Application, 'id' | 'created_at' | 'status' | 'payment_status'>): Promise<Application> {
    console.log('Creating application with data:', application);

    const tableCheck = await this.checkTableExists();
    if (!tableCheck.exists) {
      throw new Error(
        tableCheck.error
          ? `Applications table not accessible: ${tableCheck.error}`
          : 'Applications table does not exist. Please run the database schema setup.'
      );
    }

    // Use explicit column names to avoid schema cache issues
    const { data, error } = await supabase
      .from('applications')
      .insert({
        full_name: application.full_name,
        email: application.email,
        phone: application.phone,
        profession: application.profession,
        membership_type: application.membership_type,
        state: application.state,
        qualifications: application.qualifications,
        workplace: application.workplace,
        referee1_name: application.referee1_name,
        referee1_email: application.referee1_email,
        referee1_phone: application.referee1_phone,
        referee2_name: application.referee2_name,
        referee2_email: application.referee2_email,
        referee2_phone: application.referee2_phone,
        statement: application.statement,
        status: 'pending',
        payment_status: 'pending',
      })
      .select('id, created_at, full_name, email, phone, profession, membership_type, state, qualifications, workplace, referee1_name, referee1_email, referee1_phone, referee2_name, referee2_email, referee2_phone, statement, status, payment_status')
      .single();

    if (error) {
      console.error('❌ Supabase Insert Error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    console.log('✓ Application created successfully:', data);
    return data;
  },

  async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async updatePayment(id: string, paymentRef: string, paymentMethod: string): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .update({ payment_ref: paymentRef, payment_method: paymentMethod, payment_status: 'paid' })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  subscribeToChanges(callback: (payload: any) => void) {
    return supabase
      .channel('applications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, callback)
      .subscribe();
  },
};

export default applicationService;