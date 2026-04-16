
CREATE TABLE public.client_process_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL DEFAULT 1,
  heading TEXT NOT NULL,
  description TEXT,
  events TEXT[] NOT NULL DEFAULT '{}',
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'not_started',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_process_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view process steps" ON public.client_process_steps FOR SELECT TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can create process steps" ON public.client_process_steps FOR INSERT TO authenticated WITH CHECK (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can update process steps" ON public.client_process_steps FOR UPDATE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Org members can delete process steps" ON public.client_process_steps FOR DELETE TO authenticated USING (is_org_member(auth.uid(), organization_id));
CREATE POLICY "Super admins can view all process steps" ON public.client_process_steps FOR SELECT TO authenticated USING (is_super_admin(auth.uid()));

CREATE INDEX idx_process_steps_client ON public.client_process_steps(client_id, step_number);

CREATE TRIGGER update_client_process_steps_updated_at
  BEFORE UPDATE ON public.client_process_steps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
