import image_6223326a30b5e1f8adf02be924fdeab053459cce from 'figma:asset/6223326a30b5e1f8adf02be924fdeab053459cce.png';
import newIconBefore from 'figma:asset/a8e2a19c1f1e7d9db4b3ab5b1f98e9c5a8dcd2be.png';
import image_d6b7f80f7693c16e7001d9644e8e69a9830826a2 from 'figma:asset/d6b7f80f7693c16e7001d9644e8e69a9830826a2.png';
import image_f72359dcb24a10e18b3ba63967c6fb99db2e7a10 from 'figma:asset/f72359dcb24a10e18b3ba63967c6fb99db2e7a10.png';
import image_597a6f6fd0bc8e57b8ac3e371a8dbde74b6a3376 from 'figma:asset/597a6f6fd0bc8e57b8ac3e371a8dbde74b6a3376.png';
import image_cf923d4a7d44d6033628185d429d82ed2e981dce from 'figma:asset/cf923d4a7d44d6033628185d429d82ed2e981dce.png';
import image_6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe from 'figma:asset/6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe.png';
import { 
  Search, Bell, Zap, User, Moon, Sun, ChevronDown, Plus, Calendar, 
  AlertCircle, Target, Download, Upload, Shield, FileText, Users,
  Send, Mail, FolderOpen, BarChart3, TrendingUp, Clipboard, DollarSign,
  Navigation, Eye, MessageSquare, Calculator, RefreshCw, CheckCircle,
  Globe, ShoppingBag, ExternalLink, Building2, Package, Truck, Store, Boxes,
  LogOut, Settings as SettingsIcon
} from 'lucide-react';
import { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import marbimImage from 'figma:asset/c71eace56b6821982da9dde651f71e10cdc44ea3.png';
import quickActionIcon from 'figma:asset/31dc010aadfd329b50bb4ba98f777d3d534dbea2.png';
import notificationIcon from 'figma:asset/597a6f6fd0bc8e57b8ac3e371a8dbde74b6a3376.png';
import flagIcon from 'figma:asset/a35b854f5d98c8fe3cc892f6e31e562c8e01b16e.png';
import icon1 from 'figma:asset/e8dadf97e0ab8f9f66c37c69734ae4d5f61a1cbf.png';
import icon2 from 'figma:asset/85e66e6fc21f06c64b3ef63bf38bcadc72c6bbfb.png';
import { toast } from 'sonner';

interface TopBarProps {
  onOpenAIPanel: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  user?: { name: string; email: string; company: string; role: string };
  onLogout?: () => void;
}

export function TopBar({ onOpenAIPanel, currentPage = 'dashboard', onNavigate, user, onLogout }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPortals, setShowPortals] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);

  const notifications = [
    { id: 1, text: 'New lead from ABC Corp', time: '2m ago', unread: true },
    { id: 2, text: 'Supplier audit due tomorrow', time: '1h ago', unread: true },
    { id: 3, text: 'Production delay alert', time: '3h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Portal options
  const portals = [
    { 
      id: 1, 
      name: 'Buyer Portal', 
      icon: Building2, 
      description: 'View orders, track shipments, quality reports',
      url: '#',
      color: '#57ACAF'
    },
    { 
      id: 2, 
      name: 'Supplier Portal', 
      icon: Truck, 
      description: 'Manage RFQs, submit quotations, delivery updates',
      url: '#',
      color: '#EAB308'
    },
    { 
      id: 3, 
      name: 'Employee Portal', 
      icon: Users, 
      description: 'Attendance, payroll, training, announcements',
      url: '#',
      color: '#6F83A7'
    },
    { 
      id: 4, 
      name: 'Admin Portal', 
      icon: Shield, 
      description: 'User management, system configuration, audit logs',
      url: '#',
      color: '#D0342C'
    },
  ];

  // Marketplace options
  const marketplaces = [
    { 
      id: 1, 
      name: 'Material Marketplace', 
      icon: Package, 
      description: 'Browse fabrics, trims, accessories from suppliers',
      url: '#',
      color: '#57ACAF'
    },
    { 
      id: 2, 
      name: 'Service Providers', 
      icon: Users, 
      description: 'Find testing labs, freight forwarders, consultants',
      url: '#',
      color: '#EAB308'
    },
    { 
      id: 3, 
      name: 'Equipment Vendors', 
      icon: Boxes, 
      description: 'Machinery, spare parts, maintenance services',
      url: '#',
      color: '#6F83A7'
    },
    { 
      id: 4, 
      name: 'Capacity Exchange', 
      icon: Store, 
      description: 'Buy/sell production capacity, subcontracting',
      url: '#',
      color: '#57ACAF'
    },
  ];

  // Get module-specific search placeholder
  const getSearchPlaceholder = () => {
    const basePage = currentPage.split('/')[0];
    
    const placeholders: Record<string, string> = {
      'lead-management': 'Search leads by name, company, or source...',
      'buyer-management': 'Search buyers by name, tier, or location...',
      'supplier-evaluation': 'Search suppliers by name, material, or region...',
      'rfq-quotation': 'Search RFQs by buyer, style, or status...',
      'costing': 'Search cost sheets by style, buyer, or order...',
      'production-planning': 'Search orders, styles, or production lines...',
      'workforce-management': 'Search workers by name, line, or skill...',
      'quality-control': 'Search inspections by order, defect, or line...',
      'shipment': 'Search shipments by PO, container, or buyer...',
      'finance': 'Search invoices, payments, or transactions...',
      'sustainability': 'Search by metric, facility, or certification...',
      'compliance-policy': 'Search policies, audits, or certificates...',
      'analytics': 'Search reports, dashboards, or metrics...',
      'dashboard': 'Search anything across the platform...',
      'settings': 'Search settings, users, or integrations...',
    };

    return placeholders[basePage] || 'Search...';
  };

  // Get module-specific quick actions
  const getQuickActions = () => {
    const basePage = currentPage.split('/')[0];
    
    switch (basePage) {
      case 'compliance-policy':
        return [
          { label: 'Create New Policy', icon: Plus, action: () => toast.success('Create New Policy clicked') },
          { label: 'Schedule Audit', icon: Calendar, action: () => toast.success('Schedule Audit clicked') },
          { label: 'View Expiring Certs', icon: AlertCircle, action: () => toast.success('View Expiring Certs clicked') },
          { label: 'Assign CAPA', icon: Target, action: () => toast.success('Assign CAPA clicked') },
          { label: 'Generate CoC Pack', icon: Download, action: () => toast.success('Generate CoC Pack clicked') },
          { label: 'Upload Evidence', icon: Upload, action: () => toast.success('Upload Evidence clicked') },
        ];
      case 'lead-management':
        return [
          { label: 'Add Lead', icon: Plus, action: () => toast.success('Add Lead clicked') },
          { label: 'Start Campaign', icon: Send, action: () => toast.success('Starting Campaign') },
          { label: 'Assign Owner', icon: Users, action: () => toast.success('Assign Owner clicked') },
          { label: 'Send Follow-up', icon: Mail, action: () => toast.success('Send Follow-up clicked') },
          { label: 'Generate Lead Report', icon: BarChart3, action: () => toast.success('Generating Lead Report') },
        ];
      case 'buyer-management':
        return [
          { label: 'Add Buyer', icon: Plus, action: () => toast.success('Add Buyer clicked') },
          { label: 'Upload Certificate', icon: Upload, action: () => toast.success('Upload Certificate clicked') },
          { label: 'Schedule Meeting', icon: Calendar, action: () => toast.success('Schedule Meeting clicked') },
          { label: 'Generate Buyer Summary', icon: FileText, action: () => toast.success('Generate Buyer Summary clicked') },
          { label: 'Escalate Issue', icon: AlertCircle, action: () => toast.success('Escalate Issue clicked') },
        ];
      case 'supplier-evaluation':
        return [
          { label: 'Add Supplier', icon: Plus, action: () => toast.success('Add Supplier clicked') },
          { label: 'Broadcast RFQ', icon: Send, action: () => toast.success('Broadcasting RFQ') },
          { label: 'Compare Quotes', icon: BarChart3, action: () => toast.success('Opening Quote Comparison') },
          { label: 'Upload Certificate', icon: Upload, action: () => toast.success('Upload Certificate clicked') },
          { label: 'View Audit History', icon: FileText, action: () => toast.success('Opening Audit History') },
        ];
      case 'rfq-quotation':
        return [
          { label: 'Upload RFQ', icon: Upload, action: () => toast.success('Upload RFQ clicked') },
          { label: 'Draft Clarification', icon: MessageSquare, action: () => toast.success('Draft Clarification clicked') },
          { label: 'Build Quote', icon: Calculator, action: () => toast.success('Build Quote clicked') },
          { label: 'Generate OC', icon: FileText, action: () => toast.success('Generate OC clicked') },
          { label: 'View Win-Loss Report', icon: BarChart3, action: () => toast.success('Opening Win-Loss Report') },
        ];
      case 'costing':
        return [
          { label: 'Create New Cost Sheet', icon: Plus, action: () => toast.success('Create New Cost Sheet clicked') },
          { label: 'Refresh Vendor Prices', icon: Download, action: () => toast.success('Refreshing Vendor Prices') },
          { label: 'Run Scenario Comparison', icon: BarChart3, action: () => toast.success('Running Scenario Comparison') },
          { label: 'Escalate Low Margin', icon: AlertCircle, action: () => toast.warning('Escalating Low Margin Issue') },
          { label: 'Export Cost Report', icon: Download, action: () => toast.success('Exporting Cost Report') },
        ];
      case 'production-planning':
        return [
          { label: 'Create Plan', icon: Plus, action: () => toast.success('Create Plan clicked') },
          { label: 'Recalculate Capacity', icon: BarChart3, action: () => toast.success('Recalculating Capacity') },
          { label: 'Expedite Material', icon: Zap, action: () => toast.success('Expediting Material') },
          { label: 'Reassign Order', icon: RefreshCw, action: () => toast.success('Reassigning Order') },
          { label: 'View Delay Risks', icon: AlertCircle, action: () => toast.warning('Opening Delay Risk Report') },
        ];
      case 'supplier-evaluation':
        return [
          { label: 'Add New Supplier', icon: Plus, action: () => toast.success('Add New Supplier clicked') },
          { label: 'Schedule Audit', icon: Calendar, action: () => toast.success('Schedule Audit clicked') },
          { label: 'Upload Documents', icon: Upload, action: () => toast.success('Upload Documents clicked') },
          { label: 'Generate Report', icon: Download, action: () => toast.success('Generate Report clicked') },
        ];
      case 'finance':
        return [
          { label: 'Upload Invoice', icon: Upload, action: () => toast.success('Upload Invoice clicked') },
          { label: 'Run Forecast', icon: TrendingUp, action: () => toast.success('Run Forecast clicked') },
          { label: 'Generate P&L', icon: BarChart3, action: () => toast.success('Generate P&L clicked') },
          { label: 'Approve LC Document', icon: FileText, action: () => toast.success('Approve LC Document clicked') },
        ];
      case 'quality-control':
        return [
          { label: 'New Inspection', icon: Plus, action: () => toast.success('New Inspection clicked') },
          { label: 'Upload Lab Report', icon: Upload, action: () => toast.success('Upload Lab Report clicked') },
          { label: 'Generate Buyer Pack', icon: Download, action: () => toast.success('Generate Buyer Pack clicked') },
          { label: 'Assign CAPA', icon: Target, action: () => toast.success('Assign CAPA clicked') },
          { label: 'Schedule Training', icon: Calendar, action: () => toast.success('Schedule Training clicked') },
        ];
      case 'shipment':
        return [
          { label: 'Create Booking', icon: Plus, action: () => toast.success('Create Booking clicked') },
          { label: 'Upload Invoice Pack', icon: Upload, action: () => toast.success('Upload Invoice Pack clicked') },
          { label: 'Track Container', icon: Navigation, action: () => toast.success('Track Container clicked') },
          { label: 'Generate Buyer Update', icon: MessageSquare, action: () => toast.success('Generate Buyer Update clicked') },
          { label: 'View Exceptions', icon: Eye, action: () => toast.success('View Exceptions clicked') },
        ];
      case 'sustainability':
        return [
          { label: 'Upload ESG Data', icon: Upload, action: () => toast.success('Uploading ESG Data') },
          { label: 'Generate DPP', icon: Download, action: () => toast.success('Generating DPP') },
          { label: 'Create CAPA', icon: Plus, action: () => toast.success('Creating CAPA') },
          { label: 'Run Emission Audit', icon: BarChart3, action: () => toast.success('Running Emission Audit') },
          { label: 'Notify Buyer', icon: Send, action: () => toast.success('Notifying Buyer') },
        ];
      case 'workforce-management':
        return [
          { label: 'Add Worker', icon: Users, action: () => toast.success('Adding Worker') },
          { label: 'Generate Shift', icon: Calendar, action: () => toast.success('Generating Shift') },
          { label: 'Approve Leave', icon: CheckCircle, action: () => toast.success('Approving Leave') },
          { label: 'Assign Training', icon: Target, action: () => toast.success('Assigning Training') },
          { label: 'View Skill Matrix', icon: BarChart3, action: () => toast.success('Viewing Skill Matrix') },
        ];
      default:
        return [
          { label: 'Create New', icon: Plus, action: () => toast.success('Create New clicked') },
          { label: 'Upload File', icon: Upload, action: () => toast.success('Upload File clicked') },
          { label: 'Generate Report', icon: Download, action: () => toast.success('Generate Report clicked') },
        ];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="h-16 border-b border-white/5 bg-[#0D1117]/50 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Search and Quick Actions */}
      <div className="flex items-center gap-3 flex-1 max-w-3xl">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F83A7]" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              className="w-full bg-[#1C2333] border border-white/10 rounded-full pl-11 pr-20 py-2.5 text-sm text-white placeholder:text-[#6F83A7] focus:outline-none focus:border-[#EAB308]/50 transition-colors"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-[#6F83A7]">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-0 bg-transparent border-0 cursor-pointer transition-all duration-180 group">
              <img 
                src={quickActionIcon} 
                alt="Quick Action" 
                className="w-10 h-10 object-contain transition-transform duration-180 group-hover:scale-110"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-[#0D1117] border-white/10">
            <DropdownMenuLabel className="text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#EAB308]" />
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem 
                  key={index}
                  onClick={action.action}
                  className="flex items-center gap-3 p-3 focus:bg-white/5 cursor-pointer text-[#6F83A7] hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#EAB308]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#EAB308]" />
                  </div>
                  <span className="text-sm">{action.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 ml-8">
        {/* Home Button */}
        <button 
          onClick={() => onNavigate?.('dashboard')}
          className="p-0 bg-transparent border-0 cursor-pointer transition-all duration-180 hover:scale-110"
          title="Go to Home"
        >
          <img 
            src={image_6223326a30b5e1f8adf02be924fdeab053459cce} 
            alt="Home" 
            className="w-6 h-6 object-contain"
          />
        </button>

        {/* Portal Dropdown */}
        <DropdownMenu open={showPortals} onOpenChange={setShowPortals}>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-2 rounded-lg bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 hover:from-[#57ACAF]/20 hover:to-[#57ACAF]/10 transition-all duration-180 group"
              title="Portals"
            >
              <Globe className="w-5 h-5 text-[#57ACAF] transition-transform duration-180 group-hover:rotate-12" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-80 bg-gradient-to-br from-[#101725] to-[#182336] border-white/10 shadow-2xl"
          >
            <DropdownMenuLabel className="text-white px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#57ACAF]" />
                <span>Access Portals</span>
              </div>
            </DropdownMenuLabel>
            <div className="p-2">
              {portals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <button
                    key={portal.id}
                    onClick={() => {
                      toast.success(`Opening ${portal.name}...`);
                      setShowPortals(false);
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-180 group cursor-pointer border-0 bg-transparent text-left"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-180 group-hover:scale-110"
                      style={{ 
                        background: `linear-gradient(to bottom right, ${portal.color}20, ${portal.color}10)`,
                        border: `1px solid ${portal.color}30`
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: portal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{portal.name}</span>
                        <ExternalLink className="w-3 h-3 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-[#6F83A7] mt-0.5 line-clamp-1">{portal.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Marketplace Dropdown */}
        <DropdownMenu open={showMarketplace} onOpenChange={setShowMarketplace}>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-2 rounded-lg bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 hover:from-[#EAB308]/20 hover:to-[#EAB308]/10 transition-all duration-180 group"
              title="Marketplace"
            >
              <ShoppingBag className="w-5 h-5 text-[#EAB308] transition-transform duration-180 group-hover:scale-110" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-80 bg-gradient-to-br from-[#101725] to-[#182336] border-white/10 shadow-2xl"
          >
            <DropdownMenuLabel className="text-white px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#EAB308]" />
                <span>Marketplace</span>
              </div>
            </DropdownMenuLabel>
            <div className="p-2">
              {marketplaces.map((marketplace) => {
                const Icon = marketplace.icon;
                return (
                  <button
                    key={marketplace.id}
                    onClick={() => {
                      toast.success(`Opening ${marketplace.name}...`);
                      setShowMarketplace(false);
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-180 group cursor-pointer border-0 bg-transparent text-left"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-180 group-hover:scale-110"
                      style={{ 
                        background: `linear-gradient(to bottom right, ${marketplace.color}20, ${marketplace.color}10)`,
                        border: `1px solid ${marketplace.color}30`
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: marketplace.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{marketplace.name}</span>
                        <ExternalLink className="w-3 h-3 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-[#6F83A7] mt-0.5 line-clamp-1">{marketplace.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Pending Approvals Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative group hover:scale-105 transition-transform">
              <img 
                src={image_d6b7f80f7693c16e7001d9644e8e69a9830826a2} 
                alt="Pending Approvals" 
                className="w-6 h-6 object-contain"
              />
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center border border-[#182336] shadow-lg">
                <span className="text-[9px] font-bold text-white">3</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[380px] bg-gradient-to-br from-[#101725] to-[#182336] border border-white/10 shadow-2xl p-0 mt-2"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Pending Approvals</h3>
                  <p className="text-xs text-[#6F83A7] mt-0.5">3 items need your attention</p>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                  3
                </Badge>
              </div>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto">
              {/* Approval 1: Purchase Order */}
              <button
                onClick={() => {
                  toast.success('Opening Purchase Order approval...');
                  window.location.href = '/#/approve';
                }}
                className="w-full p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:bg-white/10 transition-all mb-2 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white">Purchase Order #PO-2847</h4>
                      <Badge className="bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 text-xs">
                        High
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6F83A7] mb-2">Raw material procurement - $45,000</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6F83A7]">Requested by: Sarah Chen</span>
                      <span className="text-xs text-[#57ACAF] group-hover:underline">View Details →</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Approval 2: Budget Request */}
              <button
                onClick={() => {
                  toast.success('Opening Budget Request approval...');
                  window.location.href = '/#/approve';
                }}
                className="w-full p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:bg-white/10 transition-all mb-2 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white">Budget Request #BR-1523</h4>
                      <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
                        Medium
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6F83A7] mb-2">Q1 Marketing campaign - $28,500</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6F83A7]">Requested by: Mike Johnson</span>
                      <span className="text-xs text-[#57ACAF] group-hover:underline">View Details →</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Approval 3: Vendor Contract */}
              <button
                onClick={() => {
                  toast.success('Opening Vendor Contract approval...');
                  window.location.href = '/#/approve';
                }}
                className="w-full p-3 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:bg-white/10 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white">Vendor Contract #VC-8471</h4>
                      <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs">
                        Normal
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6F83A7] mb-2">Annual supplier agreement renewal</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6F83A7]">Requested by: David Kumar</span>
                      <span className="text-xs text-[#57ACAF] group-hover:underline">View Details →</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => {
                  window.location.href = '/#/approve';
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white rounded-lg transition-all text-sm font-medium"
              >
                View All Approvals
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings Button */}
        <button 
          onClick={() => onNavigate?.('settings')}
          className="p-0 bg-transparent border-0 cursor-pointer transition-all duration-180 hover:scale-110"
          title="Go to Settings"
        >
          <img 
            src={image_cf923d4a7d44d6033628185d429d82ed2e981dce} 
            alt="Settings" 
            className="w-6 h-6 object-contain"
          />
        </button>

        {/* Notifications Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-0 bg-transparent border-0 cursor-pointer transition-all duration-180 group">
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EAB308] rounded-full flex items-center justify-center z-10 shadow-lg shadow-[#EAB308]/50">
                <span className="text-xs font-bold text-black">5</span>
              </div>
              
              <img 
                src={image_597a6f6fd0bc8e57b8ac3e371a8dbde74b6a3376} 
                alt="Notifications" 
                className="w-10 h-10 object-contain transition-transform duration-180 group-hover:scale-110"
              />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-[420px] bg-gradient-to-br from-[#1a1f2e] to-[#151922] border border-white/20 rounded-xl p-0 shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-base">Notifications</h3>
                <p className="text-xs text-[#6F83A7]">You have 5 unread notifications</p>
              </div>
              <button 
                onClick={() => toast.success('All notifications marked as read')}
                className="text-xs text-[#57ACAF] hover:text-[#57ACAF]/80 transition-colors"
              >
                Mark all read
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[480px] overflow-y-auto">
              {/* Notification 1 - New RFQ */}
              <div className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1">New RFQ Received</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">H&M submitted RFQ-2025-1842 for Spring Collection</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F83A7]">2 minutes ago</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening RFQ details...');
                        }}
                        className="text-xs text-[#57ACAF] hover:underline"
                      >
                        View RFQ
                      </button>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#EAB308] flex-shrink-0 mt-1"></div>
                </div>
              </div>

              {/* Notification 2 - Payment Reminder */}
              <div className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1">Payment Overdue</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">Invoice #2847 from Zara is 5 days overdue ($45,230)</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F83A7]">1 hour ago</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening invoice...');
                        }}
                        className="text-xs text-[#EAB308] hover:underline"
                      >
                        View Invoice
                      </button>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#EAB308] flex-shrink-0 mt-1"></div>
                </div>
              </div>

              {/* Notification 3 - Quality Alert */}
              <div className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1">Quality Issue Detected</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">Production Line 3 - Defect rate exceeded threshold (4.2%)</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F83A7]">3 hours ago</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening quality report...');
                        }}
                        className="text-xs text-red-400 hover:underline"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#EAB308] flex-shrink-0 mt-1"></div>
                </div>
              </div>

              {/* Notification 4 - Sample Approved */}
              <div className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1">Sample Approved</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">Uniqlo approved sample SMP-2847 - Ready for production</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F83A7]">5 hours ago</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening sample details...');
                        }}
                        className="text-xs text-green-400 hover:underline"
                      >
                        Start Production
                      </button>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#EAB308] flex-shrink-0 mt-1"></div>
                </div>
              </div>

              {/* Notification 5 - Machine Maintenance */}
              <div className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1">Maintenance Required</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">Machine M-847 requires scheduled maintenance in 2 days</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F83A7]">1 day ago</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening maintenance schedule...');
                        }}
                        className="text-xs text-orange-400 hover:underline"
                      >
                        Schedule Now
                      </button>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#EAB308] flex-shrink-0 mt-1"></div>
                </div>
              </div>

              {/* Notification 6 - Low Stock Alert (read) */}
              <div className="px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer group opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1">Low Stock Alert</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">Cotton fabric stock below threshold (230 yards remaining)</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F83A7]">2 days ago</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening inventory...');
                        }}
                        className="text-xs text-[#6F83A7] hover:underline"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification 7 - Shipment Delayed (read) */}
              <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer group opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-[#6F83A7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm mb-1">Shipment Delayed</h4>
                    <p className="text-xs text-[#6F83A7] mb-2">Order #9284 shipment delayed by 3 days due to customs</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6F83A7]">3 days ago</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Opening shipment tracking...');
                        }}
                        className="text-xs text-[#6F83A7] hover:underline"
                      >
                        Track Shipment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/10">
              <button 
                onClick={() => toast.info('Opening all notifications...')}
                className="w-full text-center text-sm text-[#57ACAF] hover:text-[#57ACAF]/80 transition-colors font-medium"
              >
                View All Notifications
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Separator */}
        <div className="h-8 w-px bg-white/10"></div>

        {/* AI Assistant Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIPanel}
            className="relative p-2 rounded-lg hover:bg-white/5 transition-all duration-180 group"
            title="Marbim AI Assistant"
          >
            <img 
              src={image_6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe} 
              alt="Marbim AI" 
              className="w-8 h-8 object-contain transition-transform duration-180 group-hover:scale-110"
            />
          </button>
          <span className="text-white font-medium">MARBIM</span>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-white/10"></div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all duration-180">
              <img 
                src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NjE1MDY1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" 
              />
              <span className="text-white font-medium">{user?.name || 'User'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-[#0D1117] border-white/10">
            <DropdownMenuLabel className="text-white">
              <div>
                <div className="font-medium">{user?.name || 'User'}</div>
                <div className="text-xs text-[#6F83A7] font-normal mt-0.5">{user?.email || 'user@company.com'}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20 text-xs capitalize">
                    {user?.role || 'User'}
                  </Badge>
                  <span className="text-xs text-[#6F83A7]">{user?.company || 'Company'}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={() => onNavigate?.('settings')}
              className="text-[#6F83A7] focus:bg-white/5 focus:text-white cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#6F83A7] focus:bg-white/5 focus:text-white cursor-pointer">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={onLogout}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}