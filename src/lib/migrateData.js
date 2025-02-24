import { supabase } from './supabase';

async function migrateAdminData() {
  try {
    // Get all admin users from the users table
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('*')
      .in('role', ['admin', 'superadmin']);

    if (adminError) throw adminError;

    // Update clients table to reference correct admin users
    for (const admin of adminUsers) {
      const { error: updateError } = await supabase
        .from('clients')
        .update({ user_id: admin.id })
        .eq('admin_id', admin.id);

      if (updateError) console.error(`Error updating client for admin ${admin.id}:`, updateError);
    }

    console.log('Admin data migration completed');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

export { migrateAdminData };
