import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Aperture, Focus, Sun } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Floating lens/camera elements */}
      {[
        { x: "8%", y: "12%", delay: 0, size: 60, opacity: 0.06 },
        { x: "82%", y: "18%", delay: 1, size: 80, opacity: 0.04 },
        { x: "12%", y: "78%", delay: 0.5, size: 50, opacity: 0.05 },
        { x: "88%", y: "75%", delay: 1.5, size: 70, opacity: 0.04 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/10 pointer-events-none"
          style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size, opacity: orb.opacity }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 12, delay: orb.delay, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 rounded-full border border-primary/20" />
          <div className="absolute inset-4 rounded-full border border-primary/10" />
        </motion.div>
      ))}

      {/* Ambient light glow */}
      <motion.div
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[120px] pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Left — Studio branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-[55%] flex-col justify-center items-center relative"
      >
        {/* Camera viewfinder overlay */}
        <div className="absolute inset-12 border border-border/20 rounded-xl pointer-events-none">
          {/* Corner marks */}
          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} border-primary/30 w-8 h-8 rounded-sm`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.15 }}
            />
          ))}
          {/* Center crosshair */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="w-12 h-px bg-primary/40" />
            <div className="w-px h-12 bg-primary/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-6 h-6 rounded-full border border-primary/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-sm text-center">
          {/* Aperture logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            className="relative mx-auto mb-8"
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Aperture className="h-12 w-12 text-primary/60" strokeWidth={1} />
              </motion.div>
            </div>
            <motion.div
              className="absolute -inset-3 rounded-full border border-dashed border-primary/15"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Studio<span className="text-primary">Ai</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground leading-relaxed mb-10 text-sm"
          >
            Capture moments. Manage everything.
            <br />
            Your photography studio, streamlined.
          </motion.p>

          {/* Specs strip — like camera settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 text-xs text-muted-foreground font-mono"
          >
            {[
              { icon: Aperture, label: "f/1.4" },
              { icon: Sun, label: "ISO 100" },
              { icon: Focus, label: "∞ Focus" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.15 }}
                className="flex items-center gap-1.5 text-muted-foreground/60"
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Divider line */}
        <motion.div
          className="absolute right-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-border/40 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
      </motion.div>

      {/* Right — Login form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4"
            >
              <Aperture className="h-8 w-8 text-primary/70" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">
              Studio<span className="text-primary">Ai</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Photography Studio Management</p>
          </div>

          {/* Form card */}
          <motion.div
            className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl shadow-black/10 p-8"
            whileHover={{ borderColor: "hsl(var(--primary) / 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to your studio workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="mt-1.5 h-11 bg-background/50 border-border/50 focus:border-primary/40 transition-colors"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10 h-11 bg-background/50 border-border/50 focus:border-primary/40 transition-colors"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end"
              >
                <button type="button" className="text-xs text-primary/80 hover:text-primary transition-colors">
                  Forgot password?
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-semibold gap-2 shadow-lg shadow-primary/15 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-[11px] text-muted-foreground/60 mt-8"
          >
            Powered by Studio<span className="text-primary/60">Ai</span> • Photography Studio Management
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
