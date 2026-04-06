import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, CheckCircle2, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
}

interface CreateStudioDialogProps {
  plans: Plan[];
  onCreated: () => void;
}

const teamSizes = [
  { value: "solo", label: "Solo (Just me)" },
  { value: "small", label: "Small (2-5)" },
  { value: "medium", label: "Medium (6-15)" },
  { value: "large", label: "Large (16+)" },
];

export function CreateStudioDialog({ plans, onCreated }: CreateStudioDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const [form, setForm] = useState({
    studioName: "",
    email: "",
    password: "",
    city: "",
    phone: "",
    teamSize: "solo",
    planId: "",
  });

  const resetForm = () => {
    setForm({ studioName: "", email: "", password: "", city: "", phone: "", teamSize: "solo", planId: "" });
    setStep("form");
    setCredentials(null);
    setShowPassword(false);
  };

  const handleCreate = async () => {
    if (!form.studioName || !form.email || !form.password) {
      toast.error("Studio name, email, and password are required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.functions.invoke("create-studio", {
      body: {
        studioName: form.studioName,
        email: form.email,
        password: form.password,
        city: form.city,
        phone: form.phone,
        teamSize: form.teamSize,
        planId: form.planId || undefined,
      },
    });

    setLoading(false);

    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Failed to create studio");
      return;
    }

    setCredentials({ email: form.email, password: form.password });
    setStep("success");
    onCreated();
    toast.success(`Studio "${form.studioName}" created successfully!`);
  };

  const copyCredentials = () => {
    if (!credentials) return;
    navigator.clipboard.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
    toast.success("Credentials copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Create Studio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? "Create New Studio" : "Studio Created!"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Studio Name *</Label>
              <Input
                placeholder="Pixel Perfect Studios"
                value={form.studioName}
                onChange={(e) => setForm({ ...form, studioName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Owner Email *</Label>
                <Input
                  type="email"
                  placeholder="owner@studio.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 chars"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Team Size</Label>
                <Select value={form.teamSize} onValueChange={(v) => setForm({ ...form, teamSize: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {teamSizes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={form.planId} onValueChange={(v) => setForm({ ...form, planId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" onClick={handleCreate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Creating Studio..." : "Create Studio"}
            </Button>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Studio has been created. Share these credentials with the studio owner.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Login Credentials</span>
                <Button variant="ghost" size="sm" onClick={copyCredentials}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                </Button>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Email</span>
                  <p className="text-sm font-mono font-medium text-foreground">{credentials?.email}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Password</span>
                  <p className="text-sm font-mono font-medium text-foreground">{credentials?.password}</p>
                </div>
              </div>
            </div>

            <Button className="w-full" variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
