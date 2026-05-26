import type { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeader from '@/components/SectionHeader';
import EventCard from '@/components/EventCard';
import type { HikingEvent } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Events — Goatpackers Lebanon',
  description: 'Browse upcoming hikes and past adventures with Goatpackers Lebanon.',
};

/* ─── Mock data — swap with Supabase queries once connected ─── */
const UPCOMING: HikingEvent[] = [
  {
    id: '1',
    title: 'Qornet el Sawda — Highest Peak',
    description:
      "A challenging ascent to Lebanon's highest point at 3,088m. Stunning panoramic views across the country and into Syria.",
    date: '2026-06-07',
    location: 'Bcharre, North Lebanon',
    difficulty: 'Hard',
    image_url: null,
    type: 'upcoming',
    max_participants: 20,
    current_participants: 14,
    duration_hours: 8,
    elevation_gain_m: 980,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Chouf Cedar Reserve Trail',
    description:
      "A scenic loop through Lebanon's largest nature reserve, home to ancient cedar trees and diverse wildlife.",
    date: '2026-06-21',
    location: 'Barouk, Chouf',
    difficulty: 'Moderate',
    image_url: null,
    type: 'upcoming',
    max_participants: 25,
    current_participants: 8,
    duration_hours: 5,
    elevation_gain_m: 420,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Wadi Qannoubine Gorge',
    description:
      'A mystical canyon walk past ancient hermit caves, Byzantine churches, and flowing waterfalls in the Holy Valley.',
    date: '2026-07-05',
    location: 'Qannoubine, Bcharre',
    difficulty: 'Easy',
    image_url: null,
    type: 'upcoming',
    max_participants: 30,
    current_participants: 3,
    duration_hours: 4,
    elevation_gain_m: 280,
    created_at: new Date().toISOString(),
  },
];

const PAST: HikingEvent[] = [
  {
    id: '4',
    title: 'Horsh Ehden Nature Reserve',
    description:
      "A spring wildflower walk through one of Lebanon's most beautiful nature reserves, filled with endemic flora.",
    date: '2026-04-12',
    location: 'Ehden, North Lebanon',
    difficulty: 'Moderate',
    image_url: null,
    type: 'past',
    max_participants: 25,
    current_participants: 22,
    duration_hours: 5,
    elevation_gain_m: 340,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Tannourine Cedar Forest',
    description:
      "Lebanon's second largest cedar forest and one of its best-kept secrets — a stunning winter hike through ancient trees.",
    date: '2026-03-08',
    location: 'Tannourine, North Lebanon',
    difficulty: 'Easy',
    image_url: null,
    type: 'past',
    max_participants: 20,
    current_participants: 18,
    duration_hours: 4,
    elevation_gain_m: 210,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Jabal Moussa Biosphere',
    description:
      'A full-day traverse of the Jabal Moussa UNESCO biosphere reserve above Adonis Valley, with waterfalls and canyon views.',
    date: '2026-02-22',
    location: 'Laqlouq, Kesrouane',
    difficulty: 'Hard',
    image_url: null,
    type: 'past',
    max_participants: 18,
    current_participants: 16,
    duration_hours: 7,
    elevation_gain_m: 750,
    created_at: new Date().toISOString(),
  },
];

export default function EventsPage() {
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
        <div className="container" style={{ maxWidth: '600px' }}>
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
              Get Moving
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
            Hikes & Events
          </h1>
          <p className="hero-subtitle" style={{ color: 'rgba(224,216,181,0.68)', lineHeight: 1.7 }}>
            Every trail tells a story. Come write yours with us.
          </p>
        </div>
      </section>

      {/* ─── Upcoming ─── */}
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Don't Miss Out" title="Upcoming Hikes" />

          {UPCOMING.length === 0 ? (
            <ScrollReveal direction="fade">
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}>
                No upcoming hikes scheduled. Check back soon.
              </p>
            </ScrollReveal>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {UPCOMING.map((event, i) => (
                <ScrollReveal key={event.id} direction="bottom" delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <EventCard event={event} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '0 1.5rem' }} />

      {/* ─── Past events ─── */}
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Trail History" title="Past Adventures" />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {PAST.map((event, i) => (
              <ScrollReveal key={event.id} direction="bottom" delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div style={{ opacity: 0.85 }}>
                  <EventCard event={event} variant="compact" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
