import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sampleTeamMembers, type TeamMember } from "@/data/wedding-types";
import { Camera, Video, Edit3, Users, Phone, Plus, UserPlus } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const roleIcons: Record<string, typeof Camera> = {
  photographer: Camera,
  videographer: Video,
  editor: Edit3,
  "drone-operator": Camera,
  assistant: Users,
};

const roleColors: Record<string, string> = {
  photographer: "bg-blue-500/20 text-blue-400",
  videographer: "bg-purple-500/20 text-purple-400",
  editor: "bg-emerald-500/20 text-emerald-400",
  "drone-operator": "bg-orange-500/20 text-orange-400",
  assistant: "bg-muted text-muted-foreground",
};

const allRoles: { value: TeamMember["role"]; label: string }[] = [
  { value: "photographer", label: "Photographer" },
  { value: "videographer", label: "Videographer" },
  { value: "editor", label: "Editor" },
  { value: "drone-operator", label: "Drone Operator" },
  { value: "assistant", label: "Assistant" },
];

const TeamPage = () => {
  const [members, setMembers] = useState<TeamMember[]>(sampleTeamMembers);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "photographer" as TeamMember["role"],
    type: "in-office" as TeamMember["type"],
  });

  const inOffice = members.filter((m) => m.type === "in-office");
  const vendors = members.filter((m) => m.type === "vendor");

  const handleAdd = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const member: TeamMember = {
      id: `t-${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone || undefined,
      role: form.role,
      type: form.type,
    };
    setMembers((prev) => [...prev, member]);
    setAddOpen(false);
    setForm({ name: "", phone: "", role: "photographer", type: "in-office" });
    toast.success(`${member.name} added as ${form.type === "vendor" ? "Vendor" : "In-Office"} ${form.role}`);
  };

  const renderMember = (m: TeamMember) => {
    const Icon = roleIcons[m.role] || Users;
    return (
      <div key={m.id} className={cn("rounded-lg bg-card border p-4 hover:border-primary/30 transition-colors", m.type === "vendor" ? "border-primary/20" : "border-border")}>
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">{m.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{m.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 font-medium capitalize", roleColors[m.role])}>
                <Icon className="h-2.5 w-2.5" />{m.role.replace("-", " ")}
              </span>
              {m.type === "vendor" && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30">Vendor</Badge>
              )}
            </div>
            {m.phone && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Phone className="h-3 w-3" />{m.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Team Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your in-office crew and external vendors.</p>
        </div>
        <Button className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {allRoles.map(({ value: role, label }) => {
          const Icon = roleIcons[role] || Users;
          const count = members.filter((m) => m.role === role).length;
          return (
            <div key={role} className="rounded-lg bg-card border border-border p-3 text-center">
              <Icon className="h-4 w-4 mx-auto text-primary mb-1" />
              <div className="text-lg font-display font-bold text-foreground">{count}</div>
              <div className="text-[10px] text-muted-foreground">{label}s</div>
            </div>
          );
        })}
      </div>

      {/* In-office */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3">In-Office Team ({inOffice.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {inOffice.map(renderMember)}
        </div>
      </div>

      {/* Vendors */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3">Vendors & Freelancers ({vendors.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vendors.map(renderMember)}
        </div>
      </div>

      {/* ═══ ADD MEMBER SHEET ═══ */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" /> Add Team Member
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Full Name *</Label>
              <Input placeholder="e.g. Arjun Mehta" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Phone</Label>
              <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>

            {/* Member Type */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Member Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: "in-office" as const, label: "In-Office", desc: "Full-time team member" },
                  { value: "vendor" as const, label: "Vendor", desc: "External freelancer" },
                ]).map((opt) => (
                  <button key={opt.value} onClick={() => setForm((p) => ({ ...p, type: opt.value }))}
                    className={cn(
                      "flex flex-col items-center gap-1 p-4 rounded-xl border transition-all",
                      form.type === opt.value
                        ? "border-primary/40 bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:border-primary/20"
                    )}>
                    <span className={cn("text-sm font-semibold", form.type === opt.value ? "text-primary" : "text-foreground")}>{opt.label}</span>
                    <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {allRoles.map(({ value, label }) => {
                  const Icon = roleIcons[value] || Users;
                  return (
                    <button key={value} onClick={() => setForm((p) => ({ ...p, role: value }))}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all",
                        form.role === value
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/20"
                      )}>
                      <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", form.role === value ? "bg-primary/20" : "bg-muted")}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            {form.name && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {form.name.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{form.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">
                      {form.role.replace("-", " ")} · {form.type === "vendor" ? "Vendor" : "In-Office"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Member
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TeamPage;
