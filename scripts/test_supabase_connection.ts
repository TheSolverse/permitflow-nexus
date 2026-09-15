import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log('--- Testing Supabase Connection ---');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? `${supabaseKey.substring(0, 15)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Key is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // 1. Query 'users' table
    console.log('\n1. Testing query on "users" table:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.log('❌ Error querying "users" table:');
      console.log('   Message:', usersError.message);
      console.log('   Details:', usersError.details);
      console.log('   Hint:', usersError.hint);
      console.log('   Code:', usersError.code);
    } else {
      console.log('✅ Successfully connected to Supabase and queried "users" table!');
      console.log(`   Found ${users.length} row(s):`, users);
    }

    // 2. Query 'profiles' table as fallback check
    console.log('\n2. Testing query on "profiles" table:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.log('ℹ️ Query on "profiles" table:');
      console.log('   Message:', profilesError.message);
      console.log('   Code:', profilesError.code);
    } else {
      console.log('✅ Successfully queried "profiles" table!');
      console.log(`   Found ${profiles.length} row(s):`, profiles);
    }

    // 3. Test raw public schema REST discovery
    console.log('\n3. Testing REST API endpoint reachability:');
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    console.log('   HTTP Status:', res.status, res.statusText);
    if (res.ok) {
      const openApiSpec = await res.json();
      const definitions = openApiSpec.definitions ? Object.keys(openApiSpec.definitions) : [];
      console.log('✅ OpenAPI schema retrieved successfully.');
      console.log('   Available tables / definitions in public schema:', definitions);
    } else {
      const errText = await res.text();
      console.log('❌ REST schema error response:', errText);
    }

  } catch (err: any) {
    console.error('❌ Connection or network error:', err);
  }
}

testConnection();
