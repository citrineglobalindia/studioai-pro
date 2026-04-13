import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/contexts/OrgContext";
import { toast } from "sonner";

export interface TeamMemberDB {
  id: string;
  organization_id: string;
  user_id: string | null;
  full_name: string;
  role: string;
  phone: string | null;
  email: string | null;
  availability: string;
  rating: number;
  daily_rate: number;
  specialties: string[];
  experience_years: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useTeamMembers() {
  const { organization } = useOrg();
  const queryClient = useQueryClient();
  const orgId = organization?.id;

  const query = useQuery({
    queryKey: ["team_members", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as TeamMemberDB[];
    },
    enabled: !!orgId,
  });

  const addMember = useMutation({
    mutationFn: async (member: Omit<TeamMemberDB, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("team_members").insert(member).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members", orgId] });
      toast.success("Team member added!");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMember = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TeamMemberDB> & { id: string }) => {
      const { data, error } = await supabase.from("team_members").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members", orgId] });
      toast.success("Team member updated!");
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members", orgId] });
      toast.success("Team member removed!");
    },
    onError: (e) => toast.error(e.message),
  });

  return { members: query.data || [], isLoading: query.isLoading, addMember, updateMember, deleteMember };
}
