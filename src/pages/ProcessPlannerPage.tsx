import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { useProcessSteps, type ProcessStep } from "@/hooks/useProcessSteps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Plus, Trash2, Copy, CalendarIcon, CheckCircle2, Clock, Circle,
  ChevronRight, GripVertical,
} from "lucide-react";

const EVENT_OPTIONS = [
  "Pre-Wedding", "Wedding", "Haldi", "Mehendi", "Sangeet",
  "Reception", "Engagement", "Baby Shower", "Birthday", "Corporate",
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Circle }> = {
  not_started: { label: "Not Started", color: "bg-muted text-muted-foreground", icon: Circle },
  in_progress: { label: "In Progress", color: "bg-amber-500/20 text-amber-400", icon: Clock },
  completed: { label: "Completed", color: "bg-emerald-500/20 text-emerald-400", icon: CheckCircle2 },
};

export default function ProcessPlannerPage() {
  const { clients, isLoading: clientsLoading } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { steps, isLoading, addStep, updateStep, deleteStep } = useProcessSteps(selectedClientId || undefined);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleAddStep = () => {
    if (!selectedClientId) return;
    addStep.mutate({
      client_id: selectedClientId,
      step_number: steps.length + 1,
      heading: "",
      description: null,
      events: [],
      deadline: null,
      status: "not_started",
    });
  };

  const handleDuplicate = (step: ProcessStep) => {
    addStep.mutate({
      client_id: step.client_id,
      step_number: steps.length + 1,
      heading: `${step.heading} (copy)`,
      description: step.description,
      events: step.events,
      deadline: step.deadline,
      status: "not_started",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Process Planner</h1>
          <p className="text-sm text-muted-foreground">Define step-by-step workflows for each client</p>
        </div>
      </div>

      {/* Client Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <Label>Select Client</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a client…" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedClientId && (
              <Button onClick={handleAddStep} disabled={addStep.isPending}>
                <Plus className="h-4 w-4 mr-1" /> Add Step
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedClientId && (
        <div className="text-center py-20 text-muted-foreground">
          Select a client to view or create their process timeline.
        </div>
      )}

      {selectedClientId && steps.length === 0 && !isLoading && (
        <div className="text-center py-20 text-muted-foreground">
          No steps yet. Click "Add Step" to start building the process.
        </div>
      )}

      {/* Timeline View */}
      {selectedClientId && steps.length > 0 && (
        <div className="space-y-6">
          {/* Visual Timeline */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
              <CardTitle className="text-lg">Timeline — {selectedClient?.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative pl-8">
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border" />
                {steps.map((step, idx) => {
                  const cfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.not_started;
                  const Icon = cfg.icon;
                  return (
                    <div key={step.id} className="relative mb-8 last:mb-0">
                      <div className={cn(
                        "absolute -left-[1.125rem] top-1 h-7 w-7 rounded-full flex items-center justify-center ring-4 ring-background",
                        step.status === "completed" ? "bg-emerald-500" : step.status === "in_progress" ? "bg-amber-500" : "bg-muted-foreground/30"
                      )}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-primary">STEP {step.step_number}</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{step.heading || "Untitled Step"}</span>
                          <Badge variant="secondary" className={cn("text-xs", cfg.color)}>{cfg.label}</Badge>
                        </div>
                        {step.deadline && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📅 {format(new Date(step.deadline), "dd MMM yyyy")}
                          </p>
                        )}
                        {step.events.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {step.events.map((e) => (
                              <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>
                            ))}
                          </div>
                        )}
                        {step.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{step.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step Editor Cards */}
          <div className="space-y-4">
            {steps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                onUpdate={(updates) => updateStep.mutate({ id: step.id, ...updates })}
                onDelete={() => deleteStep.mutate(step.id)}
                onDuplicate={() => handleDuplicate(step)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepCard({
  step,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  step: ProcessStep;
  onUpdate: (u: Partial<ProcessStep>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    step.deadline ? new Date(step.deadline) : undefined
  );

  const cfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.not_started;

  const toggleEvent = (event: string) => {
    const next = step.events.includes(event)
      ? step.events.filter((e) => e !== event)
      : [...step.events, event];
    onUpdate({ events: next });
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: step.status === "completed" ? "var(--color-emerald-500, #10b981)" : step.status === "in_progress" ? "var(--color-amber-500, #f59e0b)" : "hsl(var(--muted-foreground) / 0.3)" }}>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <Badge variant="outline" className="font-bold">Step {step.step_number}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Select value={step.status} onValueChange={(v) => onUpdate({ status: v })}>
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate}><Copy className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Process Heading</Label>
            <Input
              value={step.heading}
              onChange={(e) => onUpdate({ heading: e.target.value })}
              placeholder="e.g. Pre-Wedding Shoot"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full mt-1 justify-start text-left font-normal", !deadlineDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadlineDate ? format(deadlineDate, "PPP") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadlineDate}
                  onSelect={(d) => {
                    setDeadlineDate(d);
                    onUpdate({ deadline: d ? format(d, "yyyy-MM-dd") : null });
                  }}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label className="text-xs">Description</Label>
          <Textarea
            value={step.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Detailed explanation of this step…"
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label className="text-xs mb-2 block">Event Selection</Label>
          <div className="flex flex-wrap gap-2">
            {EVENT_OPTIONS.map((ev) => (
              <label key={ev} className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox
                  checked={step.events.includes(ev)}
                  onCheckedChange={() => toggleEvent(ev)}
                />
                <span className="text-xs">{ev}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
