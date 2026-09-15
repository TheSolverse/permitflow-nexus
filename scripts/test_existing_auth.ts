import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testExistingAuthUser() {
  console.log('=== TESTING SIGN IN & PROFILE LOOKUP FOR AUTH USER ===\n');

  const existingEmail = 'rahul.nexus1789452619559@gmail.com';
  const password = 'Password@123';

  console.log(`1. Signing in with Supabase Auth (signInWithPassword): ${existingEmail}`);
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: existingEmail,
    password: password
  });

  if (authErr || !authData?.user) {
    console.error('❌ Sign in failed:', authErr?.message);
    return;
  }

  console.log('✅ Supabase Auth sign in successful!');
  console.log('   Auth User UID:', authData.user.id);
  console.log('   Auth User Email:', authData.user.email);

  console.log('\n2. Loading profile from public.users:');
  const { data: profile, error: profileErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileErr) {
    console.error('❌ Profile lookup error:', profileErr.message);
  } else {
    console.log('✅ Profile found and loaded from public.users:');
    console.log('   ID:', profile.id);
    console.log('   Name:', profile.name);
    console.log('   Role:', profile.role);
    console.log('   Password hash is null:', profile.password_hash === null);
  }

  await supabase.auth.signOut();
  console.log('\n3. Signed out cleanly.');
}

testExistingAuthUser();
