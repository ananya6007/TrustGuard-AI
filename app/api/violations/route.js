import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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

    const { data: violations, error } = await supabase
      .from('violations')
      .select('*')
      .eq('user_id', userId)
      .order('detected_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, violations: violations || [] });
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
    const { assetId, platform, url, confidence, severity } = body;

    const { data, error } = await supabase
      .from('violations')
      .insert({
        user_id: userId,
        asset_id: assetId,
        platform,
        source_url: url,
        confidence: confidence || 85,
        severity: severity || 'medium',
        status: 'detected'
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, violation: data });
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
      .from('violations')
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