'use client';

import { useEffect, useState } from 'react';
import { Save, Check, Phone, Mail, AtSign } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';
import { adminOp } from '@/lib/admin-api';

const DEFAULTS = {
  whatsapp_number: '+961 76 369 668',
  whatsapp_href: 'https://wa.me/96176369668',
  instagram_handle: '@goatpackers.lb',
  instagram_href: 'https://ig.me/m/goatpackers.lb',
  email: 'goatpackers.lb@gmail.com',
};

type Settings = typeof DEFAULTS;

export default function AdminContactPage() {
  const supabase = getAdminClient();
  const [settings, setSettings] = useState<Settings>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data && data.length > 0) {
        const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
        setSettings({ ...DEFAULTS, ...map });
      }
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upsert each setting key
      for (const [key, value] of Object.entries(settings)) {
        await adminOp('upsert', 'site_settings', { key, value });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(String(err));
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings(s => ({ ...s, [key]: e.target.value }));

  return (
    <div className={`admin-page${mounted ? ' admin-page--visible' : ''}`} style={{ padding: '2.5rem', maxWidth: '620px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="admin-title">Contact Info</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Edit the contact details shown in the &ldquo;Get in Touch&rdquo; section of the website.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="admin-skeleton" style={{ height: '48px', borderRadius: '10px' }} />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* WhatsApp */}
          <ContactSection
            icon={<Phone size={17} />}
            title="WhatsApp"
            color="#25D366"
            bg="rgba(37,211,102,0.1)"
          >
            <FF label="Display number">
              <input className="input" value={settings.whatsapp_number} onChange={set('whatsapp_number')} placeholder="+961 76 000 000" />
            </FF>
            <FF label="WhatsApp link">
              <input className="input" type="url" value={settings.whatsapp_href} onChange={set('whatsapp_href')} placeholder="https://wa.me/961..." />
            </FF>
          </ContactSection>

          {/* Instagram */}
          <ContactSection
            icon={<AtSign size={17} />}
            title="Instagram"
            color="#E1306C"
            bg="rgba(225,48,108,0.1)"
          >
            <FF label="Handle (e.g. @goatpackers.lb)">
              <input className="input" value={settings.instagram_handle} onChange={set('instagram_handle')} placeholder="@youraccount" />
            </FF>
            <FF label="Instagram DM link">
              <input className="input" type="url" value={settings.instagram_href} onChange={set('instagram_href')} placeholder="https://ig.me/m/..." />
            </FF>
          </ContactSection>

          {/* Email */}
          <ContactSection
            icon={<Mail size={17} />}
            title="Email"
            color="var(--primary)"
            bg="rgba(92,97,53,0.1)"
          >
            <FF label="Email address">
              <input className="input" type="email" value={settings.email} onChange={set('email')} placeholder="you@example.com" />
            </FF>
          </ContactSection>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary admin-btn" disabled={saving} style={{ minWidth: '140px' }}>
              {saving ? (
                'Saving…'
              ) : saved ? (
                <><Check size={15} /> Saved!</>
              ) : (
                <><Save size={15} /> Save Changes</>
              )}
            </button>
            {saved && (
              <span style={{ fontSize: '0.82rem', color: '#166534', animation: 'admin-fade-in 200ms var(--ease-out) both' }}>
                Changes live on site
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

function ContactSection({ icon, title, color, bg, children }: {
  icon: React.ReactNode;
  title: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          {icon}
        </div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {children}
      </div>
    </div>
  );
}

function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{label}</label>
      {children}
    </div>
  );
}
