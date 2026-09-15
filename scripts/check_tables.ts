import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

const candidateTables = [
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

async function checkAllTables() {
  console.log('\n--- Checking Table Availability in Supabase (Read-only) ---');
  for (const table of candidateTables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('Could not find')) {
        console.log(`❌ Table "${table}": Not found in schema cache`);
      } else {
        console.log(`⚠️ Table "${table}": Access error (${error.message}) [Code: ${error.code}]`);
      }
    } else {
      console.log(`✅ Table "${table}": Accessible (Row count: ${count ?? 0})`);
    }
  }
}

checkAllTables();
