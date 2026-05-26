'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Image,
  Users,
  Mail,
  BarChart2,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';

const NAV = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/events',    label: 'Events',     icon: Calendar },
  { href: '/admin/gallery',   label: 'Gallery',    icon: Image },
  { href: '/admin/team',      label: 'Team',       icon: Users },
  { href: '/admin/contacts',  label: 'Contacts',   icon: Mail },
  { href: '/admin/analytics', label: 'Analytics',  icon: BarChart2 },
  { href: '/admin/settings',  label: 'Settings',   icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getAdminClient();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside
      style={{
        width: '240px',
        minHeight: '100vh',
        background: 'var(--secondary)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '1.5rem 1.25rem 1.25rem',
          borderBottom: '1px solid rgba(224,216,181,0.12)',
        }}
      >
        <Link
          href="/admin"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--primary)',
            fontSize: '1.15rem',
            letterSpacing: '0.04em',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          Goatpackers
        </Link>
        <span
          style={{
            fontSize: '0.68rem',
            color: 'rgba(224,216,181,0.4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              data-active={active}
              className="sidebar-nav-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '9px 12px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: active ? 'white' : 'rgba(224,216,181,0.65)',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                borderLeft: active ? '3px solid var(--primary-light)' : '3px solid transparent',
              }}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.75} />
              {label}
              {active && (
                <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* View site + Logout */}
      <div
        style={{
          padding: '0.75rem',
          borderTop: '1px solid rgba(224,216,181,0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'rgba(224,216,181,0.5)',
            textDecoration: 'none',
            transition: 'color 200ms ease',
          }}
        >
          <ChevronRight size={14} strokeWidth={1.5} />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'rgba(224,216,181,0.55)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            transition: 'color 200ms ease',
          }}
        >
          <LogOut size={14} strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
