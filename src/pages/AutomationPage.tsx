import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Plus, Play, Pause, Clock, Mail, MessageSquare, Bell, CheckCircle, Calendar, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  channel: "whatsapp" | "email" | "sms" | "internal";
  isActive: boolean;
  runs: number;
  lastRun?: string;
  category: "lead" | "project" | "payment" | "delivery" | "feedback";
}

const sampleAutomations: Automation[] = [];

const channelIcons: Record<string, typeof Mail> = { whatsapp: MessageSquare, email: Mail, sms: Bell, internal: Bell };
const categoryColors: Record<string, string> = {
  lead: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  project: "bg-primary/20 text-primary border-primary/30",
  payment: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  delivery: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  feedback: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function AutomationPage() {
  const [automations, setAutomations] = useState(sampleAutomations);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) => prev.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const activeCount = automations.filter((a) => a.isActive).length;
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0);

  return (
    
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Workflow Automation</h1>
            <p className="text-sm text-muted-foreground mt-1">{activeCount} active workflows · {totalRuns} total runs</p>
          </div>
          <Button className="gap-2"><Plus className="h-4 w-4" /> New Automation</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active", value: activeCount, icon: Play },
            { label: "Paused", value: automations.length - activeCount, icon: Pause },
            { label: "Total Runs", value: totalRuns, icon: Zap },
            { label: "Time Saved", value: `${Math.round(totalRuns * 5)}m`, icon: Clock },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-card border border-border p-4 text-center">
              <s.icon className="h-4 w-4 text-primary mx-auto mb-2" />
              <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Automations List */}
        <div className="space-y-3">
          {automations.map((auto) => {
            const ChannelIcon = channelIcons[auto.channel];
            return (
              <div key={auto.id} className={`rounded-lg bg-card border p-4 transition-colors ${auto.isActive ? "border-border hover:border-primary/30" : "border-border opacity-60"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${auto.isActive ? "bg-primary/10" : "bg-muted"}`}>
                      <Zap className={`h-5 w-5 ${auto.isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{auto.name}</p>
                        <Badge variant="outline" className={categoryColors[auto.category] + " text-[9px]"}>{auto.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="text-foreground/70">When:</span> {auto.trigger} → <span className="text-foreground/70">Then:</span> {auto.action}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><ChannelIcon className="h-3 w-3" />{auto.channel}</span>
                        <span>{auto.runs} runs</span>
                        {auto.lastRun && <span>Last: {auto.lastRun}</span>}
                      </div>
                    </div>
                  </div>
                  <Switch checked={auto.isActive} onCheckedChange={() => toggleAutomation(auto.id)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    
  );
}
