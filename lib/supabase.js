import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const encryptionKey = process.env.ENCRYPTION_KEY || 'trustguard-super-secret-key-32chars';

export const supabase = createClient(supabaseUrl, supabaseKey);

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
}

function decrypt(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, encryptionKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

export async function createUser(email, password, name) {
  const id = uuidv4();
  const hashedPassword = CryptoJS.SHA256(password + encryptionKey).toString();
  const encryptedData = encrypt({ email, name, createdAt: new Date().toISOString() });
  
  const { data, error } = await supabase
    .from('users')
    .insert([{ id, email, password: hashedPassword, encrypted_data: encryptedData }])
    .select()
    .single();
  
  if (error) throw new Error(error.message.includes('duplicate') ? 'User already exists' : error.message);
  return { id, email, name };
}

export async function loginUser(email, password) {
  const hashedPassword = CryptoJS.SHA256(password + encryptionKey).toString();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', hashedPassword)
    .single();
  
  if (error || !data) return null;
  return { id: data.id, email: data.email, name: data.name || data.email.split('@')[0] };
}

export async function userExists(email) {
  const { data } = await supabase.from('users').select('id').eq('email', email).single();
  return !!data;
}

export async function createAsset(userId, data) {
  const id = uuidv4();
  const fileHash = uuidv4().substring(0, 8);
  const encryptedMeta = encrypt({
    title: data.title,
    description: data.description,
    fileUrl: data.fileUrl,
    industry: data.industry
  });
  
  const { data: asset, error } = await supabase
    .from('assets')
    .insert([{
      id,
      user_id: userId,
      title: data.title,
      asset_type: data.assetType || 'image',
      file_hash: fileHash,
      file_size: data.fileSize || 0,
      industry: data.industry || 'Media & Entertainment',
      encrypted_meta: encryptedMeta
    }])
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return { id, ...data, fileHash };
}

export async function getUserAssets(userId) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(a => ({
    id: a.id,
    title: a.title,
    type: a.asset_type,
    industry: a.industry,
    hash: a.file_hash,
    size: a.file_size,
    isDemo: false
  }));
}

export async function getAsset(id) {
  const { data, error } = await supabase.from('assets').select('*').eq('id', id).single();
  if (error || !data) return null;
  const meta = data.encrypted_meta ? decrypt(data.encrypted_meta) : {};
  return {
    id: data.id,
    title: data.title,
    type: data.asset_type,
    industry: data.industry,
    hash: data.file_hash,
    size: data.file_size,
    ...meta
  };
}

export async function deleteAsset(id) {
  await supabase.from('assets').delete().eq('id', id);
}

export async function createViolation(assetId, data) {
  const id = uuidv4();
  await supabase.from('violations').insert([{
    id,
    asset_id: assetId,
    platform: data.platform,
    source_url: data.sourceUrl,
    match_confidence: data.matchConfidence || 0,
    severity: data.severity || 'medium'
  }]);
  return id;
}

export async function getAssetViolations(assetId) {
  const { data } = await supabase
    .from('violations')
    .select('*')
    .eq('asset_id', assetId)
    .order('detected_at', { ascending: false });
  return data || [];
}

export async function logActivity(userId, action, details) {
  await supabase.from('activity_logs').insert([{
    id: uuidv4(),
    user_id: userId,
    action,
    details
  }]);
}

export async function getActivityLogs(userId) {
  const { data } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(100);
  return data || [];
}