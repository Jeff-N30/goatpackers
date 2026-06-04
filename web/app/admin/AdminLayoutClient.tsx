'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AUTH_PAGES = ['/admin/login', '/admin/accept-invite'];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (AUTH_PAGES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className="admin-content"
        style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        {/* Mobile header bar */}
        <div className="admin-mobile-header">
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <span /><span /><span />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em' }}>
            Admin
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
