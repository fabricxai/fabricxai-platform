'use client';

import { useRouter } from 'next/navigation';
import { Login } from '@/components/pages/Login';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        return 'Please confirm your email first — check your inbox for the link.';
      }
      return error.message;
    }
    const redirect =
      new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
    router.replace(redirect);
    router.refresh();
    return null;
  };

  return (
    <Login onLogin={handleLogin} onNavigateToSignup={() => router.push('/signup')} />
  );
}
