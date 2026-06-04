'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Supabase invite links land on the homepage with #access_token=...&type=invite
// This component detects that and silently moves the user to the right page.
export default function InviteRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/accept-invite') return;
    const hash = window.location.hash;
    if (hash.includes('type=invite') || hash.includes('type=recovery')) {
      router.replace(`/admin/accept-invite${hash}`);
    }
  }, [router, pathname]);

  return null;
}
