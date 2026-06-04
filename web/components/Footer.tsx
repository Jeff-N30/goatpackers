import Image from 'next/image';
import { Mail, MapPin } from 'lucide-react';

const LINKS = [
  { href: '#',        label: 'Home' },
  { href: '#events',  label: 'Events' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#team',    label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l5.12-1.35C8.54 21.54 10.23 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.75 13.75c-.2.55-1.18 1.06-1.62 1.12-.44.06-.85.09-2.74-.58-2.31-.83-3.79-3.15-3.9-3.3-.11-.15-.91-1.22-.91-2.33 0-1.11.58-1.65.79-1.88.21-.23.45-.29.61-.29h.44c.14 0 .33.01.51.39.19.4.64 1.58.7 1.69.06.12.1.25.02.4-.07.15-.11.23-.22.36-.11.13-.23.29-.33.39-.11.11-.22.23-.09.45.12.22.55.89 1.18 1.44.82.72 1.5.95 1.72 1.06.22.11.34.09.47-.06.12-.15.54-.62.68-.84.14-.22.28-.18.47-.11.19.07 1.22.58 1.43.69.21.11.35.16.4.25.06.09.06.55-.14 1.09z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--secondary)', color: 'white', padding: '4.5rem 1.5rem 2rem' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '0.875rem' }}>
              <Image
                src="/goatpackers_logo_dark.png"
                alt="Goatpackers"
                width={140}
                height={36}
                style={{ height: '30px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.9)' }}
              />
            </div>
            <p style={{ color: 'rgba(224,216,181,0.62)', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: '240px' }}>
              A community built for the wild, we do all sorts of outdoor activites from hiking, camping, trekking, climbing and more.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '1.25rem' }}>
              <a
                href="https://wa.me/96176369668"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={socialStyle}
              >
                <WhatsAppIcon />
              </a>
              <a
                href="https://instagram.com/goatpackers.lb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={socialStyle}
              >
                <InstagramIcon />
              </a>
              <a
                href="mailto:goatpackers.lb@gmail.com"
                aria-label="Email"
                style={socialStyle}
              >
                <Mail size={15} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Quick nav */}
          <div>
            <h4 style={heading}>Explore</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {LINKS.map(({ href, label }) => (
                <a key={href} href={href} style={linkStyle}>{label}</a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 style={heading}>Get in Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={row}>
                <MapPin size={14} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Lebanon</span>
              </div>
              <a href="https://wa.me/96176369668" target="_blank" rel="noopener noreferrer" style={{ ...row, textDecoration: 'none' }}>
                <WhatsAppIcon />
                <span>+961 76 369 668</span>
              </a>
              <a href="https://instagram.com/goatpackers.lb" target="_blank" rel="noopener noreferrer" style={{ ...row, textDecoration: 'none' }}>
                <InstagramIcon />
                <span>@goatpackers.lb</span>
              </a>
              <a href="mailto:goatpackers.lb@gmail.com" style={{ ...row, textDecoration: 'none' }}>
                <Mail size={14} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>goatpackers.lb@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(224,216,181,0.14)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(224,216,181,0.38)' }}>
            {new Date().getFullYear()} Goatpackers Lebanon. All rights reserved.
          </span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(224,216,181,0.38)' }}>Lebanon</span>
        </div>
      </div>
    </footer>
  );
}

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.95rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--primary)',
  marginBottom: '1rem',
};

const linkStyle: React.CSSProperties = {
  color: 'rgba(224,216,181,0.6)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'color 180ms ease',
};

const socialStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '9px',
  background: 'rgba(224,216,181,0.1)',
  color: 'rgba(224,216,181,0.72)',
  border: '1px solid rgba(224,216,181,0.14)',
  transition: 'background 180ms ease, color 180ms ease',
};

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
  color: 'rgba(224,216,181,0.6)',
  fontSize: '0.875rem',
};
