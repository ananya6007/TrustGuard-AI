'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (name && email && password) {
      const user = { name, email, id: 'user-' + Date.now() };
      sessionStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '32px', borderRadius: '12px', width: '320px' }}>
        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '8px', marginBottom: '20px' }}></div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Create Account</h1>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Get started</p>
        
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '10px 12px', borderRadius: '6px', color: '#fff', marginBottom: '12px', fontSize: '13px' }} />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '10px 12px', borderRadius: '6px', color: '#fff', marginBottom: '12px', fontSize: '13px' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '10px 12px', borderRadius: '6px', color: '#fff', marginBottom: '16px', fontSize: '13px' }} />
        
        <button onClick={handleSignup} style={{ width: '100%', padding: '10px', background: '#8b5cf6', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Create Account</button>
        
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748b', fontSize: '12px' }}>
          Already have an account? <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: '12px' }}>Sign In</button>
        </p>
      </div>
    </div>
  );
}