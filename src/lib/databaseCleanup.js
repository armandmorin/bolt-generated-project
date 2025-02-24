import { supabase } from './supabase';

async function cleanupDatabase() {
  try {
    // 1. First check if redundant tables exist
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    // 2. Drop redundant tables
    if (tables) {
      const redundantTables = ['admins', 'admin_users', 'admin_profiles'];
      for (const table of redundantTables) {
        await supabase.rpc('drop_table_if_exists', { table_name: table });
      }
    }

    // 3. Update clients table to use user_id instead of admin_id
    await supabase.rpc('update_clients_schema');

    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

export { cleanupDatabase };
