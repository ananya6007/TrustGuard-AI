import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function createTables() {
  try {
    const { error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      const { error: insertError } = await supabase.from('users').insert([{ id: 'init', email: 'init@trustguard.ai', name: 'System' }]);
      if (!insertError || insertError?.message?.includes('duplicate')) {
        await supabase.from('users').delete().eq('email', 'init@trustguard.ai');
      }
    }
  } catch (e) {
    console.log('Using fallback in-memory storage');
  }
}

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function createAsset(userId, data) {
  const { data: asset, error } = await supabase
    .from('assets')
    .insert([{
      user_id: userId,
      title: data.title,
      asset_type: data.assetType,
      file_hash: data.fileHash,
      file_size: data.fileSize,
      industry: data.industry,
      description: data.description
    }])
    .select()
    .single();
  if (error) throw error;
  return asset;
}

export async function getUserAssets(userId) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAsset(id) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createViolation(assetId, data) {
  const { data: violation, error } = await supabase
    .from('violations')
    .insert([{
      asset_id: assetId,
      platform: data.platform,
      source_url: data.sourceUrl,
      match_confidence: data.matchConfidence,
      severity: data.severity
    }])
    .select()
    .single();
  if (error) throw error;
  return violation;
}

export async function getAssetViolations(assetId) {
  const { data, error } = await supabase
    .from('violations')
    .select('*')
    .eq('asset_id', assetId)
    .order('detected_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function logActivity(userId, action, details) {
  const { error } = await supabase
    .from('activity_logs')
    .insert([{
      user_id: userId,
      action,
      details
    }]);
  if (error) throw error;
}

export async function getActivityLogs(userId) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export { createTables };