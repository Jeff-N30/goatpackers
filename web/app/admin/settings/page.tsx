'use client';

import { useState } from 'react';
import { KeyRound, CheckCircle } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';


export default function AdminSettingsPage() {
  const [current, setCurrent]   = useState('');
  const [newPass, setNewPass]   = useState('');
  const [confirm, setConfirm]   = useState('');
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPass !== confirm) { setError('New passwords do not match.'); return; }
    if (newPass.length < 8)  { setError('Password must be at least 8 characters.'); return; }

    setStatus('loading');
    const supabase = getAdminClient();

    // Re-authenticate with current password first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setError('Not logged in.'); setStatus('error'); return; }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });
    if (signInError) { setError('Current password is incorrect.'); setStatus('error'); return; }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPass });
    if (updateError) { setError(updateError.message); setStatus('error'); return; }

    setStatus('success');
    setCurrent(''); setNewPass(''); setConfirm('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '520px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your admin account</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
          <KeyRound size={18} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>Change Password</h2>
        </div>

        {status === 'success' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f0fdf4', borderRadius: '10px', color: '#166534' }}>
            <CheckCircle size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password updated successfully.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Current password</label>
              <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required className="input" placeholder="••••••••" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>New password</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required className="input" placeholder="Min 8 characters" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Confirm new password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="input" placeholder="Repeat new password" />
            </div>
            {error && (
              <p style={{ fontSize: '0.82rem', color: '#c0392b', background: '#fdf2f2', padding: '0.75rem 1rem', borderRadius: '8px' }}>{error}</p>
            )}
            <button type="submit" disabled={status === 'loading'} className="btn btn-primary" style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}>
              {status === 'loading' ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' };
