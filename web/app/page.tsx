import { createClient } from '@supabase/supabase-js';
import ScrollReveal from '@/components/ScrollReveal';
import EventsSection from '@/components/EventsSection';
import GallerySlider from '@/components/GallerySlider';
import type { SliderImage } from '@/components/GallerySlider';
import ContactSection from '@/components/ContactSection';
import type { HikingEvent, TeamMember } from '@/lib/types';

/* ─── Mock fallbacks (used when DB is empty) ─── */
const MOCK_UPCOMING: HikingEvent[] = [
  { id: '1', title: 'Qornet el Sawda — Highest Peak', description: "A challenging ascent to Lebanon's highest point at 3,088m. Stunning panoramic views across the country and into Syria.", date: '2026-06-07', location: 'Bcharre, North Lebanon', difficulty: 'Hard', image_url: null, type: 'upcoming', max_participants: 20, current_participants: 14, duration_hours: 8, elevation_gain_m: 980, created_at: new Date().toISOString() },
  { id: '2', title: 'Chouf Cedar Reserve Trail', description: "A scenic loop through Lebanon's largest nature reserve, home to ancient cedar trees and diverse wildlife.", date: '2026-06-21', location: 'Barouk, Chouf', difficulty: 'Moderate', image_url: null, type: 'upcoming', max_participants: 25, current_participants: 8, duration_hours: 5, elevation_gain_m: 420, created_at: new Date().toISOString() },
  { id: '3', title: 'Wadi Qannoubine Gorge', description: 'A mystical canyon walk past ancient hermit caves, Byzantine churches, and flowing waterfalls in the Holy Valley.', date: '2026-07-05', location: 'Qannoubine, Bcharre', difficulty: 'Easy', image_url: null, type: 'upcoming', max_participants: 30, current_participants: 3, duration_hours: 4, elevation_gain_m: 280, created_at: new Date().toISOString() },
  { id: '7', title: 'Kadisha Valley Trek', description: 'A full traverse of the Holy Valley, past waterfalls, ancient monasteries, and cedars clinging to sheer cliff faces.', date: '2026-07-19', location: 'Bcharre, North Lebanon', difficulty: 'Moderate', image_url: null, type: 'upcoming', max_participants: 22, current_participants: 5, duration_hours: 6, elevation_gain_m: 550, created_at: new Date().toISOString() },
];
const MOCK_PAST: HikingEvent[] = [
  { id: '4', title: 'Horsh Ehden Nature Reserve', description: "A spring wildflower walk through one of Lebanon's most beautiful nature reserves, filled with endemic flora.", date: '2026-04-12', location: 'Ehden, North Lebanon', difficulty: 'Moderate', image_url: null, type: 'past', max_participants: 25, current_participants: 22, duration_hours: 5, elevation_gain_m: 340, created_at: new Date().toISOString() },
  { id: '5', title: 'Tannourine Cedar Forest', description: "Lebanon's second largest cedar forest — a stunning winter hike through ancient trees.", date: '2026-03-08', location: 'Tannourine, North Lebanon', difficulty: 'Easy', image_url: null, type: 'past', max_participants: 20, current_participants: 18, duration_hours: 4, elevation_gain_m: 210, created_at: new Date().toISOString() },
  { id: '6', title: 'Jabal Moussa Biosphere', description: 'A full-day traverse of the Jabal Moussa UNESCO biosphere reserve, with waterfalls and canyon views.', date: '2026-02-22', location: 'Laqlouq, Kesrouane', difficulty: 'Hard', image_url: null, type: 'past', max_participants: 18, current_participants: 16, duration_hours: 7, elevation_gain_m: 750, created_at: new Date().toISOString() },
  { id: '8', title: 'Afqa Grotto & Nahr Ibrahim', description: 'A mythological river source walk to the famous Afqa cave, where Adonis River springs from the rock face.', date: '2026-01-18', location: 'Afqa, Jbeil', difficulty: 'Easy', image_url: null, type: 'past', max_participants: 28, current_participants: 24, duration_hours: 3, elevation_gain_m: 180, created_at: new Date().toISOString() },
];
const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Jeff Nader', role: 'Founder & Guide', bio: 'Passionate about Lebanese mountains since childhood. Has summited every major peak in the country multiple times.', image_url: null, order: 1 },
  { id: '2', name: 'Mary Bark', role: 'Social Media Manager & Coordinator', bio: 'Manages logistics and scouting for all Goatpackers hikes. Expert in backcountry navigation and wilderness first aid.', image_url: null, order: 2 },
  { id: '3', name: 'Antoine Saliba', role: 'Guide & Medic', bio: 'Captures the spirit of every hike through a lens. Responsible for the gallery and all visual content.', image_url: null, order: 3 },
];
const MOCK_SLIDES: SliderImage[] = [
  { id: 's1', image_url: null, caption: 'Qornet el Sawda Summit' },
  { id: 's2', image_url: null, caption: 'Chouf Cedar Forest' },
  { id: 's3', image_url: null, caption: 'Wadi Qannoubine' },
];

