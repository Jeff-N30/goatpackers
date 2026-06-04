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
  Phone,
} from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';

const NAV = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/events',     label: 'Events',     icon: Calendar },
  { href: '/admin/gallery',    label: 'Gallery',    icon: Image },
  { href: '/admin/team',       label: 'Team',       icon: Users },
  { href: '/admin/contacts',   label: 'Contacts',   icon: Mail },
  { href: '/admin/contact',    label: 'Contact Info', icon: Phone },
  { href: '/admin/analytics',  label: 'Analytics',  icon: BarChart2 },
  { href: '/admin/settings',   label: 'Settings',   icon: Settings },
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
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <Link href="/admin" className="admin-sidebar-brand">
          Goatpackers
        </Link>
        <span className="admin-sidebar-sub">Admin Panel</span>
        <div className="admin-sidebar-glow" />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ href, label, icon: Icon }, i) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              data-active={active}
              className={`admin-nav-link${active ? ' admin-nav-link--active' : ''}`}
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link
          href="/"
          target="_blank"
          className="admin-sidebar-view-site"
        >
          <ChevronRight size={13} strokeWidth={1.5} />
          View Site
        </Link>
        <button onClick={handleLogout} className="admin-sidebar-logout">
          <LogOut size={14} strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
