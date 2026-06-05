'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, Upload, ImageIcon, Users } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';
import { adminOp } from '@/lib/admin-api';
import type { HikingEvent, Difficulty } from '@/lib/types';

type Tab = 'upcoming' | 'past';
type Participant = { id: string; event_id: string; name: string; created_at: string };

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
  const [mounted, setMounted] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Participants management
  const [partEventId, setPartEventId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingPart, setLoadingPart] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingPart, setSavingPart] = useState(false);
  const [editingPart, setEditingPart] = useState<{ id: string; name: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events').select('*').eq('type', tab)
      .order('date', { ascending: tab === 'upcoming' });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { setMounted(true); }, []);
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
    try {
      if (editId) {
        await adminOp('update', 'events', payload, { id: editId });
      } else {
        await adminOp('insert', 'events', { ...payload, current_participants: 0 });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await adminOp('delete', 'events', undefined, { id });
    setDeleteId(null);
    load();
  };

  const toggleType = async (ev: HikingEvent) => {
    const newType = ev.type === 'upcoming' ? 'past' : 'upcoming';
    await adminOp('update', 'events', { type: newType }, { id: ev.id });
    load();
  };

  const partEvent = events.find(e => e.id === partEventId);

  const loadParticipants = async (eventId: string) => {
    setLoadingPart(true);
    const { data } = await supabase.from('participants').select('*').eq('event_id', eventId).order('created_at', { ascending: true });
    setParticipants(data ?? []);
    setLoadingPart(false);
  };

  const openParticipants = (ev: HikingEvent) => {
    setPartEventId(ev.id);
    setNewName('');
    setEditingPart(null);
    loadParticipants(ev.id);
  };

  const addParticipant = async () => {
    if (!newName.trim() || !partEventId) return;
    setSavingPart(true);
    await supabase.from('participants').insert({ event_id: partEventId, name: newName.trim() });
    await supabase.from('events').update({ current_participants: participants.length + 1 }).eq('id', partEventId);
    setNewName('');
    await loadParticipants(partEventId);
    load();
    setSavingPart(false);
  };

  const removeParticipant = async (id: string) => {
    if (!partEventId) return;
    await supabase.from('participants').delete().eq('id', id);
    const next = Math.max(0, participants.length - 1);
    await supabase.from('events').update({ current_participants: next }).eq('id', partEventId);
    await loadParticipants(partEventId);
    load();
  };

  const savePartEdit = async () => {
    if (!editingPart?.name.trim()) return;
    await supabase.from('participants').update({ name: editingPart.name.trim() }).eq('id', editingPart.id);
    setEditingPart(null);
    if (partEventId) loadParticipants(partEventId);
  };

  const uploadEventImage = async (file: File) => {
    setUploadingImg(true);
    const ext = file.name.split('.').pop();
    const filename = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('gallery').upload(filename, file, { cacheControl: '3600', upsert: false });
    if (!error) {
      const { data } = supabase.storage.from('gallery').getPublicUrl(filename);
      setForm(f => ({ ...f, image_url: data.publicUrl }));
    }
    setUploadingImg(false);
  };

  return (
    <div className={`admin-page${mounted ? ' admin-page--visible' : ''}`} style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h1 className="admin-title">Events</h1>
        <button className="btn btn-primary admin-btn" onClick={openAdd} style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Add Hike
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {(['upcoming', 'past'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`admin-tab${tab === t ? ' admin-tab--active' : ''}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
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
              <tr><td colSpan={6} style={{ padding: '2rem' }}><SkeletonRows rows={4} /></td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No {tab} events.</td></tr>
            ) : (
              events.map((ev, i) => (
                <tr
                  key={ev.id}
                  className="admin-table-row"
                  style={{ borderBottom: '1px solid var(--border)', animationDelay: `${i * 40}ms` }}
                >
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
                      <IconBtn onClick={() => openParticipants(ev)} title="Manage participants"><Users size={14} /></IconBtn>
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
            <FormField label="Event Image">
              <ImageDropZone
                imageUrl={form.image_url}
                uploading={uploadingImg}
                onFile={uploadEventImage}
                onClear={() => setForm(f => ({ ...f, image_url: '' }))}
              />
            </FormField>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary admin-btn" disabled={saving}>
                {saving ? 'Saving…' : <><Check size={14} /> Save</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Event?" onClose={() => setDeleteId(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            This action cannot be undone. The event will be permanently deleted.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn-primary admin-btn" style={{ background: '#c0392b' }} onClick={() => handleDelete(deleteId)}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </Modal>
      )}

      {partEventId && (
        <Modal
          title="Participants"
          onClose={() => { setPartEventId(null); setEditingPart(null); setNewName(''); }}
        >
          {/* Header info */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{partEvent?.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {participants.length} registered
              {partEvent?.max_participants ? ` / ${partEvent.max_participants} spots` : ''}
            </div>
          </div>

          {/* Participant list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem', maxHeight: '260px', overflowY: 'auto' }}>
            {loadingPart ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>Loading…</div>
            ) : participants.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>No participants yet.</div>
            ) : participants.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(128,125,80,0.05)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '20px' }}>{i + 1}.</span>
                {editingPart?.id === p.id ? (
                  <>
                    <input
                      className="input"
                      style={{ flex: 1, padding: '4px 8px', fontSize: '0.875rem' }}
                      value={editingPart.name}
                      onChange={e => setEditingPart(ep => ep ? { ...ep, name: e.target.value } : ep)}
                      onKeyDown={e => { if (e.key === 'Enter') savePartEdit(); if (e.key === 'Escape') setEditingPart(null); }}
                      autoFocus
                    />
                    <button type="button" onClick={savePartEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32', padding: '2px' }}><Check size={14} /></button>
                    <button type="button" onClick={() => setEditingPart(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}><X size={14} /></button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text)' }}>{p.name}</span>
                    <button type="button" onClick={() => setEditingPart({ id: p.id, name: p.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}><Pencil size={13} /></button>
                    <button type="button" onClick={() => removeParticipant(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', padding: '2px' }}><Trash2 size={13} /></button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add new */}
          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <input
              className="input"
              placeholder="Participant name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addParticipant(); } }}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-primary admin-btn"
              style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              onClick={addParticipant}
              disabled={savingPart || !newName.trim()}
            >
              {savingPart ? '…' : <><Plus size={14} /> Add</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
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
    <button onClick={onClick} title={title} className={`admin-icon-btn${danger ? ' admin-icon-btn--danger' : ''}`}>
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

function SkeletonRows({ rows }: { rows: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px' }}>
          <div className="admin-skeleton" style={{ height: '18px', flex: 3, borderRadius: '6px' }} />
          <div className="admin-skeleton" style={{ height: '18px', flex: 1, borderRadius: '6px' }} />
          <div className="admin-skeleton" style={{ height: '18px', flex: 2, borderRadius: '6px' }} />
          <div className="admin-skeleton" style={{ height: '18px', width: '60px', borderRadius: '6px' }} />
        </div>
      ))}
    </div>
  );
}

function ImageDropZone({ imageUrl, uploading, onFile, onClear }: {
  imageUrl: string;
  uploading: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = '';
  };

  if (imageUrl) {
    return (
      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', height: '140px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button
          type="button"
          onClick={onClear}
          style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(17,17,8,0.65)', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: '10px',
        padding: '1.75rem 1rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragOver ? 'rgba(128,125,80,0.06)' : 'transparent',
        transition: 'border-color 150ms ease, background 150ms ease',
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />
      {uploading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <div className="admin-spinner" />
          <span style={{ fontSize: '0.8rem' }}>Uploading…</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Upload size={18} style={{ color: 'var(--primary)' }} />
            <ImageIcon size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Drop image here or <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>browse</span></span>
          <span style={{ fontSize: '0.72rem' }}>PNG, JPG, WEBP</span>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.875rem', verticalAlign: 'middle' };
