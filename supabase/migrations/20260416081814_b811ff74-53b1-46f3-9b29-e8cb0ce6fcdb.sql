
-- Add super admin INSERT/UPDATE/DELETE policies for leads
CREATE POLICY "Super admins can create leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin INSERT/UPDATE/DELETE policies for projects
CREATE POLICY "Super admins can create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin INSERT/UPDATE/DELETE policies for invoices
CREATE POLICY "Super admins can create invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update invoices" ON public.invoices FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete invoices" ON public.invoices FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin INSERT/UPDATE/DELETE policies for quotations
CREATE POLICY "Super admins can create quotations" ON public.quotations FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update quotations" ON public.quotations FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete quotations" ON public.quotations FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin INSERT/UPDATE/DELETE policies for deliverables
CREATE POLICY "Super admins can create deliverables" ON public.deliverables FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update deliverables" ON public.deliverables FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete deliverables" ON public.deliverables FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin INSERT/UPDATE/DELETE policies for albums
CREATE POLICY "Super admins can create albums" ON public.albums FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update albums" ON public.albums FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete albums" ON public.albums FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin policies for attendance
CREATE POLICY "Super admins can create attendance" ON public.attendance FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update attendance" ON public.attendance FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete attendance" ON public.attendance FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin policies for employees
CREATE POLICY "Super admins can create employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update employees" ON public.employees FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete employees" ON public.employees FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin policies for leaves
CREATE POLICY "Super admins can create leaves" ON public.leaves FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update leaves" ON public.leaves FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete leaves" ON public.leaves FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));

-- Add super admin policies for team_members
CREATE POLICY "Super admins can create team" ON public.team_members FOR INSERT TO authenticated WITH CHECK (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update team" ON public.team_members FOR UPDATE TO authenticated USING (is_super_admin(auth.uid()));
CREATE POLICY "Super admins can delete team" ON public.team_members FOR DELETE TO authenticated USING (is_super_admin(auth.uid()));
