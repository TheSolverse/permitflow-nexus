import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function runAuthVerification() {
  console.log('=== VERIFYING SUPABASE AUTHENTICATION PIPELINE ===\n');

  const demoAccounts = [
    { email: 'rahul.sharma@apexfoods.in', name: 'Rahul Sharma', role: 'ENTREPRENEUR' },
    { email: 'vk.patil@mpcb.gov.in', name: 'Dr. V. K. Patil', role: 'OFFICER' },
    { email: 'director.industry@maharashtra.gov.in', name: 'Dr. Harshvardhan Patil', role: 'ADMIN' }
  ];

  for (const acc of demoAccounts) {
    console.log(`--- Testing Demo Account: ${acc.name} (${acc.role}) ---`);

    // 1. Attempt Sign In
    let { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: acc.email,
      password: 'Password@123'
    });

    // 2. If not registered in Supabase Auth, Sign Up
    if (signInErr) {
      console.log(`ℹ️ Account not in Supabase Auth yet (${signInErr.message}). Provisioning...`);
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: acc.email,
        password: 'Password@123',
        options: {
          data: {
            name: acc.name,
            role: acc.role
          }
        }
      });

      if (signUpErr && !signUpErr.message.includes('already registered')) {
        console.log(`❌ SignUp error for ${acc.email}:`, signUpErr.message);
      } else {
        console.log(`✅ Provisioned in Supabase Auth! User ID:`, signUpData?.user?.id || 'Registered');
      }

      const retry = await supabase.auth.signInWithPassword({
        email: acc.email,
        password: 'Password@123'
      });
      signInData = retry.data;
      signInErr = retry.error;
    }

    if (signInErr) {
      console.log(`❌ Sign In failed:`, signInErr.message);
    } else {
      console.log(`✅ Supabase Auth Sign In SUCCESSFUL!`);
      console.log(`   Session User ID:`, signInData.user?.id);
      console.log(`   Session Email:`, signInData.user?.email);
    }

    // 3. Verify public.users profile lookup
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .ilike('email', acc.email)
      .maybeSingle();

    if (profileErr) {
      console.log(`❌ Profile query error:`, profileErr.message);
    } else {
      console.log(`✅ Database Profile confirmed in public.users:`, profile);
    }

    // 4. Sign Out
    await supabase.auth.signOut();
    console.log(`✅ Signed out cleanly.\n`);
  }

  // 5. Test Custom User Registration & Profile Linking
  const customEmail = `entrepreneur.mumbai.${Date.now()}@gmail.com`;
  console.log(`--- Testing Fresh Signup: ${customEmail} ---`);
  const { data: customSignUp, error: customSignUpErr } = await supabase.auth.signUp({
    email: customEmail,
    password: 'Password@123',
    options: {
      data: {
        name: 'Mumbai Food Ventures',
        role: 'ENTREPRENEUR'
      }
    }
  });

  if (customSignUpErr) {
    console.log(`❌ Custom SignUp error:`, customSignUpErr.message);
  } else {
    console.log(`✅ Custom User Created in Supabase Auth!`);
    console.log(`   Auth UID:`, customSignUp.user?.id);

    // Insert into public.users
    const { data: newProfile, error: newProfileErr } = await supabase
      .from('users')
      .upsert({
        id: customSignUp.user?.id || `usr-${Date.now()}`,
        name: 'Mumbai Food Ventures',
        email: customEmail,
        password_hash: 'Password@123',
        role: 'ENTREPRENEUR',
        district: 'Mumbai',
        permissions: []
      })
      .select()
      .single();

    if (newProfileErr) {
      console.log(`❌ Database insert error:`, newProfileErr.message);
    } else {
      console.log(`✅ Custom User Profile inserted into public.users:`, newProfile.email);
    }
  }

  console.log('\n=== ALL TESTS COMPLETED ===');
}

runAuthVerification();
