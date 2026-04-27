'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_SLIDES = [
  { title: 'TrustGuard AI', subtitle: 'Digital Trust Platform', icon: '🛡️', content: 'Protect your digital assets with AI-powered detection across the web.', color: '#00d4ff' },
  { title: 'Asset Library', subtitle: 'Organize & Protect', icon: '📦', content: 'Store all assets - Media, E-commerce, Social Media. Grid & table views.', color: '#ec4899' },
  { title: 'E2EE Encryption', subtitle: 'End-to-End Encrypted', icon: '🔐', content: 'Military-grade AES-256 encryption. Your assets are encrypted before upload and decrypted only on download.', color: '#8b5cf6' },
  { title: '2FA Security', subtitle: 'Protected Downloads', icon: '🕐', content: 'Every download requires 2FA verification. Demo code: 123456', color: '#a855f7' },
  { title: 'Platform Monitor', subtitle: 'Scan Everywhere', icon: '🔍', content: 'Scan Instagram, TikTok, YouTube, Facebook for violations.', color: '#f59e0b' },
  { title: 'Violations', subtitle: 'Real-Time Alerts', icon: '⚠️', content: 'Get alerts with confidence scores & severity levels.', color: '#ef4444' },
  { title: 'Upload', subtitle: 'Easy Uploads', icon: '📤', content: 'Upload images, videos, audio, docs. Get instant hash protection.', color: '#10b981' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@trustguard.ai');
  const [password, setPassword] = useState('demo1234');
  const [demoMode, setDemoMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const startDemo = () => {
    setDemoMode(true);
    setCurrentSlide(0);
  };

  useEffect(() => {
    let timer;
    if (demoMode) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev >= DEMO_SLIDES.length - 1) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [demoMode]);

  const handleLogin = () => {
    if (email === 'demo@trustguard.ai' && password === 'demo1234') {
      const user = { email: 'demo@trustguard.ai', name: 'Demo User', isDemo: true };
      sessionStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard');
    }
  };

  const enterDashboard = () => {
    const user = { email: 'demo@trustguard.ai', name: 'Demo User', isDemo: true };
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/dashboard');
  };

  const exitDemo = () => {
    setDemoMode(false);
    setCurrentSlide(0);
  };

  if (demoMode) {
    const slide = DEMO_SLIDES[currentSlide];
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at center, ${slide.color}15 0%, #0f172a 70%)`, transition: 'background 0.5s' }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <button onClick={exitDemo} style={{ position: 'absolute', top: '-60px', right: 0, padding: '8px 16px', background: 'transparent', border: '1px solid #334155', borderRadius: '6px', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}>
            ← Back to Login
          </button>

          <div style={{ marginBottom: '24px', color: slide.color, fontSize: '11px', letterSpacing: '3px' }}>DEMO MODE - FEATURE TOUR</div>
          
          <div style={{ fontSize: '72px', marginBottom: '20px', transition: 'transform 0.3s', transform: 'scale(1)' }}>{slide.icon}</div>
          
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{slide.title}</h1>
          <p style={{ fontSize: '18px', color: slide.color, marginBottom: '16px' }}>{slide.subtitle}</p>
          
          <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.6 }}>{slide.content}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
            {DEMO_SLIDES.map((s, i) => (
              <div key={i} style={{ height: '4px', width: i === currentSlide ? '40px' : '12px', borderRadius: '2px', background: i === currentSlide ? s.color : '#334155', transition: 'all 0.3s' }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={enterDashboard} style={{ padding: '14px 28px', background: '#00d4ff', border: 'none', borderRadius: '8px', color: '#0f172a', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
              Enter Dashboard →
            </button>
            {currentSlide < DEMO_SLIDES.length - 1 && (
              <button onClick={() => setCurrentSlide(c => Math.min(c + 1, DEMO_SLIDES.length - 1))} style={{ padding: '14px 28px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontSize: '15px', cursor: 'pointer' }}>
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', position: 'relative' }}>
        <button onClick={startDemo} style={{ position: 'absolute', top: '-14px', right: '20px', padding: '10px 20px', background: 'linear-gradient(135deg, #00d4ff, #0891b2)', border: 'none', borderRadius: '24px', color: '#0f172a', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 20px #00d4ff44' }}>
          ▶ Start Demo
        </button>
        
        <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #00d4ff, #0891b2)', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🛡️</div>
        
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px', color: '#fff' }}>TrustGuard AI</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>Digital Trust & Integrity Platform</p>
        <p style={{ color: '#475569', fontSize: '13px', marginBottom: '28px' }}>Protect digital assets with AI-powered detection</p>
        
        <button onClick={startDemo} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00d4ff, #0891b2)', border: 'none', borderRadius: '10px', color: '#0f172a', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginBottom: '8px', boxShadow: '0 4px 20px #00d4ff33', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🚀</span>Start Demo Tour
        </button>
        
        <p style={{ textAlign: 'center', marginBottom: '24px', color: '#475569', fontSize: '12px' }}>3-minute tour of all features</p>
        
        <div style={{ marginBottom: '24px', padding: '20px', background: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Why Choose Us</h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '13px', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#10b981' }}>✓</span> E2EE Encryption (AES-256)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#10b981' }}>✓</span> AI-Powered Detection</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#10b981' }}>✓</span> Real-time Platform Monitoring</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#10b981' }}>✓</span> 2FA Protected Downloads</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: '#334155' }} />
          <span style={{ color: '#475569', fontSize: '12px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#334155' }} />
        </div>
        
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Sign in with credentials</p>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '12px', fontSize: '14px' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '16px', fontSize: '14px' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Sign In</button>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#475569', fontSize: '12px' }}>Demo: demo@trustguard.ai / demo1234</p>
      </div>
    </div>
  );
}