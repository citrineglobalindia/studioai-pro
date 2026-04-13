
-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL,
  event_type TEXT DEFAULT 'Wedding',
  event_date DATE,
  venue TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  total_amount NUMERIC DEFAULT 0,
  amount_paid NUMERIC DEFAULT 0,
  assigned_team TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view projects" ON public.projects FOR SELECT TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can update projects" ON public.projects FOR UPDATE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can delete projects" ON public.projects FOR DELETE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Super admins can view all projects" ON public.projects FOR SELECT TO authenticated USING (is_super_admin(auth.uid()));

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ DELIVERABLES ============
CREATE TABLE public.deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  deliverable_type TEXT NOT NULL DEFAULT 'photos',
  title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_to TEXT,
  due_date DATE,
  delivered_date DATE,
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view deliverables" ON public.deliverables FOR SELECT TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can create deliverables" ON public.deliverables FOR INSERT TO authenticated WITH CHECK (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can update deliverables" ON public.deliverables FOR UPDATE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can delete deliverables" ON public.deliverables FOR DELETE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Super admins can view all deliverables" ON public.deliverables FOR SELECT TO authenticated USING (is_super_admin(auth.uid()));

CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON public.deliverables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TEAM MEMBERS ============
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'photographer',
  phone TEXT,
  email TEXT,
  availability TEXT DEFAULT 'available',
  rating NUMERIC DEFAULT 0,
  daily_rate NUMERIC DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view team" ON public.team_members FOR SELECT TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can create team" ON public.team_members FOR INSERT TO authenticated WITH CHECK (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can update team" ON public.team_members FOR UPDATE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can delete team" ON public.team_members FOR DELETE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Super admins can view all team" ON public.team_members FOR SELECT TO authenticated USING (is_super_admin(auth.uid()));

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_projects_org ON public.projects(organization_id);
CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_deliverables_project ON public.deliverables(project_id);
CREATE INDEX idx_deliverables_org ON public.deliverables(organization_id);
CREATE INDEX idx_team_members_org ON public.team_members(organization_id);
