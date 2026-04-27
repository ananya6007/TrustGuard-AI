import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (email === 'demo@trustguard.ai' && password === 'demo1234') {
      const user = { email: 'demo@trustguard.ai', name: 'Demo User', isDemo: true };
      const token = Buffer.from(email).toString('base64');
      
      return new Response(JSON.stringify({ success: true, user, token }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `userId=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
        }
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return Response.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      return Response.json({ error: error.message }, { status: 400 });
    }

    const user = data.user;
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    const userInfo = {
      id: user.id,
      email: user.email,
      name: userData?.name || user.user_metadata?.name || email.split('@')[0]
    };

    const token = Buffer.from(user.id).toString('base64');

    return new Response(JSON.stringify({ success: true, user: userInfo, token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `userId=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
      }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}