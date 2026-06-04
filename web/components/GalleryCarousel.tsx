'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const FALLBACK = [
  'linear-gradient(135deg, #808550 0%, #a0a668 100%)',
  'linear-gradient(135deg, #4a4e28 0%, #6b7040 100%)',
  'linear-gradient(135deg, #5c6135 0%, #a0a668 100%)',
];

export interface CarouselImage {
  id: string;
  image_url: string | null;
  caption: string | null;
}

export default function GalleryCarousel({ images }: { images: CarouselImage[] }) {
  const n = images.length;
  if (n === 0) return null;

  // Triple array for seamless infinite loop
  const tripled = [...images, ...images, ...images];
  const T = tripled.length;

  const [trackIdx, setTrackIdx] = useState(n); // start at middle copy
  const [animated, setAnimated] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Zoom
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const zoomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setAnimated(true);
    setTrackIdx(i => i + 1);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 4000);
  }, [advance]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  // Seamless jump when reaching clone zone
  useEffect(() => {
    if (trackIdx >= n * 2) {
      const t = setTimeout(() => { setAnimated(false); setTrackIdx(p => p - n); }, 520);
      return () => clearTimeout(t);
    }
    if (trackIdx <= 0) {
      const t = setTimeout(() => { setAnimated(false); setTrackIdx(p => p + n); }, 520);
      return () => clearTimeout(t);
    }
  }, [trackIdx, n]);

  const goNext = () => { setAnimated(true); setTrackIdx(i => i + 1); resetTimer(); };
  const goPrev = () => { setAnimated(true); setTrackIdx(i => i - 1); resetTimer(); };
  const goTo  = (i: number) => { setAnimated(true); setTrackIdx(n + i); resetTimer(); };

  // Real index for dots
  const realIdx = ((trackIdx - n) % n + n) % n;

  // Zoom handlers
  const openZoom = (idx: number) => {
    if (zoomTimer.current) clearTimeout(zoomTimer.current);
    setZoomedIdx(idx);
    requestAnimationFrame(() => requestAnimationFrame(() => setZoomOpen(true)));
  };
  const closeZoom = useCallback(() => {
    setZoomOpen(false);
    zoomTimer.current = setTimeout(() => setZoomedIdx(null), 200);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!zoomOpen) return;
      if (e.key === 'Escape') closeZoom();
      if (e.key === 'ArrowRight') setZoomedIdx(i => (i! + 1) % n);
      if (e.key === 'ArrowLeft')  setZoomedIdx(i => (i! - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomOpen, closeZoom, n]);

  /* ─── CSS math:
     Track width = T * (100/3)% of container
     Each card  = (100/T)% of track = container/3
     translateX = -(trackIdx * 100/T)% of track = -trackIdx * container/3
  ─────────────────────────────────────────────── */

  return (
    <>
      {/* ── Zoom overlay ── */}
      {zoomedIdx !== null && (() => {
        const img = images[zoomedIdx];
        return (
          <div
            onClick={closeZoom}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: zoomOpen ? 'rgba(17,17,8,0.72)' : 'rgba(17,17,8,0)',
              backdropFilter: zoomOpen ? 'blur(20px)' : 'blur(0px)',
              WebkitBackdropFilter: zoomOpen ? 'blur(20px)' : 'blur(0px)',
              transition: 'background 240ms ease, backdrop-filter 240ms ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
              pointerEvents: zoomOpen ? 'auto' : 'none',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '760px',
                transform: zoomOpen ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(18px)',
                opacity: zoomOpen ? 1 : 0,
                transition: `transform 280ms ${EASE}, opacity 200ms ease-out`,
              }}
            >
              {/* Image */}
              <div style={{
                aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden',
                background: img.image_url
                  ? `url(${img.image_url}) center/cover no-repeat`
                  : FALLBACK[zoomedIdx % FALLBACK.length],
                position: 'relative',
                boxShadow: '0 40px 100px -20px rgba(17,17,8,0.6)',
              }}>
                <button
                  onClick={closeZoom}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'rgba(17,17,8,0.6)', backdropFilter: 'blur(8px)',
                    border: 'none', color: 'white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Below image: prev / caption+counter / next */}
              <div style={{
                marginTop: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <button onClick={() => setZoomedIdx(i => (i! - 1 + n) % n)} style={zoomNavBtn}>
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  {img.caption && (
                    <p style={{ color: 'rgba(224,216,181,0.88)', fontFamily: 'var(--font-display)', fontSize: '1rem', margin: '0 0 4px' }}>
                      {img.caption}
                    </p>
                  )}
                  <p style={{ color: 'rgba(224,216,181,0.38)', fontSize: '0.72rem', margin: 0, letterSpacing: '0.06em' }}>
                    {zoomedIdx + 1} / {n}
                  </p>
                </div>
                <button onClick={() => setZoomedIdx(i => (i! + 1) % n)} style={zoomNavBtn}>
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Sliding track ── */}
      <div style={{ overflow: 'hidden', borderRadius: '10px' }}>
        <div style={{
          display: 'flex',
          width: `${T * 100 / 3}%`,
          transform: `translateX(-${trackIdx * 100 / T}%)`,
          transition: animated ? `transform 520ms ${EASE}` : 'none',
        }}>
          {tripled.map((img, i) => {
            const rIdx = i % n;
            return (
              <div key={`${img.id}-${i}`} style={{ width: `${100 / T}%`, flexShrink: 0, padding: '0 5px' }}>
                <button
                  onClick={() => openZoom(rIdx)}
                  style={{
                    all: 'unset', display: 'block', cursor: 'pointer', width: '100%',
                    aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden',
                    background: img.image_url
                      ? `url(${img.image_url}) center/cover no-repeat`
                      : FALLBACK[rIdx % FALLBACK.length],
                    position: 'relative',
                    transition: `transform 180ms ${EASE}, box-shadow 180ms ease`,
                    boxShadow: '0 4px 16px -6px rgba(92,97,53,0.16)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.025) translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px -8px rgba(92,97,53,0.24)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px -6px rgba(92,97,53,0.16)';
                  }}
                  onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
                  onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
                >
                  {img.caption && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '1.5rem 0.875rem 0.625rem',
                      background: 'linear-gradient(to top, rgba(17,17,8,0.65) 0%, transparent 100%)',
                      color: 'rgba(224,216,181,0.9)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.8rem',
                    }}>
                      {img.caption}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.125rem' }}>
        <button onClick={goPrev} style={trackNavBtn}>
          <ChevronLeft size={14} strokeWidth={2.5} />
        </button>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === realIdx ? '18px' : '6px',
              height: '6px', borderRadius: '3px',
              background: 'var(--primary)',
              opacity: i === realIdx ? 1 : 0.25,
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'width 280ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease',
            }}
          />
        ))}
        <button onClick={goNext} style={trackNavBtn}>
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}

const zoomNavBtn: React.CSSProperties = {
  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(224,216,181,0.18)',
  color: 'rgba(224,216,181,0.75)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const trackNavBtn: React.CSSProperties = {
  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
  background: 'rgba(92,97,53,0.1)', border: '1px solid var(--border)',
  color: 'var(--primary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
