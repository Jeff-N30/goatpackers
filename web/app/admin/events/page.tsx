'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';
import type { HikingEvent, Difficulty } from '@/lib/types';

type Tab = 'upcoming' | 'past';

const EMPTY_FORM = {
  title: '', description: '', date: '', location: '',
  difficulty: 'Moderate' as Difficulty,
  type: 'upcoming' as 'upcoming' | 'past',
  max_participants: '', duration_hours: '', elevation_gain_m: '', image_url: '',
};

export default function AdminEventsPage() {
  const supabase = getAdminClient();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [events, setEvents] = useState<HikingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('type', tab)
      .order('date', { ascending: tab === 'upcoming' });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]); // eslint-disable-line

  const openAdd = () => { setForm({ ...EMPTY_FORM, type: tab }); setEditId(null); setModalOpen(true); };
  const openEdit = (ev: HikingEvent) => {
    setForm({
      title: ev.title, description: ev.description, date: ev.date.slice(0, 10),
      location: ev.location, difficulty: ev.difficulty, type: ev.type,
      max_participants: String(ev.max_participants ?? ''),
      duration_hours: String(ev.duration_hours ?? ''),
      elevation_gain_m: String(ev.elevation_gain_m ?? ''),
      image_url: ev.image_url ?? '',
    });
    setEditId(ev.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title, description: form.description, date: form.date,
      location: form.location, difficulty: form.difficulty, type: form.type,
      max_participants: form.max_participants ? Number(form.max_participants) : null,
      duration_hours: form.duration_hours ? Number(form.duration_hours) : null,
      elevation_gain_m: form.elevation_gain_m ? Number(form.elevation_gain_m) : null,
      image_url: form.image_url || null,
    };
    if (editId) {
      await supabase.from('events').update(payload).eq('id', editId);
    } else {
      await supabase.from('events').insert({ ...payload, current_participants: 0 });
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('events').delete().eq('id', id);
    setDeleteId(null);
    load();
  };

  const toggleType = async (ev: HikingEvent) => {
    const newType = ev.type === 'upcoming' ? 'past' : 'upcoming';
    await supabase.from('events').update({ type: newType }).eq('id', ev.id);
    load();
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--secondary)', margin: 0 }}>Events</h1>
        <button className="btn btn-primary" onClick={openAdd} style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Add Hike
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
        {(['upcoming', 'past'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '6px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 500, background: tab === t ? 'var(--secondary)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text-muted)', transition: 'all 200ms ease',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#fdf9f9', borderBottom: '1px solid var(--border)' }}>
              {['Title', 'Date', 'Location', 'Difficulty', 'Spots', 'Actions'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No {tab} events.</td></tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500, color: 'var(--text)' }}>{ev.title}</div>
                    {ev.image_url && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Has image</div>}
                  </td>
                  <td style={tdStyle}>{new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={tdStyle}>{ev.location}</td>
                  <td style={tdStyle}><span className={`badge badge-${ev.difficulty.toLowerCase()}`}>{ev.difficulty}</span></td>
                  <td style={tdStyle}>
                    {ev.max_participants
                      ? `${ev.current_participants}/${ev.max_participants}`
                      : ev.current_participants}
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <IconBtn onClick={() => openEdit(ev)} title="Edit"><Pencil size={14} /></IconBtn>
                      <IconBtn onClick={() => toggleType(ev)} title={ev.type === 'upcoming' ? 'Mark as past' : 'Mark as upcoming'}>
                        {ev.type === 'upcoming' ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      </IconBtn>
                      <IconBtn onClick={() => setDeleteId(ev.id)} title="Delete" danger><Trash2 size={14} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal title={editId ? 'Edit Event' : 'Add New Hike'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormRow>
              <FormField label="Title" required>
                <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </FormField>
              <FormField label="Date" required>
                <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </FormField>
            </FormRow>
            <FormField label="Description" required>
              <textarea className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required style={{ minHeight: '90px' }} />
            </FormField>
            <FormRow>
              <FormField label="Location" required>
                <input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
              </FormField>
              <FormField label="Status">
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'upcoming' | 'past' }))}>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField label="Difficulty">
                <select className="input" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))}>
                  {['Easy', 'Moderate', 'Hard', 'Expert'].map(d => <option key={d}>{d}</option>)}
                </select>
              </FormField>
              <FormField label="Max Participants">
                <input className="input" type="number" min={1} value={form.max_participants} onChange={e => setForm(f => ({ ...f, max_participants: e.target.value }))} placeholder="Unlimited" />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField label="Duration (hours)">
                <input className="input" type="number" min={0} step={0.5} value={form.duration_hours} onChange={e => setForm(f => ({ ...f, duration_hours: e.target.value }))} />
              </FormField>
              <FormField label="Elevation Gain (m)">
                <input className="input" type="number" min={0} value={form.elevation_gain_m} onChange={e => setForm(f => ({ ...f, elevation_gain_m: e.target.value }))} />
              </FormField>
            </FormRow>
            <FormField label="Image URL">
              <input className="input" type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
            </FormField>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : <><Check size={14} /> Save</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete Event?" onClose={() => setDeleteId(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            This action cannot be undone. The event will be permanently deleted.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ background: '#c0392b' }} onClick={() => handleDelete(deleteId)}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── Shared helpers ─── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(45,47,28,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '1.25rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px -12px rgba(45,47,28,0.3)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--secondary)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><X size={18} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

function IconBtn({ onClick, title, danger, children }: { onClick: () => void; title: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{ background: danger ? '#fdf2f2' : '#f7f2f2', border: 'none', borderRadius: '7px', padding: '6px 8px', cursor: 'pointer', color: danger ? '#c0392b' : 'var(--secondary)', display: 'flex', alignItems: 'center', transition: 'background 200ms ease' }}>
      {children}
    </button>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{label}{required && ' *'}</label>
      {children}
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.875rem', verticalAlign: 'middle' };
