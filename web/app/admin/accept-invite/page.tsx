'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminClient } from '@/lib/supabase-admin';

export default function AcceptInvitePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'success'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    // Supabase puts tokens in the URL hash after invite click
    const hash = window.location.hash;
    if (!hash.includes('access_token')) {
      setError('Invalid or expired invite link. Ask for a new one.');
      setStatus('error');
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token) {
      setError('Missing tokens. Ask for a new invite.');
      setStatus('error');
      return;
    }

    const supabase = getAdminClient();
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }: { error: { message: string } | null }) => {
      if (error) {
        setError('Session expired. Ask for a new invite.');
        setStatus('error');
      } else {
        setStatus('ready');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    const supabase = getAdminClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      return;
    }

    // Stamp the 24-hour session expiry cookie so the proxy lets them in
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    document.cookie = `admin_expires_at=${expiresAt}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;

    setStatus('success');
    setTimeout(() => router.push('/admin'), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2d2f1c 0%, var(--secondary) 100%)', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 24px 60px -12px rgba(45,47,28,0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Goatpackers</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Set your password</span>
        </div>

        {status === 'loading' && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Verifying invite…</p>}

        {status === 'error' && (
          <p style={{ textAlign: 'center', color: '#c0392b', background: '#fdf2f2', padding: '1rem', borderRadius: '0.75rem' }}>{error}</p>
        )}

        {status === 'success' && (
          <p style={{ textAlign: 'center', color: '#27ae60', background: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem' }}>Password set! Redirecting to admin…</p>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>New password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required className="input" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required className="input" />
            </div>
            {error && <p style={{ fontSize: '0.82rem', color: '#c0392b', background: '#fdf2f2', padding: '0.625rem 0.875rem', borderRadius: '0.5rem' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
              Set Password & Enter Admin
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' };
