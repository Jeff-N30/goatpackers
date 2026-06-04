import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname.startsWith('/admin/login');

  if (!supabaseUrl || !supabaseKey) {
    if (isAdminPath && !isLoginPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return supabaseResponse;
  }

  // ── Check our custom 24-hour session expiry ──────────────────
  const raw = request.cookies.get('admin_expires_at')?.value;
  const sessionValid = !!raw && Date.now() < Number(raw);

  // If expired/missing and trying to access admin, kick to login
  if (isAdminPath && !isLoginPath && !sessionValid) {
    const res = NextResponse.redirect(new URL('/admin/login', request.url));
    res.cookies.set('admin_expires_at', '', { maxAge: 0, path: '/' });
    return res;
  }

  // ── Verify Supabase session ──────────────────────────────────
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase unreachable — fall through
  }

  // No Supabase session on admin path → kick to login
  if (isAdminPath && !isLoginPath && !user) {
    const res = NextResponse.redirect(new URL('/admin/login', request.url));
    res.cookies.set('admin_expires_at', '', { maxAge: 0, path: '/' });
    return res;
  }

  // Already logged in with valid session → skip login page
  if (isLoginPath && user && sessionValid) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
