export interface ProjectService {
  id: string;
  label: string;
}

export interface ProjectMetric {
  id: string;
  number: string;
  symbol: string; // %, +, x
  title: string;
  description: string;
}

export interface ProjectMilestone {
  id: string;
  year: string;
  title: string;
  category: string;
}

export interface ProjectMobileView {
  id: string;
  url: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  status: 'Published' | 'Draft' | 'Archived';
  category: string;
  
  // Phase 2 Content
  heroTitle?: string;
  heroSubtitle?: string;
  heroDate?: string;
  heroGraphic?: string;
  
  description?: string;
  universalTitle?: string;
  missionLabel?: string;
  videoUrl?: string;
  
  shuffleImage1?: string;
  shuffleImage2?: string;
  
  nextProjectId?: string;
  
  services: ProjectService[];
  metrics: ProjectMetric[];
  mobileViews: ProjectMobileView[];
  milestones: ProjectMilestone[];
  
  createdAt: string;
  updatedAt: string;
}
