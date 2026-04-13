import { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Camera, Video, Edit3, Users, Phone, Plus, UserPlus, Mail, MapPin, CreditCard,
  IndianRupee, Heart, ChevronDown, ChevronUp, Search, Filter,
  LayoutGrid, List, Star, Clock, CheckCircle2, SlidersHorizontal,
  Zap, Award,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useTeamMembers, type TeamMemberDB } from "@/hooks/useTeamMembers";
import { useOrg } from "@/contexts/OrgContext";

const roleIcons: Record<string, typeof Camera> = {
  photographer: Camera, videographer: Video, editor: Edit3, "drone-operator": Camera, drone_operator: Camera, assistant: Users, manager: Users,
};
const roleColors: Record<string, string> = {
  photographer: "bg-blue-500/20 text-blue-400", videographer: "bg-purple-500/20 text-purple-400",
  editor: "bg-emerald-500/20 text-emerald-400", "drone-operator": "bg-orange-500/20 text-orange-400",
  drone_operator: "bg-orange-500/20 text-orange-400", assistant: "bg-muted text-muted-foreground",
  manager: "bg-primary/20 text-primary",
};
const allRoles = [
  { value: "photographer", label: "Photographer" }, { value: "videographer", label: "Videographer" },
  { value: "editor", label: "Editor" }, { value: "drone_operator", label: "Drone Operator" },
  { value: "assistant", label: "Assistant" }, { value: "manager", label: "Manager" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } } as const;
const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 220, damping: 22 } } };

const AnimatedNumber = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const isInView = useInView(ref, { once: true });
  useEffect(() => { if (isInView) { const c = animate(motionVal, value, { duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] }); return c.stop; } }, [isInView, motionVal, value, delay]);
  useEffect(() => { const unsub = rounded.on("change", (v) => { if (ref.current) ref.current.textContent = `${v}`; }); return unsub; }, [rounded]);
  return <span ref={ref}>0</span>;
};

const initialForm = {
  name: "", phone: "", email: "", role: "photographer", daily_rate: "",
  experience_years: "", specialties: "", notes: "",
};

