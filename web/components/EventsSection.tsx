'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Clock, TrendingUp, Users, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import type { HikingEvent } from '@/lib/types';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const DIFFICULTY_CLASS: Record<string, string> = {
  Easy: 'badge-easy', Moderate: 'badge-moderate', Hard: 'badge-hard', Expert: 'badge-expert',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function MetaRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
      <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{icon}</span>
      {text}
    </div>
  );
}

function EventModal({ event, open, onClose }: { event: HikingEvent; open: boolean; onClose: () => void }) {
  const spotsLeft = event.max_participants != null ? event.max_participants - event.current_participants : null;

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        background: open ? 'rgba(17,17,8,0.55)' : 'rgba(17,17,8,0)',
        backdropFilter: open ? 'blur(18px)' : 'blur(0px)',
        WebkitBackdropFilter: open ? 'blur(18px)' : 'blur(0px)',
        transition: 'background 240ms ease, backdrop-filter 240ms ease',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          boxShadow: '0 32px 80px -20px rgba(17,17,8,0.45)',
          width: '100%', maxWidth: '520px', maxHeight: '88vh',
          overflowY: 'auto',
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(20px)',
          opacity: open ? 1 : 0,
          transition: open
            ? `transform 280ms ${EASE}, opacity 200ms ease-out`
            : 'transform 160ms ease-in, opacity 140ms ease-in',
        }}
      >
        {/* Header image / gradient */}
        <div style={{
          height: '200px',
          background: event.image_url
            ? `url(${event.image_url}) center/cover`
            : 'linear-gradient(135deg, #4a4e28 0%, #808550 100%)',
          position: 'relative', borderRadius: '16px 16px 0 0', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
            <span className={`badge ${DIFFICULTY_CLASS[event.difficulty] ?? 'badge-moderate'}`}>{event.difficulty}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(17,17,8,0.55)', backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: 'none', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: `transform 200ms ${EASE}`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
            onMouseDown={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)';
              (e.currentTarget as HTMLElement).style.transitionDuration = '100ms';
            }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transitionDuration = '200ms'; }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
          {spotsLeft !== null && event.type === 'upcoming' && (
            <div style={{
              position: 'absolute', bottom: '14px', right: '14px',
              background: spotsLeft === 0 ? 'rgba(139,26,26,0.85)' : 'rgba(17,17,8,0.72)',
              color: '#e0d8b5', borderRadius: '10px', padding: '4px 10px',
              fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(8px)',
            }}>
              {spotsLeft === 0 ? 'Full' : `${spotsLeft} spots left`}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.875rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.55rem', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            {event.title}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.72, marginBottom: '1.5rem' }}>
            {event.description}
          </p>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.65rem',
            marginBottom: '1.75rem', padding: '1rem 1.125rem',
            background: 'rgba(92,97,53,0.07)', borderRadius: '16px',
          }}>
            <MetaRow icon={<Calendar size={15} />} text={formatDate(event.date)} />
            <MetaRow icon={<MapPin size={15} />} text={event.location} />
            {event.duration_hours && <MetaRow icon={<Clock size={15} />} text={`${event.duration_hours} hours`} />}
            {event.elevation_gain_m && <MetaRow icon={<TrendingUp size={15} />} text={`+${event.elevation_gain_m}m elevation gain`} />}
            {event.max_participants && (
              <MetaRow icon={<Users size={15} />} text={`${event.current_participants} / ${event.max_participants} hikers registered`} />
            )}
          </div>

          {event.type === 'upcoming' ? (
            <a
              href="#contact"
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', borderRadius: '14px' }}
            >
              Contact us for registration
            </a>
          ) : (
            <div style={{
              padding: '0.875rem 1rem', borderRadius: '14px',
              background: 'rgba(92,97,53,0.08)', textAlign: 'center',
              fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600,
            }}>
              ✓ This adventure has concluded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompactCard({ event, onOpen, past = false }: { event: HikingEvent; onOpen: () => void; past?: boolean }) {
  const spotsLeft = event.max_participants != null ? event.max_participants - event.current_participants : null;

  return (
    <button
      onClick={onOpen}
      style={{
        all: 'unset', display: 'flex', flexDirection: 'column',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        boxShadow: '0 2px 12px -6px rgba(92,97,53,0.10)',
        overflow: 'hidden', cursor: 'pointer', width: '100%',
        textAlign: 'left', height: '100%',
        opacity: past ? 0.82 : 1,
        transition: `transform 200ms ${EASE}, box-shadow 200ms ease, opacity 180ms ease`,
      }}
      onMouseEnter={e => {
        Object.assign((e.currentTarget as HTMLElement).style, {
          transform: 'translateY(-3px)',
          boxShadow: '0 12px 32px -8px rgba(92,97,53,0.20)',
          opacity: '1',
        });
      }}
      onMouseLeave={e => {
        Object.assign((e.currentTarget as HTMLElement).style, {
          transform: '',
          boxShadow: '0 2px 12px -6px rgba(92,97,53,0.10)',
          opacity: past ? '0.82' : '1',
          transition: `transform 200ms ${EASE}, box-shadow 200ms ease, opacity 180ms ease`,
        });
      }}
      onMouseDown={e => {
        Object.assign((e.currentTarget as HTMLElement).style, {
          transform: 'scale(0.97)',
          transition: 'transform 100ms ease',
        });
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLElement).style.transition =
          `transform 200ms ${EASE}, box-shadow 200ms ease, opacity 180ms ease`;
      }}
    >
      {/* Accent top bar */}
      <div style={{
        height: '3px', flexShrink: 0,
        background: past
          ? 'linear-gradient(90deg, #808550, #e0d8b5)'
          : 'linear-gradient(90deg, #5c6135, #808550)',
      }} />

      <div style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className={`badge ${DIFFICULTY_CLASS[event.difficulty] ?? 'badge-moderate'}`}>
            {event.difficulty}
          </span>
          {!past && spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
            <span className="badge badge-moderate">{spotsLeft} left</span>
          )}
          {!past && spotsLeft === 0 && (
            <span className="badge badge-hard">Full</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '1rem',
          color: 'var(--text)', lineHeight: 1.3, margin: 0, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {event.title}
        </h3>

        {/* Meta rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <Calendar size={11} strokeWidth={2} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            {formatDate(event.date)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <MapPin size={11} strokeWidth={2} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '0.625rem', borderTop: '1px solid var(--border)',
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
          color: 'var(--primary)',
        }}>
          <span>{past ? 'View Details' : 'Details & Register'}</span>
          <ArrowRight size={12} strokeWidth={2.5} />
        </div>
      </div>
    </button>
  );
}

export default function EventsSection({ upcoming, past }: { upcoming: HikingEvent[]; past: HikingEvent[] }) {
  const [selected, setSelected] = useState<HikingEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openEvent = useCallback((event: HikingEvent) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSelected(event);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalOpen(true)));
  }, []);

  const closeEvent = useCallback(() => {
    setModalOpen(false);
    closeTimer.current = setTimeout(() => setSelected(null), 260);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && modalOpen) closeEvent(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, closeEvent]);

  return (
    <>
      {selected && <EventModal event={selected} open={modalOpen} onClose={closeEvent} />}

      <section id="events" className="section">
        <div className="container">
          {/* Upcoming */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <ScrollReveal direction="bottom">
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>Don't Miss Out</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--text)', lineHeight: 1.1, marginTop: 0 }}>Upcoming Hikes</h2>
              <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>Tap any card to see full details and register.</p>
            </ScrollReveal>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {upcoming.map((event, i) => (
              <ScrollReveal key={event.id} direction="bottom" delay={((i % 4) + 1) as 1|2|3|4}>
                <div style={{ width: '260px', flexShrink: 0 }}>
                  <CompactCard event={event} onOpen={() => openEvent(event)} />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Past Adventures */}
          {past.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <ScrollReveal direction="bottom">
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem' }}>Trail History</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', color: 'var(--text)', lineHeight: 1.1, marginTop: 0 }}>Past Adventures</h2>
                </ScrollReveal>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                {past.map((event, i) => (
                  <ScrollReveal key={event.id} direction="bottom" delay={((i % 4) + 1) as 1|2|3|4}>
                    <div style={{ width: '260px', flexShrink: 0 }}>
                      <CompactCard event={event} onOpen={() => openEvent(event)} past />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
