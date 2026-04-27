'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_ASSETS = [
  { id: 'media-001', title: 'Championship Final 2024', type: 'video', industry: 'Media & Entertainment', size: '2.4 GB' },
  { id: 'media-002', title: 'Album Cover', type: 'image', industry: 'Media & Entertainment', size: '4.2 MB' },
  { id: 'ecom-001', title: 'Fall Collection', type: 'image', industry: 'E-commerce', size: '8.1 MB' },
  { id: 'ecom-002', title: 'Brand Logo', type: 'image', industry: 'E-commerce', size: '156 KB' },
  { id: 'social-001', title: 'Influencer Reel', type: 'video', industry: 'Social Media', size: '156 MB' },
  { id: 'social-002', title: 'Brand Campaign', type: 'image', industry: 'Social Media', size: '12.3 MB' },
];

export default function AssetsPage() {
  const router = useRouter();
  const [assets] = useState(DEMO_ASSETS);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!stored) router.push('/login');
  }, [router]);

  const filtered = assets.filter(a => filter === 'all' || a.industry === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <header style={{ background: '#1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #00d4ff, #0891b2)', borderRadius: '6px' }}></div>
          <span style={{ fontWeight: 600 }}>TrustGuard</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #334155', borderRadius: '4px', color: '#94a3b8', fontSize: '12px' }}>Dashboard</button>
          <button onClick={() => router.push('/asset-list')} style={{ padding: '6px 12px', background: '#00d4ff', border: 'none', borderRadius: '4px', color: '#0f172a', fontSize: '12px', fontWeight: 600 }}>Assets</button>
          <button onClick={() => router.push('/upload')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #334155', borderRadius: '4px', color: '#94a3b8', fontSize: '12px' }}>Upload</button>
        </div>
      </header>

      <main style={{ padding: '20px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Asset Library</h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>{assets.length} assets</p>
          </div>
          <button onClick={() => router.push('/upload')} style={{ padding: '8px 16px', background: '#00d4ff', border: 'none', borderRadius: '6px', color: '#0f172a', fontWeight: 600, fontSize: '13px' }}>+ Upload</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', padding: '6px 12px', borderRadius: '4px', color: '#fff', fontSize: '13px' }}>
              <option value="all">All Industries</option>
              <option value="Media & Entertainment">Media</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Social Media">Social</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '6px 10px', background: viewMode === 'grid' ? '#00d4ff' : '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: viewMode === 'grid' ? '#0f172a' : '#94a3b8', fontSize: '12px' }}>Grid</button>
            <button onClick={() => setViewMode('table')} style={{ padding: '6px 10px', background: viewMode === 'table' ? '#00d4ff' : '#1e293b', border: '1px solid #334155', borderRadius: '4px', color: viewMode === 'table' ? '#0f172a' : '#94a3b8', fontSize: '12px' }}>Table</button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {filtered.map(a => (
              <div key={a.id} style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
                <div style={{ height: '100px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                  {a.type === 'video' ? '🎬' : '🖼️'}
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>{a.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>{a.industry.split(' ')[0]}</span>
                    <button onClick={() => router.push(`/asset-list/${a.id}`)} style={{ padding: '6px 12px', background: '#00d4ff', border: 'none', borderRadius: '4px', color: '#0f172a', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '11px' }}>Asset</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '11px' }}>Industry</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '11px' }}>Type</th>
                <th style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '11px' }}>Size</th>
                <th style={{ padding: '10px', textAlign: 'right', color: '#64748b', fontSize: '11px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '10px', fontWeight: 500 }}>{a.title}</td>
                  <td style={{ padding: '10px' }}><span style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '2px 8px', borderRadius: '10px', fontSize: '10px' }}>{a.industry.split(' ')[0]}</span></td>
                  <td style={{ padding: '10px', color: '#94a3b8' }}>{a.type}</td>
                  <td style={{ padding: '10px', color: '#94a3b8' }}>{a.size}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    <button onClick={() => router.push(`/asset-list/${a.id}`)} style={{ padding: '4px 10px', background: '#00d4ff', border: 'none', borderRadius: '4px', color: '#0f172a', fontSize: '11px', cursor: 'pointer' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}