function FormSection({ title, icon: Icon, children, defaultOpen = true }: { title: string; icon: typeof Camera; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex-1 text-left">{title}</span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

const TeamPage = () => {
  const { organization } = useOrg();
  const { members, isLoading, addMember, deleteMember } = useTeamMembers();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [detailMember, setDetailMember] = useState<TeamMemberDB | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = `${m.full_name} ${m.phone || ""} ${m.email || ""}`.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === "all" || m.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [members, search, filterRole]);

  const totalMembers = members.length;
  const availableCount = members.filter((m) => m.availability === "available").length;
  const busyCount = members.filter((m) => m.availability === "busy").length;

  const availColors: Record<string, string> = { available: "bg-emerald-500", busy: "bg-red-500", partial: "bg-amber-500", unavailable: "bg-muted-foreground" };
  const availLabels: Record<string, string> = { available: "Available", busy: "Busy", partial: "Partial", unavailable: "Unavailable" };

  const updateForm = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleAdd = () => {
    if (!form.name.trim() || !organization?.id) { toast.error("Name is required"); return; }
    addMember.mutate({
      organization_id: organization.id,
      user_id: null,
      full_name: form.name.trim(),
      role: form.role,
      phone: form.phone || null,
      email: form.email || null,
      availability: "available",
      rating: 0,
      daily_rate: parseInt(form.daily_rate) || 0,
      specialties: form.specialties ? form.specialties.split(",").map(s => s.trim()) : [],
      experience_years: parseInt(form.experience_years) || 0,
      notes: form.notes || null,
    });
    setAddOpen(false);
    setForm(initialForm);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">Team Management</h1>
            <p className="text-xs text-muted-foreground">{totalMembers} members · {availableCount} available · {busyCount} busy</p>
          </div>
        </div>
        <Button size="sm" className="gap-2 rounded-xl" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Member</Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        {allRoles.map(({ value: role, label }, i) => {
          const Icon = roleIcons[role] || Users;
          const count = members.filter((m) => m.role === role).length;
          const colors = roleColors[role] || "bg-muted text-muted-foreground";
          return (
            <motion.div key={role} variants={cardVariants}
              className="bg-gradient-to-b from-card to-muted/20 border border-border rounded-2xl p-4 ring-1 ring-border/50 cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => setFilterRole(filterRole === role ? "all" : role)}>
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center ring-1 ring-border mb-2.5", colors)}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xl font-display font-extrabold text-foreground leading-tight"><AnimatedNumber value={count} delay={0.2 + i * 0.1} /></p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold mt-0.5">{label}s</p>
            </motion.div>
          );
        })}
      </div>

      {/* Search + Filters */}
      <motion.div variants={cardVariants} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search team members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <div className="flex rounded-lg border border-border overflow-hidden shrink-0 hidden sm:flex">
          <button onClick={() => setViewMode("grid")} className={cn("px-2.5 py-2 text-xs transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted")}><LayoutGrid className="h-3.5 w-3.5" /></button>
          <button onClick={() => setViewMode("list")} className={cn("px-2.5 py-2 text-xs transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted")}><List className="h-3.5 w-3.5" /></button>
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-36 h-9 hidden sm:flex"><SelectValue placeholder="All Roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {allRoles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="sm:hidden h-9 w-9 shrink-0" onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Grid / List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => {
            const Icon = roleIcons[m.role] || Users;
            return (
              <motion.div key={m.id} variants={cardVariants} whileTap={{ scale: 0.98 }}
                onClick={() => setDetailMember(m)}
                className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                <div className="h-1 bg-gradient-to-r from-blue-500/50 to-blue-500/20" />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{m.full_name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background", availColors[m.availability] || availColors.unavailable)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{m.full_name}</p>
                      <span className={cn("inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 font-medium capitalize mt-1", roleColors[m.role] || "bg-muted text-muted-foreground")}><Icon className="h-2.5 w-2.5" />{m.role.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/50">
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{m.experience_years || 0}</p>
                      <p className="text-[9px] text-muted-foreground">Yrs Exp</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">₹{((m.daily_rate || 0) / 1000).toFixed(0)}K</p>
                      <p className="text-[9px] text-muted-foreground">Day Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        <p className="text-sm font-bold text-foreground">{(m.rating || 0).toFixed(1)}</p>
                      </div>
                      <p className="text-[9px] text-muted-foreground">Rating</p>
                    </div>
                  </div>
                  {m.phone && <p className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex-1">Member</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold w-24 hidden sm:block">Role</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold w-20 hidden md:block">Status</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold w-16 hidden lg:block text-center">Rating</span>
          </div>
          {filtered.map((m) => {
            const Icon = roleIcons[m.role] || Users;
            return (
              <div key={m.id} onClick={() => setDetailMember(m)}
                className="flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                <div className="relative">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><span className="text-xs font-bold text-primary">{m.full_name.split(" ").map(n => n[0]).join("")}</span></div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background", availColors[m.availability] || availColors.unavailable)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{m.full_name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.phone || m.email || ""}</p>
                </div>
                <div className="w-24 hidden sm:block">
                  <span className={cn("inline-flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 font-medium capitalize", roleColors[m.role] || "bg-muted text-muted-foreground")}><Icon className="h-2.5 w-2.5" />{m.role.replace(/_/g, " ")}</span>
                </div>
                <div className="w-20 hidden md:block">
                  <Badge variant="outline" className={cn("text-[10px]", m.availability === "available" ? "text-emerald-500 border-emerald-500/20" : m.availability === "busy" ? "text-red-500 border-red-500/20" : "text-amber-500 border-amber-500/20")}>
                    {availLabels[m.availability] || "Unknown"}
                  </Badge>
                </div>
                <div className="w-16 hidden lg:flex items-center justify-center gap-0.5">
                  <Star className="h-3 w-3 text-primary fill-primary" /><span className="text-xs font-medium">{(m.rating || 0).toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center"><Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" /><p className="text-sm text-muted-foreground">No team members found</p></div>
      )}

      {/* Member Detail Sheet */}
      <Sheet open={!!detailMember} onOpenChange={(open) => !open && setDetailMember(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {detailMember && (() => {
            const Icon = roleIcons[detailMember.role] || Users;
            return (
              <>
                <SheetHeader><SheetTitle className="text-left">Member Profile</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"><span className="text-xl font-bold text-primary">{detailMember.full_name.split(" ").map(n => n[0]).join("")}</span></div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{detailMember.full_name}</p>
                      <span className={cn("inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-0.5 font-medium capitalize mt-1", roleColors[detailMember.role] || "bg-muted text-muted-foreground")}><Icon className="h-3 w-3" />{detailMember.role.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-muted/30 border border-border p-3 text-center"><Zap className="h-4 w-4 text-amber-500 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{detailMember.experience_years || 0}</p><p className="text-[10px] text-muted-foreground">Yrs Exp</p></div>
                    <div className="rounded-xl bg-muted/30 border border-border p-3 text-center"><IndianRupee className="h-4 w-4 text-emerald-500 mx-auto mb-1" /><p className="text-lg font-bold text-foreground">₹{((detailMember.daily_rate || 0) / 1000).toFixed(0)}K</p><p className="text-[10px] text-muted-foreground">Day Rate</p></div>
                    <div className="rounded-xl bg-muted/30 border border-border p-3 text-center"><Star className="h-4 w-4 text-primary mx-auto mb-1" /><p className="text-lg font-bold text-foreground">{(detailMember.rating || 0).toFixed(1)}</p><p className="text-[10px] text-muted-foreground">Rating</p></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
                    {detailMember.phone && <div className="flex items-center gap-2 text-sm text-foreground"><Phone className="h-4 w-4 text-muted-foreground" />{detailMember.phone}</div>}
                    {detailMember.email && <div className="flex items-center gap-2 text-sm text-foreground"><Mail className="h-4 w-4 text-muted-foreground" />{detailMember.email}</div>}
                  </div>
                  {detailMember.specialties && detailMember.specialties.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Specialties</p>
                      <div className="flex flex-wrap gap-1.5">
                        {detailMember.specialties.map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {detailMember.notes && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</p>
                      <p className="text-sm text-foreground">{detailMember.notes}</p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ═══ ADD MEMBER SHEET ═══ */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
            <SheetTitle className="flex items-center gap-2"><UserPlus className="h-4 w-4 text-primary" /> Add Team Member</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-2"><Label className="text-xs font-medium">Role *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {allRoles.map(({ value, label }) => { const Icon = roleIcons[value] || Users; return (
                    <button key={value} onClick={() => updateForm("role", value)} className={cn("flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all", form.role === value ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/20")}>
                      <div className={cn("h-7 w-7 rounded-md flex items-center justify-center", form.role === value ? "bg-primary/20" : "bg-muted")}><Icon className="h-3.5 w-3.5" /></div>{label}
                    </button>
                  ); })}
                </div>
              </div>
              <FormSection title="Personal Information" icon={UserPlus} defaultOpen={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Full Name *</Label><Input placeholder="e.g. Arjun Mehta" value={form.name} onChange={(e) => updateForm("name", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input type="email" placeholder="arjun@example.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} /></div>
                </div>
              </FormSection>
              <FormSection title="Professional Details" icon={IndianRupee} defaultOpen={false}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">Experience (Years)</Label><Input type="number" placeholder="5" value={form.experience_years} onChange={(e) => updateForm("experience_years", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Daily Rate (₹)</Label><Input type="number" placeholder="5000" value={form.daily_rate} onChange={(e) => updateForm("daily_rate", e.target.value)} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Specialties (comma-separated)</Label><Input placeholder="e.g. Candid, Traditional, Drone" value={form.specialties} onChange={(e) => updateForm("specialties", e.target.value)} /></div>
                </div>
              </FormSection>
              <div className="space-y-1.5"><Label className="text-xs font-medium">Additional Notes</Label><Textarea placeholder="Any additional notes..." className="min-h-[60px]" value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} /></div>
              <Button className="w-full" onClick={handleAdd} disabled={addMember.isPending}><Plus className="h-4 w-4 mr-1" /> Add Member</Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Mobile Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl pb-8 max-h-[70vh]">
          <SheetHeader className="pb-4"><div className="text-base font-semibold flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-primary" /> Filters</div></SheetHeader>
          <div className="space-y-5">
            <div><label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">Role</label>
              <div className="flex flex-wrap gap-2">
                {[{ value: "all", label: "All" }, ...allRoles].map((opt) => (
                  <button key={opt.value} onClick={() => setFilterRole(opt.value)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", filterRole === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border")}>{opt.label}</button>
                ))}
              </div>
            </div>
            <Button className="w-full h-11 rounded-xl" onClick={() => setFilterOpen(false)}><Filter className="h-4 w-4 mr-2" /> Show {filtered.length} Members</Button>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default TeamPage;
