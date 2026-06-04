export async function adminOp(
  action: 'insert' | 'update' | 'delete' | 'upsert',
  table: string,
  data?: object,
  match?: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, table, data, match }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Admin operation failed');
  return json.data;
}
