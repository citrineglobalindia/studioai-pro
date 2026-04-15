
-- Table to store which roles are disabled per studio
CREATE TABLE public.studio_role_restrictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  disabled_roles TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id)
);

-- Enable RLS
ALTER TABLE public.studio_role_restrictions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Super admins can view all role restrictions"
  ON public.studio_role_restrictions FOR SELECT
  TO authenticated
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Org members can view own role restrictions"
  ON public.studio_role_restrictions FOR SELECT
  TO authenticated
  USING (is_org_member(auth.uid(), organization_id));

CREATE POLICY "Super admins can create role restrictions"
  ON public.studio_role_restrictions FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update role restrictions"
  ON public.studio_role_restrictions FOR UPDATE
  TO authenticated
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete role restrictions"
  ON public.studio_role_restrictions FOR DELETE
  TO authenticated
  USING (is_super_admin(auth.uid()));
