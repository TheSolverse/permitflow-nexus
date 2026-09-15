import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

const tables = [
  'users',
  'projects',
  'applications',
  'documents',
  'regulatory_rules',
  'compliance_tasks',
  'audit_logs',
  'officer_queries',
  'notifications',
  'activity_logs',
  'todos'
];

async function inspectSchema() {
  console.log('=== SUPABASE LIVE SCHEMA INSPECTION ===');
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`\nTable [${table}]: ERROR - ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`\nTable [${table}]: ACTIVE (Sample row columns)`);
      console.log('Columns:', Object.keys(data[0]));
      console.log('Sample Row:', JSON.stringify(data[0], null, 2));
    } else {
      // If table is empty, insert nothing, just check if select works
      console.log(`\nTable [${table}]: ACTIVE (0 rows)`);
    }
  }
}

inspectSchema();
