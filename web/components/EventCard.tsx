import Link from 'next/link';
import { Calendar, MapPin, Clock, TrendingUp, Users } from 'lucide-react';
import type { HikingEvent } from '@/lib/types';

interface EventCardProps {
  event: HikingEvent;
  variant?: 'default' | 'compact';
}

const difficultyClass: Record<string, string> = {
  Easy:     'badge-easy',
  Moderate: 'badge-moderate',
  Hard:     'badge-hard',
  Expert:   'badge-expert',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  const spotsLeft =
    event.max_participants != null
      ? event.max_participants - event.current_participants
      : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image */}
      <div
        style={{
          height: variant === 'compact' ? '180px' : '220px',
          background: event.image_url
            ? `url(${event.image_url}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--secondary) 0%, #4a4e28 100%)',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Difficulty badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${difficultyClass[event.difficulty] ?? 'badge-moderate'}`}>
            {event.difficulty}
          </span>
        </div>

        {/* Spots left */}
        {spotsLeft !== null && spotsLeft <= 5 && event.type === 'upcoming' && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(45, 47, 28, 0.85)',
              color: '#e0d8b5',
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 600,
            }}
          >
            {spotsLeft === 0 ? 'Full' : `${spotsLeft} spots left`}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            color: 'var(--text)',
            marginBottom: '0.6rem',
            lineHeight: 1.25,
          }}
        >
          {event.title}
        </h3>

        <p
          style={{
            fontSize: '0.855rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.description}
        </p>

        {/* Meta */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <MetaRow icon={<Calendar size={13} />} text={formatDate(event.date)} />
          <MetaRow icon={<MapPin size={13} />} text={event.location} />
          {event.duration_hours && (
            <MetaRow icon={<Clock size={13} />} text={`${event.duration_hours}h`} />
          )}
          {event.elevation_gain_m && (
            <MetaRow icon={<TrendingUp size={13} />} text={`+${event.elevation_gain_m}m elevation`} />
          )}
          {event.max_participants && (
            <MetaRow
              icon={<Users size={13} />}
              text={`${event.current_participants}/${event.max_participants} hikers`}
            />
          )}
        </div>

        {event.type === 'upcoming' && (
          <Link
            href="/contact"
            className="btn btn-primary"
            style={{ marginTop: '1rem', justifyContent: 'center', fontSize: '0.825rem' }}
          >
            Register
          </Link>
        )}
      </div>
    </div>
  );
}

function MetaRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}
    >
      <span style={{ color: 'var(--primary-mid)', flexShrink: 0 }}>{icon}</span>
      {text}
    </div>
  );
}
