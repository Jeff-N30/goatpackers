'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Calendar, Image, Users, Mail, BarChart2, Plus, ArrowRight } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';

interface Stats {
  upcoming: number; past: number; gallery: number;
  team: number; unread: number; viewsToday: number; viewsMonth: number;
}
interface RecentContact { id: string; name: string; email: string; subject: string; created_at: string; read: boolean; }
interface UpcomingEvent { id: string; title: string; date: string; location: string; difficulty: string; current_participants: number; max_participants: number | null; }

/* Count-up hook — ease-out cubic, under 900ms */
function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);
  return value;
}

export default function AdminDashboard() {
  const supabase = getAdminClient();
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<RecentContact[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const [
        { count: upcoming }, { count: past }, { count: gallery }, { count: team },
        { count: unread }, { count: viewsToday }, { count: viewsMonth },
        { data: recentContacts }, { data: upcomingEvents },
      ] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'upcoming'),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'past'),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('team').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('read', false),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
        supabase.from('contacts').select('id, name, email, subject, created_at, read').order('created_at', { ascending: false }).limit(5),
        supabase.from('events').select('id, title, date, location, difficulty, current_participants, max_participants').eq('type', 'upcoming').order('date', { ascending: true }).limit(4),
      ]);

      setStats({ upcoming: upcoming ?? 0, past: past ?? 0, gallery: gallery ?? 0, team: team ?? 0, unread: unread ?? 0, viewsToday: viewsToday ?? 0, viewsMonth: viewsMonth ?? 0 });
      setContacts(recentContacts ?? []);
      setEvents(upcomingEvents ?? []);
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line

  return (
    <div className={`admin-page${mounted ? ' admin-page--visible' : ''}`} style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <h1 className="admin-title">Dashboard</h1>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="admin-skeleton" style={{ height: '96px', borderRadius: '1rem', animationDelay: `${i * 60}ms` }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard icon={<Calendar size={18} />} label="Upcoming Hikes" value={stats!.upcoming} color="#5c6135" href="/admin/events" delay={0} />
            <StatCard icon={<Calendar size={18} />} label="Past Events" value={stats!.past} color="#7a4040" href="/admin/events" delay={50} />
            <StatCard icon={<Image size={18} />} label="Gallery Images" value={stats!.gallery} color="#5a3b3b" href="/admin/gallery" delay={100} />
            <StatCard icon={<Users size={18} />} label="Team Members" value={stats!.team} color="#693d3d" href="/admin/team" delay={150} />
            <StatCard icon={<Mail size={18} />} label="Unread Messages" value={stats!.unread} color={stats!.unread > 0 ? '#b33333' : '#7a4040'} href="/admin/contacts" delay={200} accent={stats!.unread > 0} />
            <StatCard icon={<BarChart2 size={18} />} label="Views Today" value={stats!.viewsToday} color="#5c6135" href="/admin/analytics" delay={250} />
            <StatCard icon={<BarChart2 size={18} />} label="Views This Month" value={stats!.viewsMonth} color="#808550" href="/admin/analytics" delay={300} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', animation: 'admin-slide-up 300ms var(--ease-out) 220ms both' }}>
            <Link href="/admin/events" className="btn btn-primary admin-btn" style={{ fontSize: '0.82rem' }}><Plus size={14} /> Add Hike</Link>
            <Link href="/admin/gallery" className="btn btn-outline admin-btn" style={{ fontSize: '0.82rem' }}><Plus size={14} /> Upload Photo</Link>
            <Link href="/admin/team" className="btn btn-outline admin-btn" style={{ fontSize: '0.82rem' }}><Plus size={14} /> Add Team Member</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', animation: 'admin-slide-up 300ms var(--ease-out) 300ms both' }}>
            <AdminCard title="Upcoming Hikes" action={<Link href="/admin/events" style={linkStyle}>View all <ArrowRight size={12} /></Link>}>
              {events.length === 0 ? (
                <EmptyRow>No upcoming hikes scheduled.</EmptyRow>
              ) : (
                events.map((ev, i) => (
                  <div key={ev.id} style={{ ...rowStyle, animationDelay: `${360 + i * 40}ms`, animation: 'admin-row-in 250ms var(--ease-out) both' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text)' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {ev.location}
                      </div>
                    </div>
                    <span className={`badge badge-${ev.difficulty.toLowerCase()}`}>{ev.difficulty}</span>
                  </div>
                ))
              )}
            </AdminCard>

            <AdminCard title="Recent Messages" action={<Link href="/admin/contacts" style={linkStyle}>View all <ArrowRight size={12} /></Link>}>
              {contacts.length === 0 ? (
                <EmptyRow>No messages yet.</EmptyRow>
              ) : (
                contacts.map((c, i) => (
                  <div key={c.id} style={{ ...rowStyle, animationDelay: `${360 + i * 40}ms`, animation: 'admin-row-in 250ms var(--ease-out) both' }}>
                    <div>
                      <div style={{ fontWeight: c.read ? 400 : 600, fontSize: '0.875rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {!c.read && <span className="admin-unread-dot" />}
                        {c.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.subject}</div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                ))
              )}
            </AdminCard>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, href, delay, accent }: {
  icon: React.ReactNode; label: string; value: number; color: string;
  href: string; delay: number; accent?: boolean;
}) {
  const displayed = useCountUp(value);
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        className="admin-stat-card"
        style={{
          background: 'white',
          border: `1px solid ${accent ? 'rgba(176,56,56,0.25)' : 'var(--border)'}`,
          borderRadius: '1rem',
          padding: '1.25rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          cursor: 'pointer',
          animationDelay: `${delay}ms`,
          boxShadow: accent ? '0 0 0 3px rgba(176,56,56,0.08)' : undefined,
        }}
      >
        <div style={{ color, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {icon}{label}
        </div>
        <div className="admin-count-value" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--text)', lineHeight: 1, animationDelay: `${delay + 80}ms` }}>
          {displayed}
        </div>
      </div>
    </Link>
  );
}

function AdminCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', margin: 0 }}>{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{children}</div>;
}

const rowStyle: React.CSSProperties = { padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' };
const linkStyle: React.CSSProperties = { fontSize: '0.78rem', color: 'var(--primary-mid)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', transition: 'color 150ms ease' };
