'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#',        label: 'Home' },
  { href: '#events',  label: 'Events' },
  { href: '#gallery', label: 'Gallery' },
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

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="#" aria-label="Goatpackers home" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Image
              src="/goatpackers_logo_dark.png"
              alt="Goatpackers"
              width={130} height={34}
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              priority
            />
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
          </nav>

          <button
            className="mobile-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div style={{ padding: '0.5rem 0' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
