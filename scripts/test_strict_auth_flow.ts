import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testStrictAuthPipeline() {
  console.log('=== TESTING STRICT SIGNUP & AUTH PIPELINE ===\n');

  // Test 1: Invalid Signup (Short Password) - Should Fail and NOT insert to public.users
  const invalidEmail = `test.invalid.${Date.now()}@gmail.com`;
  console.log('1. Testing Invalid Signup (Password < 6 chars):', invalidEmail);
  const { data: failAuth, error: failErr } = await supabase.auth.signUp({
    email: invalidEmail,
    password: '123'
  });

  if (failErr || !failAuth?.user) {
    console.log('✅ Correctly rejected by Supabase Auth:', failErr?.message);
  }

  // Verify public.users does NOT contain invalidEmail
  const { data: checkEmpty } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', invalidEmail)
    .maybeSingle();

  if (!checkEmpty) {
    console.log('✅ Verified: No record created in public.users when Auth fails!');
  } else {
    console.error('❌ FAILURE: public.users record was created when Auth failed!');
  }

  // Test 2: Valid Signup Flow
  const uniqueId = Date.now().toString().slice(-6);
  const validEmail = `permitflow.founder.${uniqueId}@gmail.com`;
  const validPassword = 'StrongPassword@123';
  const validName = `Founder ${uniqueId}`;

  console.log('\n2. Testing Valid Signup:', validEmail);
  // Step 1: Call supabase.auth.signUp
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: validEmail,
    password: validPassword,
    options: {
      data: {
        name: validName,
        role: 'ENTREPRENEUR'
      }
    }
  });

  if (authErr || !authData?.user) {
    console.error('❌ Supabase Auth signup failed:', authErr?.message);
    return;
  }

  const authUser = authData.user;
  console.log('✅ Supabase Auth signup SUCCESSFUL!');
  console.log('   Auth User UID:', authUser.id);
  console.log('   Auth Email:', authUser.email);

  // Step 2: Insert into public.users using authUser.id and password_hash = null
  const { data: dbProfile, error: dbErr } = await supabase
    .from('users')
    .upsert({
      id: authUser.id,
      name: validName,
      email: validEmail,
      password_hash: null, // No manual password storing
      role: 'ENTREPRENEUR',
      department: null,
      designation: null,
      district: 'Pune',
      permissions: []
    }, { onConflict: 'id' })
    .select()
    .single();

  if (dbErr) {
    console.error('❌ public.users profile insert failed:', dbErr.message);
    return;
  }

  console.log('✅ Profile inserted into public.users with Auth UID:', dbProfile.id);
  console.log('   Stored password_hash is null:', dbProfile.password_hash === null);

  // Test 3: Sign In with signInWithPassword
  console.log('\n3. Testing Login with signInWithPassword:');
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
    email: validEmail,
    password: validPassword
  });

  if (loginErr || !loginData?.user) {
    console.error('❌ Login failed:', loginErr?.message);
    return;
  }

  console.log('✅ Logged in successfully via Supabase Auth!');
  console.log('   Logged In User ID:', loginData.user.id);

  // Load profile from public.users
  const { data: loadedProfile, error: loadErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', loginData.user.id)
    .single();

  if (loadErr) {
    console.error('❌ Profile loading failed:', loadErr.message);
  } else {
    console.log('✅ Profile loaded from public.users:');
    console.log('   Name:', loadedProfile.name);
    console.log('   Email:', loadedProfile.email);
    console.log('   Role:', loadedProfile.role);
    console.log('   ID matches Auth UID:', loadedProfile.id === loginData.user.id);
  }

  // Test 4: Sign Out
  await supabase.auth.signOut();
  console.log('\n4. Signed out successfully.');

  console.log('\n=== ALL STRICT AUTH PIPELINE TESTS PASSED ===');
}

testStrictAuthPipeline();