const AVATAR_COLORS = ['#5c6135', '#4a4e28', '#808550', '#6b7040'];

export default async function HomePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /* ─── Fetch all data in parallel ─── */
  const [eventsRes, teamRes, featuredRes, recentRes] = await Promise.all([
    supabase.from('events').select('*').order('date', { ascending: true }),
    supabase.from('team').select('*').order('order', { ascending: true }),
    supabase.from('gallery').select('id,image_url,caption,display_order').not('display_order', 'is', null).order('display_order', { ascending: true }).limit(3),
    supabase.from('gallery').select('id,image_url,caption').order('created_at', { ascending: false }).limit(3),
  ]);

  /* ─── Events: auto-categorize by date ─── */
  const today = new Date().toISOString().split('T')[0];
  const allEvents = eventsRes.data ?? [];
  const UPCOMING = allEvents.length > 0
    ? allEvents.filter(e => e.date >= today).map(e => ({ ...e, type: 'upcoming' as const }))
    : MOCK_UPCOMING;
  const PAST = allEvents.length > 0
    ? allEvents.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date)).map(e => ({ ...e, type: 'past' as const }))
    : MOCK_PAST;

  /* ─── Team ─── */
  const TEAM: TeamMember[] = teamRes.data && teamRes.data.length > 0 ? teamRes.data : MOCK_TEAM;

  /* ─── Gallery slides: featured first, fall back to recent ─── */
  const rawSlides = featuredRes.data && featuredRes.data.length > 0
    ? featuredRes.data
    : (recentRes.data ?? []);
  const SLIDES: SliderImage[] = rawSlides.length > 0
    ? rawSlides.map(r => ({ id: r.id, image_url: r.image_url, caption: r.caption }))
    : MOCK_SLIDES;

  return (
    <>
      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(92,97,53,0.1) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: '120px 24px 100px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{ marginBottom: '1.25rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(92,97,53,0.1)',
              border: '1px solid rgba(92,97,53,0.2)',
              borderRadius: '9999px',
              padding: '5px 18px',
              fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--primary)',
            }}>
              Lebanon · Est. 2020
            </span>
          </div>
          <h1 className="hero-title" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            color: 'var(--text)',
            lineHeight: 1.0, letterSpacing: '-0.01em', marginBottom: '1.5rem',
          }}>
            Goatpackers
          </h1>
          <p className="hero-subtitle" style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.75, margin: '0 auto 2.75rem', maxWidth: '460px',
          }}>
            We pack with Goats
            <br />
            Exploring Lebanon together
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#events" className="btn btn-primary">Upcoming Hikes</a>
            <a href="#contact" className="btn btn-outline">Join the Club</a>
          </div>
        </div>

        <div className="hero-scroll" style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: '1.5px', height: '52px', background: 'linear-gradient(to bottom, transparent, rgba(92,97,53,0.35))' }} />
        </div>
      </section>

      {/* ─── EVENTS ─── */}
      <EventsSection upcoming={UPCOMING} past={PAST} />

      {/* ─── GALLERY — 3-image slider ─── */}
      <section id="gallery" className="section" style={{ background: 'rgba(92,97,53,0.03)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <ScrollReveal direction="bottom">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>Visual Stories</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1, marginTop: 0 }}>Through the Lens</h2>
            </ScrollReveal>
          </div>
          <ScrollReveal direction="bottom" delay={1}>
            <GallerySlider images={SLIDES} />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" style={{ background: 'rgba(92,97,53,0.05)', padding: '6rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <ScrollReveal direction="bottom">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: 'var(--text)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Born from a love of Lebanon's mountains
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={1}>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', maxWidth: '560px', margin: '0 auto 2.75rem' }}>
              Goatpackers started as a small group of friends with one shared obsession — the Lebanese mountains. Today we are a community of weekend warriors, trail runners, photography lovers, and anyone who needs fresh air and open space.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={2}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2.75rem', padding: '1.75rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--bg)' }}>
              {[
                { value: '200+', label: 'Members' },
                { value: '85+', label: 'Trails' },
                { value: '6', label: 'Regions' },
                { value: '6 yrs', label: 'Together' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={3}>
            <a href="#team" className="btn btn-primary">Meet the Team</a>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section id="team" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <ScrollReveal direction="bottom">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>The People</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1, marginTop: 0 }}>Meet the Goatpackers</h2>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>The people who make every hike happen.</p>
            </ScrollReveal>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', justifyContent: 'center' }}>
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
