import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkurtvvrgwlgpbyfbmup.supabase.co';
// Replace with your service role key. CAUTION: Do not expose the service role key in a public client.
const serviceRoleKey = 'YOUR_SERVICE_ROLE_KEY';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function scanSchema() {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('table_name, column_name')
    .eq('table_schema', 'public');
    
  if (error) {
    console.error('Error scanning schema:', error);
  } else {
    console.log('Schema information (public schema):');
    data.forEach(({ table_name, column_name }) => {
      console.log(`${table_name} -> ${column_name}`);
    });
  }
}

scanSchema();
