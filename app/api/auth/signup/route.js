import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { name: name || email.split('@')[0] },
        emailRedirectTo: `${request.headers.get('origin')}/dashboard`
      }
    });

    if (error) {
      if (error.message.includes('already been registered')) {
        return Response.json({ error: 'User already exists' }, { status: 400 });
      }
      return Response.json({ error: error.message }, { status: 400 });
    }

    const user = data.user;
    
    if (user) {
      await supabase.from('users').insert([{
        id: user.id,
        email: user.email,
        name: name || email.split('@')[0]
      }]);
    }

    return Response.json({
      success: true,
      message: 'Verification email sent! Check your inbox.',
      user: {
        id: user?.id,
        email: user?.email
      }
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}