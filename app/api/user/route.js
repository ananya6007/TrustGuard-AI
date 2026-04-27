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

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, user });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, apiKey } = body;

    const updates = {};
    if (name) updates.name = name;
    if (apiKey) updates.api_key = apiKey;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, user: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}