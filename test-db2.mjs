import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_schema_info');
  // Wait, we don't have rpc for this. Let's try to fetch a verification to see if we can get the error details.
  const { data: vData, error: vError } = await supabase.from('spot_verifications').select('*').limit(1);
  console.log("verifications:", vData, vError);
}
check();
