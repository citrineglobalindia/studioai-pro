import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/contexts/OrgContext";
import { toast } from "sonner";

export interface AttendanceDB {
  id: string;
  employee_id: string;
  organization_id: string;
  date: string;
  status: string;
  clock_in: string | null;
  clock_out: string | null;
  total_hours: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useAttendance() {
  const { organization } = useOrg();
  const queryClient = useQueryClient();
  const orgId = organization?.id;

  const query = useQuery({
    queryKey: ["attendance", orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("organization_id", orgId)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data || []) as AttendanceDB[];
    },
    enabled: !!orgId,
  });

  const clockIn = useMutation({
    mutationFn: async ({ employeeId, notes }: { employeeId: string; notes?: string }) => {
      if (!orgId) throw new Error("No organization");
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Check if there's already a record for today
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("employee_id", employeeId)
        .eq("organization_id", orgId)
        .eq("date", today)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from("attendance")
          .update({ clock_in: now.toISOString(), status: "present", notes })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("attendance")
          .insert({
            employee_id: employeeId,
            organization_id: orgId,
            date: today,
            clock_in: now.toISOString(),
            status: "present",
            notes,
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", orgId] });
      toast.success("Clocked in!");
    },
    onError: (e) => toast.error(e.message),
  });

  const clockOut = useMutation({
    mutationFn: async ({ employeeId }: { employeeId: string }) => {
      if (!orgId) throw new Error("No organization");
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employeeId)
        .eq("organization_id", orgId)
        .eq("date", today)
        .maybeSingle();

      if (!existing) throw new Error("No clock-in record found for today");

      // Calculate total hours
      const clockInTime = existing.clock_in ? new Date(existing.clock_in) : now;
      const totalHours = Math.round(((now.getTime() - clockInTime.getTime()) / 3600000) * 100) / 100;

      const { data, error } = await supabase
        .from("attendance")
        .update({ clock_out: now.toISOString(), total_hours: totalHours })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", orgId] });
      toast.success("Clocked out!");
    },
    onError: (e) => toast.error(e.message),
  });

  const markAttendance = useMutation({
    mutationFn: async ({ employeeId, date, status, notes }: { employeeId: string; date: string; status: string; notes?: string }) => {
      if (!orgId) throw new Error("No organization");
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("employee_id", employeeId)
        .eq("organization_id", orgId)
        .eq("date", date)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase.from("attendance").update({ status, notes }).eq("id", existing.id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from("attendance").insert({ employee_id: employeeId, organization_id: orgId, date, status, notes }).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", orgId] });
    },
    onError: (e) => toast.error(e.message),
  });

  return {
    attendance: query.data || [],
    isLoading: query.isLoading,
    clockIn,
    clockOut,
    markAttendance,
  };
}
