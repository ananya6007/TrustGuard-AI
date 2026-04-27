'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const ASSETS = {
  'media-001': { id: 'media-001', title: 'Championship Final 2024', type: 'video', industry: 'Media & Entertainment', hash: 'a1b2c3d4e5f6g7h8i9j0', size: '2.4 GB', status: 'protected', createdAt: '2024-03-15' },
  'media-002': { id: 'media-002', title: 'Album Cover - New Release', type: 'image', industry: 'Media & Entertainment', hash: 'b2c3d4e5f6g7h8i9j0k1', size: '4.2 MB', status: 'protected', createdAt: '2024-02-20' },
  'ecom-001': { id: 'ecom-001', title: 'Fall Collection - Product Shots', type: 'image', industry: 'E-commerce', hash: 'd4e5f6g7h8i9j0k1l2', size: '8.1 MB', status: 'protected', createdAt: '2024-01-10' },
  'ecom-002': { id: 'ecom-002', title: 'Brand Logo - Official', type: 'image', industry: 'E-commerce', hash: 'e5f6g7h8i9j0k1l2m3', size: '156 KB', status: 'protected', createdAt: '2024-01-05' },
  'social-001': { id: 'social-001', title: 'Influencer Reel - Summer Vibes', type: 'video', industry: 'Social Media', hash: 'h8i9j0k1l2m3n4o5', size: '156 MB', status: 'protected', createdAt: '2024-03-01' },
  'social-002': { id: 'social-002', title: 'Brand Campaign - 2024', type: 'image', industry: 'Social Media', hash: 'i9j0k1l2m3n4o5p6', size: '12.3 MB', status: 'protected', createdAt: '2024-02-28' },
};

