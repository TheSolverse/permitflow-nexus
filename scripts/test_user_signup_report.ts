import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function runLiveSignupAudit() {
  const testEmail = `audit.test.${Date.now()}@gmail.com`;
  const testPassword = 'SecurePassword@123';
  const testName = 'Audit Verification User';

  let authUserCreated = 'NO';
  let authUserId: string | null = null;
  let publicProfileCreated = 'NO';
  let emailConfirmationRequired = 'UNKNOWN';
  let exactError: string | null = null;

  try {
    // Step 1: Call supabase.auth.signUp()
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          role: 'ENTREPRENEUR'
        }
      }
    });

    if (authErr) {
      exactError = `${authErr.name}: ${authErr.message} (status: ${authErr.status})`;
      if (authErr.message.includes('rate limit')) {
        exactError = `${authErr.message} (Code: ${(authErr as any).code || 'over_email_send_rate_limit'})`;
      }
    } else if (authData?.user) {
      authUserCreated = 'YES';
      authUserId = authData.user.id;
      emailConfirmationRequired = authData.session ? 'NO' : 'YES';

      // Step 2: Insert into public.users with the exact same authUserId
      const { data: dbProfile, error: dbErr } = await supabase
        .from('users')
        .upsert({
          id: authUserId,
          name: testName,
          email: testEmail,
          password_hash: null,
          role: 'ENTREPRENEUR',
          department: null,
          designation: null,
          district: 'Pune',
          permissions: []
        }, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (dbErr) {
        exactError = `DB Profile Error: ${dbErr.message}`;
      } else if (dbProfile) {
        publicProfileCreated = 'YES';
      }
    }
  } catch (err: any) {
    exactError = err.message;
  }

  // Print Structured Audit Report
  console.log('----------------------------------------');
  console.log(`AUTH USER CREATED: ${authUserCreated}`);
  console.log(`AUTH USER ID: ${authUserId || 'None'}`);
  console.log(`PUBLIC PROFILE CREATED: ${publicProfileCreated}`);
  console.log(`EMAIL CONFIRMATION REQUIRED: ${emailConfirmationRequired}`);
  console.log(`EXACT ERROR: ${exactError || 'None'}`);
  console.log('----------------------------------------');
}

runLiveSignupAudit();
