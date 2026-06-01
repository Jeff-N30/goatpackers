'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, GripVertical } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';
import type { TeamMember } from '@/lib/types';

const EMPTY = { name: '', role: '', bio: '', image_url: '', order: 1 };

export default function AdminTeamPage() {
  const supabase = getAdminClient();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('team').select('*').order('order', { ascending: true });
    setMembers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const openAdd = () => {
    const nextOrder = members.length > 0 ? Math.max(...members.map(m => m.order)) + 1 : 1;
    setForm({ ...EMPTY, order: nextOrder });
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setForm({ name: m.name, role: m.role, bio: m.bio ?? '', image_url: m.image_url ?? '', order: m.order });
    setEditId(m.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { name: form.name, role: form.role, bio: form.bio || null, image_url: form.image_url || null, order: form.order };
    if (editId) {
      await supabase.from('team').update(payload).eq('id', editId);
    } else {
      await supabase.from('team').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('team').delete().eq('id', id);
    setDeleteId(null);
    load();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--secondary)', margin: 0 }}>Team</h1>
        <button className="btn btn-primary" onClick={openAdd} style={{ fontSize: '0.82rem' }}>
          <Plus size={15} /> Add Member
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#fdf9f9', borderBottom: '1px solid var(--border)' }}>
              {['', 'Name', 'Role', 'Order', 'Actions'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No team members yet.</td></tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ ...tdStyle, width: '40px', color: 'var(--border)' }}>
                    <GripVertical size={15} />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                          background: m.image_url ? `url(${m.image_url}) center/cover` : 'var(--secondary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--primary)', fontSize: '0.75rem', fontFamily: 'var(--font-display)',
                        }}
                      >
                        {!m.image_url && m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{m.role}</td>
                  <td style={tdStyle}>{m.order}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <IconBtn onClick={() => openEdit(m)} title="Edit"><Pencil size={14} /></IconBtn>
                      <IconBtn onClick={() => setDeleteId(m.id)} title="Delete" danger><Trash2 size={14} /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ModalShell title={editId ? 'Edit Member' : 'Add Team Member'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FF label="Name *"><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></FF>
              <FF label="Role *"><input className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required /></FF>
            </div>
            <FF label="Bio">
              <textarea className="input" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ minHeight: '80px' }} />
            </FF>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
              <FF label="Image URL">
                <input className="input" type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
              </FF>
              <FF label="Order">
                <input className="input" type="number" min={1} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} style={{ width: '80px' }} />
              </FF>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : <><Check size={14} /> Save</>}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <ModalShell title="Remove Member?" onClose={() => setDeleteId(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            This team member will be permanently removed.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ background: '#c0392b' }} onClick={() => handleDelete(deleteId)}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(45,47,28,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '1.25rem', width: '100%', maxWidth: '520px', boxShadow: '0 24px 60px -12px rgba(45,47,28,0.3)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--secondary)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{label}</label>{children}</div>;
}

function IconBtn({ onClick, title, danger, children }: { onClick: () => void; title: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{ background: danger ? '#fdf2f2' : '#f7f2f2', border: 'none', borderRadius: '7px', padding: '6px 8px', cursor: 'pointer', color: danger ? '#c0392b' : 'var(--secondary)', display: 'flex', transition: 'background 200ms ease' }}>
      {children}
    </button>
  );
}

const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.875rem', verticalAlign: 'middle' };
