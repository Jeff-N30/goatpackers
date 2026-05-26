import type { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeader from '@/components/SectionHeader';
import type { TeamMember } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Team — Goatpackers Lebanon',
  description: 'Meet the people behind Goatpackers Lebanon.',
};

/* ─── Mock team — replace with Supabase query once connected ─── */
const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Placeholder Name',
    role: 'Founder & Lead Guide',
    bio: 'Passionate about Lebanese mountains since childhood. Has summited every major peak in the country multiple times.',
    image_url: null,
    order: 1,
  },
  {
    id: '2',
    name: 'Placeholder Name',
    role: 'Trail Coordinator',
    bio: 'Manages logistics and scouting for all Goatpackers hikes. Expert in backcountry navigation and wilderness first aid.',
    image_url: null,
    order: 2,
  },
  {
    id: '3',
    name: 'Placeholder Name',
    role: 'Photography Lead',
    bio: 'Captures the spirit of every hike through a lens. Responsible for the gallery and all visual content.',
    image_url: null,
    order: 3,
  },
  {
    id: '4',
    name: 'Placeholder Name',
    role: 'Community Manager',
    bio: 'Keeps the community connected online and offline. Organises social events and manages member relations.',
    image_url: null,
    order: 4,
  },
];

const INITIALS_COLORS = [
  { bg: '#5c6135', text: '#e0d8b5' },
  { bg: '#4a4e28', text: '#e0d8b5' },
  { bg: '#808550', text: '#e0d8b5' },
  { bg: '#6b7040', text: '#e0d8b5' },
];

export default function TeamPage() {
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
              The People
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
            Our Team
          </h1>
          <p className="hero-subtitle" style={{ color: 'rgba(224,216,181,0.68)', lineHeight: 1.7 }}>
            The people who make every hike happen.
          </p>
        </div>
      </section>

      {/* ─── Team grid ─── */}
      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Behind the Trails"
            title="Meet the Goatpackers"
            subtitle="Update your team members in the Supabase team table and photos will appear automatically."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {TEAM.map((member, i) => {
              const colors = INITIALS_COLORS[i % INITIALS_COLORS.length];
              const initials = member.name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0])
                .join('');

              return (
                <ScrollReveal key={member.id} direction="bottom" delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: member.image_url
                          ? `url(${member.image_url}) center/cover`
                          : colors.bg,
                        margin: '0 auto 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {!member.image_url && (
                        <span
                          style={{
                            color: colors.text,
                            fontSize: '1.25rem',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 600,
                          }}
                        >
                          {initials}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        color: 'var(--text)',
                        marginBottom: '0.3rem',
                      }}
                    >
                      {member.name}
                    </h3>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--primary)',
                        marginBottom: '0.85rem',
                      }}
                    >
                      {member.role}
                    </span>
                    {member.bio && (
                      <p
                        style={{
                          fontSize: '0.855rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.65,
                        }}
                      >
                        {member.bio}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Join CTA ─── */}
      <section
        style={{
          background: 'var(--primary)',
          padding: '5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '560px' }}>
          <ScrollReveal direction="bottom">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: 'var(--secondary)',
                marginBottom: '1rem',
                lineHeight: 1.1,
              }}
            >
              Want to be part of the crew?
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={1}>
            <p style={{ color: 'var(--text)', marginBottom: '2rem', lineHeight: 1.7 }}>
              We are always looking for passionate hikers, photographers, and trail lovers to grow the Goatpackers family.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={2}>
            <a href="/contact" className="btn btn-primary">
              Get in Touch
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
