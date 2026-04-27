import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function initTables() {
  try {
    console.log('Checking tables...');
    
    const { data: users, error: usersError } = await supabase.from('users').select('id').limit(1);
    if (usersError) {
      console.log('Creating users table...');
      await supabase.rpc('create_users_table', {});
    }
    
    const { data: assets, error: assetsError } = await supabase.from('assets').select('id').limit(1);
    if (assetsError) {
      console.log('Creating assets table...');
      await supabase.rpc('create_assets_table', {});
    }
    
    const { data: violations, error: violationsError } = await supabase.from('violations').select('id').limit(1);
    if (violationsError) {
      console.log('Creating violations table...');
      await supabase.rpc('create_violations_table', {});
    }
    
    const { data: activity, error: activityError } = await supabase.from('activity_logs').select('id').limit(1);
    if (activityError) {
      console.log('Creating activity_logs table...');
      await supabase.rpc('create_activity_logs_table', {});
    }
    
    return { success: true, message: 'Tables ready' };
  } catch (e) {
    return { error: e.message };
  }
}

export async function GET() {
  return Response.json(await initTables());
}

export async function POST() {
  return Response.json(await initTables());
}