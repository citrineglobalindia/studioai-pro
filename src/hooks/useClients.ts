import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/contexts/OrgContext";
import { toast } from "sonner";

export interface DbClient {
  id: string;
  organization_id: string;
  name: string;
  partner_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  event_type: string | null;
  event_date: string | null;
  delivery_date: string | null;
  source: string | null;
  status: string;
  budget: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useClients() {
  const { organization } = useOrg();
  const queryClient = useQueryClient();
  const orgId = organization?.id;

  const query = useQuery({
    queryKey: ["clients", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbClient[];
    },
    enabled: !!orgId,
  });

  const addClient = useMutation({
    mutationFn: async (client: Omit<DbClient, "id" | "created_at" | "updated_at" | "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("clients")
        .insert({ ...client, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", orgId] });
      toast.success("Client added successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbClient> & { id: string }) => {
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", orgId] });
      toast.success("Client updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", orgId] });
      toast.success("Client deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    clients: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addClient,
    updateClient,
    deleteClient,
  };
}
