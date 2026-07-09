'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { Toaster } from '@/components/ui/sonner';
import { PageSkeleton } from '@/components/PageSkeleton';

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = pathname.replace(/^\//, ''); // strip leading /
  const {
    user,
    isAuthChecked,
    isAIPanelOpen,
    setIsAIPanelOpen,
    aiPanelPrompt,
    setAIPanelPrompt,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    handleAskMarbim,
    handleLogout,
  } = useApp();

  useEffect(() => {
    if (isAuthChecked && !user) {
      router.replace('/login');
    }
  }, [isAuthChecked, user, router]);

  if (!isAuthChecked || !user) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#101725] to-[#182336] overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => router.push(`/${page}`)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginRight: isAIPanelOpen ? '680px' : '0' }}
      >
        <TopBar
          onOpenAIPanel={() => setIsAIPanelOpen(true)}
          currentPage={currentPage}
          onNavigate={(page) => router.push(`/${page}`)}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto custom-scrollbar">
          {children}
        </main>

        <footer className="border-t border-white/5 bg-[#0D1117]/50 backdrop-blur-sm px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>© 2025 FabricXAI. All rights reserved.</span>
              <span className="hidden sm:inline text-gray-600">|</span>
              <span className="hidden sm:inline">Garments Intelligent Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/privacy-policy')}
                className="hover:text-[#57ACAF] transition-colors duration-180"
              >
                Privacy Policy
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={() => router.push('/terms-of-service')}
                className="hover:text-[#57ACAF] transition-colors duration-180"
              >
                Terms of Service
              </button>
              <span className="text-gray-600">|</span>
              <button className="hover:text-[#57ACAF] transition-colors duration-180">
                Contact Support
              </button>
            </div>
          </div>
        </footer>
      </div>

      <AIAssistantPanel
        isOpen={isAIPanelOpen}
        onClose={() => {
          setIsAIPanelOpen(false);
          setAIPanelPrompt(undefined);
        }}
        initialPrompt={aiPanelPrompt}
        currentModule={currentPage.split('/')[0]}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
