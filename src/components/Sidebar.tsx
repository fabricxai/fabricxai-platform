import image_e60a26e7718629a129c4e7a854b1f876925c041e from 'figma:asset/e60a26e7718629a129c4e7a854b1f876925c041e.png';
import image_37c5cc972080f780d91709f9ee5699e2549830d5 from 'figma:asset/37c5cc972080f780d91709f9ee5699e2549830d5.png';
import { 
  Users, TrendingUp, Package, DollarSign, Leaf, Settings as SettingsIcon,
  FileText, Calculator, Factory, ClipboardCheck, Truck, ChevronLeft, ChevronRight,
  LogOut, User, CheckCircle, Contact, Shield, ChevronDown, ChevronUp,
  BarChart3, Send, Mail, FolderOpen, BookOpen, Clipboard, Globe, Sparkles,
  CreditCard, Wallet, CircleDollarSign, PiggyBank, Receipt, Ship, Navigation,
  AlertTriangle, MessageSquare, Calendar, Layers, Award, Recycle, Wrench, Activity,
  Box, ArrowDownUp, ClipboardList, PackageSearch, RefreshCw, Building2, Image
} from 'lucide-react';
import { cn } from './ui/utils';
import { useState } from 'react';
import logoImage from 'figma:asset/e5bbcfaaf08b208473c04b5ae611365f951076ab.png';
import logoCollapsed from 'figma:asset/6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe.png';
import homeIcon from 'figma:asset/a0fd1a064dcc12c2e2c75b6ea79e51d94e7b9c31.png';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationGroups = [
  {
    title: 'CRM & Sales',
    items: [
      { 
        id: 'lead-management', 
        label: 'Lead Management', 
        icon: Users,
        subPages: [
          { id: 'lead-management-intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'lead-management/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'lead-management/campaigns', label: 'Campaigns', icon: Send },
          { id: 'lead-management/lead-inbox', label: 'Lead Inbox', icon: Mail },
          { id: 'lead-management/directory', label: 'Directory', icon: FolderOpen },
          { id: 'lead-management/analytics', label: 'Analytics', icon: TrendingUp },
        ]
      },
      { 
        id: 'buyer-management', 
        label: 'Buyer Management', 
        icon: TrendingUp,
        subPages: [
          { id: 'modules/buyer-management/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'buyer-management/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'buyer-management/buyer-directory', label: 'Buyer Directory', icon: Users },
          { id: 'buyer-management/feedback-issues', label: 'Feedback & Issues', icon: MessageSquare },
        ]
      },
    ]
  },
  {
    title: 'Production & Supply Chain',
    items: [
      { 
        id: 'supplier-evaluation', 
        label: 'Supplier Evaluation', 
        icon: Package,
        subPages: [
          { id: 'modules/supplier-evaluation/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'supplier-evaluation/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'supplier-evaluation/supplier-directory', label: 'Supplier Directory', icon: Users },
          { id: 'supplier-evaluation/rfq-board', label: 'RFQ Board', icon: Send },
          { id: 'supplier-evaluation/samples', label: 'Samples', icon: Package },
        ]
      },
      { 
        id: 'rfq-quotation', 
        label: 'RFQ & Quotation', 
        icon: FileText,
        subPages: [
          { id: 'modules/rfq-quotation/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'rfq-quotation/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'rfq-quotation/rfq-inbox', label: 'RFQ Inbox', icon: FileText },
          { id: 'rfq-quotation/quotation-builder', label: 'Quotation Builder', icon: Calculator },
          { id: 'rfq-quotation/clarification-tracker', label: 'Clarification Tracker', icon: MessageSquare },
        ]
      },
      { 
        id: 'costing', 
        label: 'Costing', 
        icon: Calculator,
        subPages: [
          { id: 'modules/costing/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'costing/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'costing/cost-sheet-list', label: 'Cost Sheet List', icon: FileText },
          { id: 'costing/scenarios', label: 'Scenarios', icon: Layers },
          { id: 'costing/benchmarks', label: 'Benchmarks', icon: Award },
        ]
      },
      { 
        id: 'production-planning', 
        label: 'Production Planning', 
        icon: Factory,
        subPages: [
          { id: 'modules/production-planning/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'production-planning/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'production-planning/master-plan', label: 'Master Plan (Gantt)', icon: Calendar },
          { id: 'production-planning/line-allocation', label: 'Line Allocation', icon: Factory },
          { id: 'production-planning/ta-calendar', label: 'T&A Calendar', icon: Calendar },
          { id: 'production-planning/materials-shortages', label: 'Materials & Shortages', icon: Package },
          { id: 'production-planning/risk-ai', label: 'Risk & AI', icon: AlertTriangle },
        ]
      },
      { 
        id: 'workforce-management', 
        label: 'Workforce Management', 
        icon: Users,
        subPages: [
          { id: 'modules/workforce-management/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'workforce-management/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'workforce-management/roster-profiles', label: 'Roster & Profiles', icon: Users },
          { id: 'workforce-management/attendance-leave', label: 'Attendance & Leave', icon: Calendar },
          { id: 'workforce-management/skill-matrix', label: 'Skill Matrix', icon: Award },
          { id: 'workforce-management/training-assessments', label: 'Training & Assessments', icon: BookOpen },
          { id: 'workforce-management/welfare-safety', label: 'Welfare & Safety', icon: Shield },
        ]
      },
      { 
        id: 'machine-maintenance', 
        label: 'Machine Maintenance', 
        icon: Wrench,
        subPages: [
          { id: 'modules/machine-maintenance/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'machine-maintenance/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'machine-maintenance/machine-directory', label: 'Machine Directory', icon: SettingsIcon },
          { id: 'machine-maintenance/maintenance-planner', label: 'Maintenance Planner', icon: Calendar },
          { id: 'machine-maintenance/breakdowns', label: 'Breakdown & Repairs', icon: AlertTriangle },
          { id: 'machine-maintenance/spare-parts', label: 'Spare Parts', icon: Package },
          { id: 'machine-maintenance/ai-predictive', label: 'AI Predictive', icon: Activity },
        ]
      },
      { 
        id: 'inventory-management', 
        label: 'Inventory Management', 
        icon: Box,
        subPages: [
          { id: 'modules/inventory-management/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'inventory-management/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'inventory-management/material-master', label: 'Material Master', icon: PackageSearch },
          { id: 'inventory-management/stock-ledger', label: 'Stock Ledger', icon: ArrowDownUp },
          { id: 'inventory-management/warehouse', label: 'Warehouse & Location', icon: Box },
          { id: 'inventory-management/material-requests', label: 'Material Requests', icon: ClipboardList },
          { id: 'inventory-management/finished-goods', label: 'Finished Goods', icon: Package },
          { id: 'inventory-management/reorder-forecasting', label: 'Reorder & Forecasting', icon: RefreshCw },
        ]
      },
      { 
        id: 'quality-control', 
        label: 'Quality Control', 
        icon: ClipboardCheck,
        subPages: [
          { id: 'modules/quality-control/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'quality-control/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'quality-control/inline-qc', label: 'Inline QC', icon: ClipboardCheck },
          { id: 'quality-control/final-qc', label: 'Final QC & AQL', icon: CheckCircle },
          { id: 'quality-control/lab-tests', label: 'Lab Tests', icon: Sparkles },
          { id: 'quality-control/capa', label: 'CAPA', icon: AlertTriangle },
          { id: 'quality-control/standards', label: 'Standards', icon: BookOpen },
        ]
      },
      { 
        id: 'shipment', 
        label: 'Shipment', 
        icon: Truck,
        subPages: [
          { id: 'modules/shipment/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'shipment/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'shipment/booking-manager', label: 'Booking Manager', icon: Calendar },
          { id: 'shipment/live-tracking', label: 'Live Tracking', icon: Navigation },
          { id: 'shipment/document-vault', label: 'Document Vault', icon: FileText },
          { id: 'shipment/buyer-updates', label: 'Buyer Updates', icon: MessageSquare },
          { id: 'shipment/exceptions', label: 'Exceptions', icon: AlertTriangle },
        ]
      },
    ]
  },
  {
    title: 'Financial & Compliance',
    items: [
      { 
        id: 'finance', 
        label: 'Finance', 
        icon: DollarSign,
        subPages: [
          { id: 'modules/finance/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'finance/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'finance/accounts-receivable', label: 'Accounts Receivable', icon: CreditCard },
          { id: 'finance/accounts-payable', label: 'Accounts Payable', icon: Wallet },
          { id: 'finance/order-pl', label: 'Order P&L', icon: TrendingUp },
          { id: 'finance/cash-flow', label: 'Cash Flow', icon: CircleDollarSign },
          { id: 'finance/banking-lc', label: 'Banking & LC', icon: PiggyBank },
        ]
      },
      { 
        id: 'compliance-policy', 
        label: 'Compliance & Policy', 
        icon: Shield,
        subPages: [
          { id: 'modules/compliance-policy/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'compliance-policy/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'compliance-policy/policy-library', label: 'Policy Library', icon: BookOpen },
          { id: 'compliance-policy/audits', label: 'Audits', icon: Clipboard },
          { id: 'compliance-policy/regulatory-monitor', label: 'Regulatory Monitor', icon: Globe },
        ]
      },
    ]
  },
  {
    title: 'Sustainability',
    items: [
      { 
        id: 'sustainability', 
        label: 'Sustainability', 
        icon: Leaf,
        subPages: [
          { id: 'modules/sustainability/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'sustainability/dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'sustainability/environmental', label: 'Environmental', icon: Leaf },
          { id: 'sustainability/social', label: 'Social', icon: Users },
          { id: 'sustainability/governance', label: 'Governance', icon: Shield },
          { id: 'sustainability/waste-materials', label: 'Waste & Materials', icon: Recycle },
          { id: 'sustainability/footprint-dpp', label: 'Footprint & DPP', icon: FileText },
        ]
      },
    ]
  },
  {
    title: 'Analytics & Insights',
    items: [
      { 
        id: 'analytics', 
        label: 'Analytics & Reporting', 
        icon: BarChart3,
        subPages: [
          { id: 'modules/analytics/intro', label: '🚀 Module Setup', icon: Sparkles },
          { id: 'analytics/role-dashboards', label: 'Role Dashboards', icon: Users },
          { id: 'analytics/explainers', label: 'Explainers', icon: Sparkles },
          { id: 'analytics/reports-library', label: 'Reports Library', icon: FileText },
          { id: 'analytics/scheduled-reports', label: 'Scheduled Reports', icon: Calendar },
        ]
      },
    ]
  },
];

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (itemId: string, subPages?: any[]) => {
    if (currentPage === itemId) return true;
    if (subPages) {
      return subPages.some(sub => currentPage === sub.id);
    }
    return false;
  };

  return (
    <div 
      className={cn(
        "bg-[#0D1117] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <img
              src="/assets/fabricxai-logo-dark.png"
              alt="fabricXai"
              className="h-8 w-auto object-contain"
            />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          {isCollapsed ? (
            <img 
              src={logoCollapsed} 
              alt="Expand" 
              className="w-5 h-5 object-contain"
            />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#6F83A7]" />
          )}
        </button>
      </div>

      {/* Dashboard Link */}
      <div className="px-3 py-4 border-b border-white/5 space-y-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            currentPage === 'dashboard' 
              ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]" 
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
          )}
        >
          <img src={image_e60a26e7718629a129c4e7a854b1f876925c041e} alt="Home" className="w-5 h-5 flex-shrink-0 object-contain" />
          {!isCollapsed && <span>Home</span>}
        </button>
        <button
          onClick={() => onNavigate('approve')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            currentPage === 'approve' 
              ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]" 
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
          )}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Approve</span>}
        </button>
        <button
          onClick={() => onNavigate('contacts')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            currentPage === 'contacts' 
              ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]" 
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
          )}
        >
          <Contact className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Contacts</span>}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs text-[#6F83A7] uppercase tracking-wide">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasSubPages = item.subPages && item.subPages.length > 0;
                const isExpanded = expandedItems.includes(item.id);
                const isActive = isItemActive(item.id, item.subPages);
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        if (hasSubPages && !isCollapsed) {
                          toggleExpand(item.id);
                        } else if (hasSubPages && isCollapsed) {
                          // Navigate to first sub-page when collapsed
                          onNavigate(item.subPages[0].id);
                        } else {
                          onNavigate(item.id);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
                        isActive
                          ? "bg-[#EAB308]/10 text-[#EAB308] border-b-2 border-[#EAB308]" 
                          : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="text-left flex-1">{item.label}</span>
                          {hasSubPages && (
                            isExpanded ? (
                              <ChevronUp className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 flex-shrink-0" />
                            )
                          )}
                        </>
                      )}
                    </button>
                    
                    {/* Sub Pages */}
                    {hasSubPages && !isCollapsed && isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subPages.map((subPage: any) => {
                          const SubIcon = subPage.icon;
                          return (
                            <button
                              key={subPage.id}
                              onClick={() => onNavigate(subPage.id)}
                              className={cn(
                                "group relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 overflow-hidden",
                                currentPage === subPage.id
                                  ? "bg-gradient-to-r from-[#EAB308]/15 to-[#EAB308]/5 text-[#EAB308] shadow-lg shadow-[#EAB308]/10" 
                                  : "text-[#6F83A7] hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white hover:shadow-md"
                              )}
                            >
                              {/* Active State Glow Effect */}
                              {currentPage === subPage.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#EAB308]/20 via-transparent to-transparent animate-pulse" />
                              )}
                              
                              {/* Active State Left Border Accent */}
                              {currentPage === subPage.id && (
                                <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#EAB308] to-[#EAB308]/50 rounded-r-full" />
                              )}
                              
                              {/* Icon with Animation */}
                              <SubIcon 
                                className={cn(
                                  "w-4 h-4 flex-shrink-0 transition-all duration-300",
                                  currentPage === subPage.id 
                                    ? "scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" 
                                    : "group-hover:scale-110 group-hover:rotate-6"
                                )}
                              />
                              
                              {/* Label */}
                              <span className={cn(
                                "text-left relative z-10 transition-all duration-300",
                                currentPage === subPage.id ? "font-medium" : "group-hover:translate-x-0.5"
                              )}>
                                {subPage.label}
                              </span>
                              
                              {/* Hover Shimmer Effect */}
                              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Company & Settings */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button
          onClick={() => onNavigate('company-profile')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            currentPage === 'company-profile' 
              ? "bg-[#EAB308]/10 text-[#EAB308]" 
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
          )}
        >
          <Building2 className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Company Profile</span>}
        </button>
        
        <button
          onClick={() => onNavigate('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-180",
            currentPage === 'settings' 
              ? "bg-[#EAB308]/10 text-[#EAB308]" 
              : "text-[#6F83A7] hover:bg-white/5 hover:text-white"
          )}
        >
          <SettingsIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {!isCollapsed && (
          <div className="relative pt-8 pb-4 px-4 rounded-2xl bg-gradient-to-br from-[#3A4A6B]/60 to-[#2A3A5A]/60 border border-white/10">
            {/* Avatar positioned at top center, overlapping the edge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A5A7B] to-[#3A4A6B] border-4 border-[#101725] flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-[#A0AEC0]" />
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center mt-2">
              <div className="text-sm text-[#A0B5D0] mb-1">User name</div>
              <div className="text-white mb-3">Designation</div>
            </div>

            {/* Logout icon button */}
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/20 hover:border-[#EF4444]/40 transition-all duration-200 group">
              <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}