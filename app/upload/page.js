'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [assetType, setAssetType] = useState('image');
  const [industry, setIndustry] = useState('Media & Entertainment');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
    if (!stored) { router.push('/login'); }
  }, [router]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); if (!title) setTitle(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleUpload = async () => {
    if (!title) { setMessage('Please enter a title'); return; }
    setLoading(true);
    setMessage('');
    try {
      await new Promise(r => setTimeout(r, 1500));
      const fileHash = Math.random().toString(36).substring(2, 10);
      const fileSize = file ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown';
      const newAsset = { id: 'asset-' + Date.now(), title, type: assetType, industry, description, hash: fileHash, size: fileSize, isDemo: false, createdAt: new Date().toISOString() };
      const uploaded = JSON.parse(localStorage.getItem('uploadedAssets') || '[]');
      uploaded.push(newAsset);
      localStorage.setItem('uploadedAssets', JSON.stringify(uploaded));
      setMessage('Asset uploaded successfully!');
      setTitle(''); setDescription(''); setFile(null);
    } catch (e) { setMessage('Upload failed: ' + e.message); }
    setLoading(false);
  };

  if (!mounted) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="aurora-bg" style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <nav className="flex justify-between items-center p-4" style={{ background: 'rgba(19,26,42,0.9)', borderBottom: '1px solid var(--divider)' }}>
          <Link href="/dashboard" className="logo text-xl font-bold">← Upload Asset</Link>
          <Link href="/asset-list" className="btn btn-secondary">Library</Link>
        </nav>
        <div className="container mt-6" style={{ padding: '0 24px', maxWidth: 600 }}>
          <h2 className="text-xl font-bold mb-4">Upload Asset</h2>
          {message && <div className={`badge mb-4 ${message.includes('success') ? 'badge-success' : 'badge-error'}`} style={{ display: 'block', textAlign: 'center', padding: 12 }}>{message}</div>}
          <div className="card flex flex-col gap-4">
            <div><label className="text-sm text-muted mb-2" style={{ display: 'block' }}>Upload File</label><input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} /><label htmlFor="fileInput" className="input" style={{ border: '2px dashed var(--divider)', padding: 40, textAlign: 'center', cursor: 'pointer', display: 'block' }}>{file ? (<div><div style={{ fontSize: 32 }}>📄</div><div className="font-bold mt-2">{file.name}</div></div>) : (<div className="text-muted"><div style={{ fontSize: 32 }}>📁</div><div className="mt-2">Drag & drop or click to upload</div></div>)}</label></div>
            <div><label className="text-sm text-muted mb-2" style={{ display: 'block' }}>Title *</label><input className="input" placeholder="Enter asset title" value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm text-muted mb-2" style={{ display: 'block' }}>Asset Type</label><select className="input" value={assetType} onChange={e => setAssetType(e.target.value)}><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option><option value="document">Document</option></select></div>
              <div><label className="text-sm text-muted mb-2" style={{ display: 'block' }}>Industry</label><select className="input" value={industry} onChange={e => setIndustry(e.target.value)}><option value="Media & Entertainment">Media & Entertainment</option><option value="E-commerce">E-commerce</option><option value="Social Media">Social Media</option></select></div>
            </div>
            <div><label className="text-sm text-muted mb-2" style={{ display: 'block' }}>Description</label><textarea className="input" placeholder="Enter description (optional)" rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>
            <button className="btn btn-primary w-full" onClick={handleUpload} disabled={loading}>{loading ? 'Uploading...' : 'Upload Asset'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}