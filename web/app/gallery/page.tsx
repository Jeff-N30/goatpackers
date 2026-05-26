import type { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Gallery — Goatpackers Lebanon',
  description: 'Photos from our hikes across Lebanon\'s mountains and trails.',
};

/* ─── Placeholder tiles — replace with Supabase gallery images ─── */
const PLACEHOLDER_TILES = [
  { id: 1, span: 'tall',   label: 'Qornet el Sawda Summit' },
  { id: 2, span: 'wide',   label: 'Chouf Cedar Forest' },
  { id: 3, span: 'normal', label: 'Wadi Qannoubine' },
  { id: 4, span: 'normal', label: 'Sunset over Bcharre' },
  { id: 5, span: 'wide',   label: 'Cedar of God' },
  { id: 6, span: 'tall',   label: 'Horsh Ehden Wildflowers' },
  { id: 7, span: 'normal', label: 'Mountain Fog' },
  { id: 8, span: 'normal', label: 'Trail to Ehden' },
  { id: 9, span: 'normal', label: 'Tannourine Valley' },
];

const spanStyles: Record<string, React.CSSProperties> = {
  tall:   { gridRow: 'span 2' },
  wide:   { gridColumn: 'span 2' },
  normal: {},
};

const gradients = [
  'linear-gradient(135deg, #808550 0%, #a0a668 100%)',
  'linear-gradient(135deg, #4a4e28 0%, #6b7040 100%)',
  'linear-gradient(135deg, #5c6135 0%, #a0a668 100%)',
  'linear-gradient(135deg, #2d2f1c 0%, #808550 100%)',
  'linear-gradient(135deg, #6b7040 0%, #e0d8b5 100%)',
  'linear-gradient(135deg, #5a2828 0%, #6b7040 100%)',
];

export default function GalleryPage() {
  return (
    <>
      {/* ─── Page header ─── */}
      <section
        style={{
          background: 'linear-gradient(150deg, #2d2f1c 0%, var(--secondary) 100%)',
          padding: '140px 1.5rem 70px',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '560px' }}>
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(224,216,181,0.12)',
                border: '1px solid rgba(224,216,181,0.25)',
                borderRadius: '9999px',
                padding: '4px 16px',
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(224,216,181,0.7)',
              }}
            >
              Visual Stories
            </span>
          </div>
          <h1
            className="hero-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'white',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            Gallery
          </h1>
          <p className="hero-subtitle" style={{ color: 'rgba(224,216,181,0.68)', lineHeight: 1.7 }}>
            Moments captured on the trails of Lebanon.
          </p>
        </div>
      </section>

      {/* ─── Gallery grid ─── */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Our Trails"
            title="Through the Lens"
            subtitle="Connect your Supabase gallery table to populate this with real photos."
          />

          {/* Masonry-style CSS grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gridAutoRows: '220px',
              gap: '1rem',
            }}
          >
            {PLACEHOLDER_TILES.map((tile, i) => (
              <ScrollReveal
                key={tile.id}
                direction="scale"
                delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className=""
              >
                <div
                  className="gallery-tile"
                  style={{
                    ...spanStyles[tile.span],
                    background: gradients[i % gradients.length],
                    borderRadius: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  {/* Overlay label */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(45,47,28,0.7) 0%, transparent 50%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '1rem',
                      opacity: 0,
                      transition: 'opacity 250ms ease',
                    }}
                    className="gallery-overlay"
                  >
                    <span
                      style={{
                        color: 'rgba(224,216,181,0.9)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {tile.label}
                    </span>
                  </div>

                  {/* Placeholder text */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(224,216,181,0.25)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Photo
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Note */}
          <ScrollReveal direction="fade" delay={2}>
            <p
              style={{
                textAlign: 'center',
                marginTop: '3rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
              }}
            >
              Images will load automatically once you connect your Supabase gallery table and upload photos via the admin panel.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
