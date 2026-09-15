import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

const schemaSqlTables = [
  'users',
  'business_projects',
  'applications',
  'documents',
  'inspections',
  'compliance_tasks',
  'incentive_schemes',
  'noc_applications',
  'joint_inspections',
  'audit_logs',
  'notifications',
  'approval_rules',
  'regulatory_sources',
  'regulatory_rules',
  'rule_conditions',
  'rule_test_cases'
];

async function checkSchemaSqlTables() {
  console.log('=== COMPREHENSIVE SUPABASE TABLE CHECK ===');
  const results: Record<string, any> = {};
  for (const table of schemaSqlTables) {
    const { count, data, error } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      results[table] = { status: 'MISSING/ERROR', message: error.message, code: error.code };
    } else {
      results[table] = {
        status: 'EXISTS',
        rowCount: count,
        sampleColumns: data && data[0] ? Object.keys(data[0]) : []
      };
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

checkSchemaSqlTables();
