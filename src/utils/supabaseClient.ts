import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://nchikwztmgtgjofpqypl.supabase.co';

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_pieKOST4EIRu40oxBw7kqA_xjCH4T-d';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
