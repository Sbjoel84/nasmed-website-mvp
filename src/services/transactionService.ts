import supabase from '../lib/supabaseClient';

export interface Transaction {
  id: string;
  created_at: string;
  payment_ref: string;
  member_name: string;
  email: string;
  membership_type: string;
  amount: string;
  currency: string;
  payment_method: string;
  status: string;
  type: string;
  description: string;
  receipt_url?: string;
  receipt_name?: string;
  application_id?: string;
}

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(txn: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(txn)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  async updateReceiptByRef(ref: string, receiptUrl: string, receiptName: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .update({ receipt_url: receiptUrl, receipt_name: receiptName })
      .eq('payment_ref', ref);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  subscribeToChanges(callback: (payload: unknown) => void) {
    return supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, callback)
      .subscribe();
  },
};

export default transactionService;
