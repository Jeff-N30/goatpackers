export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert';
export type EventType = 'upcoming' | 'past';

export interface HikingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  difficulty: Difficulty;
  image_url: string | null;
  type: EventType;
  max_participants: number | null;
  current_participants: number;
  duration_hours: number | null;
  elevation_gain_m: number | null;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  event_id: string | null;
  width: number;
  height: number;
  display_order: number | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  order: number;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}
