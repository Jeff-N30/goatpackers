'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #808550 0%, #a0a668 100%)',
  'linear-gradient(135deg, #4a4e28 0%, #6b7040 100%)',
  'linear-gradient(135deg, #5c6135 0%, #a0a668 100%)',
];

export interface SliderImage {
  id: string;
  image_url: string | null;
  caption: string | null;
}

export default function GallerySlider({ images }: { images: SliderImage[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = images.length;

  const next = useCallback(() => setCurrent(i => (i + 1) % count), [count]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = (i: number) => { setCurrent(i); resetTimer(); };
  const goPrev = () => { setCurrent(i => (i - 1 + count) % count); resetTimer(); };
  const goNext = () => { next(); resetTimer(); };

  if (images.length === 0) return null;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '14px',
        overflow: 'hidden',
        aspectRatio: '16/7',
        background: '#1c1e0f',
        boxShadow: '0 8px 40px -10px rgba(92,97,53,0.2)',
      }}
    >
      {/* Slides */}
      {images.map((img, i) => (
        <div
          key={img.id}
          style={{
            position: 'absolute', inset: 0,
            background: img.image_url
              ? `url(${img.image_url}) center/cover no-repeat`
              : FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length],
            opacity: i === current ? 1 : 0,
            transition: 'opacity 700ms ease',
          }}
        >
          {img.caption && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '3rem 1.75rem 1.5rem',
              background: 'linear-gradient(to top, rgba(17,17,8,0.62) 0%, transparent 100%)',
            }}>
              <span style={{
                color: 'rgba(224,216,181,0.92)',
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                letterSpacing: '0.02em',
              }}>
                {img.caption}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Prev / Next */}
      {count > 1 && (
        <>
          <button onClick={goPrev} aria-label="Previous" style={navBtn('left')}>‹</button>
          <button onClick={goNext} aria-label="Next" style={navBtn('right')}>›</button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div style={{
          position: 'absolute', bottom: '1rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '6px', alignItems: 'center',
          zIndex: 2,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: 'white',
                opacity: i === current ? 1 : 0.5,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 280ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function navBtn(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: '1rem',
    transform: 'translateY(-50%)',
    zIndex: 2,
    width: '38px', height: '38px',
    borderRadius: '50%',
    background: 'rgba(245,242,227,0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.3rem',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text)',
    boxShadow: '0 2px 12px -4px rgba(92,97,53,0.18)',
  };
}
