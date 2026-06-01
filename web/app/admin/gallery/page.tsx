'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, X, Check, Image as ImageIcon, Star } from 'lucide-react';
import { getAdminClient } from '@/lib/supabase-admin';
import type { GalleryImage } from '@/lib/types';

export default function AdminGalleryPage() {
  const supabase = getAdminClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState<{ id: string; caption: string } | null>(null);
  const [urlModal, setUrlModal] = useState(false);
  const [urlForm, setUrlForm] = useState({ image_url: '', caption: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setImages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  /* ─── File upload to Supabase Storage ─── */
  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    const total = files.length;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1}/${total}: ${file.name}`);

      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('gallery')
        .upload(filename, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) {
        console.error('Upload error:', uploadErr);
        continue;
      }

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(filename);

      await supabase.from('gallery').insert({
        image_url: urlData.publicUrl,
        caption: null,
        width: 800,
        height: 600,
      });
    }

    setUploading(false);
    setUploadProgress('');
    if (fileRef.current) fileRef.current.value = '';
    load();
  };

  /* ─── Add by URL ─── */
  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('gallery').insert({
      image_url: urlForm.image_url,
      caption: urlForm.caption || null,
      width: 800,
      height: 600,
    });
    setUrlModal(false);
    setUrlForm({ image_url: '', caption: '' });
    load();
  };

  const handleDelete = async (img: GalleryImage) => {
    const filename = img.image_url.split('/').pop();
    if (filename && img.image_url.includes('supabase')) {
      await supabase.storage.from('gallery').remove([filename]);
    }
    await supabase.from('gallery').delete().eq('id', img.id);
    setDeleteId(null);
    load();
  };

  const handleSaveCaption = async () => {
    if (!editCaption) return;
    await supabase.from('gallery').update({ caption: editCaption.caption }).eq('id', editCaption.id);
    setEditCaption(null);
    load();
  };

  const handleSetSlot = async (img: GalleryImage, slot: 1 | 2 | 3) => {
    const isCurrentSlot = img.display_order === slot;
    // Clear this slot from whoever has it
    await supabase.from('gallery').update({ display_order: null }).eq('display_order', slot);
    // Set or unset for this image
    await supabase.from('gallery')
      .update({ display_order: isCurrentSlot ? null : slot })
      .eq('id', img.id);
    load();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--secondary)', margin: 0 }}>Gallery</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.82rem' }} onClick={() => setUrlModal(true)}>
            <ImageIcon size={14} /> Add by URL
          </button>
          <button
            className="btn btn-primary"
            style={{ fontSize: '0.82rem' }}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={14} /> {uploading ? uploadProgress : 'Upload Photos'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Slider slot info */}
      <div style={{ background: 'rgba(92,97,53,0.07)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text)' }}>Homepage slider:</strong> Click S1 / S2 / S3 on any image to assign it to that slide position. The 3 assigned images appear in the &quot;Through the Lens&quot; section on the main page. Click again to remove.
      </div>

      {/* Upload drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed var(--border)',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          cursor: 'pointer',
          transition: 'border-color 200ms ease, background 200ms ease',
          background: 'white',
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); e.dataTransfer.files && handleFileUpload(e.dataTransfer.files); }}
      >
        <Upload size={24} style={{ color: 'var(--primary-mid)', marginBottom: '0.5rem' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
          Drag and drop images here, or click to browse
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Uploads to Supabase Storage — make sure the &quot;gallery&quot; bucket is public.
        </p>
      </div>

      {/* Stats */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {images.length} image{images.length !== 1 ? 's' : ''} in gallery
      </p>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No images yet. Upload your first photo above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {images.map((img) => (
            <div key={img.id} style={{ background: 'white', border: img.display_order ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '0.875rem', overflow: 'hidden' }}>
              {/* Image preview */}
              <div
                style={{
                  height: '160px',
                  background: img.image_url
                    ? `url(${img.image_url}) center/cover no-repeat`
                    : 'linear-gradient(135deg, var(--secondary), var(--primary))',
                  position: 'relative',
                }}
              >
                {img.display_order && (
                  <div style={{
                    position: 'absolute', top: '8px', left: '8px',
                    background: 'var(--primary)', color: '#e0d8b5',
                    borderRadius: '6px', padding: '3px 8px',
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Star size={10} fill="currentColor" /> Slide {img.display_order}
                  </div>
                )}
                <button
                  onClick={() => setDeleteId(img.id)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(45,47,28,0.7)', border: 'none', borderRadius: '6px',
                    padding: '5px 6px', cursor: 'pointer', color: '#e0d8b5', display: 'flex',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {/* Slot buttons */}
              <div style={{ display: 'flex', gap: '4px', padding: '6px 8px 0', justifyContent: 'center' }}>
                {([1, 2, 3] as const).map(slot => (
                  <button
                    key={slot}
                    onClick={() => handleSetSlot(img, slot)}
                    title={img.display_order === slot ? 'Remove from slider' : `Set as Slide ${slot}`}
                    style={{
                      flex: 1, padding: '4px 0', borderRadius: '6px', border: 'none',
                      fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                      background: img.display_order === slot ? 'var(--primary)' : 'rgba(92,97,53,0.08)',
                      color: img.display_order === slot ? 'white' : 'var(--primary)',
                      transition: 'background 150ms ease, color 150ms ease',
                    }}
                  >
                    S{slot}
                  </button>
                ))}
              </div>
              {/* Caption */}
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
                      <Check size={13} />
                    </button>
                    <button onClick={() => setEditCaption(null)} style={{ background: '#f0e8e8', border: 'none', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', display: 'flex' }}>
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditCaption({ id: img.id, caption: img.caption ?? '' })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.78rem', color: img.caption ? 'var(--text)' : 'var(--text-muted)', width: '100%', textAlign: 'left' }}
                  >
                    {img.caption || 'Add caption...'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add by URL modal */}
      {urlModal && (
        <ModalShell title="Add Image by URL" onClose={() => setUrlModal(false)}>
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
              <button type="submit" className="btn btn-primary"><Check size={14} /> Add Image</button>
            </div>
          </form>
        </ModalShell>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <ModalShell title="Delete Image?" onClose={() => setDeleteId(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            This will permanently delete the image from both the gallery and storage.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ background: '#c0392b' }} onClick={() => { const img = images.find(i => i.id === deleteId); if (img) handleDelete(img); }}>
              <Trash2 size={14} /> Delete
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
      <div style={{ background: 'white', borderRadius: '1.25rem', width: '100%', maxWidth: '500px', boxShadow: '0 24px 60px -12px rgba(45,47,28,0.3)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--secondary)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' };
