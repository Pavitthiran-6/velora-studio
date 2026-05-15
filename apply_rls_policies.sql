-- 1. MESSAGES: Users write (contact form), Admin does all
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert" ON messages;
DROP POLICY IF EXISTS "Admin All" ON messages;
CREATE POLICY "Public Insert" ON messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin All" ON messages FOR ALL TO authenticated USING (true);

-- 2. HOME CARDS: Users read, Admin does all
ALTER TABLE home_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON home_cards;
DROP POLICY IF EXISTS "Admin All" ON home_cards;
CREATE POLICY "Public Read" ON home_cards FOR SELECT TO public USING (true);
CREATE POLICY "Admin All" ON home_cards FOR ALL TO authenticated USING (true);

-- 3. REVIEWS: Users read, Admin does all
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON reviews;
DROP POLICY IF EXISTS "Admin All" ON reviews;
CREATE POLICY "Public Read" ON reviews FOR SELECT TO public USING (true);
CREATE POLICY "Admin All" ON reviews FOR ALL TO authenticated USING (true);

-- 4. PROJECTS (AND ALL SUB-TABLES): Users read, Admin does all
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON projects;
DROP POLICY IF EXISTS "Admin All" ON projects;
CREATE POLICY "Public Read" ON projects FOR SELECT TO public USING (true);
CREATE POLICY "Admin All" ON projects FOR ALL TO authenticated USING (true);

ALTER TABLE project_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON project_services;
DROP POLICY IF EXISTS "Admin All" ON project_services;
CREATE POLICY "Public Read" ON project_services FOR SELECT TO public USING (true);
CREATE POLICY "Admin All" ON project_services FOR ALL TO authenticated USING (true);

ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON project_metrics;
DROP POLICY IF EXISTS "Admin All" ON project_metrics;
CREATE POLICY "Public Read" ON project_metrics FOR SELECT TO public USING (true);
CREATE POLICY "Admin All" ON project_metrics FOR ALL TO authenticated USING (true);

ALTER TABLE project_mobile_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON project_mobile_views;
DROP POLICY IF EXISTS "Admin All" ON project_mobile_views;
CREATE POLICY "Public Read" ON project_mobile_views FOR SELECT TO public USING (true);
CREATE POLICY "Admin All" ON project_mobile_views FOR ALL TO authenticated USING (true);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON project_milestones;
DROP POLICY IF EXISTS "Admin All" ON project_milestones;
CREATE POLICY "Public Read" ON project_milestones FOR SELECT TO public USING (true);
CREATE POLICY "Admin All" ON project_milestones FOR ALL TO authenticated USING (true);
