import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Returns an authenticated server-side Supabase client using the request cookies. */
function makeAuthClient(req: NextRequest) {
  return createServerClient(URL(), ANON(), {
    cookies: {
      getAll() { return req.cookies.getAll(); },
      setAll() {},
    },
  });
}

/** Returns service-role client if key available, else the passed-in auth client. */
function makeWriteClient(authClient: ReturnType<typeof makeAuthClient>) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createClient(URL(), serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  // Fallback: use the authenticated client — works because our RLS policy
  // grants ALL to the `authenticated` role, and the session JWT is in cookies.
  return authClient;
}

export async function POST(req: NextRequest) {
  const authClient = makeAuthClient(req);

  // Verify the caller is a logged-in admin
  let user = null;
  try {
    const { data } = await authClient.auth.getUser();
    user = data.user;
  } catch { /* unreachable */ }
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { action: string; table: string; data?: unknown; match?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { action, table, data, match } = body;
  const db = makeWriteClient(authClient);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;

    if (action === 'insert') {
      result = await db.from(table).insert(data as object).select();
    } else if (action === 'update') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = db.from(table).update(data as object);
      if (match) for (const [k, v] of Object.entries(match)) q = q.eq(k, v);
      result = await q.select();
    } else if (action === 'delete') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let q: any = db.from(table).delete();
      if (match) for (const [k, v] of Object.entries(match)) q = q.eq(k, v);
      result = await q;
    } else if (action === 'upsert') {
      const onConflict = table === 'site_settings' ? 'key' : 'id';
      result = await db.from(table).upsert(data as object, { onConflict }).select();
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
    return NextResponse.json({ data: result.data ?? null });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
