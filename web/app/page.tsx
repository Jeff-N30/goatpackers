import { ArrowRight, Mountain, Users, MapPin, Award, Calendar, Clock, TrendingUp } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import ContactSection from '@/components/ContactSection';
import type { HikingEvent, TeamMember } from '@/lib/types';

/* ─── Mock data — replace with Supabase queries once connected ─── */
const UPCOMING: HikingEvent[] = [
  {
    id: '1',
    title: 'Qornet el Sawda — Highest Peak',
    description: "A challenging ascent to Lebanon's highest point at 3,088m. Stunning panoramic views across the country and into Syria.",
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
    description: "A scenic loop through Lebanon's largest nature reserve, home to ancient cedar trees and diverse wildlife.",
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
    description: 'A mystical canyon walk past ancient hermit caves, Byzantine churches, and flowing waterfalls in the Holy Valley.',
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
    description: "A spring wildflower walk through one of Lebanon's most beautiful nature reserves, filled with endemic flora.",
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
    description: "Lebanon's second largest cedar forest — a stunning winter hike through ancient trees.",
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
    description: 'A full-day traverse of the Jabal Moussa UNESCO biosphere reserve, with waterfalls and canyon views.',
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

const STATS = [
  { icon: <Users size={22} strokeWidth={1.75} />, value: '200+', label: 'Active Members' },
  { icon: <Mountain size={22} strokeWidth={1.75} />, value: '85+', label: 'Trails Explored' },
  { icon: <MapPin size={22} strokeWidth={1.75} />, value: '6', label: 'Regions Covered' },
  { icon: <Award size={22} strokeWidth={1.75} />, value: '6', label: 'Years Together' },
];

const GALLERY_TILES = [
  { id: 1, span: 'tall',   label: 'Qornet el Sawda Summit' },
  { id: 2, span: 'wide',   label: 'Chouf Cedar Forest' },
  { id: 3, span: 'normal', label: 'Wadi Qannoubine' },
  { id: 4, span: 'normal', label: 'Sunset over Bcharre' },
  { id: 5, span: 'wide',   label: 'Cedar of God' },
  { id: 6, span: 'tall',   label: 'Horsh Ehden Wildflowers' },
  { id: 7, span: 'normal', label: 'Mountain Fog' },
  { id: 8, span: 'normal', label: 'Trail to Ehden' },
];

const GRADIENTS = [
  'linear-gradient(135deg, #808550 0%, #a0a668 100%)',
  'linear-gradient(135deg, #4a4e28 0%, #6b7040 100%)',
  'linear-gradient(135deg, #5c6135 0%, #a0a668 100%)',
  'linear-gradient(135deg, #2d2f1c 0%, #808550 100%)',
  'linear-gradient(135deg, #6b7040 0%, #e0d8b5 100%)',
  'linear-gradient(135deg, #4a4e28 0%, #6b7040 100%)',
  'linear-gradient(135deg, #5c6135 0%, #808550 100%)',
  'linear-gradient(135deg, #2d2f1c 0%, #5c6135 100%)',
];

const TEAM: TeamMember[] = [
  { id: '1', name: 'Placeholder Name', role: 'Founder & Lead Guide',   bio: 'Passionate about Lebanese mountains since childhood. Has summited every major peak in the country multiple times.', image_url: null, order: 1 },
  { id: '2', name: 'Placeholder Name', role: 'Trail Coordinator',       bio: 'Manages logistics and scouting for all Goatpackers hikes. Expert in backcountry navigation and wilderness first aid.', image_url: null, order: 2 },
  { id: '3', name: 'Placeholder Name', role: 'Photography Lead',        bio: 'Captures the spirit of every hike through a lens. Responsible for the gallery and all visual content.', image_url: null, order: 3 },
  { id: '4', name: 'Placeholder Name', role: 'Community Manager',       bio: 'Keeps the community connected online and offline. Organises social events and manages member relations.', image_url: null, order: 4 },
];

const AVATAR_COLORS = ['#5c6135', '#4a4e28', '#808550', '#6b7040'];

const DIFFICULTY_CLASS: Record<string, string> = {
  Easy: 'badge-easy', Moderate: 'badge-moderate', Hard: 'badge-hard', Expert: 'badge-expert',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, #2d2f1c 0%, var(--secondary) 45%, #5c6135 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '120px 24px 100px',
      }}>
        <div aria-hidden style={{ position: 'absolute', top: '-15%', right: '-8%', width: '640px', height: '640px', background: 'radial-gradient(circle, rgba(128,133,80,0.18) 0%, transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-12%', left: '-6%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(224,216,181,0.07) 0%, transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ textAlign: 'center', maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{ marginBottom: '1.25rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(224,216,181,0.12)', border: '1px solid rgba(224,216,181,0.25)', borderRadius: '9999px', padding: '5px 18px', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(224,216,181,0.75)' }}>
              Lebanon · Est. 2020
            </span>
          </div>
          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 10vw, 8rem)', color: 'white', lineHeight: 1.0, letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
            Goatpackers
          </h1>
          <p className="hero-subtitle" style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'rgba(224,216,181,0.72)', lineHeight: 1.75, margin: '0 auto 2.75rem', maxWidth: '500px' }}>
            Exploring Lebanon's trails together — from cedar forests and gorges to mountain peaks.
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#events" className="btn btn-light">
              Upcoming Hikes <ArrowRight size={15} strokeWidth={2} />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Join the Club
            </a>
          </div>
        </div>

        <div className="hero-scroll" style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: '1.5px', height: '52px', background: 'linear-gradient(to bottom, transparent, rgba(224,216,181,0.55))' }} />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: 'var(--secondary)', padding: '2.75rem 1.5rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} direction="bottom" delay={((i % 4) + 1) as 1|2|3|4}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-light)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', lineHeight: 1, marginBottom: '0.3rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(224,216,181,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── EVENTS ─── */}
      <section id="events" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <ScrollReveal direction="fade">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>Don't Miss Out</span>
            </ScrollReveal>
            <ScrollReveal direction="bottom" delay={1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1 }}>Upcoming Hikes</h2>
            </ScrollReveal>
            <ScrollReveal direction="bottom" delay={2}>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>Reserve your spot before they fill up.</p>
            </ScrollReveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {UPCOMING.map((event, i) => (
              <ScrollReveal key={event.id} direction="bottom" delay={((i % 3) + 1) as 1|2|3}>
                <EventCard event={event} />
              </ScrollReveal>
            ))}
          </div>

          {/* Past events */}
          <div style={{ marginTop: '5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <ScrollReveal direction="fade">
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>Trail History</span>
              </ScrollReveal>
              <ScrollReveal direction="bottom" delay={1}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', color: 'var(--text)', lineHeight: 1.1 }}>Past Adventures</h2>
              </ScrollReveal>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {PAST.map((event, i) => (
                <ScrollReveal key={event.id} direction="bottom" delay={((i % 3) + 1) as 1|2|3}>
                  <div style={{ opacity: 0.82 }}>
                    <EventCard event={event} variant="compact" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section id="gallery" className="section" style={{ background: 'rgba(92,97,53,0.04)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <ScrollReveal direction="fade">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>Visual Stories</span>
            </ScrollReveal>
            <ScrollReveal direction="bottom" delay={1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1 }}>Through the Lens</h2>
            </ScrollReveal>
            <ScrollReveal direction="bottom" delay={2}>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>Moments captured on the trails of Lebanon.</p>
            </ScrollReveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gridAutoRows: '220px', gap: '1rem' }}>
            {GALLERY_TILES.map((tile, i) => (
              <ScrollReveal key={tile.id} direction="scale" delay={((i % 4) + 1) as 1|2|3|4} className="">
                <div
                  className="gallery-tile"
                  style={{
                    ...(tile.span === 'tall' ? { gridRow: 'span 2' } : tile.span === 'wide' ? { gridColumn: 'span 2' } : {}),
                    background: GRADIENTS[i % GRADIENTS.length],
                    borderRadius: '1rem', position: 'relative', overflow: 'hidden', height: '100%', cursor: 'pointer',
                  }}
                >
                  <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(45,47,28,0.7) 0%, transparent 50%)', display: 'flex', alignItems: 'flex-end', padding: '1rem', opacity: 0, transition: 'opacity 250ms ease' }}>
                    <span style={{ color: 'rgba(224,216,181,0.9)', fontSize: '0.82rem', fontWeight: 500 }}>{tile.label}</span>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(224,216,181,0.25)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Photo</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="section" style={{ background: 'var(--primary)', padding: '5.5rem 1.5rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <ScrollReveal direction="left">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary-light)', marginBottom: '0.75rem', display: 'block' }}>Who We Are</span>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: 'white', lineHeight: 1.1, marginBottom: '1rem' }}>
                Born from a love of Lebanon's mountains
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={2}>
              <p style={{ color: 'rgba(224,216,181,0.78)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Goatpackers started as a small group of friends with one shared obsession — the Lebanese mountains. Today we are a community of weekend warriors, trail runners, photography lovers, and anyone who needs fresh air and open space.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={3}>
              <a href="#team" className="btn btn-light">Meet the Team</a>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="right" delay={1}>
            <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, rgba(45,47,28,0.6) 0%, rgba(128,133,80,0.4) 100%)', border: '1px solid rgba(224,216,181,0.15)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(224,216,181,0.3)', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span>Photo coming soon</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section id="team" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <ScrollReveal direction="fade">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>The People</span>
            </ScrollReveal>
            <ScrollReveal direction="bottom" delay={1}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1 }}>Meet the Goatpackers</h2>
            </ScrollReveal>
            <ScrollReveal direction="bottom" delay={2}>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>The people who make every hike happen.</p>
            </ScrollReveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {TEAM.map((member, i) => {
              const initials = member.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('');
              return (
                <ScrollReveal key={member.id} direction="bottom" delay={((i % 4) + 1) as 1|2|3|4}>
                  <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: member.image_url ? `url(${member.image_url}) center/cover` : AVATAR_COLORS[i % AVATAR_COLORS.length], margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {!member.image_url && <span style={{ color: '#e0d8b5', fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>{initials}</span>}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text)', marginBottom: '0.3rem' }}>{member.name}</h3>
                    <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.85rem' }}>{member.role}</span>
                    {member.bio && <p style={{ fontSize: '0.855rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{member.bio}</p>}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <ContactSection />
    </>
  );
}

/* ─── Inline EventCard (avoids redirect to /contact) ─── */
function EventCard({ event, variant = 'default' }: { event: HikingEvent; variant?: 'default' | 'compact' }) {
  const spotsLeft = event.max_participants != null ? event.max_participants - event.current_participants : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        height: variant === 'compact' ? '180px' : '220px',
        background: event.image_url ? `url(${event.image_url}) center/cover no-repeat` : 'linear-gradient(135deg, var(--secondary) 0%, #4a4e28 100%)',
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${DIFFICULTY_CLASS[event.difficulty] ?? 'badge-moderate'}`}>{event.difficulty}</span>
        </div>
        {spotsLeft !== null && spotsLeft <= 5 && event.type === 'upcoming' && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(45,47,28,0.85)', color: '#e0d8b5', borderRadius: '8px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 600 }}>
            {spotsLeft === 0 ? 'Full' : `${spotsLeft} spots left`}
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text)', marginBottom: '0.6rem', lineHeight: 1.25 }}>{event.title}</h3>
        <p style={{ fontSize: '0.855rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <MetaRow icon={<Calendar size={13} />} text={formatDate(event.date)} />
          <MetaRow icon={<MapPin size={13} />} text={event.location} />
          {event.duration_hours && <MetaRow icon={<Clock size={13} />} text={`${event.duration_hours}h`} />}
          {event.elevation_gain_m && <MetaRow icon={<TrendingUp size={13} />} text={`+${event.elevation_gain_m}m elevation`} />}
          {event.max_participants && <MetaRow icon={<Users size={13} />} text={`${event.current_participants}/${event.max_participants} hikers`} />}
        </div>

        {event.type === 'upcoming' && (
          <a href="#contact" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center', fontSize: '0.825rem' }}>
            Register
          </a>
        )}
      </div>
    </div>
  );
}

function MetaRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
      <span style={{ color: 'var(--primary-mid)', flexShrink: 0 }}>{icon}</span>
      {text}
    </div>
  );
}
