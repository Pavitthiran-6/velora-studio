-- 1. Create Tables

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  cover_image TEXT,
  status TEXT DEFAULT 'Draft',
  category TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_date TEXT,
  hero_graphic TEXT,
  description TEXT,
  universal_title TEXT,
  mission_label TEXT,
  video_url TEXT,
  shuffle_image_1 TEXT,
  shuffle_image_2 TEXT,
  next_project_id UUID REFERENCES projects(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Services
CREATE TABLE project_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- Project Metrics
CREATE TABLE project_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  number TEXT,
  symbol TEXT,
  title TEXT,
  description TEXT,
  display_order INT DEFAULT 0
);

-- Project Mobile Views
CREATE TABLE project_mobile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- Project Milestones
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  year TEXT,
  title TEXT,
  category TEXT,
  display_order INT DEFAULT 0
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  avatar_url TEXT,
  rating INT DEFAULT 5,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  review_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home Cards
CREATE TABLE home_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  slug TEXT,
  tags TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (Contact Form Submissions)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin All" ON messages FOR ALL TO authenticated USING (true);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin All" ON projects FOR ALL TO authenticated USING (true);

ALTER TABLE project_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON project_services FOR SELECT USING (true);
CREATE POLICY "Admin All" ON project_services FOR ALL TO authenticated USING (true);

-- Repeat for others
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON project_metrics FOR SELECT USING (true);
CREATE POLICY "Admin All" ON project_metrics FOR ALL TO authenticated USING (true);

ALTER TABLE project_mobile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON project_mobile_views FOR SELECT USING (true);
CREATE POLICY "Admin All" ON project_mobile_views FOR ALL TO authenticated USING (true);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON project_milestones FOR SELECT USING (true);
CREATE POLICY "Admin All" ON project_milestones FOR ALL TO authenticated USING (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON reviews FOR SELECT USING (true);
CREATE POLICY "Admin All" ON reviews FOR ALL TO authenticated USING (true);

ALTER TABLE home_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON home_cards FOR SELECT USING (true);
CREATE POLICY "Admin All" ON home_cards FOR ALL TO authenticated USING (true);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin All" ON settings FOR ALL TO authenticated USING (true);
