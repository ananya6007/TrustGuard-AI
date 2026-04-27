'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEMO_ASSETS = [
  { id: 'media-001', title: 'Championship Final 2024', type: 'video', industry: 'Media & Entertainment', status: 'protected', scannedAt: '2024-03-10' },
  { id: 'media-002', title: 'Album Cover - New Release', type: 'image', industry: 'Media & Entertainment', status: 'protected', scannedAt: '2024-02-20' },
  { id: 'ecom-001', title: 'Fall Collection - Product Shots', type: 'image', industry: 'E-commerce', status: 'protected', scannedAt: '2024-01-10' },
  { id: 'ecom-002', title: 'Brand Logo - Official', type: 'image', industry: 'E-commerce', status: 'protected', scannedAt: '2024-01-05' },
  { id: 'social-001', title: 'Influencer Reel - Summer Vibes', type: 'video', industry: 'Social Media', status: 'protected', scannedAt: '2024-03-01' },
  { id: 'social-002', title: 'Brand Campaign - 2024', type: 'image', industry: 'Social Media', status: 'protected', scannedAt: '2024-02-28' },
];

const PLATFORMS = [
  { name: 'Instagram', icon: '📸', status: 'active' },
  { name: 'TikTok', icon: '🎵', status: 'active' },
  { name: 'YouTube', icon: '▶️', status: 'active' },
  { name: 'Facebook', icon: '📘', status: 'active' },
  { name: 'Twitter/X', icon: '🐦', status: 'active' },
  { name: 'Pinterest', icon: '📌', status: 'active' },
];

export default function MonitorPage() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [scanning, setScanning] = useState({});
  const [results, setResults] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!stored) { router.push('/login'); }
  }, [router]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const triggerScan = async (id) => {
    setScanning(prev => ({ ...prev, [id]: true }));
    await new Promise(r => setTimeout(r, 2000));
    
    const newResults = [
      { platform: 'Instagram', url: `https://instagram.com/p/${Math.random().toString(36).substring(7)}`, confidence: Math.floor(Math.random() * 15) + 85, severity: 'high' },
      { platform: 'TikTok', url: `https://tiktok.com/@user/${Math.random().toString(36).substring(7)}`, confidence: Math.floor(Math.random() * 20) + 75, severity: 'medium' },
      { platform: 'YouTube', url: `https://youtube.com/watch?v=${Math.random().toString(36).substring(7)}`, confidence: Math.floor(Math.random() * 25) + 70, severity: 'low' },
    ];
    
    setScanning(prev => ({ ...prev, [id]: false }));
    setResults(prev => [...prev, { assetId: id, results: newResults, scannedAt: new Date().toISOString() }]);
    setScanHistory(prev => [{ assetId: id, platforms: PLATFORMS.length, violations: newResults.length, scannedAt: new Date().toISOString() }, ...prev]);
  };

  const triggerBatchScan = async () => {
    for (const id of selected) {
      await triggerScan(id);
    }
  };

  if (!mounted) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050810' }}>
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="aurora-bg" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '40px' }}>
      <nav className="nav">
        <Link href="/dashboard" className="logo">Content Monitor</Link>
        <div className="nav-links">
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/violations" className="nav-link">Violations</Link>
          <Link href="/settings" className="nav-link">Settings</Link>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <div className="section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Platform Monitor</h1>
                  <p style={{ color: '#a0aec0' }}>Scan your assets across major platforms for unauthorized use</p>
                </div>
                <button className="btn btn-primary" onClick={triggerBatchScan} disabled={selected.length === 0} style={{ padding: '12px 24px' }}>
                  {selected.length > 0 ? `Scan Selected (${selected.length})` : 'Select Assets to Scan'}
                </button>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}><input type="checkbox" checked={selected.length === DEMO_ASSETS.length && selected.length > 0} onChange={() => setSelected(selected.length === DEMO_ASSETS.length ? [] : DEMO_ASSETS.map(a => a.id))} /></th>
                    <th>Asset</th>
                    <th>Industry</th>
                    <th>Type</th>
                    <th>Last Scanned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ASSETS.map(a => (
                    <tr key={a.id}>
                      <td><input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} style={{ width: '18px', height: '18px' }} /></td>
                      <td><Link href={`/asset-list/${a.id}`} style={{ fontWeight: 600, color: '#fff' }}>{a.title}</Link></td>
                      <td><span className="badge badge-success">{a.industry.split(' ')[0]}</span></td>
                      <td><span className="badge badge-info">{a.type}</span></td>
                      <td style={{ color: '#a0aec0', fontSize: '13px' }}>{a.scannedAt}</td>
                      <td>
                        {scanning[a.id] ? (
                          <span className="badge badge-warning">Scanning...</span>
                        ) : (
                          <button className="btn btn-secondary" onClick={() => triggerScan(a.id)} style={{ padding: '6px 12px', fontSize: '12px' }}>🔍 Scan</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="section">
              <h2 className="section-title">Scan History</h2>
              {scanHistory.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Platforms Scanned</th>
                      <th>Violations Found</th>
                      <th>Scanned At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanHistory.map((scan, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{DEMO_ASSETS.find(a => a.id === scan.assetId)?.title}</td>
                        <td>{scan.platforms}</td>
                        <td><span className={scan.violations > 0 ? 'badge badge-error' : 'badge badge-success'}>{scan.violations} found</span></td>
                        <td style={{ color: '#a0aec0', fontSize: '13px' }}>{new Date(scan.scannedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="card-static" style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#a0aec0' }}>No scans yet</div>
                  <div style={{ color: '#64748b', marginTop: '8px' }}>Select assets and click Scan to check for violations</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card-static mb-4">
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>Monitored Platforms</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PLATFORMS.map(p => (
                  <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{p.icon}</span>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-static">
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>Platform Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#a0aec0' }}>Total Platforms</span>
                    <span style={{ fontWeight: 600 }}>{PLATFORMS.length}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#a0aec0' }}>Assets Protected</span>
                    <span style={{ fontWeight: 600 }}>{DEMO_ASSETS.length}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%', background: 'linear-gradient(90deg, #8b5cf6, #10b981)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#a0aec0' }}>Violations Found</span>
                    <span style={{ fontWeight: 600, color: '#ef4444' }}>{results.reduce((acc, r) => acc + r.results.length, 0)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '25%', background: '#ef4444' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}