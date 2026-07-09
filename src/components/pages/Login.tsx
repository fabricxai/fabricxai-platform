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
import { toast } from "sonner";

interface LoginProps {
  /** Real Supabase sign-in. Resolves to an error message, or null on success. */
  onLogin: (email: string, password: string) => Promise<string | null>;
  onNavigateToSignup: () => void;
}

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

  const handleDemoMode = async () => {
    setIsLoading(true);
    const error = await onLogin("demo@fabricxai.com", "demo1234");
    if (error) {
      toast.error("Demo account not available yet — please sign up.");
      setIsLoading(false);
      return;
    }
    toast.success("Welcome to the FabricXAI demo!");
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
                onClick={handleDemoMode}
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
                className="h-11 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
              >
                <span className="mr-2 font-semibold text-[#EA4335]">G</span>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info("LinkedIn sign-in coming soon.")}
                className="h-11 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
              >
                <span className="mr-2 font-semibold text-[#0A66C2]">in</span>
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
              onClick={handleDemoMode}
              disabled={isLoading}
              className="w-full h-11 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
            >
              <Rocket className="w-4 h-4 mr-2 text-[#EAB308]" />
              Request demo access (email credentials)
            </Button>

            <p className="mt-5 text-center text-xs text-[#6F83A7]">
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
    </div>
  );
}
