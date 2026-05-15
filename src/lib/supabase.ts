import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  slug: string;
  title: string;
  cover_image: string;
  status: 'Published' | 'Draft' | 'Archived';
  category: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_date?: string;
  hero_graphic?: string;
  description?: string;
  universal_title?: string;
  mission_label?: string;
  video_url?: string;
  shuffle_image_1?: string;
  shuffle_image_2?: string;
  next_project_id?: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  name: string;
  company?: string;
  avatar_url?: string;
  rating: number;
  content: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

export type HomeCard = {
  id: string;
  title: string;
  image_url: string;
  link?: string;
  display_order: number;
};
