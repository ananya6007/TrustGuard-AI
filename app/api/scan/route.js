import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const PLATFORMS = [
  { name: 'Instagram', baseUrl: 'https://instagram.com' },
  { name: 'TikTok', baseUrl: 'https://tiktok.com' },
  { name: 'YouTube', baseUrl: 'https://youtube.com' },
  { name: 'Facebook', baseUrl: 'https://facebook.com' },
  { name: 'Twitter', baseUrl: 'https://twitter.com' },
  { name: 'Pinterest', baseUrl: 'https://pinterest.com' },
];

function getUserId(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/userId=([^;]+)/);
  return match ? Buffer.from(match[1], 'base64').toString() : null;
}

async function simulateScan(assetId, platform) {
  await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
  
  const hasViolation = Math.random() > 0.4;
  
  if (hasViolation) {
    return {
      platform: platform.name,
      url: `${platform.baseUrl}/user/${Math.random().toString(36).substring(7)}`,
      confidence: Math.floor(Math.random() * 20) + 75,
      severity: Math.random() > 0.5 ? 'high' : 'medium'
    };
  }
  return null;
}

export async function POST(request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { assetId, platforms } = body;

    const platformsToScan = platforms || PLATFORMS.map(p => p.name);
    const results = [];

    for (const platformName of platformsToScan) {
      const platform = PLATFORMS.find(p => p.name === platformName);
      if (!platform) continue;

      const result = await simulateScan(assetId, platform);
      
      if (result) {
        const { data, error } = await supabase
          .from('violations')
          .insert({
            user_id: userId,
            asset_id: assetId,
            platform: result.platform,
            source_url: result.url,
            confidence: result.confidence,
            severity: result.severity,
            status: 'detected'
          })
          .select()
          .single();

        if (!error && data) {
          results.push(data);
        }
      }
    }

    return Response.json({ 
      success: true, 
      scanned: platformsToScan.length,
      violationsFound: results.length,
      results 
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request) {
  return Response.json({ 
    success: true, 
    platforms: PLATFORMS.map(p => ({ name: p.name, url: p.baseUrl, status: 'active' }))
  });
}