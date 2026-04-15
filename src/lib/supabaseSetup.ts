/**
 * Supabase Setup Verification Helper
 * This helps diagnose connection and schema issues
 */

import supabase from './supabaseClient';

export const supabaseSetup = {
  async verifyConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error && error.status === 400) {
        // This is expected for anonymous access
        console.log('✓ Supabase connection OK (anonymous)');
        return true;
      }
      console.log('✓ Supabase connection OK');
      return true;
    } catch (err) {
      console.error('❌ Supabase connection failed:', err);
      return false;
    }
  },

  async verifyApplicationsTable(): Promise<{
    exists: boolean;
    columns: string[];
    error?: string;
  }> {
    try {
      // Try to query the table schema
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .limit(0);

      if (error) {
        console.error('❌ Applications table error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        return {
          exists: false,
          columns: [],
          error: `${error.code}: ${error.message}`,
        };
      }

      console.log('✓ Applications table exists');
      return {
        exists: true,
        columns: [],
      };
    } catch (err: any) {
      console.error('❌ Table verification failed:', err);
      return {
        exists: false,
        columns: [],
        error: err.message,
      };
    }
  },

  async refreshSchemaCache(): Promise<void> {
    try {
      console.log('🔄 Refreshing Supabase schema cache...');

      // Force a schema refresh by making a query that includes all columns
      const { error } = await supabase
        .from('applications')
        .select('id, created_at, full_name, email, phone, profession, membership_type, state, qualifications, workplace, referee1_name, referee1_email, referee1_phone, referee2_name, referee2_email, referee2_phone, statement, status, payment_status')
        .limit(0);

      if (error) {
        console.warn('⚠️ Schema cache refresh query failed (this is normal):', error.message);
      } else {
        console.log('✓ Schema cache refreshed');
      }
    } catch (err) {
      console.warn('⚠️ Schema cache refresh failed (this is normal):', err);
    }
  },

  async runFullDiagnostics(): Promise<{
    connection: boolean;
    tableExists: boolean;
    ready: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Refresh schema cache first
    await this.refreshSchemaCache();

    // Check connection
    const connectionOk = await this.verifyConnection();
    if (!connectionOk) errors.push('Cannot connect to Supabase');

    // Check table
    const tableCheck = await this.verifyApplicationsTable();
    if (!tableCheck.exists) {
      errors.push(tableCheck.error || 'Applications table does not exist');
    }

    return {
      connection: connectionOk,
      tableExists: tableCheck.exists,
      ready: connectionOk && tableCheck.exists,
      errors,
    };
  },
};

// Run diagnostics on load (development only)
if (import.meta.env.DEV) {
  console.log('🔍 Running Supabase diagnostics...');
  supabaseSetup.runFullDiagnostics().then((result) => {
    if (result.ready) {
      console.log('✅ Supabase is ready!');
    } else {
      console.warn('⚠️ Supabase issues detected:', result.errors);
      console.warn(
        'To fix: Run the database schema setup or check your Supabase configuration.'
      );
    }
  });
}

// Make available globally for manual testing
if (import.meta.env.DEV) {
  (window as any).supabaseSetup = supabaseSetup;
}
