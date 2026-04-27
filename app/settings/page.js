'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    setUser(JSON.parse(stored));
    setApiKey(localStorage.getItem('apiKey') || '');
  }, [router]);

  const handleSaveApiKey = () => { localStorage.setItem('apiKey', apiKey); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleLogout = () => { sessionStorage.removeItem('user'); localStorage.removeItem('user'); router.push('/login'); };

  if (!mounted || !user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="aurora-bg" style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <nav className="flex justify-between items-center p-4" style={{ background: 'rgba(19,26,42,0.9)', borderBottom: '1px solid var(--divider)' }}>
          <Link href="/dashboard" className="logo text-xl font-bold">← Settings</Link>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </nav>
        <div className="container mt-6" style={{ padding: '0 24px', maxWidth: 600 }}>
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <div className="card mb-4"><h3 className="font-bold mb-4">Account</h3><div className="mb-4"><div className="text-muted text-sm">Email</div><div className="font-bold">{user.email || 'demo@trustguard.ai'}</div></div><div className="mb-4"><div className="text-muted text-sm">Name</div><div className="font-bold">{user.name || user.email?.split('@')[0]}</div></div>{user.isDemo && <span className="badge badge-warning">Demo Mode</span>}</div>
          <div className="card mb-4"><h3 className="font-bold mb-4">API Keys</h3><input className="input mb-2" type="password" placeholder="Enter API key" value={apiKey} onChange={e => setApiKey(e.target.value)} /><button className="btn btn-primary" onClick={handleSaveApiKey}>{saved ? '✓ Saved!' : 'Save API Key'}</button></div>
          <div className="card"><h3 className="font-bold mb-4">Quick Links</h3><Link href="/asset-list" className="btn btn-secondary w-full mb-2">📁 Asset Library</Link><Link href="/upload" className="btn btn-secondary w-full mb-2">📤 Upload Asset</Link><Link href="/monitor" className="btn btn-secondary w-full mb-2">🔍 Monitor</Link><Link href="/violations" className="btn btn-secondary w-full">⚠️ Violations</Link></div>
        </div>
      </div>
    </div>
  );
}