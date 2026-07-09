import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Brain,
  Zap,
  Shield,
  Globe,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { toast } from "sonner";

/** Official brand marks (inline so they stay crisp and need no external assets). */
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

interface LoginProps {
  /** Real Supabase sign-in. Resolves to an error message, or null on success. */
  onLogin: (email: string, password: string) => Promise<string | null>;
  onNavigateToSignup: () => void;
}

interface DemoForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  companySize: string;
  message: string;
}
const EMPTY_DEMO: DemoForm = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  companySize: "",
  message: "",
};

const FEATURES = [
  { icon: Brain, label: "AI-Powered Intelligence", color: "#EAB308" },
  { icon: Zap, label: "14 Integrated Modules", color: "#57ACAF" },
  { icon: Shield, label: "Enterprise-Grade Security", color: "#EAB308" },
  { icon: Globe, label: "Multi-Location Support", color: "#57ACAF" },
];

export function Login({ onLogin, onNavigateToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [demoOpen, setDemoOpen] = useState(false);
  const [demoForm, setDemoForm] = useState<DemoForm>(EMPTY_DEMO);
  const [demoSubmitting, setDemoSubmitting] = useState(false);

  const setDemo = (field: keyof DemoForm, value: string) =>
    setDemoForm((prev) => ({ ...prev, [field]: value }));

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.companyName.trim() || !demoForm.email.includes("@")) {
      toast.error("Please enter your company name and a valid work email.");
      return;
    }
    setDemoSubmitting(true);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not submit request");
      toast.success("Thanks! We'll email your demo credentials shortly.");
      setDemoForm(EMPTY_DEMO);
      setDemoOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit request");
    } finally {
      setDemoSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    const error = await onLogin(email, password);
    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }
    toast.success("Welcome back to FabricXAI!");
  };

  return (
    <div className="min-h-screen bg-[#0A0E16] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-[32rem] h-[32rem] bg-[#57ACAF]/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[32rem] h-[32rem] bg-[#EAB308]/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* ── Left: branding ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/fabricxai-logo-dark.png"
              alt="fabricXai"
              className="h-9 w-auto object-contain"
            />
            <div className="leading-tight">
              <div className="text-lg text-white font-semibold">Garments</div>
              <div className="text-[10px] tracking-[0.2em] text-[#6F83A7] uppercase">
                Intelligent Platform
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="w-fit inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#9FB3C8]">
            <Sparkles className="w-3.5 h-3.5 text-[#57ACAF]" />
            AI-Powered ERP Platform
          </div>

          {/* Headline */}
          <div className="space-y-5">
            <h1 className="text-5xl font-bold leading-[1.1] text-white">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                Garment Business with AI
              </span>
            </h1>
            <p className="text-[#6F83A7] text-base leading-relaxed max-w-lg">
              A robust platform with 14 tailored modules and 22 AI agents to
              revolutionize garment operations, built to streamline operations,
              improve efficiency, increase margins, and fuel sustainable growth
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-8"
                  style={{ backgroundColor: `${f.color}1A` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div className="text-sm text-white font-medium">{f.label}</div>
                <div
                  className="mt-2 h-0.5 w-8 rounded"
                  style={{ backgroundColor: f.color }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: sign-in ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          {/* Security pill */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#9FB3C8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#57ACAF]" />
              AI-Monitored Data Security
              <span className="w-1.5 h-1.5 rounded-full bg-[#57ACAF]" />
            </div>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
            <img
              src="/assets/fabricxai-logo-dark.png"
              alt="fabricXai"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl">
            <h2 className="text-2xl text-white font-semibold">Sign in</h2>
            <p className="mt-1 text-sm text-[#6F83A7]">
              New organization?{" "}
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="text-[#57ACAF] hover:underline"
              >
                Request demo access
              </button>{" "}
              ·{" "}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-[#57ACAF] hover:underline"
              >
                Full company signup (desktop)
              </button>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Work Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 text-sm">
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(c) => setRememberMe(c as boolean)}
                    className="border-white/20 data-[state=checked]:bg-[#57ACAF] data-[state=checked]:border-[#57ACAF]"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-white/70 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset link coming soon.")}
                  className="text-sm text-[#57ACAF] hover:text-[#57ACAF]/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary CTA (gold) */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-[#EAB308] to-[#F5C518] text-[#0D1117] font-medium hover:opacity-95 shadow-lg shadow-[#EAB308]/20 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to workspace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* or continue with */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#131722] px-3 text-[#6F83A7]">
                  or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info("Google sign-in coming soon.")}
                className="h-11 gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
              >
                <GoogleIcon className="w-4 h-4" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info("LinkedIn sign-in coming soon.")}
                className="h-11 gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
              >
                <LinkedInIcon className="w-4 h-4" />
                LinkedIn
              </Button>
            </div>

            {/* Quick Start */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#131722] px-3 text-[#6F83A7]">
                  Quick Start
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setDemoOpen(true)}
              className="w-full h-11 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
            >
              <Rocket className="w-4 h-4 mr-2 text-[#EAB308]" />
              Request demo access (email credentials)
            </Button>

            {/* Mobile-only: full signup lives on desktop. Hidden on desktop, where signup is available here. */}
            <p className="lg:hidden mt-5 text-center text-xs text-[#6F83A7]">
              Company onboarding (profile + modules) is on{" "}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-[#57ACAF] hover:underline"
              >
                desktop signup
              </button>
              .
            </p>
          </div>
        </motion.div>
      </div>

      {/* Request demo access — collects the prospect's company details */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md bg-[#0F1420] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Request demo access</DialogTitle>
            <DialogDescription className="text-[#6F83A7]">
              Tell us about your company and we&apos;ll email your demo credentials.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDemoSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-white/90">Company name *</Label>
              <Input
                value={demoForm.companyName}
                onChange={(e) => setDemo("companyName", e.target.value)}
                placeholder="Acme Garments Ltd"
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-white/90">Your name</Label>
                <Input
                  value={demoForm.contactName}
                  onChange={(e) => setDemo("contactName", e.target.value)}
                  placeholder="Full name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-white/90">Work email *</Label>
                <Input
                  type="email"
                  value={demoForm.email}
                  onChange={(e) => setDemo("email", e.target.value)}
                  placeholder="you@company.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-white/90">Phone</Label>
                <Input
                  value={demoForm.phone}
                  onChange={(e) => setDemo("phone", e.target.value)}
                  placeholder="+880…"
                  className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-white/90">Country</Label>
                <Input
                  value={demoForm.country}
                  onChange={(e) => setDemo("country", e.target.value)}
                  placeholder="Bangladesh"
                  className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-white/90">Company size</Label>
              <Input
                value={demoForm.companySize}
                onChange={(e) => setDemo("companySize", e.target.value)}
                placeholder="e.g. 500–1,000 workers"
                className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-white/90">Anything we should know?</Label>
              <Textarea
                value={demoForm.message}
                onChange={(e) => setDemo("message", e.target.value)}
                placeholder="What would you like to see in the demo?"
                className="min-h-[72px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={demoSubmitting}
                className="w-full h-11 bg-gradient-to-r from-[#EAB308] to-[#F5C518] text-[#0D1117] font-medium hover:opacity-95"
              >
                {demoSubmitting ? "Submitting…" : "Request demo access"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
