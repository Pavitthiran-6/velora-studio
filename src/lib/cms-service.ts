import { supabase, Project as DBProject, Review, HomeCard } from './supabase';
import { Project } from '../types/project';
import { logSystemEvent } from './logger';

const mapProjectFields = (p: any) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  coverImage: p.cover_image,
  status: p.status,
  category: p.category,
  heroTitle: p.hero_title,
  heroSubtitle: p.hero_subtitle,
  heroDate: p.hero_date,
  heroGraphic: p.hero_graphic,
  description: p.description,
  universalTitle: p.universal_title,
  missionLabel: p.mission_label,
  videoUrl: p.video_url,
  shuffleImage1: p.shuffle_image_1,
  shuffleImage2: p.shuffle_image_2,
  nextProjectId: p.next_project_id,
  services: (p.project_services || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)).map((s: any) => ({ id: s.id, label: s.label })),
  metrics: (p.project_metrics || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)).map((m: any) => ({ 
    id: m.id, 
    number: m.number, 
    symbol: m.symbol, 
    title: m.title, 
    description: m.description 
  })),
  mobileViews: (p.project_mobile_views || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)).map((v: any) => ({ id: v.id, url: v.url })),
  milestones: (p.project_milestones || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)).map((m: any) => ({ 
    id: m.id, 
    year: m.year, 
    title: m.title, 
    category: m.category 
  })),
  createdAt: p.created_at,
  updatedAt: p.updated_at
});

const deleteStorageFile = async (url: string, bucket: string) => {
  if (!url || !url.includes('storage/v1/object/public/')) return;
  try {
    const parts = url.split(`${bucket}/`);
    if (parts.length < 2) return;
    const filePath = parts[1];
    await supabase.storage.from(bucket).remove([filePath]);
  } catch (err) {
    console.error('Storage cleanup failed:', err);
  }
};

