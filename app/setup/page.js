'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zybfbxfaumeywjpzgcce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5YmZieGZhdW1leXdqcHpnY2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTQ4MzAsImV4cCI6MjA5MjI3MDgzMH0.eSg5m5cTvf6MAoErUCKh3CsS_pnKEAYLbuxqRVtuzbo';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function SetupPage() {
  const [status, setStatus] = useState('checking');
  const [results, setResults] = useState([]);

  useEffect(() => {
    setupTables();
  }, []);

  const setupTables = async () => {
    const tables = ['users', 'assets', 'violations', 'activity_logs'];
    const resultsData = [];

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
          resultsData.push({ table, status: 'missing', error: error.message });
        } else {
          resultsData.push({ table, status: 'exists' });
        }
      } catch (e) {
        resultsData.push({ table, status: 'error', error: e.message });
      }
    }

    setResults(resultsData);
    setStatus('complete');
  };

  const createSampleData = async () => {
    try {
      await supabase.from('users').insert([{ 
        email: 'demo@trustguard.ai', 
        name: 'Demo User',
        password: 'demo123'
      }]);
      setResults(prev => [...prev, { table: 'sample_data', status: 'created' }]);
    } catch (e) {
      setResults(prev => [...prev, { table: 'sample_data', error: e.message }]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050810', padding: '40px', color: '#fff' }}>
      <h1 style={{ marginBottom: '24px' }}>Supabase Setup</h1>
      
      <div style={{ background: '#131a2a', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px' }}>Tables Status</h2>
        {results.map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #2d3748' }}>
            <span>{r.table}</span>
            <span style={{ color: r.status === 'exists' ? '#10b981' : '#ef4444' }}>{r.status}</span>
          </div>
        ))}
      </div>

      {status === 'complete' && (
        <button onClick={createSampleData} className="btn btn-primary">
          Create Sample Data
        </button>
      )}
    </div>
  );
}