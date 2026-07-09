import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Building2, User, Phone, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { projectId, publicAnonKey, supabaseUrl } from '../../utils/supabase/info';

interface SignupProps {
  /** Real Supabase sign-up. Resolves to an error message, or null on success. */
  onSignup: (data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    phone: string;
    role: string;
  }) => Promise<string | null>;
  onNavigateToLogin: () => void;
}

export function Signup({ onSignup, onNavigateToLogin }: SignupProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.companyName || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    const error = await onSignup({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      companyName: formData.companyName,
      phone: formData.phone,
      role: formData.role || 'owner',
    });

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }
    // Success: email confirmation sent. The auth handler shows the "check your
    // inbox" screen / navigates. Keep the button disabled meanwhile.
  };

  const features = [
    '14 Integrated Business Modules',
    'AI-Powered Analytics & Insights',
    'Real-time Production Tracking',
    'Advanced Quality Control',
    'Supplier & Buyer Management',
    'Financial Management Suite',
  ];

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
            ease: "easeInOut"
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
            ease: "easeInOut"
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
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#EAB308] flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl text-white tracking-tight">FabricXAI</h1>
              <p className="text-sm text-[#6F83A7]">Garments Intelligent Platform</p>
            </div>
          </div>

          {/* Value propositions */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl text-white mb-3">
                Join the Future of
                <br />
                <span className="bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                  Garment Manufacturing
                </span>
              </h2>
              <p className="text-[#6F83A7] text-lg leading-relaxed">
                Get started with FabricXAI and experience enterprise-grade ERP designed specifically for modern garment businesses.
              </p>
            </div>

            {/* Features checklist */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <div className="w-6 h-6 rounded-md bg-[#57ACAF]/20 border border-[#57ACAF]/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#57ACAF]" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            {[
              { value: 'Free', label: '30-Day Trial' },
              { value: 'No', label: 'Credit Card' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-2xl text-white mb-1">{stat.value}</div>
                <div className="text-xs text-[#6F83A7]">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Signup form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl p-8 lg:p-10">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#EAB308] flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-white tracking-tight">FabricXAI</h1>
                <p className="text-xs text-[#6F83A7]">Garments Intelligent Platform</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl text-white mb-2">Create Account</h2>
                <p className="text-[#6F83A7]">Start your 30-day free trial today</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white/90">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    Business Email <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Company Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white/90">
                      Company Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Acme Garments"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/90">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white/90">Your Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white focus:border-[#57ACAF] focus:ring-[#57ACAF]/20">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2332] border-white/10 text-white">
                      <SelectItem value="owner">Owner / CEO</SelectItem>
                      <SelectItem value="manager">General Manager</SelectItem>
                      <SelectItem value="production">Production Manager</SelectItem>
                      <SelectItem value="sales">Sales Manager</SelectItem>
                      <SelectItem value="finance">Finance Manager</SelectItem>
                      <SelectItem value="procurement">Procurement Manager</SelectItem>
                      <SelectItem value="quality">Quality Manager</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">
                    Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-11 pr-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/90">
                    Confirm Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6F83A7]" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-11 pr-11 h-11 bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#57ACAF] focus:ring-[#57ACAF]/20"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F83A7] hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="border-white/20 data-[state=checked]:bg-[#57ACAF] data-[state=checked]:border-[#57ACAF] mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-white/70 cursor-pointer leading-relaxed"
                  >
                    I agree to the{' '}
                    <button type="button" className="text-[#57ACAF] hover:underline">
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" className="text-[#57ACAF] hover:underline">
                      Privacy Policy
                    </button>
                  </Label>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 transition-all duration-180 mt-6"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
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
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign in link */}
              <Button
                type="button"
                onClick={onNavigateToLogin}
                variant="outline"
                className="w-full h-12 border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)] transition-all duration-180"
              >
                Sign In Instead
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#6F83A7]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>SSL Encrypted</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#57ACAF]" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}