'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { Signup } from '@/components/pages/Signup';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSignup = async (data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    phone: string;
    role: string;
  }): Promise<string | null> => {
    const emailRedirectTo = `${window.location.origin}/auth/confirm`;
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo,
        data: {
          full_name: data.fullName,
          company_name: data.companyName,
          phone: data.phone,
          role: data.role,
        },
      },
    });
    if (error) return error.message;
    setSentTo(data.email);
    return null;
  };

  if (sentTo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#57ACAF]/15">
            <MailCheck className="h-8 w-8 text-[#57ACAF]" />
          </div>
          <h1 className="text-xl font-semibold text-white">Confirm your email</h1>
          <p className="mt-3 text-sm text-[#6F83A7]">
            We sent a confirmation link to{' '}
            <span className="text-white">{sentTo}</span>. Click it to activate your
            account, then sign in.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="mt-6 w-full h-11 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
          <p className="mt-4 text-xs text-[#6F83A7]">
            Didn&apos;t get it? Check spam, or wait a minute and try signing in to
            resend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Signup onSignup={handleSignup} onNavigateToLogin={() => router.push('/login')} />
  );
}
