'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';
import { adminOp } from '@/lib/admin-api';
import type { GalleryImage } from '@/lib/types';

export default function AdminGalleryPage() {
  const supabase = getAdminClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const slotRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [slotUploading, setSlotUploading] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState<{ id: string; caption: string } | null>(null);
  const [urlModal, setUrlModal] = useState(false);
  const [urlForm, setUrlForm] = useState({ image_url: '', caption: '' });
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [dragImgId, setDragImgId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setImages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { setMounted(true); load(); }, []); // eslint-disable-line

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('gallery').upload(filename, file, { cacheControl: '3600', upsert: false });
    if (error) { console.error('Upload error:', error); return null; }
    const { data } = supabase.storage.from('gallery').getPublicUrl(filename);
    return data.publicUrl;
  };

  /* General gallery upload */
  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Uploading ${i + 1}/${files.length}: ${files[i].name}`);
      const url = await uploadFile(files[i]);
      if (url) {
        await adminOp('insert', 'gallery', { image_url: url, caption: null });
      }
    }
    setUploading(false);
    setUploadProgress('');
    if (fileRef.current) fileRef.current.value = '';
    load();
  };

  /* Upload directly into a slot */
  const handleSlotFileUpload = async (slot: 1 | 2 | 3, files: FileList) => {
    if (!files.length) return;
    setSlotUploading(slot);
    const url = await uploadFile(files[0]);
    if (url) {
      // Insert new image
      const inserted = await adminOp('insert', 'gallery', { image_url: url, caption: null }) as GalleryImage[] | null;
      const newId = Array.isArray(inserted) && inserted[0] ? inserted[0].id : null;
      if (newId) {
        // Clear existing slot assignment
        await adminOp('update', 'gallery', { display_order: null }, { display_order: slot });
        // Assign new image to slot
        await adminOp('update', 'gallery', { display_order: slot }, { id: newId });
      }
    }
    setSlotUploading(null);
    if (slotRefs[slot - 1].current) slotRefs[slot - 1].current!.value = '';
    load();
  };

  /* Assign/unassign gallery image to a slot via drag from grid */
  const assignToSlot = async (imgId: string, slot: 1 | 2 | 3) => {
    const img = images.find(i => i.id === imgId);
    const isCurrentSlot = img?.display_order === slot;
    await adminOp('update', 'gallery', { display_order: null }, { display_order: slot });
    await adminOp('update', 'gallery', { display_order: isCurrentSlot ? null : slot }, { id: imgId });
    load();
  };

  /* Clear a slot */
  const clearSlot = async (slot: 1 | 2 | 3) => {
    await adminOp('update', 'gallery', { display_order: null }, { display_order: slot });
    load();
  };

  const handleDelete = async (img: GalleryImage) => {
    const filename = img.image_url.split('/').pop();
    if (filename && img.image_url.includes('supabase')) {
      await supabase.storage.from('gallery').remove([filename]);
    }
    await adminOp('delete', 'gallery', undefined, { id: img.id });
    setDeleteId(null);
    load();
  };

  const handleSaveCaption = async () => {
    if (!editCaption) return;
    await adminOp('update', 'gallery', { caption: editCaption.caption }, { id: editCaption.id });
    setEditCaption(null);
    load();
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminOp('insert', 'gallery', { image_url: urlForm.image_url, caption: urlForm.caption || null });
    setUrlModal(false);
    setUrlForm({ image_url: '', caption: '' });
    load();
  };

  const slots = [1, 2, 3] as const;
  const slotImages = slots.map(s => images.find(img => img.display_order === s) ?? null);

  return (
    <div className={`admin-page${mounted ? ' admin-page--visible' : ''}`} style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 className="admin-title">Gallery</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline admin-btn" style={{ fontSize: '0.82rem' }} onClick={() => setUrlModal(true)}>
            <ImageIcon size={14} /> Add by URL
          </button>
          <button className="btn btn-primary admin-btn" style={{ fontSize: '0.82rem' }} onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload size={14} /> {uploading ? uploadProgress : 'Upload Photos'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)} />
        </div>
      </div>

      {/* ─── Homepage Slide Slots ─── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary-mid)', marginBottom: '0.875rem' }}>
          Homepage Slides — "Through the Lens"
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {slots.map((slot, idx) => {
            const assigned = slotImages[idx];
            const isOver = dragOverSlot === slot;
            return (
              <div
                key={slot}
                onDragOver={(e) => { e.preventDefault(); setDragOverSlot(slot); }}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverSlot(null);
                  // File drop
                  if (e.dataTransfer.files.length > 0) {
                    handleSlotFileUpload(slot, e.dataTransfer.files);
                  } else if (dragImgId) {
                    assignToSlot(dragImgId, slot);
                    setDragImgId(null);
                  }
                }}
                onClick={() => { if (!assigned) slotRefs[idx].current?.click(); }}
                style={{
                  border: `2px ${assigned ? 'solid' : 'dashed'} ${isOver ? 'var(--primary)' : assigned ? 'var(--primary-mid)' : 'var(--border)'}`,
                  borderRadius: '14px',
                  background: isOver ? 'rgba(92,97,53,0.08)' : assigned ? 'transparent' : 'white',
                  cursor: assigned ? 'default' : 'pointer',
                  overflow: 'hidden',
                  transition: 'border-color 180ms var(--ease-out), background 180ms var(--ease-out), transform 180ms var(--ease-out), box-shadow 180ms var(--ease-out)',
                  transform: isOver ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isOver ? '0 8px 24px -6px rgba(92,97,53,0.2)' : '0 1px 4px rgba(92,97,53,0.06)',
                  position: 'relative',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <input
                  ref={slotRefs[idx]}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files && handleSlotFileUpload(slot, e.target.files)}
                />

                {/* Slot label */}
                <div style={{
                  position: 'absolute', top: '10px', left: '10px', zIndex: 2,
                  background: assigned ? 'rgba(0,0,0,0.55)' : 'var(--secondary)',
                  color: 'var(--primary-light)', borderRadius: '8px', padding: '3px 10px',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                }}>
                  SLIDE {slot}
                </div>

                {slotUploading === slot ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="admin-spinner" />
                  </div>
                ) : assigned ? (
                  <>
                    <div style={{
                      flex: 1,
                      background: `url(${assigned.image_url}) center/cover no-repeat`,
                      minHeight: '140px',
                    }} />
                    <div style={{ padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: 'white', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {assigned.caption || 'No caption'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearSlot(slot); }}
                        title="Remove from slide"
                        style={{ background: '#fdf2f2', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', color: '#c0392b', display: 'flex', flexShrink: 0, transition: 'background 150ms ease' }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.625rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(92,97,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={18} style={{ color: 'var(--primary-mid)' }} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
                      Drop image here<br />or click to upload
                    </p>
                    <p style={{ fontSize: '0.68rem', color: 'rgba(92,97,53,0.4)', margin: 0, textAlign: 'center' }}>
                      Or drag a photo from below
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* General Upload Drop Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); e.dataTransfer.files && handleFileUpload(e.dataTransfer.files); }}
        style={{
          border: '2px dashed var(--border)', borderRadius: '1rem', padding: '1.5rem 2rem',
          textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer',
          transition: 'border-color 200ms ease, background 200ms ease', background: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
        }}
      >
        <Upload size={18} style={{ color: 'var(--primary-mid)', flexShrink: 0 }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Drag & drop images to add to gallery, or click to browse
        </p>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {images.length} image{images.length !== 1 ? 's' : ''} — drag any card onto a slide slot above to assign it
      </p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="admin-skeleton" style={{ height: '200px', borderRadius: '0.875rem' }} />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No images yet. Upload your first photo above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {images.map((img, i) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => setDragImgId(img.id)}
              onDragEnd={() => setDragImgId(null)}
              className="admin-gallery-card"
              style={{
                background: 'white',
                border: img.display_order ? '2px solid var(--primary-mid)' : '1px solid var(--border)',
                borderRadius: '0.875rem', overflow: 'hidden',
                animationDelay: `${i * 30}ms`,
              }}
            >
              <div
                style={{
                  height: '140px', position: 'relative',
                  background: img.image_url
                    ? `url(${img.image_url}) center/cover no-repeat`
                    : 'linear-gradient(135deg, var(--secondary), var(--primary))',
                  cursor: 'grab',
                }}
              >
                {img.display_order && (
                  <div style={{
                    position: 'absolute', top: '6px', left: '6px',
                    background: 'var(--secondary)', color: 'var(--primary-light)',
                    borderRadius: '6px', padding: '2px 7px',
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                  }}>
                    S{img.display_order}
                  </div>
                )}
                <button
                  onClick={() => setDeleteId(img.id)}
                  style={{
                    position: 'absolute', top: '6px', right: '6px',
                    background: 'rgba(45,47,28,0.65)', border: 'none', borderRadius: '6px',
                    padding: '4px 6px', cursor: 'pointer', color: '#e0d8b5', display: 'flex',
                    transition: 'background 150ms ease',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div style={{ padding: '0.625rem 0.75rem' }}>
                {editCaption?.id === img.id ? (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input
                      className="input"
                      value={editCaption.caption}
                      onChange={(e) => setEditCaption({ id: img.id, caption: e.target.value })}
                      style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      autoFocus
                    />
                    <button onClick={handleSaveCaption} style={{ background: 'var(--secondary)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: 'white', cursor: 'pointer', display: 'flex' }}>
                      <Check size={12} />
                    </button>
                    <button onClick={() => setEditCaption(null)} style={{ background: '#f0e8e8', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditCaption({ id: img.id, caption: img.caption ?? '' })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.75rem', color: img.caption ? 'var(--text)' : 'var(--text-muted)', width: '100%', textAlign: 'left' }}
                  >
                    {img.caption || 'Add caption…'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {urlModal && (
        <div className="admin-modal-backdrop" onClick={() => setUrlModal(false)}>
          <div className="admin-modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--secondary)', margin: 0 }}>Add Image by URL</h2>
              <button onClick={() => setUrlModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <form onSubmit={handleAddUrl} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={labelStyle}>Image URL *</label>
                  <input className="input" type="url" value={urlForm.image_url} onChange={e => setUrlForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={labelStyle}>Caption</label>
                  <input className="input" value={urlForm.caption} onChange={e => setUrlForm(f => ({ ...f, caption: e.target.value }))} placeholder="Optional caption" />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setUrlModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary admin-btn"><Check size={14} /> Add Image</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" style={{ maxWidth: '400px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--secondary)', margin: '0 0 0.75rem' }}>Delete Image?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Permanently removes from gallery and storage.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary admin-btn" style={{ background: '#c0392b' }} onClick={() => { const img = images.find(i => i.id === deleteId); if (img) handleDelete(img); }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' };
