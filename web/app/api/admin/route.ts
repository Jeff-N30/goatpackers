import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

async function getAuthUser(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll() {},
        },
      }
    );
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  // Fallback to anon key — works when RLS is disabled
  return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { action: string; table: string; data?: unknown; match?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { action, table, data, match } = body;
  const db = getServiceClient();

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
      // site_settings uses 'key' as unique column
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
