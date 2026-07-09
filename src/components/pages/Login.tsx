import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import {
  projectId,
  publicAnonKey,
  supabaseUrl,
} from "../../utils/supabase/info";
import logoImage from "figma:asset/6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe.png";

interface LoginProps {
  /** Real Supabase sign-in. Resolves to an error message, or null on success. */
  onLogin: (email: string, password: string) => Promise<string | null>;
  onNavigateToSignup: () => void;
}

export function Login({
  onLogin,
  onNavigateToSignup,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoMode = async () => {
    // Signs into the seeded demo account (created by the seed script).
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
    // Success: the auth handler navigates to the app.
    toast.success("Welcome back to FabricXAI!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-[#57ACAF]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center space-y-8 px-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14">
                <img
                  src="/assets/fabricxai-logo-dark.png"
                  alt="fabricXai"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl text-white tracking-tight">
                fabricXai
              </h1>
              <p className="text-sm text-[#6F83A7]">
                Garments Intelligent Platform
              </p>
            </div>
          </div>

          {/* Value propositions */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl text-white mb-3">
                Transform Your Garment Business with{" "}
                <span className="bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                  AI Agents
                </span>
              </h2>
              <p className="text-[#6F83A7] text-lg leading-relaxed">
                Unlock end-to-end visibility and intelligent
                automation with fabricXai's autonomous
                agents—working together to streamline
                merchandising, production, sourcing, and sample
                tracking so your entire operation runs smarter,
                faster, and with complete control.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                {
                  icon: Building2,
                  text: "Autonomous Production Coordination",
                },
                {
                  icon: Sparkles,
                  text: "AI-Driven Insights & Decision Automation",
                },
                {
                  icon: ArrowRight,
                  text: "14 Integrated Agent-Enabled Modules",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-8 lg:p-10">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#EAB308] flex items-center justify-center shadow-lg shadow-[#57ACAF]/20 p-2">
                <img
                  src="/assets/fabricxai-logo-dark.png"
                  alt="fabricXai"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl text-white tracking-tight">
                  fabricXai
                </h1>
                <p className="text-xs text-[#6F83A7]">
                  Garments Intelligent Platform
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-[#6F83A7]">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-white/90"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-white/90"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="pl-11 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
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
                    className="text-sm text-[#57ACAF] hover:text-[#57ACAF]/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 transition-all duration-180"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-4 text-[#6F83A7]">
                    Or try without account
                  </span>
                </div>
              </div>

              {/* Demo Mode Button */}
              <Button
                type="button"
                onClick={handleDemoMode}
                className="w-full h-12 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20 transition-all duration-180"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Demo Mode
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-4 text-[#6F83A7]">
                    New to fabricXai?
                  </span>
                </div>
              </div>

              {/* Sign up link */}
              <Button
                type="button"
                onClick={onNavigateToSignup}
                variant="outline"
                className="w-full h-12 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] transition-all duration-180"
              >
                Create an Account
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#6F83A7]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Secure Login</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#57ACAF]" />
              <span>SOC 2 Certified</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}