const VIOLATIONS = {
  'media-001': [
    { id: 1, platform: 'Instagram', url: 'https://instagram.com/p/abc123', confidence: 94, severity: 'high', detectedAt: '2024-03-10' },
    { id: 2, platform: 'TikTok', url: 'https://tiktok.com/@user/video', confidence: 87, severity: 'medium', detectedAt: '2024-03-08' }
  ],
  'media-002': [
    { id: 3, platform: 'Facebook', url: 'https://facebook.com/page', confidence: 92, severity: 'high', detectedAt: '2024-02-15' }
  ],
  'ecom-001': [],
  'ecom-002': [
    { id: 4, platform: 'Twitter', url: 'https://twitter.com/fan', confidence: 98, severity: 'high', detectedAt: '2024-01-20' },
    { id: 5, platform: 'Pinterest', url: 'https://pinterest.com', confidence: 76, severity: 'medium', detectedAt: '2024-01-18' }
  ],
  'social-001': [
    { id: 6, platform: 'Instagram', url: 'https://instagram.com/reel/abc', confidence: 89, severity: 'medium', detectedAt: '2024-03-05' }
  ],
  'social-002': [],
};

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [id, setId] = useState(null);
  const [asset, setAsset] = useState(null);
  const [verified, setVerified] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    
    const assetId = params?.id;
    if (assetId) {
      setId(assetId);
    }
  }, [params?.id, router]);

  useEffect(() => {
    if (mounted && id) {
      const uploaded = JSON.parse(localStorage.getItem('uploadedAssets') || '[]');
      uploaded.forEach((a, i) => {
        ASSETS['uploaded-' + (i + 1)] = { ...a, id: 'uploaded-' + (i + 1), status: 'protected', createdAt: new Date().toISOString() };
        VIOLATIONS['uploaded-' + (i + 1)] = [];
      });
    }
  }, [mounted, id]);

  useEffect(() => {
    if (id && ASSETS[id]) {
      setAsset(ASSETS[id]);
    } else if (id) {
      router.push('/asset-list');
    }
  }, [id, router]);

  const handleVerify = () => {
    if (twoFactorCode === '123456' || twoFactorCode === '000000' || twoFactorCode === '') {
      setVerified(true);
      setError('');
    } else {
      setError('Invalid code. Use 123456 for demo.');
    }
  };

  const handleDownload = () => {
    alert('Download started: ' + asset?.title);
  };

  const handleScan = async () => {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2000));
    setScanning(false);
  };

  if (!mounted || !asset) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050810' }}>
      <div className="loading-spinner"></div>
    </div>
  );

  const violations = VIOLATIONS[id] || [];

  return (
    <div className="aurora-bg" style={{ position: 'relative', minHeight: '100vh', paddingBottom: '40px' }}>
      <nav className="nav">
        <Link href="/asset-list" className="logo">← Asset Details</Link>
        <div className="nav-links">
          <Link href="/asset-list" className="nav-link">Asset Library</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <div className="card-static mb-6">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{asset.title}</h1>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span className="badge badge-success">{asset.industry}</span>
                    <span className="badge badge-info">{asset.type.toUpperCase()}</span>
                    <span className="badge badge-warning">{asset.status}</span>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={handleScan} disabled={scanning} style={{ padding: '10px 20px' }}>
                  {scanning ? 'Scanning...' : '🔍 Scan for Violations'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingTop: '16px', borderTop: '1px solid #2d3748' }}>
                <div>
                  <div style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '4px' }}>FILE HASH</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#00d4ff', wordBreak: 'break-all' }}>{asset.hash}</div>
                </div>
                <div>
                  <div style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '4px' }}>FILE SIZE</div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{asset.size}</div>
                </div>
                <div>
                  <div style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '4px' }}>CREATED</div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{asset.createdAt}</div>
                </div>
                <div>
                  <div style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '4px' }}>ASSET ID</div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{asset.id}</div>
                </div>
              </div>
            </div>

            <div className="section">
              <h2 className="section-title">Detected Violations ({violations.length})</h2>
              {violations.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Source URL</th>
                      <th>Confidence</th>
                      <th>Severity</th>
                      <th>Detected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.map(v => (
                      <tr key={v.id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{v.platform}</td>
                        <td><a href={v.url} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', fontSize: '13px' }}>{v.url.substring(0, 40)}...</a></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="progress-bar" style={{ width: '60px' }}>
                              <div className="progress-fill" style={{ width: v.confidence + '%' }}></div>
                            </div>
                            <span style={{ fontSize: '13px' }}>{v.confidence}%</span>
                          </div>
                        </td>
                        <td><span className={`badge ${v.severity === 'high' ? 'badge-error' : 'badge-warning'}`}>{v.severity}</span></td>
                        <td style={{ color: '#a0aec0', fontSize: '13px' }}>{v.detectedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="card-static" style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>No Violations Found</div>
                  <div style={{ color: '#a0aec0' }}>This asset is not being used without authorization</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card-static mb-4">
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: '#fff' }}>2FA Verification</h3>
              {verified ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#10b981', marginBottom: '24px' }}>Verified</div>
                  <button className="btn btn-primary w-full" onClick={handleDownload} style={{ padding: '14px' }}>
                    Download Asset
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#a0aec0', fontSize: '14px', marginBottom: '16px' }}>Enter 2FA code to download. Demo: 123456</p>
                  <input 
                    className="input" 
                    placeholder="2FA code" 
                    value={twoFactorCode} 
                    onChange={e => setTwoFactorCode(e.target.value)} 
                    maxLength={6}
                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px', marginBottom: '12px' }}
                  />
                  {error && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
                  <button className="btn btn-primary w-full mb-3" onClick={handleVerify} style={{ padding: '12px' }}>Verify</button>
                  <button className="btn btn-secondary w-full" onClick={() => setVerified(true)} style={{ padding: '12px', borderStyle: 'dashed' }}>
                    Skip (Demo Mode)
                  </button>
                </div>
              )}
            </div>

            <div className="card-static">
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/monitor" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px 16px' }}>
                  📊 Monitor Platform
                </Link>
                <Link href="/violations" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px 16px' }}>
                  ⚠️ View All Violations
                </Link>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px 16px', borderColor: '#ef4444' }}>
                  🗑️ Delete Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}