'use client';

import { useState } from 'react';
import { Send, CheckCircle, MapPin, Mail } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import type { ContactSubmission } from '@/lib/types';

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.06L2 22l5.12-1.35C8.54 21.54 10.23 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.75 13.75c-.2.55-1.18 1.06-1.62 1.12-.44.06-.85.09-2.74-.58-2.31-.83-3.79-3.15-3.9-3.3-.11-.15-.91-1.22-.91-2.33 0-1.11.58-1.65.79-1.88.21-.23.45-.29.61-.29h.44c.14 0 .33.01.51.39.19.4.64 1.58.7 1.69.06.12.1.25.02.4-.07.15-.11.23-.22.36-.11.13-.23.29-.33.39-.11.11-.22.23-.09.45.12.22.55.89 1.18 1.44.82.72 1.5.95 1.72 1.06.22.11.34.09.47-.06.12-.15.54-.62.68-.84.14-.22.28-.18.47-.11.19.07 1.22.58 1.43.69.21.11.35.16.4.25.06.09.06.55-.14 1.09z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

const CONTACT_INFO = [
  { icon: <WhatsAppIcon />,                    label: 'WhatsApp',  value: '+961 76 369 668',         href: 'https://wa.me/96176369668',            external: true  },
  { icon: <InstagramIcon />,                   label: 'Instagram', value: '@goatpackers.lb',         href: 'https://instagram.com/goatpackers.lb', external: true  },
  { icon: <Mail size={16} strokeWidth={1.75} />, label: 'Email',   value: 'goatpacker.lb@gmail.com', href: 'mailto:goatpacker.lb@gmail.com',       external: false },
  { icon: <MapPin size={16} strokeWidth={1.75} />, label: 'Location', value: 'Lebanon',              href: undefined,                              external: false },
];

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text)',
  letterSpacing: '0.03em',
};

export default function ContactSection() {
  const [form, setForm] = useState<ContactSubmission>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <ScrollReveal direction="fade">
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--primary)',
              display: 'block', marginBottom: '0.5rem',
            }}>
              Say Hello
            </span>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={1}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: 'var(--text)', lineHeight: 1.1,
            }}>
              Get in Touch
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="bottom" delay={2}>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '1rem auto 0', lineHeight: 1.7 }}>
              Questions, partnerships, or just want to join a hike? We'd love to hear from you.
            </p>
          </ScrollReveal>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start',
        }}>
          {/* Left — contact info */}
          <div>
            <ScrollReveal direction="left">
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem', color: 'var(--text)', marginBottom: '1.5rem',
              }}>
                Reach us directly
              </h3>
            </ScrollReveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {CONTACT_INFO.map(({ icon, label, value, href, external }, i) => (
                <ScrollReveal key={label} direction="left" delay={((i % 4 + 1) as 1|2|3|4)}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.875rem 1rem',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}>
                    <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{
                        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1px',
                      }}>
                        {label}
                      </div>
                      {href ? (
                        <a
                          href={href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          style={{ color: 'var(--text)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}
                        >
                          {value}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text)', fontSize: '0.875rem', fontWeight: 500 }}>{value}</span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <ScrollReveal direction="right">
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '1.5rem',
              padding: '2rem',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}>
              {status === 'success' ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', padding: '3rem 1rem', gap: '1rem',
                }}>
                  <CheckCircle size={48} strokeWidth={1.5} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)' }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    We'll get back to you within 48 hours.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Your name" required className="input" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="your@email.com" required className="input" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required className="input">
                      <option value="">Select a topic</option>
                      <option value="join">Join the Club</option>
                      <option value="event">Event Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="media">Media / Photography</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      placeholder="Tell us what's on your mind..." required className="input" />
                  </div>
                  {status === 'error' && (
                    <p style={{ fontSize: '0.82rem', color: '#c0392b', background: '#fdf2f2', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn btn-primary"
                    style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}
                  >
                    {status === 'loading' ? 'Sending…' : (
                      <><span>Send Message</span> <Send size={14} strokeWidth={2} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
