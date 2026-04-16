
DROP POLICY "Org members can create process steps" ON public.client_process_steps;
CREATE POLICY "Org members or super admins can create process steps"
  ON public.client_process_steps FOR INSERT TO authenticated
  WITH CHECK (is_org_member(auth.uid(), organization_id) OR is_super_admin(auth.uid()));

DROP POLICY "Org members can update process steps" ON public.client_process_steps;
CREATE POLICY "Org members or super admins can update process steps"
  ON public.client_process_steps FOR UPDATE TO authenticated
  USING (is_org_member(auth.uid(), organization_id) OR is_super_admin(auth.uid()));

DROP POLICY "Org members can delete process steps" ON public.client_process_steps;
CREATE POLICY "Org members or super admins can delete process steps"
  ON public.client_process_steps FOR DELETE TO authenticated
  USING (is_org_member(auth.uid(), organization_id) OR is_super_admin(auth.uid()));
