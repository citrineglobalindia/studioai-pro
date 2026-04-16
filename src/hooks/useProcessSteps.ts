import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/contexts/OrgContext";
import { toast } from "sonner";

export interface ProcessStep {
  id: string;
  organization_id: string;
  client_id: string;
  step_number: number;
  heading: string;
  description: string | null;
  events: string[];
  deadline: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useProcessSteps(clientId?: string) {
  const { organization } = useOrg();
  const queryClient = useQueryClient();
  const orgId = organization?.id;

  const query = useQuery({
    queryKey: ["process-steps", orgId, clientId],
    queryFn: async () => {
      if (!orgId || !clientId) return [];
      const { data, error } = await supabase
        .from("client_process_steps")
        .select("*")
        .eq("organization_id", orgId)
        .eq("client_id", clientId)
        .order("step_number", { ascending: true });
      if (error) throw error;
      return data as ProcessStep[];
    },
    enabled: !!orgId && !!clientId,
  });

  const addStep = useMutation({
    mutationFn: async (step: Omit<ProcessStep, "id" | "created_at" | "updated_at" | "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("client_process_steps")
        .insert({ ...step, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["process-steps", orgId, clientId] });
      toast.success("Step added");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateStep = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProcessStep> & { id: string }) => {
      const { data, error } = await supabase
        .from("client_process_steps")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["process-steps", orgId, clientId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteStep = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("client_process_steps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["process-steps", orgId, clientId] });
      toast.success("Step deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    steps: query.data ?? [],
    isLoading: query.isLoading,
    addStep,
    updateStep,
    deleteStep,
  };
}
