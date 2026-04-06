import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Bell, BellOff, MapPin, MapPinOff, Shield, User, Mail, Phone, Building, Pencil, Save, ChevronRight, Lock, Globe, Moon, Volume2, Vibrate } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Profile fields
  const [name, setName] = useState("Amit Sharma");
   const [email, setEmail] = useState("amit@studioai.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [role, setRole] = useState("Studio Owner");
  const [company, setCompany] = useState("StudioAi Photography");

  // Toggles
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [gpsTracker, setGpsTracker] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const toggleItem = (label: string, value: boolean, setter: (v: boolean) => void) => {
    setter(!value);
    toast.success(`${label} ${!value ? "enabled" : "disabled"}`);
  };

  return (
    
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(var(--sidebar-background)) 0%, hsl(var(--primary) / 0.9) 100%)" }}
        >
          <div className="absolute -top-10 -right-10 size-36 rounded-full bg-white/[0.04]" />
          <div className="absolute -bottom-8 -left-8 size-28 rounded-full bg-white/[0.03]" />
          <div className="absolute top-1/2 right-1/4 size-48 rounded-full bg-white/[0.02]" />

          <div className="p-5 md:p-8 flex flex-col md:flex-row items-center gap-5">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="size-24 md:size-28 border-4 border-white/20 shadow-lg">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="bg-white/10 text-white text-2xl md:text-3xl font-bold">
                  {name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary flex items-center justify-center border-2 border-white/20">
                <Camera size={12} className="text-primary-foreground" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white">{name}</h2>
              <p className="text-sm text-white/60 mt-0.5">{role}</p>
              <p className="text-xs text-white/40 mt-1">{email}</p>
              <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold">Active</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-[11px] font-medium">Admin</span>
              </div>
            </div>

            {/* Edit button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="border-white/20 text-white bg-white/10 hover:bg-white/20"
            >
              {isEditing ? <><Save size={14} className="mr-1.5" /> Save</> : <><Pencil size={14} className="mr-1.5" /> Edit</>}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Personal Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-card rounded-2xl shadow-sm border border-border/50 p-4 md:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center"><User size={16} className="text-primary" /></div>
              <h3 className="text-base font-bold text-foreground">Personal Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                {isEditing ? (
                  <Input value={name} onChange={e => setName(e.target.value)} className="h-10" />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2">{name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email</Label>
                {isEditing ? (
                  <Input value={email} onChange={e => setEmail(e.target.value)} className="h-10" />
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <Mail size={14} className="text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">{email}</p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                {isEditing ? (
                  <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-10" />
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <Phone size={14} className="text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">{phone}</p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Role</Label>
                {isEditing ? (
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Studio Owner">Studio Owner</SelectItem>
                      <SelectItem value="Photographer">Photographer</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium text-foreground py-2">{role}</p>
                )}
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground">Company</Label>
                {isEditing ? (
                  <Input value={company} onChange={e => setCompany(e.target.value)} className="h-10" />
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <Building size={14} className="text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">{company}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border/50 p-4 md:p-6 space-y-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center"><Shield size={16} className="text-primary" /></div>
              <h3 className="text-base font-bold text-foreground">Account</h3>
            </div>
            {[
              { label: "Change Password", icon: Lock, desc: "Update your password" },
              { label: "Two-Factor Auth", icon: Shield, desc: "Extra security layer" },
              { label: "Language", icon: Globe, desc: "English (US)" },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </motion.div>
        </div>

        {/* Notification Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-sm border border-border/50 p-4 md:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {pushNotifications ? <Bell size={16} className="text-primary" /> : <BellOff size={16} className="text-muted-foreground" />}
            </div>
            <h3 className="text-base font-bold text-foreground">Notifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Push Notifications", desc: "Receive push alerts on your device", icon: Bell, value: pushNotifications, setter: setPushNotifications },
              { label: "Email Notifications", desc: "Get notified via email", icon: Mail, value: emailNotifications, setter: setEmailNotifications },
              { label: "SMS Alerts", desc: "Receive text message alerts", icon: Phone, value: smsNotifications, setter: setSmsNotifications },
              { label: "Sound Alerts", desc: "Play sound for new notifications", icon: Volume2, value: soundAlerts, setter: setSoundAlerts },
              { label: "Vibration", desc: "Vibrate on notification", icon: Vibrate, value: vibration, setter: setVibration },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`size-9 rounded-lg flex items-center justify-center ${item.value ? "bg-primary/10" : "bg-muted"}`}>
                    <item.icon size={16} className={item.value ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={item.value}
                  onCheckedChange={() => toggleItem(item.label, item.value, item.setter)}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* GPS & Location */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl shadow-sm border border-border/50 p-4 md:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {gpsTracker ? <MapPin size={16} className="text-primary" /> : <MapPinOff size={16} className="text-muted-foreground" />}
            </div>
            <h3 className="text-base font-bold text-foreground">GPS & Location</h3>
          </div>

          <div className="space-y-3">
            {/* GPS Tracker */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl flex items-center justify-center ${gpsTracker ? "bg-emerald-500/10" : "bg-muted"}`}>
                  <MapPin size={18} className={gpsTracker ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">GPS Tracker</p>
                  <p className="text-[11px] text-muted-foreground">Track employee location during work hours</p>
                </div>
              </div>
              <Switch
                checked={gpsTracker}
                onCheckedChange={() => toggleItem("GPS Tracker", gpsTracker, setGpsTracker)}
              />
            </div>

            {/* Location Sharing */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl flex items-center justify-center ${locationSharing ? "bg-blue-500/10" : "bg-muted"}`}>
                  <Globe size={18} className={locationSharing ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Location Sharing</p>
                  <p className="text-[11px] text-muted-foreground">Share your live location with team leads</p>
                </div>
              </div>
              <Switch
                checked={locationSharing}
                onCheckedChange={() => toggleItem("Location Sharing", locationSharing, setLocationSharing)}
              />
            </div>

            {/* GPS Status info */}
            {gpsTracker && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">GPS Active</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Status</p>
                    <p className="text-xs font-bold text-foreground">Connected</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Accuracy</p>
                    <p className="text-xs font-bold text-foreground">High</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Last Update</p>
                    <p className="text-xs font-bold text-foreground">Just now</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Battery Impact</p>
                    <p className="text-xs font-bold text-foreground">Low</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    
  );
};

export default ProfilePage;
