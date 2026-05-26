import { createClient } from '@supabase/supabase-js';
import type { HikingEvent, GalleryImage, TeamMember } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* ---- Events ---- */
export async function getUpcomingEvents(): Promise<HikingEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('type', 'upcoming')
    .order('date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPastEvents(): Promise<HikingEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('type', 'past')
    .order('date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getEventById(id: string): Promise<HikingEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

/* ---- Gallery ---- */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/* ---- Team ---- */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
