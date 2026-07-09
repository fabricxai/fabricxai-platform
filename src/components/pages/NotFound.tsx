import { Home, ArrowLeft, Search } from 'lucide-react';

interface NotFoundProps {
  onNavigate?: (page: string) => void;
}

export function NotFound({ onNavigate }: NotFoundProps) {
  const handleHome = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    } else {
      window.location.href = '/';
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-140px)] p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#57ACAF]/10 border border-[#57ACAF]/20 flex items-center justify-center">
              <Search className="w-12 h-12 text-[#57ACAF]/60" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#101725] border border-white/10 flex items-center justify-center">
              <span className="text-white/40 text-xs font-bold">?</span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <span className="text-6xl font-bold text-white/10 select-none">404</span>
        </div>

        <h1 className="text-xl font-semibold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Try navigating from the sidebar menu.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={handleHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#57ACAF] text-white text-sm font-medium hover:bg-[#57ACAF]/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
