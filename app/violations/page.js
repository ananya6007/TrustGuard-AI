'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DEMO_VIOLATIONS = [
  { id: 1, assetId: 'media-001', asset: 'Championship Final 2024', platform: 'Instagram', url: 'https://instagram.com/p/abc123', confidence: 94, severity: 'high', status: 'detected', detectedAt: '2024-03-10' },
  { id: 2, assetId: 'media-001', asset: 'Championship Final 2024', platform: 'TikTok', url: 'https://tiktok.com/@user/video/123', confidence: 87, severity: 'medium', status: 'pending', detectedAt: '2024-03-08' },
  { id: 3, assetId: 'media-002', asset: 'Album Cover - New Release', platform: 'YouTube', url: 'https://youtube.com/watch?v=xyz', confidence: 76, severity: 'low', status: 'pending', detectedAt: '2024-02-15' },
  { id: 4, assetId: 'ecom-002', asset: 'Brand Logo - Official', platform: 'Facebook', url: 'https://facebook.com/fanpage', confidence: 98, severity: 'high', status: 'detected', detectedAt: '2024-01-20' },
  { id: 5, assetId: 'ecom-001', asset: 'Fall Collection', platform: 'Twitter', url: 'https://twitter.com/fan', confidence: 91, severity: 'high', status: 'detected', detectedAt: '2024-01-18' },
  { id: 6, assetId: 'social-001', asset: 'Influencer Reel', platform: 'Instagram', url: 'https://instagram.com/reel/xyz', confidence: 89, severity: 'medium', status: 'pending', detectedAt: '2024-03-05' },
];

export default function ViolationsPage() {
  const router = useRouter();
  const [violations, setViolations] = useState(DEMO_VIOLATIONS);
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!stored) { router.push('/login'); }
  }, [router]);

  const filteredViolations = violations.filter(v => filter === 'all' || v.severity === filter);
  
  const stats = {
    total: violations.length,
    high: violations.filter(v => v.severity === 'high').length,
    medium: violations.filter(v => v.severity === 'medium').length,
    low: violations.filter(v => v.severity === 'low').length,
  };

  const handleDismiss = (id) => {
    setViolations(violations.filter(v => v.id !== id));
  };

  if (!mounted) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050810' }}>
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="aurora-bg" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '40px' }}>
      <nav className="nav">
        <Link href="/dashboard" className="logo">Violations Monitor</Link>
        <div className="nav-links">
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/monitor" className="nav-link">Monitor</Link>
          <Link href="/settings" className="nav-link">Settings</Link>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '32px' }}>
        <div className="section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>All Violations</h1>
            <span className="badge badge-error" style={{ fontSize: '14px', padding: '8px 16px' }}>{stats.total} Detected</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ background: 'linear-gradient(135deg, #ef4444, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.high}</div>
              <div className="stat-label">High Severity</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ background: 'linear-gradient(135deg, #f59e0b, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.medium}</div>
              <div className="stat-label">Medium</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ background: 'linear-gradient(135deg, #10b981, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.low}</div>
              <div className="stat-label">Low</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => setFilter('all')} className={`badge-pill ${filter === 'all' ? '' : ''}`} style={{ background: filter === 'all' ? '#00d4ff' : 'transparent', color: filter === 'all' ? '#0a0e17' : '#a0aec0', borderColor: filter === 'all' ? '#00d4ff' : '#2d3748' }}>All ({stats.total})</button>
            <button onClick={() => setFilter('high')} style={{ background: filter === 'high' ? '#ef4444' : 'transparent', color: filter === 'high' ? '#fff' : '#a0aec0', border: '1px solid', borderColor: filter === 'high' ? '#ef4444' : '#2d3748', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer' }}>High ({stats.high})</button>
            <button onClick={() => setFilter('medium')} style={{ background: filter === 'medium' ? '#f59e0b' : 'transparent', color: filter === 'medium' ? '#fff' : '#a0aec0', border: '1px solid', borderColor: filter === 'medium' ? '#f59e0b' : '#2d3748', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer' }}>Medium ({stats.medium})</button>
            <button onClick={() => setFilter('low')} style={{ background: filter === 'low' ? '#10b981' : 'transparent', color: filter === 'low' ? '#fff' : '#a0aec0', border: '1px solid', borderColor: filter === 'low' ? '#10b981' : '#2d3748', padding: '6px 16px', borderRadius: '50px', cursor: 'pointer' }}>Low ({stats.low})</button>
          </div>

          {filteredViolations.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Platform</th>
                  <th>Source URL</th>
                  <th>Confidence</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Detected</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredViolations.map(v => (
                  <tr key={v.id}>
                    <td><Link href={`/asset-list/${v.assetId}`} style={{ fontWeight: 600, color: '#fff' }}>{v.asset}</Link></td>
                    <td style={{ fontWeight: 600 }}>{v.platform}</td>
                    <td><a href={v.url} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', fontSize: '13px' }}>{v.url.substring(0, 35)}...</a></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar" style={{ width: '60px' }}>
                          <div className="progress-fill" style={{ width: v.confidence + '%', background: v.confidence > 90 ? '#ef4444' : v.confidence > 75 ? '#f59e0b' : '#10b981' }}></div>
                        </div>
                        <span style={{ fontSize: '13px', minWidth: '35px' }}>{v.confidence}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${v.severity === 'high' ? 'badge-error' : v.severity === 'medium' ? 'badge-warning' : 'badge-success'}`}>{v.severity}</span></td>
                    <td><span className={`badge ${v.status === 'detected' ? 'badge-error' : 'badge-info'}`}>{v.status}</span></td>
                    <td style={{ color: '#a0aec0', fontSize: '13px' }}>{v.detectedAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>View</a>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDismiss(v.id)}>Dismiss</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="card-static" style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>No {filter === 'all' ? '' : filter} Violations</div>
              <div style={{ color: '#a0aec0' }}>All clear! No violations detected.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}