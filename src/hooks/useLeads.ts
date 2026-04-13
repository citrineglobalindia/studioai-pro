import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/contexts/OrgContext";
import { toast } from "sonner";

export interface DbLead {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  event_type: string | null;
  event_date: string | null;
  city: string | null;
  budget: number | null;
  status: string;
  assigned_to: string | null;
  follow_up_date: string | null;
  notes: string | null;
  converted_client_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useLeads() {
  const { organization } = useOrg();
  const queryClient = useQueryClient();
  const orgId = organization?.id;

  const query = useQuery({
    queryKey: ["leads", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbLead[];
    },
    enabled: !!orgId,
  });

  const addLead = useMutation({
    mutationFn: async (lead: Omit<DbLead, "id" | "created_at" | "updated_at" | "organization_id">) => {
      if (!orgId) throw new Error("No organization");
      const { data, error } = await supabase
        .from("leads")
        .insert({ ...lead, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", orgId] });
      toast.success("Lead added successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbLead> & { id: string }) => {
      const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", orgId] });
      toast.success("Lead updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", orgId] });
      toast.success("Lead deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const convertToClient = useMutation({
    mutationFn: async (leadId: string) => {
      if (!orgId) throw new Error("No organization");
      const lead = query.data?.find((l) => l.id === leadId);
      if (!lead) throw new Error("Lead not found");

      // Create client from lead
      const { data: client, error: clientErr } = await supabase
        .from("clients")
        .insert({
          organization_id: orgId,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          city: lead.city,
          event_type: lead.event_type,
          event_date: lead.event_date,
          source: lead.source,
          budget: lead.budget,
          status: "active",
          notes: lead.notes,
        })
        .select()
        .single();
      if (clientErr) throw clientErr;

      // Update lead as converted
      const { error: leadErr } = await supabase
        .from("leads")
        .update({ status: "converted", converted_client_id: client.id })
        .eq("id", leadId);
      if (leadErr) throw leadErr;

      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", orgId] });
      queryClient.invalidateQueries({ queryKey: ["clients", orgId] });
      toast.success("Lead converted to client!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    leads: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addLead,
    updateLead,
    deleteLead,
    convertToClient,
  };
}
