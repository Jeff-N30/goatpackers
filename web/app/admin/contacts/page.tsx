'use client';

import { useEffect, useState } from 'react';
import { Trash2, Eye, MailOpen, Mail, X } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';
import { adminOp } from '@/lib/admin-api';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

type Filter = 'all' | 'unread' | 'read';

export default function AdminContactsPage() {
  const supabase = getAdminClient();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const load = async () => {
    setLoading(true);
    let query = supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (filter === 'unread') query = query.eq('read', false);
    if (filter === 'read') query = query.eq('read', true);
    const { data } = await query;
    setContacts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  const openMessage = async (c: Contact) => {
    setSelected(c);
    if (!c.read) {
      await adminOp('update', 'contacts', { read: true }, { id: c.id });
      setContacts((prev) => prev.map((x) => x.id === c.id ? { ...x, read: true } : x));
    }
  };

  const toggleRead = async (c: Contact) => {
    await adminOp('update', 'contacts', { read: !c.read }, { id: c.id });
    load();
  };

  const handleDelete = async (id: string) => {
    await adminOp('delete', 'contacts', undefined, { id });
    setDeleteId(null);
    if (selected?.id === id) setSelected(null);
    load();
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className={`admin-page${mounted ? ' admin-page--visible' : ''}`} style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 className="admin-title">Contacts</h1>
          {unreadCount > 0 && (
            <span className="admin-unread-badge">{unreadCount} unread</span>
          )}
        </div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: '1.25rem' }}>
        {(['all', 'unread', 'read'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`admin-tab${filter === f ? ' admin-tab--active' : ''}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#fdf9f9', borderBottom: '1px solid var(--border)' }}>
              {['', 'Name', 'Subject', 'Date', 'Actions'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No messages.</td></tr>
            ) : (
              contacts.map((c, i) => (
                <tr
                  key={c.id}
                  className="admin-table-row"
                  onClick={() => openMessage(c)}
                  style={{
                    borderBottom: '1px solid var(--border)', cursor: 'pointer',
                    background: !c.read ? '#fdf8f8' : 'white',
                    animationDelay: `${i * 35}ms`,
                  }}
                >
                  <td style={{ ...tdStyle, width: '16px', paddingRight: 0 }}>
                    {!c.read && <span className="admin-unread-dot" />}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: c.read ? 400 : 600, color: 'var(--text)' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.email}</div>
                  </td>
                  <td style={tdStyle}>{c.subject}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <IconBtn onClick={() => openMessage(c)} title="View message"><Eye size={14} /></IconBtn>
                      <IconBtn onClick={() => toggleRead(c)} title={c.read ? 'Mark unread' : 'Mark read'}>
                        {c.read ? <Mail size={14} /> : <MailOpen size={14} />}
                      </IconBtn>
                      <IconBtn onClick={() => setDeleteId(c.id)} title="Delete" danger><Trash2 size={14} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="admin-modal" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--secondary)', margin: '0 0 4px' }}>{selected.subject}</h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  From <strong style={{ color: 'var(--text)' }}>{selected.name}</strong> — <a href={`mailto:${selected.email}`} style={{ color: 'var(--primary-mid)' }}>{selected.email}</a>
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text)', lineHeight: 1.7, fontSize: '0.9rem' }}>{selected.message}</p>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Received {new Date(selected.created_at).toLocaleString('en-GB')}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary admin-btn" style={{ fontSize: '0.82rem' }}>
                  Reply via Email
                </a>
                <button className="btn btn-outline admin-btn" style={{ fontSize: '0.82rem', borderColor: '#c0392b', color: '#c0392b' }} onClick={() => { setDeleteId(selected.id); setSelected(null); }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth: '400px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', margin: '0 0 0.75rem' }}>Delete Message?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary admin-btn" style={{ background: '#c0392b' }} onClick={() => handleDelete(deleteId)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ onClick, title, danger, children }: { onClick: () => void; title: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} className={`admin-icon-btn${danger ? ' admin-icon-btn--danger' : ''}`}>
      {children}
    </button>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.875rem', verticalAlign: 'middle' };
