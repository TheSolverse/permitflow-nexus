import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testCurrentAuthStatus() {
  console.log('=== TESTING CURRENT SUPABASE AUTH STATE ===\n');

  const testEmail = `test.user.${Date.now()}@gmail.com`;
  const testPassword = 'Password@123';
  const testName = 'Test Entrepreneur';

  console.log(`1. Testing supabase.auth.signUp with: ${testEmail}`);
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        name: testName,
        role: 'ENTREPRENEUR'
      }
    }
  });

  if (signUpErr) {
    console.log('❌ Supabase Auth SignUp returned error:');
    console.log('   Message:', signUpErr.message);
    console.log('   Status:', signUpErr.status);
    console.log('   Name:', signUpErr.name);
    console.log('   Code:', (signUpErr as any).code);
    return;
  }

  console.log('✅ Supabase Auth SignUp SUCCESSFUL!');
  console.log('   Auth User ID:', signUpData.user?.id);
  console.log('   Auth User Email:', signUpData.user?.email);
  console.log('   Email Confirmed At:', signUpData.user?.confirmed_at);
  console.log('   Identities:', signUpData.user?.identities?.length);

  const authUserId = signUpData.user!.id;

  console.log('\n2. Testing public.users insert with the SAME Auth user ID:');
  const { data: dbUser, error: dbErr } = await supabase
    .from('users')
    .upsert({
      id: authUserId,
      name: testName,
      email: testEmail,
      password_hash: null, // Never store password in public.users
      role: 'ENTREPRENEUR',
      department: null,
      designation: null,
      district: 'Pune',
      permissions: []
    }, { onConflict: 'id' })
    .select()
    .single();

  if (dbErr) {
    console.log('❌ public.users insert error:', dbErr.message);
    return;
  }

  console.log('✅ public.users profile created successfully with Auth ID!');
  console.log('   Database User ID:', dbUser.id);
  console.log('   IDs match exactly:', dbUser.id === authUserId);
  console.log('   Password hash is null:', dbUser.password_hash === null);

  console.log('\n3. Testing supabase.auth.signInWithPassword:');
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });

  if (signInErr) {
    console.log('ℹ️ Sign in returned error (e.g. email confirmation required):');
    console.log('   Message:', signInErr.message);
    console.log('   Status:', signInErr.status);
  } else {
    console.log('✅ Sign in SUCCESSFUL!');
    console.log('   Session User ID:', signInData.user.id);
  }

  await supabase.auth.signOut();
  console.log('\n4. Signed out successfully.');
}

testCurrentAuthStatus();
