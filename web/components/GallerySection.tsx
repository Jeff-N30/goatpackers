'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export type GalleryTile = { id: number | string; span: 'tall' | 'wide' | 'normal'; label: string; image_url?: string | null };

function GalleryZoom({ tile, gradient, open, onClose }: {
  tile: GalleryTile; gradient: string; open: boolean; onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        background: open ? 'rgba(17,17,8,0.7)' : 'rgba(17,17,8,0)',
        backdropFilter: open ? 'blur(28px)' : 'blur(0px)',
        WebkitBackdropFilter: open ? 'blur(28px)' : 'blur(0px)',
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '680px', aspectRatio: '4/3',
          borderRadius: '14px',
          background: tile.image_url ? `url(${tile.image_url}) center/cover no-repeat` : gradient,
          overflow: 'hidden', position: 'relative',
          transform: open ? 'scale(1)' : 'scale(0.9)',
          opacity: open ? 1 : 0,
          transition: open
            ? `transform 280ms ${EASE}, opacity 200ms ease-out`
            : 'transform 160ms ease-in, opacity 140ms ease-in',
          boxShadow: '0 48px 120px -24px rgba(17,17,8,0.65)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 10,
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(17,17,8,0.6)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: 'none', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: `transform 280ms ${EASE}`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
          onMouseDown={e => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(0.9)';
            (e.currentTarget as HTMLElement).style.transitionDuration = '80ms';
          }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transitionDuration = '280ms'; }}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(224,216,181,0.2)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Photo
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '2.5rem 1.75rem 1.75rem',
          background: 'linear-gradient(to top, rgba(17,17,8,0.68) 0%, transparent 100%)',
        }}>
          <span style={{ color: 'rgba(224,216,181,0.92)', fontSize: '1.1rem', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
            {tile.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GallerySection({ tiles, gradients }: { tiles: GalleryTile[]; gradients: string[] }) {
  const [selected, setSelected] = useState<{ tile: GalleryTile; gradient: string } | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openTile = useCallback((tile: GalleryTile, gradient: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSelected({ tile, gradient });
    requestAnimationFrame(() => requestAnimationFrame(() => setZoomOpen(true)));
  }, []);

  const closeTile = useCallback(() => {
    setZoomOpen(false);
    closeTimer.current = setTimeout(() => setSelected(null), 260);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && zoomOpen) closeTile(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomOpen, closeTile]);

  return (
    <>
      {selected && (
        <GalleryZoom tile={selected.tile} gradient={selected.gradient} open={zoomOpen} onClose={closeTile} />
      )}

      <section id="gallery" className="section" style={{ background: 'rgba(92,97,53,0.04)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <ScrollReveal direction="bottom">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>Visual Stories</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1, marginTop: 0 }}>Through the Lens</h2>
              <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>Tap any photo to view it larger.</p>
            </ScrollReveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {tiles.map((tile, i) => (
              <ScrollReveal key={tile.id} direction="scale" delay={((i % 4) + 1) as 1|2|3|4}>
                <button
                  onClick={() => openTile(tile, gradients[i % gradients.length])}
                  style={{
                    all: 'unset', display: 'block', cursor: 'pointer',
                    background: tile.image_url
                      ? `url(${tile.image_url}) center/cover no-repeat`
                      : gradients[i % gradients.length],
                    borderRadius: '12px',
                    position: 'relative', overflow: 'hidden',
                    height: '220px', width: '100%',
                    transition: `transform 200ms ${EASE}, box-shadow 200ms ease`,
                    boxShadow: '0 2px 12px -6px rgba(92,97,53,0.12)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.015)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px -8px rgba(92,97,53,0.22)';
                    const overlay = (e.currentTarget as HTMLElement).querySelector('.gallery-overlay') as HTMLElement | null;
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px -6px rgba(92,97,53,0.12)';
                    const overlay = (e.currentTarget as HTMLElement).querySelector('.gallery-overlay') as HTMLElement | null;
                    if (overlay) overlay.style.opacity = '0';
                  }}
                  onMouseDown={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
                    (e.currentTarget as HTMLElement).style.transition = 'transform 100ms ease';
                  }}
                  onMouseUp={e => {
                    (e.currentTarget as HTMLElement).style.transition = `transform 200ms ${EASE}, box-shadow 200ms ease`;
                  }}
                >
                  <div
                    className="gallery-overlay"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(17,17,8,0.72) 0%, transparent 55%)',
                      display: 'flex', alignItems: 'flex-end', padding: '1rem',
                      opacity: 0, transition: 'opacity 250ms ease',
                    }}
                  >
                    <span style={{ color: 'rgba(224,216,181,0.92)', fontSize: '0.82rem', fontWeight: 600 }}>{tile.label}</span>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(224,216,181,0.18)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Photo
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
