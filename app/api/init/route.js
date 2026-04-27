import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES_SQL = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can view users" ON users FOR SELECT USING (true);
    CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
  `,
  assets: `
    CREATE TABLE IF NOT EXISTS assets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      title TEXT NOT NULL,
      asset_type TEXT,
      file_hash TEXT,
      file_size BIGINT,
      industry TEXT,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can view assets" ON assets FOR SELECT USING (true);
    CREATE POLICY "Anyone can insert assets" ON assets FOR INSERT WITH CHECK (true);
  `,
  violations: `
    CREATE TABLE IF NOT EXISTS violations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      asset_id UUID REFERENCES assets(id),
      platform TEXT,
      source_url TEXT,
      match_confidence FLOAT,
      severity TEXT,
      status TEXT DEFAULT 'pending',
      detected_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can view violations" ON violations FOR SELECT USING (true);
    CREATE POLICY "Anyone can insert violations" ON violations FOR INSERT WITH CHECK (true);
  `,
  activity_logs: `
    CREATE TABLE IF NOT EXISTS activity_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      action TEXT NOT NULL,
      details TEXT,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can view activity_logs" ON activity_logs FOR SELECT USING (true);
    CREATE POLICY "Anyone can insert activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);
  `
};

async function ensureTables() {
  const results = {};
  
  for (const [tableName, sql] of Object.entries(TABLES_SQL)) {
    try {
      const { error } = await supabase.from(tableName).select('id').limit(1);
      if (error?.code === '42P01') {
        await supabase.rpc('exec_sql', { query: sql });
      }
      results[tableName] = { success: true };
    } catch (e) {
      results[tableName] = { error: e.message };
    }
  }
  
  return results;
}

export async function GET() {
  try {
    const results = await ensureTables();
    return Response.json({ success: true, results });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const results = await ensureTables();
    return Response.json({ success: true, results });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}