'use client';

import { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Eye, Globe } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';

interface PageView { id: string; path: string; created_at: string; }
interface PathCount { path: string; count: number; }
interface DayCount { label: string; value: number; }

export default function AdminAnalyticsPage() {
  const supabase = getAdminClient();
  const [loading, setLoading] = useState(true);
  const [totalAll, setTotalAll] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [totalWeek, setTotalWeek] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  const [byPage, setByPage] = useState<PathCount[]>([]);
  const [daily, setDaily] = useState<DayCount[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function load() {
      const now = new Date();
      const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
      const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30);
      const twoWeeksStart = new Date(now); twoWeeksStart.setDate(now.getDate() - 13);

      const [{ count: all }, { count: today }, { count: week }, { count: month }, { data: rawViews }] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString()),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
        supabase.from('page_views').select('path, created_at').gte('created_at', twoWeeksStart.toISOString()),
      ]);

      setTotalAll(all ?? 0);
      setTotalToday(today ?? 0);
      setTotalWeek(week ?? 0);
      setTotalMonth(month ?? 0);

      const views: PageView[] = rawViews ?? [];
      const pageCounts: Record<string, number> = {};
      views.forEach(v => { pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1; });
      setByPage(Object.entries(pageCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([path, count]) => ({ path, count })));

      const dayCounts: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now); d.setDate(now.getDate() - i);
        const key = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const isoDate = d.toISOString().slice(0, 10);
        dayCounts[key] = views.filter(v => v.created_at.startsWith(isoDate)).length;
      }
      setDaily(Object.entries(dayCounts).map(([label, value]) => ({ label, value })));
      setLoading(false);
    }
    load();
  }, [supabase]);

  const maxBar = Math.max(...byPage.map(p => p.count), 1);

  return (
    <div className={`admin-page${mounted ? ' admin-page--visible' : ''}`} style={{ padding: '2rem' }}>
      <h1 className="admin-title" style={{ marginBottom: '1.75rem' }}>Analytics</h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-skeleton" style={{ height: '90px', borderRadius: '1rem', animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
          <div className="admin-skeleton" style={{ height: '220px', borderRadius: '1rem' }} />
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'All Time', value: totalAll, icon: <Globe size={16} />, delay: 0 },
              { label: 'Today', value: totalToday, icon: <Eye size={16} />, delay: 60 },
              { label: 'Last 7 Days', value: totalWeek, icon: <TrendingUp size={16} />, delay: 120 },
              { label: 'Last 30 Days', value: totalMonth, icon: <BarChart2 size={16} />, delay: 180 },
            ].map(({ label, value, icon, delay }) => (
              <div
                key={label}
                className="admin-stat-card"
                style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.25rem', animationDelay: `${delay}ms` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary-mid)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  {icon} {label}
                </div>
                <div className="admin-count-value" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--text)', lineHeight: 1, animationDelay: `${delay + 80}ms` }}>
                  {value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', animation: 'admin-slide-up 300ms var(--ease-out) 240ms both' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Page Views — Last 14 Days</h3>
            <DailyBarChart data={daily} />
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden', animation: 'admin-slide-up 300ms var(--ease-out) 320ms both' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', margin: 0 }}>Top Pages (Last 14 Days)</h3>
            </div>
            {byPage.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No data yet.</div>
            ) : (
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {byPage.map(({ path, count }, i) => (
                  <div key={path} style={{ animation: `admin-row-in 250ms var(--ease-out) ${i * 40}ms both` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--secondary)', fontWeight: 500, fontFamily: 'monospace' }}>{path}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ height: '6px', background: '#f0e8e8', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'var(--primary-mid)', borderRadius: '9999px', width: `${(count / maxBar) * 100}%`, transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)', transitionDelay: `${i * 60}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p style={{ marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Views tracked via <code>page_views</code> table. Admin pages excluded.
          </p>
        </>
      )}
    </div>
  );
}

function DailyBarChart({ data }: { data: DayCount[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const barCount = data.length;
  const W = 560; const H = 160;
  const barW = Math.max(6, (W / barCount) - 5);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H + 32}`} style={{ width: '100%', minWidth: '300px', display: 'block' }}>
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={0} x2={W} y1={H - f * H} y2={H - f * H} stroke="#f0e8e8" strokeWidth={1} />
        ))}
        {data.map((d, i) => {
          const barH = (d.value / max) * H;
          const x = i * (W / barCount) + (W / barCount - barW) / 2;
          const y = H - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH || 2} fill="var(--primary)" rx={3}
                style={{ opacity: 0, animation: `admin-slide-up 300ms var(--ease-out) ${i * 25}ms both` }} />
              {d.value > 0 && (
                <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={9} fill="var(--secondary)" fontWeight="600">{d.value}</text>
              )}
              {i % 2 === 0 && (
                <text x={x + barW / 2} y={H + 20} textAnchor="middle" fontSize={8.5} fill="var(--text-muted)">{d.label}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
