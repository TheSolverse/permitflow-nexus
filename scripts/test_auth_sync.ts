import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testSignupAndLogin() {
  console.log('=== TESTING SUPABASE SIGNUP & LOGIN SYNC ===\n');

  const testEmail = `rahul.nexus${Date.now()}@gmail.com`;
  const testPassword = 'Password@123';
  const testName = 'Rahul Nexus';

  console.log(`1. Testing Supabase Auth Signup for: ${testEmail}`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: testName,
        role: 'ENTREPRENEUR'
      }
    }
  });

  if (authError) {
    console.log('❌ Supabase Auth error:', authError.message);
  } else {
    console.log('✅ Supabase Auth created successfully!');
    console.log('   Auth User ID:', authData.user?.id);
    console.log('   Auth User Email:', authData.user?.email);
  }

  console.log('\n2. Testing Table Insert into public.users:');
  const userId = authData.user?.id || `usr-${Date.now()}`;
  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      name: testName,
      email: testEmail,
      password_hash: testPassword,
      role: 'ENTREPRENEUR',
      district: 'Pune',
      permissions: []
    })
    .select()
    .single();

  if (dbError) {
    console.log('❌ public.users insert error:', dbError.message);
  } else {
    console.log('✅ public.users inserted successfully!');
    console.log('   Record ID:', dbUser.id, 'Email:', dbUser.email);
  }

  console.log('\n3. Testing Query from public.users:');
  const { data: queriedUser, error: queryError } = await supabase
    .from('users')
    .select('*')
    .eq('email', testEmail)
    .single();

  if (queryError) {
    console.log('❌ Query error:', queryError.message);
  } else {
    console.log('✅ User queried successfully from Supabase:', queriedUser.email, `(Role: ${queriedUser.role})`);
  }
}

testSignupAndLogin();
