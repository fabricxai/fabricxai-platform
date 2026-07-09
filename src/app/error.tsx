'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. You can try refreshing or go back to the dashboard.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-8 text-left bg-[#0D1117] border border-white/10 rounded-xl p-4">
            <summary className="text-sm text-red-400 cursor-pointer font-mono">{error.message}</summary>
            <pre className="text-xs text-gray-500 overflow-auto max-h-40 mt-2 font-mono">{error.stack}</pre>
          </details>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#57ACAF] text-white text-sm font-medium hover:bg-[#57ACAF]/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
