'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#',        label: 'Home' },
  { href: '#events',  label: 'Events' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#about',   label: 'About' },
  { href: '#team',    label: 'Team' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" aria-label="Goatpackers home" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Image
              src="/goatpackers_logo_dark.png"
              alt="Goatpackers"
              width={130} height={34}
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
              priority
            />
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
          </nav>

        </div>
      </header>

      {/* Floating 3-dot trigger — mobile only */}
      <button
        className="mobile-trigger"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <span className="mobile-trigger-dot" />
        <span className="mobile-trigger-dot" />
        <span className="mobile-trigger-dot" />
      </button>

      {/* Overlay */}
      <div
        className={`mobile-sidebar-overlay${mobileOpen ? ' open' : ''}`}
        onClick={close}
        aria-hidden
      />

      {/* Sidebar */}
      <aside className={`mobile-sidebar${mobileOpen ? ' open' : ''}`} aria-label="Navigation">
        <div className="mobile-sidebar-header">
          <a href="#" onClick={close} style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/goatpackers_logo_dark.png"
              alt="Goatpackers"
              width={110} height={30}
              style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
            />
          </a>
          <button
            onClick={close}
            aria-label="Close menu"
            style={{
              background: 'rgba(92,97,53,0.08)', border: 'none',
              borderRadius: '8px', padding: '7px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', color: 'var(--text)',
            }}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <nav style={{ padding: '0.75rem 0', flex: 1 }}>
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="mobile-sidebar-link"
              onClick={close}
            >
              {label}
            </a>
          ))}
        </nav>

        <div style={{
          padding: '1rem 1.25rem 1.5rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.72rem', color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}>
          Lebanon — hiking year-round
        </div>
      </aside>
    </>
  );
}
