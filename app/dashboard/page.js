'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ASSETS = [
  { id: 'media-001', title: 'Championship Final 2024', type: 'video', industry: 'Media & Entertainment' },
  { id: 'media-002', title: 'Album Cover', type: 'image', industry: 'Media & Entertainment' },
  { id: 'ecom-001', title: 'Fall Collection', type: 'image', industry: 'E-commerce' },
  { id: 'ecom-002', title: 'Brand Logo', type: 'image', industry: 'E-commerce' },
  { id: 'social-001', title: 'Influencer Reel', type: 'video', industry: 'Social Media' },
  { id: 'social-002', title: 'Brand Campaign', type: 'image', industry: 'Social Media' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div style={{ background: '#0f172a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <header style={{ background: '#1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #00d4ff, #0891b2)', borderRadius: '6px' }}></div>
          <span style={{ fontWeight: 600 }}>TrustGuard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{user.name || user.email}</span>
          {user.isDemo && <span style={{ background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>DEMO</span>}
          <button onClick={handleLogout} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '20px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>Welcome back, {user.name || 'User'}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{ASSETS.length}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Assets</div>
          </div>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ec4899' }}>{ASSETS.filter(a => a.industry === 'Media & Entertainment').length}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Media</div>
          </div>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#8b5cf6' }}>{ASSETS.filter(a => a.industry === 'E-commerce').length}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>E-commerce</div>
          </div>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{ASSETS.filter(a => a.industry === 'Social Media').length}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Social</div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '20px' }}>
          <button onClick={() => router.push('/asset-list')} style={{ padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>📦 Assets</button>
          <button onClick={() => router.push('/upload')} style={{ padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>📤 Upload</button>
          <button onClick={() => router.push('/monitor')} style={{ padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>🔍 Monitor</button>
          <button onClick={() => router.push('/violations')} style={{ padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>⚠️ Violations</button>
          <button onClick={() => router.push('/settings')} style={{ padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>⚙️ Settings</button>
          <button onClick={handleLogout} style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>🚪 Logout</button>
        </div>

        {/* Recent Assets */}
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Recent Assets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {ASSETS.slice(0, 6).map(a => (
            <button key={a.id} onClick={() => router.push(`/asset-list/${a.id}`)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{a.title}</div>
              <span style={{ fontSize: '10px', background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '2px 6px', borderRadius: '8px' }}>{a.industry.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}