export const cmsService = {
  // --- Projects ---
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(p => ({
      ...mapProjectFields(p),
      services: [],
      metrics: [],
      mobileViews: [],
      milestones: []
    })) as any;
  },

  async getProjectById(id: string): Promise<Project | null> {
    const { data: p, error } = await supabase
      .from('projects')
      .select('*, project_services(*), project_metrics(*), project_mobile_views(*), project_milestones(*)')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return mapProjectFields(p);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const { data: p, error } = await supabase
      .from('projects')
      .select('*, project_services(*), project_metrics(*), project_mobile_views(*), project_milestones(*)')
      .eq('slug', slug)
      .single();
    
    if (error) return null;
    return mapProjectFields(p);
  },

  async saveProject(project: Partial<Project>, id?: string) {
    const { services, metrics, mobileViews, milestones, ...coreData } = project;
    
    const dbData: any = {
      slug: coreData.slug,
      title: coreData.title,
      cover_image: coreData.coverImage,
      status: coreData.status,
      category: coreData.category,
      hero_title: coreData.heroTitle,
      hero_subtitle: coreData.heroSubtitle,
      hero_date: coreData.heroDate,
      hero_graphic: coreData.heroGraphic,
      description: coreData.description,
      universal_title: coreData.universalTitle,
      mission_label: coreData.missionLabel,
      video_url: coreData.videoUrl,
      shuffle_image_1: coreData.shuffleImage1,
      shuffle_image_2: coreData.shuffleImage2,
      next_project_id: coreData.nextProjectId,
      updated_at: new Date().toISOString()
    };

    let targetId = id;

    if (id) {
      const { error } = await supabase.from('projects').update(dbData).eq('id', id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('projects').insert([{ ...dbData, created_at: new Date().toISOString() }]).select().single();
      if (error) throw error;
      targetId = data.id;
    }

    if (!targetId) return;

    if (services) {
      await supabase.from('project_services').delete().eq('project_id', targetId);
      await supabase.from('project_services').insert(services.map((s: any, i: number) => ({ project_id: targetId, label: s.label, display_order: i })));
    }
    if (metrics) {
      await supabase.from('project_metrics').delete().eq('project_id', targetId);
      await supabase.from('project_metrics').insert(metrics.map((m: any, i: number) => ({ project_id: targetId, number: m.number, symbol: m.symbol, title: m.title, description: m.description, display_order: i })));
    }
    if (mobileViews) {
      await supabase.from('project_mobile_views').delete().eq('project_id', targetId);
      await supabase.from('project_mobile_views').insert(mobileViews.map((v: any, i: number) => ({ project_id: targetId, url: v.url, display_order: i })));
    }
    if (milestones) {
      await supabase.from('project_milestones').delete().eq('project_id', targetId);
      await supabase.from('project_milestones').insert(milestones.map((m: any, i: number) => ({ project_id: targetId, year: m.year, title: m.title, category: m.category, display_order: i })));
    }
  },

  async createProject(title: string) {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
    const { data, error } = await supabase.from('projects').insert([{ 
      title, 
      slug, 
      status: 'Draft',
      created_at: new Date().toISOString()
    }]).select().single();
    if (error) throw error;
    return data;
  },

  async updateProjectStatus(id: string, status: 'Draft' | 'Published') {
    const { error } = await supabase.from('projects').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async deleteProject(id: string) {
    // 1. Get project data to find file URLs
    const project = await this.getProjectById(id);
    
    // 2. Delete database record
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;

    // 3. Cleanup files from storage if DB delete successful
    if (project) {
      await Promise.all([
        deleteStorageFile(project.coverImage, 'projects'),
        deleteStorageFile(project.videoUrl, 'projects'),
        deleteStorageFile(project.shuffleImage1, 'projects'),
        deleteStorageFile(project.shuffleImage2, 'projects'),
        ...(project.mobileViews || []).map(v => deleteStorageFile(v.url, 'projects'))
      ]);
    }
  },

  async saveHomeCard(card: Partial<any>, id?: string) {
    const dbData = {
      title: card.title,
      tags: card.tags,
      slug: card.slug,
      image_url: card.image,
      is_active: card.active,
      display_order: card.order
    };

    if (id) {
      const { error } = await supabase.from('home_cards').update(dbData).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('home_cards').insert([dbData]);
      if (error) throw error;
    }
  },

  async deleteHomeCard(id: string) {
    // 1. Get card data for URL
    const { data: card } = await supabase.from('home_cards').select('image_url').eq('id', id).single();
    
    // 2. Delete DB record
    const { error } = await supabase.from('home_cards').delete().eq('id', id);
    if (error) throw error;

    // 3. Storage cleanup
    if (card?.image_url) {
      await deleteStorageFile(card.image_url, 'home-cards');
    }
  },

  // --- Reviews ---
  async getReviews(): Promise<any[]> {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(r => ({
      id: r.id,
      name: r.name,
      company: r.company,
      content: r.content,
      rating: r.rating,
      avatarUrl: r.avatar_url,
      isActive: r.is_active,
      isFeatured: r.is_featured,
      reviewIndex: r.review_index,
      createdAt: r.created_at
    }));
  },

  async saveReview(review: any, id?: string) {
    const dbData = {
      name: review.name,
      company: review.company,
      content: review.content,
      rating: review.rating,
      avatar_url: review.avatarUrl,
      is_active: review.isActive,
      is_featured: review.isFeatured,
      review_index: review.reviewIndex
    };

    if (id) {
      const { error } = await supabase.from('reviews').update(dbData).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('reviews').insert([dbData]);
      if (error) throw error;
    }
  },

  // --- Home Cards ---
  async getHomeCards(): Promise<HomeCard[]> {
    const { data, error } = await supabase.from('home_cards').select('*').order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // --- Settings ---
  async getSettings() {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    return (data || []).reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  },

  async updateSetting(key: string, value: any) {
    const { error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
  },

  async deleteReview(id: string) {
    // 1. Get avatar URL
    const { data: review } = await supabase.from('reviews').select('avatar_url').eq('id', id).single();
    
    // 2. Delete DB record
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;

    // 3. Storage cleanup
    if (review?.avatar_url) {
      await deleteStorageFile(review.avatar_url, 'avatars');
    }
  },

  // --- Messages ---
  async getMessages() {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async submitMessage(message: { name: string, email: string, subject: string, message: string }) {
    const { error } = await supabase.from('messages').insert([message]);
    if (error) throw error;
  },

  async updateMessageStatus(id: string, status: 'read' | 'unread' | 'archived') {
    const { error } = await supabase.from('messages').update({ status }).eq('id', id);
    if (error) throw error;
  },

  async deleteMessage(id: string) {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
  },

  async clearAllMessages() {
    const { error } = await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  },

  // --- System Logs ---
  async getSystemLogs() {
    const { data, error } = await supabase.from('system_logs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async deleteSystemLog(id: string) {
    const { error } = await supabase.from('system_logs').delete().eq('id', id);
    if (error) throw error;
  },

  async clearAllSystemLogs() {
    const { error } = await supabase.from('system_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  },

  // --- Media Upload ---
  async uploadMedia(file: File, bucket: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }
};
