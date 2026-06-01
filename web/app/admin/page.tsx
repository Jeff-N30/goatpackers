'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Image, Users, Mail, BarChart2, Plus, ArrowRight } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';

interface Stats {
  upcoming: number;
  past: number;
  gallery: number;
  team: number;
  unread: number;
  viewsToday: number;
  viewsMonth: number;
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  created_at: string;
  read: boolean;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  difficulty: string;
  current_participants: number;
  max_participants: number | null;
}

export default function AdminDashboard() {
  const supabase = getAdminClient();
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<RecentContact[]>([]);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const [
        { count: upcoming },
        { count: past },
        { count: gallery },
        { count: team },
        { count: unread },
        { count: viewsToday },
        { count: viewsMonth },
        { data: recentContacts },
        { data: upcomingEvents },
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

      setStats({
        upcoming: upcoming ?? 0,
        past: past ?? 0,
        gallery: gallery ?? 0,
        team: team ?? 0,
        unread: unread ?? 0,
        viewsToday: viewsToday ?? 0,
        viewsMonth: viewsMonth ?? 0,
      });
      setContacts(recentContacts ?? []);
      setEvents(upcomingEvents ?? []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  return (
    <div style={{ padding: '2rem' }}>
      <AdminHeader title="Dashboard" />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard icon={<Calendar size={18} />} label="Upcoming Hikes" value={stats!.upcoming} color="#808550" href="/admin/events" />
            <StatCard icon={<Calendar size={18} />} label="Past Events" value={stats!.past} color="#996666" href="/admin/events" />
            <StatCard icon={<Image size={18} />} label="Gallery Images" value={stats!.gallery} color="#7a3a3a" href="/admin/gallery" />
            <StatCard icon={<Users size={18} />} label="Team Members" value={stats!.team} color="#884444" href="/admin/team" />
            <StatCard icon={<Mail size={18} />} label="Unread Messages" value={stats!.unread} color={stats!.unread > 0 ? '#b33333' : '#996666'} href="/admin/contacts" />
            <StatCard icon={<BarChart2 size={18} />} label="Views Today" value={stats!.viewsToday} color="#808550" href="/admin/analytics" />
            <StatCard icon={<BarChart2 size={18} />} label="Views This Month" value={stats!.viewsMonth} color="#996666" href="/admin/analytics" />
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link href="/admin/events" className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              <Plus size={14} /> Add Hike
            </Link>
            <Link href="/admin/gallery" className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
              <Plus size={14} /> Upload Photo
            </Link>
            <Link href="/admin/team" className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
              <Plus size={14} /> Add Team Member
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Upcoming events */}
            <AdminCard
              title="Upcoming Hikes"
              action={<Link href="/admin/events" style={linkStyle}>View all <ArrowRight size={12} /></Link>}
            >
              {events.length === 0 ? (
                <EmptyRow>No upcoming hikes scheduled.</EmptyRow>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} style={rowStyle}>
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

            {/* Recent messages */}
            <AdminCard
              title="Recent Messages"
              action={<Link href="/admin/contacts" style={linkStyle}>View all <ArrowRight size={12} /></Link>}
            >
              {contacts.length === 0 ? (
                <EmptyRow>No messages yet.</EmptyRow>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} style={rowStyle}>
                    <div>
                      <div style={{ fontWeight: c.read ? 400 : 600, fontSize: '0.875rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {!c.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)', flexShrink: 0, display: 'inline-block' }} />}
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

/* ─── Shared sub-components ─── */

function AdminHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--secondary)', margin: 0 }}>
        {title}
      </h1>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, color, href }: { icon: React.ReactNode; label: string; value: number; color: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          transition: 'transform 250ms ease, box-shadow 250ms ease',
          cursor: 'pointer',
        }}
      >
        <div style={{ color, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {icon}
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--text)', lineHeight: 1 }}>
          {value}
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
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
      {children}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.25rem', height: '96px', opacity: 0.5 }} />
      ))}
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  padding: '0.875rem 1.25rem',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
};

const linkStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  color: 'var(--primary-mid)',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
};
