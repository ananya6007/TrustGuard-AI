import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const body = await request.json();
    const { table, data } = body;
    
    if (!table) {
      return Response.json({ error: 'Table name required' }, { status: 400 });
    }

    const { error } = await supabase.from(table).insert(data);
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ success: true, message: `Inserted into ${table}` });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table');
    
    if (!table) {
      return Response.json({ error: 'Table name required' }, { status: 400 });
    }

    const { data, error } = await supabase.from(table).select('*');
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ success: true, data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}