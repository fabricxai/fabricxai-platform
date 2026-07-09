'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageSkeleton } from '@/components/PageSkeleton';

import { Dashboard } from '@/components/pages/Dashboard';
import { Approve } from '@/components/pages/Approve';
import { Contacts } from '@/components/pages/Contacts';
import { ModuleSetup } from '@/components/pages/ModuleSetup';
import { ModuleRouter } from '@/components/pages/modules/ModuleRouter';
import { DetailPage } from '@/components/pages/DetailPage';
import { NotFound } from '@/components/pages/NotFound';
import { LeadManagementIntro } from '@/components/pages/LeadManagementIntro';
import { LeadManagementPricing } from '@/components/pages/LeadManagementPricing';
import { LeadManagementOnboarding } from '@/components/pages/LeadManagementOnboarding';
import { ProductionPlanningSetup } from '@/components/pages/modules/ProductionPlanningSetup';
import { LeadManagement } from '@/components/pages/LeadManagement';
import { BuyerManagement } from '@/components/pages/BuyerManagement';
import { SupplierEvaluation } from '@/components/pages/SupplierEvaluation';
import { RFQQuotation } from '@/components/pages/RFQQuotation';
import { Costing } from '@/components/pages/Costing';
import { ProductionPlanning } from '@/components/pages/ProductionPlanning';
import { WorkforceManagement } from '@/components/pages/WorkforceManagement';
import { MachineMaintenance } from '@/components/pages/MachineMaintenance';
import { InventoryManagement } from '@/components/pages/InventoryManagement';
import { QualityControl } from '@/components/pages/QualityControl';
import { Shipment } from '@/components/pages/Shipment';
import { Finance } from '@/components/pages/Finance';
import { CompliancePolicy } from '@/components/pages/CompliancePolicy';
import { Sustainability } from '@/components/pages/Sustainability';
import { Analytics } from '@/components/pages/Analytics';
import { CompanyProfile } from '@/components/pages/CompanyProfile';
import { Settings } from '@/components/pages/Settings';
import { PrivacyPolicy } from '@/components/pages/PrivacyPolicy';
import { TermsOfService } from '@/components/pages/TermsOfService';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function getSubPage(parts: string[]): string {
  return parts.length > 1 ? parts[1] : 'dashboard';
}

function PageContent({ slug }: { slug: string[] }) {
  const router = useRouter();
  const { handleAskMarbim, isAIPanelOpen, setIsAIPanelOpen } = useApp();
  const navigate = (page: string) => router.push(`/${page}`);

  const path = slug.join('/');

  // modules/moduleId/page
  if (path.startsWith('modules')) {
    const parts = slug;
    if (parts.length === 1) {
      return <ModuleSetup onNavigate={navigate} onAskMarbim={handleAskMarbim} />;
    }
    if (parts.length === 3) {
      return (
        <ModuleRouter
          moduleId={parts[1]}
          page={parts[2] as 'intro' | 'pricing' | 'onboarding'}
          onNavigate={navigate}
          onAskMarbim={handleAskMarbim}
        />
      );
    }
  }

  // module/subPage/detail/entryId
  if (path.includes('/detail/')) {
    const parts = slug;
    const module = parts[0];
    const subPage = parts[1];
    const entryId = parts[3];
    return (
      <DetailPage
        module={module}
        subPage={subPage}
        entryId={entryId}
        onBack={() => router.push(`/${module}/${subPage}`)}
        onAskMarbim={handleAskMarbim}
      />
    );
  }

  switch (slug[0]) {
    case undefined:
    case 'dashboard':
      return <Dashboard />;
    case 'modules':
      return <ModuleSetup onNavigate={navigate} onAskMarbim={handleAskMarbim} />;
    case 'approve':
      return <Approve />;
    case 'contacts':
      return <Contacts />;
    case 'lead-management-intro':
      return <LeadManagementIntro onNavigate={navigate} onAskMarbim={handleAskMarbim} />;
    case 'lead-management-pricing':
      return <LeadManagementPricing onNavigate={navigate} onAskMarbim={handleAskMarbim} />;
    case 'lead-management-onboarding':
      return <LeadManagementOnboarding onNavigate={navigate} onAskMarbim={handleAskMarbim} />;
    case 'lead-management':
      return (
        <LeadManagement
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          onNavigateToPage={navigate}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'buyer-management':
      return (
        <BuyerManagement
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          onNavigateToPage={navigate}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'supplier-evaluation':
      return (
        <SupplierEvaluation
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          onOpenAI={() => setIsAIPanelOpen(true)}
          onNavigateToPage={navigate}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'rfq-quotation':
      return (
        <RFQQuotation
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          onOpenAI={() => setIsAIPanelOpen(true)}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'costing':
      return (
        <Costing
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'production-planning':
      if (slug[1] === 'setup') {
        return <ProductionPlanningSetup onNavigate={navigate} onAskMarbim={handleAskMarbim} />;
      }
      return (
        <ProductionPlanning
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'workforce-management':
      return (
        <WorkforceManagement
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'machine-maintenance':
      return (
        <MachineMaintenance
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'inventory-management':
      return (
        <InventoryManagement
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'quality-control':
      return (
        <QualityControl
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'shipment':
      return (
        <Shipment
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'finance':
      return (
        <Finance
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'compliance-policy':
      return (
        <CompliancePolicy
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'sustainability':
      return (
        <Sustainability
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'analytics':
      return (
        <Analytics
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'company-profile':
      return (
        <CompanyProfile
          initialSubPage={getSubPage(slug)}
          onAskMarbim={handleAskMarbim}
          isAIPanelOpen={isAIPanelOpen}
        />
      );
    case 'settings':
      return <Settings />;
    case 'privacy-policy':
      return <PrivacyPolicy onNavigate={navigate} />;
    case 'terms-of-service':
      return <TermsOfService />;
    default:
      return <NotFound onNavigate={navigate} />;
  }
}

export default function CatchAllPage({ params }: PageProps) {
  const { slug = [] } = use(params);
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <PageContent slug={slug} />
      </Suspense>
    </ErrorBoundary>
  );
}
