import { createClient } from '@supabase/supabase-js';
import { ChevronRight, MapPin, Mail } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l5.12-1.35C8.54 21.54 10.23 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.75 13.75c-.2.55-1.18 1.06-1.62 1.12-.44.06-.85.09-2.74-.58-2.31-.83-3.79-3.15-3.9-3.3-.11-.15-.91-1.22-.91-2.33 0-1.11.58-1.65.79-1.88.21-.23.45-.29.61-.29h.44c.14 0 .33.01.51.39.19.4.64 1.58.7 1.69.06.12.1.25.02.4-.07.15-.11.23-.22.36-.11.13-.23.29-.33.39-.11.11-.22.23-.09.45.12.22.55.89 1.18 1.44.82.72 1.5.95 1.72 1.06.22.11.34.09.47-.06.12-.15.54-.62.68-.84.14-.22.28-.18.47-.11.19.07 1.22.58 1.43.69.21.11.35.16.4.25.06.09.06.55-.14 1.09z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

const DEFAULTS = {
  whatsapp_number:    '+961 76 369 668',
  whatsapp_href:      'https://wa.me/96176369668',
  instagram_handle:   '@goatpackers.lb',
  instagram_href:     'https://ig.me/m/goatpackers.lb',
  email:              'goatpackers.lb@gmail.com',
  whatsapp_group_href: 'https://chat.whatsapp.com/HuuCmQl4DaKGDm5jn6HIK5?s=sh&p=i&ilr=4&amv=1',
};

async function getContactSettings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return DEFAULTS;
  try {
    const supabase = createClient(url, key);
    const { data } = await supabase.from('site_settings').select('key, value');
    if (!data || data.length === 0) return DEFAULTS;
    const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
    return { ...DEFAULTS, ...map };
  } catch {
    return DEFAULTS;
  }
}

export default async function ContactSection() {
  const s = await getContactSettings();

  const ACTIONS = [
    {
      icon: <WhatsAppIcon />,
      label: 'WhatsApp',
      value: s.whatsapp_number,
      sub: 'Message us directly',
      href: s.whatsapp_href,
      color: '#25D366',
      bg: 'rgba(37,211,102,0.12)',
      border: 'rgba(37,211,102,0.28)',
    },
    {
      icon: <InstagramIcon />,
      label: 'Instagram',
      value: s.instagram_handle,
      sub: 'Send us a DM or follow our trails',
      href: s.instagram_href,
      color: '#E1306C',
      bg: 'rgba(225,48,108,0.12)',
      border: 'rgba(225,48,108,0.28)',
    },
    {
      icon: <Mail size={22} strokeWidth={1.75} />,
      label: 'Email',
      value: s.email,
      sub: 'For inquiries, partnerships, collabs and media',
      href: `mailto:${s.email}`,
      color: 'var(--primary)',
      bg: 'rgba(92,97,53,0.10)',
      border: 'rgba(92,97,53,0.22)',
    },
    {
      icon: <WhatsAppIcon />,
      label: 'WhatsApp Group',
      value: 'Join the Group',
      sub: 'Tap to join our group chat',
      href: s.whatsapp_group_href,
      color: '#25D366',
      bg: 'rgba(37,211,102,0.12)',
      border: 'rgba(37,211,102,0.28)',
    },
  ] as const;

  return (
    <section id="contact" className="section" style={{ background: 'rgba(92,97,53,0.03)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <ScrollReveal direction="bottom">
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>
              Say Hello
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1, marginTop: 0 }}>
              Get in Touch
            </h2>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0.75rem auto 0', lineHeight: 1.7 }}>
              Questions, partnerships, or want to join a hike? Tap any card,opens the app on your phone.
            </p>
          </ScrollReveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.125rem', maxWidth: '1080px', margin: '0 auto' }}>
          {ACTIONS.map(({ icon, label, value, sub, href, color, bg, border }, i) => (
            <ScrollReveal key={label} direction="bottom" delay={((i + 1) as 1|2|3|4)}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-action-card"
                style={{ border: `1px solid ${border}` } as React.CSSProperties}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: '1.125rem', flexShrink: 0 }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', wordBreak: 'break-all' }}>{value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{sub}</div>
                </div>
                <ChevronRight size={18} strokeWidth={2} style={{ color, opacity: 0.65, marginTop: '0.5rem', alignSelf: 'flex-end' }} />
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="fade">
          <div style={{ textAlign: 'center', marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <MapPin size={15} strokeWidth={1.75} style={{ color: 'var(--primary)' }} />
            <span>Based in <strong style={{ color: 'var(--text)' }}>Lebanon 🇱🇧</strong>   All sorts of outdoor activites </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
