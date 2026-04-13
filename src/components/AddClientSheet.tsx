import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  UserPlus, User, Heart, Phone, Mail, MapPin, CalendarDays,
  Sparkles, IndianRupee, FileText,
} from "lucide-react";

const clientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  partner_name: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  source: z.string().min(1, "Select a source"),
  event_type: z.string().optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  delivery_date: z.string().optional().or(z.literal("")),
  status: z.string().default("active"),
  budget: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface AddClientSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (client: any) => void;
}

const sources = ["Instagram", "Referral", "Website", "Google", "WhatsApp", "Facebook", "Other"];
const eventTypes = ["Wedding", "Pre-Wedding", "Engagement", "Reception", "Corporate", "Birthday"];

export function AddClientSheet({ open, onOpenChange, onAdd }: AddClientSheetProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "", partner_name: "", phone: "", email: "", city: "",
      source: "", event_type: "Wedding", event_date: "", delivery_date: "",
      status: "active", budget: "", notes: "",
    },
  });

  const onSubmit = (values: ClientFormValues) => {
    onAdd({
      name: values.name,
      partner_name: values.partner_name || null,
      phone: values.phone || null,
      email: values.email || null,
      city: values.city || null,
      source: values.source || null,
      event_type: values.event_type || null,
      event_date: values.event_date || null,
      delivery_date: values.delivery_date || null,
      status: values.status,
      budget: values.budget ? parseFloat(values.budget) : null,
      notes: values.notes || null,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-base font-display">
            <UserPlus className="h-5 w-5 text-primary" /> Add New Client
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Couple Info */}
            <div className="space-y-1 mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="h-3 w-3" /> Couple Details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Client Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Priya Sharma" className="pl-9 h-9 text-sm" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="partner_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Partner Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Rahul Kapoor" className="pl-9 h-9 text-sm" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            {/* Contact Info */}
            <div className="space-y-1 mb-1 pt-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> Contact Info
              </p>
            </div>

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Phone *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="+91 99887 76655" className="pl-9 h-9 text-sm" {...field} />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="priya@gmail.com" className="pl-9 h-9 text-sm" {...field} />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            {/* Location & Dates */}
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">City</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input placeholder="Delhi" className="pl-9 h-9 text-sm" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="event_date" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Event Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input type="date" className="pl-9 h-9 text-sm" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="delivery_date" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Delivery Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="h-9 text-sm" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="budget" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Budget (₹)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input type="number" placeholder="300000" className="pl-9 h-9 text-sm" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            {/* Source & Status */}
            <div className="space-y-1 mb-1 pt-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Source & Status
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="source" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Lead Source *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sources.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="event_type" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Event Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs flex items-center gap-1.5">
                  <FileText className="h-3 w-3" /> Notes
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Any special preferences or requirements..." className="text-sm min-h-[80px] resize-none" {...field} />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            {/* Submit */}
            <div className="flex gap-2 pt-3">
              <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl gap-2">
                <UserPlus className="h-4 w-4" /> Add Client
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
