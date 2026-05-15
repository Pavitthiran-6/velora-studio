import { Project } from '../types/project';

const STORAGE_KEY = 'buzzworthy_cms_projects';

// Initial Mock Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'sling-shot',
    title: 'Sling Shot',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    status: 'Published',
    category: 'Branding',
    heroTitle: 'SLING SHOT',
    heroSubtitle: 'BRANDING • IDENTITY',
    heroDate: 'MAY 2026',
    description: 'WE CRAFTED A BOLD IDENTITY FOR SLING SHOT, REVOLUTIONIZING THE WAY THEY INTERACT WITH THEIR GLOBAL AUDIENCE THROUGH CUTTING-EDGE DESIGN AND CINEMATIC MOTION.',
    universalTitle: 'BEYOND BOUNDARIES',
    services: [
      { id: 's1', label: 'Brand Design' },
      { id: 's2', label: 'Motion Graphics' },
      { id: 's3', label: 'Strategy' }
    ],
    metrics: [
      { id: 'm1', number: '120', symbol: '%', title: 'GROWTH', description: 'INCREASE IN USER ENGAGEMENT WITHIN THE FIRST QUARTER.' },
      { id: 'm2', number: '18', symbol: '+', title: 'COUNTRIES', description: 'SUCCESSFUL BRAND ROLLOUT ACROSS GLOBAL MARKETS.' }
    ],
    mobileViews: [
      { id: 'mv1', url: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=400' },
      { id: 'mv2', url: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&q=80&w=400' },
      { id: 'mv3', url: 'https://images.unsplash.com/photo-1616469830506-c140d4a1b94a?auto=format&fit=crop&q=80&w=400' }
    ],
    milestones: [
      { id: 'ml1', year: '2026', title: 'GLOBAL LAUNCH', category: 'EVENT' },
      { id: 'ml2', year: '2025', title: 'STRATEGIC PIVOT', category: 'INTERNAL' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const cmsStore = {
  getProjects: (): Project[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(saved);
  },

  getProjectBySlug: (slug: string): Project | undefined => {
    const projects = cmsStore.getProjects();
    return projects.find(p => p.slug === slug);
  },

  saveProject: (project: Project) => {
    const projects = cmsStore.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index > -1) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new Event('cms-update'));
  },

  deleteProject: (id: string) => {
    const projects = cmsStore.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('cms-update'));
  }
};
