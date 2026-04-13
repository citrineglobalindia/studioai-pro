import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/contexts/OrgContext";
import { toast } from "sonner";

export interface DeliverableDB {
  id: string;
  project_id: string;
  organization_id: string;
  deliverable_type: string;
  title: string | null;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
  delivered_date: string | null;
  priority: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useDeliverables(projectId?: string) {
  const { organization } = useOrg();
  const queryClient = useQueryClient();
  const orgId = organization?.id;

  const query = useQuery({
    queryKey: ["deliverables", orgId, projectId],
    queryFn: async () => {
      if (!orgId) return [];
      let q = supabase.from("deliverables").select("*").eq("organization_id", orgId);
      if (projectId) q = q.eq("project_id", projectId);
      const { data, error } = await q.order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as DeliverableDB[];
    },
    enabled: !!orgId,
  });

  const addDeliverable = useMutation({
    mutationFn: async (d: Omit<DeliverableDB, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("deliverables").insert(d).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverables", orgId] });
      toast.success("Deliverable added!");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateDeliverable = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DeliverableDB> & { id: string }) => {
      const { data, error } = await supabase.from("deliverables").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverables", orgId] });
    },
    onError: (e) => toast.error(e.message),
  });

  return { deliverables: query.data || [], isLoading: query.isLoading, addDeliverable, updateDeliverable };
}
