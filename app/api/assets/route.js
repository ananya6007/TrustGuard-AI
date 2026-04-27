import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const encryptionKey = process.env.ENCRYPTION_KEY || 'trustguard-secret-key-32chars!';

const supabase = createClient(supabaseUrl, supabaseKey);

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

function getUserId(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/userId=([^;]+)/);
  return match ? Buffer.from(match[1], 'base64').toString() : null;
}

export async function GET(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const decrypted = assets.map(a => ({
      ...a,
      data: a.encrypted_data ? decrypt(a.encrypted_data) : null
    }));

    return Response.json({ success: true, assets: decrypted });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, assetType, fileUrl, fileSize, industry, description, fileHash } = body;

    const encryptedData = encrypt({
      fileUrl,
      description,
      additionalInfo: 'E2EE encrypted'
    });

    const { data, error } = await supabase
      .from('assets')
      .insert({
        user_id: userId,
        title,
        asset_type: assetType || 'image',
        file_size: fileSize || 0,
        industry: industry || 'Media & Entertainment',
        file_hash: fileHash || Math.random().toString(36).substring(2, 10),
        encrypted_data: encryptedData,
        status: 'protected'
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, asset: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}