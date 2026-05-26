import ScrollReveal from './ScrollReveal';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export default function SectionHeader({ eyebrow, title, subtitle, align = 'center', light = false }: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div style={{ marginBottom: '3.5rem', ...(centered ? { textAlign: 'center' } : {}) }}>
      {eyebrow && (
        <ScrollReveal direction="fade">
          <span style={{
            display: 'block',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: '0.5rem',
            color: light ? 'rgba(224,216,181,0.7)' : 'var(--primary)',
          }}>
            {eyebrow}
          </span>
        </ScrollReveal>
      )}
      <ScrollReveal direction="bottom" delay={1}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          color: light ? 'white' : 'var(--text)',
        }}>
          {title}
        </h2>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal direction="bottom" delay={2}>
          <p style={{
            marginTop: '1rem',
            fontSize: '1rem', lineHeight: 1.7,
            color: light ? 'rgba(224,216,181,0.68)' : 'var(--text-muted)',
            ...(centered ? { maxWidth: '520px', margin: '1rem auto 0' } : {}),
          }}>
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
