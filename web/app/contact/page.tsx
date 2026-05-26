'use client';

import { useState } from 'react';
import { Mail, MapPin, ExternalLink, Send, CheckCircle } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { ContactSubmission } from '@/lib/types';

export default function ContactPage() {
  const [form, setForm] = useState<ContactSubmission>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* ─── Page header ─── */}
      <section
        style={{
          background: 'linear-gradient(150deg, #2d2f1c 0%, var(--secondary) 100%)',
          padding: '140px 1.5rem 70px',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '560px' }}>
          <div className="hero-badge" style={{ marginBottom: '1rem' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(224,216,181,0.12)',
                border: '1px solid rgba(224,216,181,0.25)',
                borderRadius: '9999px',
                padding: '4px 16px',
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(224,216,181,0.7)',
              }}
            >
              Say Hello
            </span>
          </div>
          <h1
            className="hero-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'white',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            Contact Us
          </h1>
          <p className="hero-subtitle" style={{ color: 'rgba(224,216,181,0.68)', lineHeight: 1.7 }}>
            Questions, partnerships, or just want to join? We're happy to hear from you.
          </p>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="section">
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {/* Left — info */}
          <div>
            <ScrollReveal direction="left">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  color: 'var(--secondary)',
                  marginBottom: '1rem',
                  lineHeight: 1.1,
                }}
              >
                Let's connect
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={1}>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.9rem' }}>
                Whether you want to join a hike, collaborate on an event, or just have a question — drop us a message and we will get back to you within 48 hours.
              </p>
            </ScrollReveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  icon: <Mail size={16} strokeWidth={1.75} />,
                  label: 'Email',
                  value: 'goatpackers.lb@gmail.com',
                  href: 'mailto:goatpackers.lb@gmail.com',
                },
                {
                  icon: <MapPin size={16} strokeWidth={1.75} />,
                  label: 'Location',
                  value: 'Lebanon',
                  href: undefined,
                },
              ].map(({ icon, label, value, href }, i) => (
                <ScrollReveal key={label} direction="left" delay={((i + 2) as 2 | 3)}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      padding: '1rem 1.25rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(224,216,181,0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--secondary)',
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {label}
                      </div>
                      {href ? (
                        <a href={href} style={{ color: 'var(--secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                          {value}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{value}</span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Social links */}
            <ScrollReveal direction="left" delay={4}>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                {[
                  { icon: <ExternalLink size={16} strokeWidth={1.75} />, label: 'Instagram', href: 'https://instagram.com' },
                  { icon: <ExternalLink size={16} strokeWidth={1.75} />, label: 'Facebook', href: 'https://facebook.com' },
                ].map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      color: 'var(--secondary)',
                      textDecoration: 'none',
                      transition: 'background 200ms ease, border-color 200ms ease',
                    }}
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right — form */}
          <ScrollReveal direction="right">
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '1.5rem',
                padding: '2rem',
              }}
            >
              {status === 'success' ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    gap: '1rem',
                  }}
                >
                  <CheckCircle size={48} strokeWidth={1.5} style={{ color: 'var(--primary)' }} />
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      color: 'var(--secondary)',
                    }}
                  >
                    Message Sent
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Thanks for reaching out. We will get back to you within 48 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn btn-outline"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="input"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="input"
                    >
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
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      required
                      className="input"
                    />
                  </div>

                  {status === 'error' && (
                    <p style={{ fontSize: '0.82rem', color: '#c0392b', background: '#fdf2f2', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn btn-primary"
                    style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}
                  >
                    {status === 'loading' ? 'Sending...' : (
                      <>
                        Send Message
                        <Send size={14} strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text)',
  letterSpacing: '0.03em',
};
