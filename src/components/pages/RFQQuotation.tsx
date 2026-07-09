import { useState, useEffect } from 'react';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer, DetailDrawerData } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { MarbimAIButton } from '../MarbimAIButton';
import { ModuleSetupBanner } from '../ModuleSetupBanner';
import { BuyerRFQDetailDrawer } from '../BuyerRFQDetailDrawer';
import { QuoteScenarioDetailDrawer } from '../QuoteScenarioDetailDrawer';
import { UploadRFQDrawer } from '../UploadRFQDrawer';
import { CreateScenarioDrawer } from '../CreateScenarioDrawer';
import { useDatabase, MODULE_NAMES, canPerformAction } from '../../utils/supabase';
import { useRfqs, type Rfq } from '@/lib/data/rfqs';
import { useRouter } from 'next/navigation';
import { 
  FileText, TrendingUp, AlertTriangle, CheckCircle2, Eye, Edit, Search,
  Clock, ChevronDown, Plus, Download, Filter, Upload, Sparkles, Target,
  MessageSquare, DollarSign, Calendar, Mail, Phone, Send, XCircle,
  BarChart3, Award, Activity, FileCheck, Layers, Package, AlertCircle,
  TrendingDown, Star, Settings, BookOpen, Clipboard, Users, Heart,
  HelpCircle, CheckSquare, FileSearch, Calculator, RefreshCw, Zap, ChevronRight,
  Shield, Building2, Copy, Bell, ThumbsUp, ThumbsDown, Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// Dashboard Data
const dashboardSummary = [
  { label: 'Needs Clarification', value: 8, icon: HelpCircle, color: '#EAB308' },
  { label: 'Ready for Costing', value: 15, icon: Calculator, color: '#57ACAF' },
  { label: 'Quoted', value: 24, icon: FileCheck, color: '#6F83A7' },
  { label: 'Win Rate', value: '68%', icon: TrendingUp, color: '#57ACAF' },
];

const conversionByBuyerData = [
  { buyer: 'H&M', quoted: 45, won: 32, rate: 71 },
  { buyer: 'Zara', quoted: 38, won: 28, rate: 74 },
  { buyer: 'Gap', quoted: 28, won: 18, rate: 64 },
  { buyer: 'Nike', quoted: 22, won: 14, rate: 64 },
];

const conversionByProductData = [
  { product: 'T-Shirts', rate: 75, color: '#57ACAF' },
  { product: 'Denim', rate: 68, color: '#EAB308' },
  { product: 'Activewear', rate: 72, color: '#6F83A7' },
  { product: 'Outerwear', rate: 58, color: '#9333EA' },
];

// RFQ Inbox Data
const allRFQsData = [
  {
    id: 1,
    rfqId: 'RFQ-2024-1847',
    buyer: 'H&M',
    productType: 'Cotton T-Shirts',
    receivedDate: '2024-10-25',
    status: 'Needs Clarification',
    owner: 'Sarah M.',
  },
  {
    id: 2,
    rfqId: 'RFQ-2024-1848',
    buyer: 'Zara',
    productType: 'Denim Jeans',
    receivedDate: '2024-10-24',
    status: 'Ready for Costing',
    owner: 'John D.',
  },
  {
    id: 3,
    rfqId: 'RFQ-2024-1849',
    buyer: 'Gap',
    productType: 'Polo Shirts',
    receivedDate: '2024-10-23',
    status: 'Quoted',
    owner: 'Lisa K.',
  },
  {
    id: 4,
    rfqId: 'RFQ-2024-1850',
    buyer: 'Nike',
    productType: 'Activewear Set',
    receivedDate: '2024-10-22',
    status: 'Closed - Won',
    owner: 'Mike R.',
  },
  {
    id: 5,
    rfqId: 'RFQ-2024-1851',
    buyer: 'ACME Fashion',
    productType: 'Hoodies',
    receivedDate: '2024-10-20',
    status: 'Closed - Lost',
    owner: 'Sarah M.',
  },
];

const needsClarificationData = allRFQsData.filter(r => r.status === 'Needs Clarification');
const readyForCostingData = allRFQsData.filter(r => r.status === 'Ready for Costing');
const quotedData = allRFQsData.filter(r => r.status === 'Quoted');

// Clarification Tracker Data
const openClarificationsData = [
  {
    id: 1,
    clarificationId: 'CLR-2024-421',
    buyer: 'H&M',
    rfqId: 'RFQ-2024-1847',
    question: 'Missing GSM specification for main fabric',
    dateSent: '2024-10-26',
    status: 'Pending',
    responseDue: '2024-10-28',
  },
  {
    id: 2,
    clarificationId: 'CLR-2024-422',
    buyer: 'ACME Fashion',
    rfqId: 'RFQ-2024-1851',
    question: 'Wash test method not specified',
    dateSent: '2024-10-24',
    status: 'Overdue',
    responseDue: '2024-10-26',
  },
  {
    id: 3,
    clarificationId: 'CLR-2024-423',
    buyer: 'Gap',
    rfqId: 'RFQ-2024-1849',
    question: 'Label placement requirements missing',
    dateSent: '2024-10-25',
    status: 'Pending',
    responseDue: '2024-10-27',
  },
];

const resolvedClarificationsData = [
  {
    id: 1,
    clarificationId: 'CLR-2024-418',
    buyer: 'Zara',
    rfqId: 'RFQ-2024-1848',
    question: 'Color swatch confirmation needed',
    dateSent: '2024-10-20',
    dateResolved: '2024-10-22',
    responseTime: '2 days',
  },
  {
    id: 2,
    clarificationId: 'CLR-2024-415',
    buyer: 'Nike',
    rfqId: 'RFQ-2024-1850',
    question: 'Stretch percentage clarification',
    dateSent: '2024-10-18',
    dateResolved: '2024-10-19',
    responseTime: '1 day',
  },
];

// Quotation Builder Data
const quotationScenariosData = [
  {
    id: 1,
    scenario: 'Scenario A - Premium',
    margin: 18,
    fob: 6.25,
    leadTime: 45,
    fabricChoice: 'Organic Cotton',
    status: 'Active',
  },
  {
    id: 2,
    scenario: 'Scenario B - Competitive',
    margin: 12,
    fob: 5.85,
    leadTime: 35,
    fabricChoice: 'Standard Cotton',
    status: 'Recommended',
  },
  {
    id: 3,
    scenario: 'Scenario C - Budget',
    margin: 8,
    fob: 5.50,
    leadTime: 50,
    fabricChoice: 'Blended Cotton',
    status: 'Active',
  },
];

// Helper function to generate DetailDrawerData for RFQs
const generateRFQDrawerData = (rfq: any, subPage: string, onAskMarbim?: (prompt: string) => void): DetailDrawerData => {
  return {
    id: rfq.id.toString(),
    title: rfq.rfqId,
    subtitle: `${rfq.buyer} • ${rfq.productType}`,
    type: rfq.productType,
    status: {
      label: rfq.status,
      variant: rfq.status === 'Closed - Won' ? 'success' : 
               rfq.status === 'Needs Clarification' ? 'warning' :
               rfq.status === 'Closed - Lost' ? 'error' : 'default'
    },
    overview: {
      keyAttributes: [
        { label: 'RFQ ID', value: rfq.rfqId, icon: <FileText className="w-4 h-4" /> },
        { label: 'Buyer', value: rfq.buyer, icon: <Users className="w-4 h-4" /> },
        { label: 'Product Type', value: rfq.productType, icon: <Package className="w-4 h-4" /> },
        { label: 'Received Date', value: rfq.receivedDate, icon: <Calendar className="w-4 h-4" /> },
        { label: 'Status', value: rfq.status, icon: <Activity className="w-4 h-4" /> },
        { label: 'Owner', value: rfq.owner, icon: <Users className="w-4 h-4" /> },
      ],
      metrics: [
        { label: 'Days Since Received', value: '3', trend: 'down' as const },
        { label: 'Response Time Target', value: '5 days', trend: 'up' as const },
        { label: 'Win Probability', value: '72%', change: '+5%', trend: 'up' as const },
      ],
      description: `RFQ ${rfq.rfqId} from ${rfq.buyer} for ${rfq.productType}. Received on ${rfq.receivedDate}. Current status: ${rfq.status}. Assigned to ${rfq.owner} for processing.`,
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={conversionByBuyerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="buyer" stroke="#6F83A7" />
            <YAxis stroke="#6F83A7" />
            <Tooltip contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #ffffff20' }} />
            <Bar dataKey="won" fill="#57ACAF" />
            <Bar dataKey="quoted" fill="#EAB308" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    interactions: [
      { date: '2024-10-26', type: 'email', description: 'Sent quote to buyer with 3 pricing scenarios', sentiment: 'positive' },
      { date: '2024-10-25', type: 'call', description: 'Clarification call regarding fabric specifications', sentiment: 'neutral' },
      { date: '2024-10-24', type: 'meeting', description: 'Internal costing meeting with finance team', sentiment: 'positive' },
      { date: '2024-10-23', type: 'email', description: 'RFQ received from buyer procurement team', sentiment: 'neutral' },
    ],
    documents: [
      { name: 'RFQ_Document.pdf', type: 'RFQ', uploadDate: rfq.receivedDate, uploader: 'System', aiSummary: `Complete RFQ specification for ${rfq.productType} from ${rfq.buyer}. Includes tech pack, size chart, and quality requirements.` },
      { name: 'Tech_Pack_v1.pdf', type: 'Technical', uploadDate: rfq.receivedDate, uploader: rfq.owner, aiSummary: 'Detailed technical specifications including fabric, trims, and construction details.' },
      { name: 'Quotation_Scenario_A.pdf', type: 'Quote', uploadDate: '2024-10-26', uploader: rfq.owner, tag: 'Sent', aiSummary: 'Premium scenario with FOB $6.25, 18% margin, 45-day lead time.' },
      { name: 'Quotation_Scenario_B.pdf', type: 'Quote', uploadDate: '2024-10-26', uploader: rfq.owner, tag: 'Recommended', aiSummary: 'Competitive scenario with FOB $5.85, 12% margin, 35-day lead time.' },
    ],
    aiInsights: {
      summary: `RFQ ${rfq.rfqId} from ${rfq.buyer} shows ${rfq.status === 'Closed - Won' ? 'successful conversion' : rfq.status === 'Quoted' ? 'high win probability' : 'requires attention'}. Based on historical data with ${rfq.buyer}, win rate is 72%.`,
      recommendations: [
        {
          title: 'Pricing Strategy',
          description: `Scenario B (FOB $5.85) recommended based on ${rfq.buyer}'s historical price acceptance. 68% win rate predicted.`,
          action: 'View Scenarios',
          onClick: () => onAskMarbim?.(`Show me detailed pricing scenarios for ${rfq.rfqId}`)
        },
        {
          title: 'Lead Time Optimization',
          description: `${rfq.buyer} typically accepts 35-40 day lead times. Consider production line allocation for Line 2.`,
          action: 'Check Capacity',
          onClick: () => onAskMarbim?.(`Check production capacity for ${rfq.productType} in next 45 days`)
        },
        {
          title: 'Follow-up Action',
          description: rfq.status === 'Quoted' ? 'Schedule follow-up call in 2 days to discuss quote.' : 'Prioritize for quick turnaround to maintain buyer relationship.',
          action: 'Set Reminder',
          onClick: () => onAskMarbim?.(`Create follow-up reminder for ${rfq.rfqId}`)
        },
      ],
      visualInsight: (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Win Probability</span>
              <span className="text-white">72%</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Quote Competitiveness</span>
              <span className="text-white">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#6F83A7]">Buyer Relationship Score</span>
              <Badge className="bg-green-500/20 text-green-400">Strong</Badge>
            </div>
          </div>
        </div>
      ),
      references: [
        `Buyer History - ${rfq.buyer}`,
        'Win Rate Analysis Q4 2024',
        'Pricing Competitiveness Report',
        'Production Capacity Forecast'
      ]
    }
  };
};

interface RFQQuotationProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
  isAIPanelOpen?: boolean;
}

// Map a real rfqs row → the inbox row shape the table/drawers expect.
const RFQ_STATUS_LABEL: Record<Rfq['status'], string> = {
  open: 'Ready for Costing',
  quoted: 'Quoted',
  won: 'Closed - Won',
  lost: 'Closed - Lost',
  cancelled: 'Closed - Lost',
};
function mapRfqToInbox(r: Rfq) {
  return {
    id: r.id,
    rfqId: `RFQ-${r.id.slice(0, 8).toUpperCase()}`,
    buyer: r.buyer?.company_name ?? '—',
    productType: r.product_type ?? r.title,
    receivedDate: r.created_at.slice(0, 10),
    status: RFQ_STATUS_LABEL[r.status] ?? 'Ready for Costing',
    owner: 'You',
    type: 'rfq',
    title: r.title,
    quantity: r.quantity,
    targetPrice: r.target_price,
    currency: r.currency,
    deadline: r.deadline,
    description: r.description,
    _raw: r,
  };
}

export function RFQQuotation({ initialSubPage = 'dashboard', onAskMarbim, onOpenAI, isAIPanelOpen }: RFQQuotationProps) {
  // Database hook
  const db = useDatabase();
  // Live RFQs from Supabase (RLS-scoped to the company). Replaces localStorage seed.
  const { data: liveRfqs, loading: rfqsLoading, refresh: refreshRfqs } = useRfqs();
  const router = useRouter();
  
  // UI State
  const [currentView, setCurrentView] = useState<string>(initialSubPage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<DetailDrawerData | null>(null);
  const [rfqDrawerOpen, setRfqDrawerOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [scenarioDrawerOpen, setScenarioDrawerOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [createScenarioDrawerOpen, setCreateScenarioDrawerOpen] = useState(false);
  const [showModuleSetup, setShowModuleSetup] = useState(false);
  
  // Database State
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed Data
  const needsClarification = rfqs.filter(r => r.status === 'Needs Clarification');
  const readyForCosting = rfqs.filter(r => r.status === 'Ready for Costing');
  const quoted = rfqs.filter(r => r.status === 'Quoted');
  const closedWon = rfqs.filter(r => r.status === 'Closed - Won');
  const closedLost = rfqs.filter(r => r.status === 'Closed - Lost');
  
  const winRate = rfqs.length > 0 
    ? Math.round((closedWon.length / (closedWon.length + closedLost.length || 1)) * 100)
    : 0;

  const computedDashboardSummary = [
    { label: 'Needs Clarification', value: needsClarification.length, icon: HelpCircle, color: '#EAB308' },
    { label: 'Ready for Costing', value: readyForCosting.length, icon: Calculator, color: '#57ACAF' },
    { label: 'Quoted', value: quoted.length, icon: FileCheck, color: '#6F83A7' },
    { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp, color: '#57ACAF' },
  ];

  // Update view when initialSubPage changes
  useEffect(() => {
    setCurrentView(initialSubPage);
  }, [initialSubPage]);

  // Close all drawers when AI panel opens
  useEffect(() => {
    if (isAIPanelOpen) {
      setDrawerOpen(false);
      setRfqDrawerOpen(false);
      setScenarioDrawerOpen(false);
      setUploadDrawerOpen(false);
      setCreateScenarioDrawerOpen(false);
    }
  }, [isAIPanelOpen]);

  // RFQs come live from Supabase; map them into the inbox shape.
  useEffect(() => {
    setRfqs(liveRfqs.map(mapRfqToInbox));
    setIsLoading(rfqsLoading);
  }, [liveRfqs, rfqsLoading]);

  // Scenarios still use the local store for now (Costing wave migrates them).
  useEffect(() => {
    loadScenarios();
  }, []);

  // Database Operations
  async function loadRFQs() {
    try {
      setIsLoading(true);
      const data = await db.getByModule(MODULE_NAMES.RFQ_QUOTATION);
      const rfqData = data.filter((item: any) => item.type === 'rfq');
      
      if (rfqData.length === 0) {
        await seedInitialRFQs();
      } else {
        setRfqs(rfqData);
      }
    } catch (error) {
      console.error('Failed to load RFQs:', error);
      toast.error('Failed to load RFQs');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadScenarios() {
    try {
      const data = await db.getByModule(MODULE_NAMES.RFQ_QUOTATION);
      const scenarioData = data.filter((item: any) => item.type === 'scenario');
      
      if (scenarioData.length === 0) {
        await seedInitialScenarios();
      } else {
        setScenarios(scenarioData);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
      toast.error('Failed to load scenarios');
    }
  }

  async function seedInitialRFQs() {
    const initialRFQs = allRFQsData.map(rfq => ({
      ...rfq,
      type: 'rfq',
    }));
    
    for (const rfq of initialRFQs) {
      const id = `rfq-${rfq.id}-${Date.now()}`;
      await db.store(id, rfq, MODULE_NAMES.RFQ_QUOTATION);
    }
    
    setRfqs(initialRFQs);
  }

  async function seedInitialScenarios() {
    const initialScenarios = quotationScenariosData.map(scenario => ({
      ...scenario,
      type: 'scenario',
    }));
    
    for (const scenario of initialScenarios) {
      const id = `scenario-${scenario.id}-${Date.now()}`;
      await db.store(id, scenario, MODULE_NAMES.RFQ_QUOTATION);
    }
    
    setScenarios(initialScenarios);
  }

  async function handleRFQUpdated(updatedRFQ: any) {
    try {
      await refreshRfqs();
      toast.success('RFQ updated successfully');
    } catch (error) {
      console.error('Failed to update RFQ:', error);
      toast.error('Failed to update RFQ');
    }
  }

  async function handleScenarioUpdated(updatedScenario: any) {
    try {
      await loadScenarios();
      toast.success('Scenario updated successfully');
    } catch (error) {
      console.error('Failed to update scenario:', error);
      toast.error('Failed to update scenario');
    }
  }

  async function handleCreateScenario(scenarioData: any) {
    try {
      // Store in database
      const id = `scenario-${Date.now()}`;
      await db.store(id, { ...scenarioData, type: 'scenario' }, MODULE_NAMES.RFQ_QUOTATION);
      
      // Store in vector DB for AI search
      const searchableContent = `
        Scenario: ${scenarioData.scenario}
        RFQ: ${scenarioData.rfqId}
        Buyer: ${scenarioData.buyer}
        Product: ${scenarioData.productType}
        Margin: ${scenarioData.margin}%
        FOB: $${scenarioData.fob}
        Lead Time: ${scenarioData.leadTime} days
        Fabric: ${scenarioData.fabricChoice}
        Status: ${scenarioData.status}
        Pricing Approach: ${scenarioData.pricingApproach}
        Notes: ${scenarioData.notes}
      `.trim();
      
      await db.storeVector(id, searchableContent, MODULE_NAMES.RFQ_QUOTATION);
      
      // Reload scenarios to show the new one
      await loadScenarios();
      
      toast.success('Scenario created successfully');
    } catch (error) {
      console.error('Failed to create scenario:', error);
      toast.error('Failed to create scenario');
    }
  }

  // All RFQs Columns
  const allRFQsColumns: Column[] = [
    { key: 'rfqId', label: 'RFQ ID', sortable: true },
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'productType', label: 'Product Type' },
    { key: 'receivedDate', label: 'Received Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Needs Clarification': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Ready for Costing': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Quoted': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Closed - Won': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Closed - Lost': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    { key: 'owner', label: 'Owner' },
  ];

  // Open Clarifications Columns
  const openClarificationsColumns: Column[] = [
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'rfqId', label: 'RFQ ID', sortable: true },
    { key: 'question', label: 'Question' },
    { key: 'dateSent', label: 'Date Sent', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Pending': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Overdue': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    { key: 'responseDue', label: 'Response Due', sortable: true },
  ];

  // Resolved Clarifications Columns
  const resolvedClarificationsColumns: Column[] = [
    { key: 'buyer', label: 'Buyer', sortable: true },
    { key: 'rfqId', label: 'RFQ ID' },
    { key: 'question', label: 'Question' },
    { key: 'dateSent', label: 'Date Sent', sortable: true },
    { key: 'dateResolved', label: 'Date Resolved', sortable: true },
    { key: 'responseTime', label: 'Response Time' },
  ];

  // Quotation Scenarios Columns
  const quotationScenariosColumns: Column[] = [
    { key: 'scenario', label: 'Scenario', sortable: true },
    { key: 'margin', label: 'Margin %', sortable: true, render: (value) => `${value}%` },
    { key: 'fob', label: 'FOB Price', sortable: true, render: (value) => `$${value}` },
    { key: 'leadTime', label: 'Lead Time', sortable: true, render: (value) => `${value} days` },
    { key: 'fabricChoice', label: 'Fabric Choice' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Active': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Recommended': 'bg-[#EAB308]/10 text-[#EAB308]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // MARBIM drafts a priced quote for this RFQ → lands in the Approve inbox.
  const handleDraftQuote = async (rfqId: string) => {
    toast.loading('MARBIM is drafting a quote…', { id: 'draft-quote' });
    try {
      const res = await fetch('/api/rfq/draft-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Draft failed');
      toast.success(
        `Quote drafted — FOB ${json.draft.currency ?? 'USD'} ${json.draft.fob_price}. Review it in Approve.`,
        { id: 'draft-quote' },
      );
      router.push('/approve');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Draft failed', { id: 'draft-quote' });
    }
  };

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    // Use premium RFQ drawer for RFQ records
    if (record.rfqId) {
      setSelectedRFQ(record);
      setRfqDrawerOpen(true);
    } else if (record.scenario) {
      // Use Quote Scenario drawer for scenario records
      setSelectedScenario(record);
      setScenarioDrawerOpen(true);
    } else {
      // For other record types (clarifications), use generic drawer
      setDrawerData(generateRFQDrawerData(record, currentView, onAskMarbim));
      setDrawerOpen(true);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Hero Banner with Executive Summary */}
      {/* Module Setup Banner */}
      <ModuleSetupBanner 
        moduleName="RFQ & Quotation"
        onSetupClick={() => setShowModuleSetup(true)}
      />

      <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-2">RFQ & Quotation Intelligence Hub</h2>
                <p className="text-[#6F83A7] text-sm max-w-2xl">
                  Real-time visibility into your entire RFQ lifecycle—from inquiry receipt to quote submission. 
                  Track conversion rates, identify bottlenecks, and leverage AI insights to win more business.
                </p>
              </div>
            </div>
            <MarbimAIButton
              marbimPrompt="Provide a comprehensive executive summary of the RFQ pipeline including: 1) Overall pipeline health and conversion trends, 2) Critical RFQs requiring immediate attention, 3) Win/loss patterns and key drivers, 4) Bottleneck analysis in the quote-to-win process, 5) Opportunities to improve turnaround time and win rate, 6) Forecast for next month based on current pipeline."
              onAskMarbim={onAskMarbim}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Active RFQs</span>
              </div>
              <div className="text-2xl text-white mb-1">47</div>
              <div className="text-xs text-[#57ACAF]">+12 this week</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Win Rate</span>
              </div>
              <div className="text-2xl text-white mb-1">68%</div>
              <div className="text-xs text-[#57ACAF]">+5.2% vs last month</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Avg TAT</span>
              </div>
              <div className="text-2xl text-white mb-1">1.6d</div>
              <div className="text-xs text-[#57ACAF]">-18.5% faster</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Pipeline Value</span>
              </div>
              <div className="text-2xl text-white mb-1">$2.4M</div>
              <div className="text-xs text-[#57ACAF]">+23% vs LY</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">At Risk</span>
              </div>
              <div className="text-2xl text-white mb-1">8</div>
              <div className="text-xs text-[#D0342C]">Needs attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <KPICard
          title="Needs Clarification"
          value="8"
          change={-15.5}
          changeLabel="vs last week"
          icon={HelpCircle}
          trend="up"
        />
        <KPICard
          title="Ready for Costing"
          value="15"
          change={20.0}
          changeLabel="vs last week"
          icon={Calculator}
          trend="up"
        />
        <KPICard
          title="Quoted"
          value="24"
          change={12.5}
          icon={FileCheck}
          trend="up"
        />
        <KPICard
          title="Win Rate"
          value="68%"
          change={5.2}
          changeLabel="vs last month"
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Avg TAT"
          value="1.6 days"
          change={-18.5}
          changeLabel="improvement"
          icon={Clock}
          trend="up"
        />
        <KPICard
          title="Missing Info Rate"
          value="12%"
          change={-25.0}
          changeLabel="reduction"
          icon={AlertCircle}
          trend="up"
        />
      </div>

      {/* RFQ Pipeline by Status */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#57ACAF]" />
              RFQ Pipeline by Status
            </h3>
            <p className="text-sm text-[#6F83A7]">
              Real-time view of RFQ distribution across different processing stages
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze the RFQ pipeline distribution and provide insights on: 1) Bottlenecks causing delays in each stage, 2) RFQs at risk of exceeding response time targets, 3) Opportunities to fast-track high-value RFQs, 4) Resource allocation recommendations across stages, 5) Historical patterns and forecast for next week's pipeline."
            onAskMarbim={onAskMarbim}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {computedDashboardSummary.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => toast.info(`Viewing ${item.label} RFQs`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>
                  <div className="text-4xl" style={{ color: item.color }}>{item.value}</div>
                </div>
                <div className="text-[#6F83A7] mb-3">{item.label}</div>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F83A7]">View Details</span>
                    <ChevronRight className="w-4 h-4 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Analytics and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Rate by Buyer Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                Conversion Rate by Buyer
              </h3>
              <p className="text-sm text-[#6F83A7]">Win rate performance across top buyers</p>
            </div>
            <div className="flex gap-2">
              <MarbimAIButton
                marbimPrompt="Analyze buyer-specific conversion rates and identify: 1) Buyers with declining win rates and potential causes, 2) High-performing buyers and their common characteristics, 3) Buyers with low quote-to-win ratio requiring strategy adjustment, 4) Opportunities to improve margins with specific buyers, 5) Recommended actions for each buyer segment."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
              <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={conversionByBuyerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="buyer" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value: any, name: string) => {
                  if (name === 'rate') return [`${value}%`, 'Win Rate'];
                  return [value, name];
                }}
              />
              <Bar dataKey="rate" fill="#57ACAF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Avg Win Rate</div>
                <div className="text-lg text-white">68%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Total Quoted</div>
                <div className="text-lg text-white">133</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Total Won</div>
                <div className="text-lg text-white">92</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Strategic Insights */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-1">AI Strategic Insights</h4>
                <p className="text-xs text-[#6F83A7]">
                  MARBIM-powered recommendations
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#D0342C] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">8 RFQs at risk of missing TAT target</div>
                    <div className="text-xs text-[#6F83A7]">Prioritize RFQ-2024-1847, RFQ-2024-1853</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">Win rate trending up 5.2%</div>
                    <div className="text-xs text-[#6F83A7]">Improved clarification process driving gains</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 cursor-pointer group">
                <div className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-white mb-1">High-value opportunity detected</div>
                    <div className="text-xs text-[#6F83A7]">H&M RFQ similar to $450K win last quarter</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white">Quick Actions</h4>
              <Zap className="w-4 h-4 text-[#EAB308]" />
            </div>
            <div className="space-y-2">
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70"
                onClick={() => toast.info('Opening clarification wizard')}
              >
                <Send className="w-3 h-3 mr-2" />
                Send Clarifications (8)
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="w-full border-white/10 text-white bg-transparent hover:bg-white/5"
                onClick={() => toast.info('Opening costing queue')}
              >
                <Calculator className="w-3 h-3 mr-2" />
                Review Costing Queue (15)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Type Performance and Growth Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion by Product Type */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#57ACAF]" />
                Conversion by Product Type
              </h3>
              <p className="text-sm text-[#6F83A7]">Win rate performance by category</p>
            </div>
            <MarbimAIButton
              marbimPrompt="Analyze product category performance and provide: 1) Categories with declining win rates, 2) High-margin opportunities by category, 3) Competitive positioning insights, 4) Resource reallocation recommendations, 5) Emerging product trends in the pipeline."
              onAskMarbim={onAskMarbim}
              size="sm"
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={conversionByProductData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis type="number" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <YAxis type="category" dataKey="product" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                formatter={(value: any) => [`${value}%`, 'Win Rate']}
              />
              <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                {conversionByProductData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win/Loss Analysis */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#57ACAF]" />
                Win/Loss Driver Analysis
              </h3>
              <p className="text-sm text-[#6F83A7]">Key factors impacting quote success</p>
            </div>
            <MarbimAIButton
              marbimPrompt="Analyze win/loss patterns and identify: 1) Primary drivers of won quotes (price, lead time, quality), 2) Common reasons for lost quotes with mitigation strategies, 3) Buyer-specific preferences and decision criteria, 4) Competitive intelligence and positioning gaps, 5) Actions to improve overall win rate."
              onAskMarbim={onAskMarbim}
              size="sm"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white">Lead Time Competitiveness</div>
                <div className="text-sm text-[#57ACAF]">85%</div>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white">Price Competitiveness</div>
                <div className="text-sm text-[#EAB308]">72%</div>
              </div>
              <Progress value={72} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white">Quality Perception</div>
                <div className="text-sm text-[#57ACAF]">92%</div>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white">Compliance Rating</div>
                <div className="text-sm text-[#57ACAF]">88%</div>
              </div>
              <Progress value={88} className="h-2" />
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-[#6F83A7] mb-1">Top Win Driver</div>
                  <div className="text-sm text-white">Quality & Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#6F83A7] mb-1">Top Loss Driver</div>
                  <div className="text-sm text-[#D0342C]">Price Premium</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Action Items */}
      <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
              Critical Action Items
            </h3>
            <p className="text-sm text-[#6F83A7]">
              RFQs and quotes requiring immediate attention to prevent loss
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze critical action items and provide: 1) Prioritized action plan for at-risk RFQs, 2) Resource allocation to address bottlenecks, 3) Escalation recommendations for high-value opportunities, 4) Preventive measures to avoid similar delays, 5) Communication templates for urgent buyer follow-up."
            onAskMarbim={onAskMarbim}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#D0342C]" />
              </div>
              <div className="text-white">TAT Overdue</div>
            </div>
            <div className="text-3xl text-[#D0342C] mb-2">3</div>
            <div className="text-xs text-[#6F83A7] mb-3">RFQs exceeding target response time</div>
            <Button 
              size="sm" 
              className="w-full bg-[#D0342C] hover:bg-[#D0342C]/90 text-white"
              onClick={() => toast.error('Opening overdue RFQs')}
            >
              Review Now
            </Button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-[#EAB308]" />
              </div>
              <div className="text-white">Pending Clarifications</div>
            </div>
            <div className="text-3xl text-[#EAB308] mb-2">8</div>
            <div className="text-xs text-[#6F83A7] mb-3">Awaiting buyer response</div>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full border-[#EAB308]/40 text-[#EAB308] bg-transparent hover:bg-[#EAB308]/10"
              onClick={() => toast.info('Opening clarification tracker')}
            >
              Follow Up
            </Button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#57ACAF]" />
              </div>
              <div className="text-white">High-Value Pipeline</div>
            </div>
            <div className="text-3xl text-[#57ACAF] mb-2">$1.2M</div>
            <div className="text-xs text-[#6F83A7] mb-3">5 strategic opportunities</div>
            <Button 
              size="sm" 
              variant="outline"
              className="w-full border-[#57ACAF]/40 text-[#57ACAF] bg-transparent hover:bg-[#57ACAF]/10"
              onClick={() => toast.success('Opening strategic pipeline')}
            >
              Prioritize
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  const renderRFQInbox = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">RFQ Inbox</h2>
          <p className="text-sm text-[#6F83A7]">Centralized inbox for all incoming RFQs with stage segregation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => setUploadDrawerOpen(true)}
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload RFQ
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-rfqs" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-5 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="all-rfqs" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileText className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">All RFQs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="needs-clarification" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <HelpCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Needs Clarification</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ready-for-costing" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Calculator className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Ready for Costing</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quoted" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <FileCheck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Quoted</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all-rfqs" className="space-y-6">
          {/* Workflow Progress */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#EAB308]" />
                  <span className="text-white">RFQ Processing Workflow</span>
                </div>
                <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <WorkflowStepper
                  steps={[
                    { label: 'RFQ Upload', status: 'completed' },
                    { label: 'AI Parsing', status: 'completed' },
                    { label: 'Missing Fields Detection', status: 'active' },
                    { label: 'Clarification', status: 'pending' },
                    { label: 'Ready for Costing', status: 'pending' },
                  ]}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">All RFQs</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EAB308]"></div>
              </div>
            ) : (
              <SmartTable
                columns={allRFQsColumns}
                data={rfqs}
                searchPlaceholder="Search RFQs..."
                onRowClick={handleRowClick}
              />
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-white mb-1">AI RFQ Grouping</div>
                <div className="text-sm text-[#6F83A7]">
                  MARBIM groups RFQs by similarity (style, quantity, region) and flags duplicates automatically.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="needs-clarification" className="space-y-6">
          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">Total Pending</div>
              </div>
              <div className="text-3xl text-white mb-1">8</div>
              <div className="text-xs text-[#6F83A7]">↑ 2 from last week</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#D0342C]" />
                <div className="text-[#6F83A7] text-sm">Overdue</div>
              </div>
              <div className="text-3xl text-[#D0342C] mb-1">2</div>
              <div className="text-xs text-[#6F83A7]">{'>'} 3 days old</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Avg Response</div>
              </div>
              <div className="text-3xl text-white mb-1">1.2d</div>
              <div className="text-xs text-[#57ACAF]">15% faster</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Resolution Rate</div>
              </div>
              <div className="text-3xl text-white mb-1">92%</div>
              <div className="text-xs text-[#6F83A7]">This month</div>
            </div>
          </div>

          {/* AI Priority Insights */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Priority Clarification Queue</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    2 high-value RFQs require immediate attention. MARBIM has drafted clarification requests and identified the most critical missing fields affecting costing accuracy.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Critical Items</div>
                      <div className="text-lg text-[#D0342C]">2</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Auto-Drafted</div>
                      <div className="text-lg text-[#57ACAF]">6</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Avg Fields Missing</div>
                      <div className="text-lg text-white">3.2</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt={`Analyze clarification queue bottlenecks and optimization opportunities. Current state: 8 RFQs pending clarification (2 overdue >3 days), 92% resolution rate, 1.2 day average response time. Critical items: 2 high-value RFQs. Provide: 1) Root cause analysis of delays and overdue items, 2) Prioritization strategy for maximum impact, 3) Template optimization for faster buyer responses, 4) Process improvements to reduce clarification rate from 12% baseline, 5) Buyer-specific communication strategies, 6) Escalation recommendations for overdue items, 7) Resource allocation optimization.`}
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Detailed RFQ List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white">RFQs Requiring Clarification</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                  <Filter className="w-3 h-3 mr-2" />
                  Filter
                </Button>
                <Button size="sm" className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                  <Send className="w-3 h-3 mr-2" />
                  Bulk Send
                </Button>
              </div>
            </div>

            {needsClarificationData.map((rfq) => (
              <div key={rfq.id} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:bg-white/10 transition-all duration-180">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-white text-lg">{rfq.rfqId}</div>
                      <Badge className={rfq.id === 1 ? 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20' : 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'}>
                        {rfq.id === 1 ? 'Overdue - 3d' : 'Pending'}
                      </Badge>
                      {rfq.id === 1 && (
                        <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          High Value
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Buyer</div>
                        <div className="text-white">{rfq.buyer}</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Product</div>
                        <div className="text-white">{rfq.productType}</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Received</div>
                        <div className="text-white">{rfq.receivedDate}</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Owner</div>
                        <div className="text-white">{rfq.owner}</div>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Draft clarification request for RFQ ${rfq.rfqId} from ${rfq.buyer}. Product: ${rfq.productType}. Missing critical fields needed for accurate costing. Status: ${rfq.id === 1 ? 'OVERDUE (3 days)' : 'Pending'}. Provide: 1) Professional clarification email draft addressing all missing fields, 2) Suggested tone and urgency level based on buyer relationship, 3) Alternative phrasing options if buyer is unresponsive, 4) Follow-up strategy with timeline, 5) Escalation path if no response, 6) Risk assessment of proceeding without full information.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>

                <div className="p-4 rounded-lg bg-[#EAB308]/5 border border-[#EAB308]/20 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-[#EAB308]">Missing Fields Detected by AI</div>
                    <div className="text-xs text-[#6F83A7]">3 fields</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-white/10 text-white text-xs border border-white/20">
                      <FileSearch className="w-3 h-3 mr-1" />
                      GSM Specification
                    </Badge>
                    <Badge className="bg-white/10 text-white text-xs border border-white/20">
                      <Shield className="w-3 h-3 mr-1" />
                      Test Method
                    </Badge>
                    <Badge className="bg-white/10 text-white text-xs border border-white/20">
                      <Layers className="w-3 h-3 mr-1" />
                      Size Run Details
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-2">AI-Drafted Message Preview:</div>
                    <div className="text-sm text-white italic">
                      "Dear {rfq.buyer}, thank you for your RFQ. To provide an accurate quote, could you please clarify the fabric GSM specification, testing methodology required, and complete size run breakdown? We aim to submit our quote within 24 hours of receiving this information."
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20">
                    <Send className="w-3 h-3 mr-2" />
                    Send Clarification
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]" onClick={() => handleRowClick(rfq)}>
                    <Eye className="w-3 h-3 mr-2" />
                    View Full Details
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                    <Edit className="w-3 h-3 mr-2" />
                    Edit Draft
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Missing Fields Analytics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                    Most Common Missing Fields
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Across all pending clarifications</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze recurring missing fields in RFQ clarifications. Top gaps: GSM Specification (38%), Test Method (28%), Size Run (22%), Color Swatches (12%). Provide: 1) Root cause analysis for each missing field type, 2) Buyer education strategy to reduce recurrence, 3) RFQ template improvements to capture this data upfront, 4) Pre-submission checklists for buyers, 5) Industry best practices for complete RFQ submissions, 6) Cost impact of incomplete RFQs on quote accuracy.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                {[
                  { field: 'GSM Specification', count: 3, percentage: 38 },
                  { field: 'Test Method', count: 2, percentage: 28 },
                  { field: 'Size Run Details', count: 2, percentage: 22 },
                  { field: 'Color Swatches', count: 1, percentage: 12 },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white">{item.field}</div>
                      <div className="text-xs text-[#6F83A7]">{item.count} RFQs</div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#57ACAF]" />
                    Buyer Response Patterns
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Average response times by buyer</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze buyer response behavior for clarification requests. Data: H&M (0.8 days - excellent), Zara (1.2 days - good), Nike (2.5 days - slow), Uniqlo (3.8 days - very slow). Overall average: 1.2 days. Provide: 1) Buyer segmentation by responsiveness, 2) Communication strategy customization per buyer, 3) Optimal send times for each buyer, 4) Escalation triggers for slow responders, 5) Relationship health indicators, 6) Recommendations to improve overall response rates.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                {[
                  { buyer: 'H&M', time: '0.8d', status: 'Excellent', color: '#57ACAF' },
                  { buyer: 'Zara', time: '1.2d', status: 'Good', color: '#57ACAF' },
                  { buyer: 'Nike', time: '2.5d', status: 'Slow', color: '#EAB308' },
                  { buyer: 'Uniqlo', time: '3.8d', status: 'Very Slow', color: '#D0342C' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
                        {item.buyer.charAt(0)}
                      </div>
                      <div className="text-sm text-white">{item.buyer}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
                        {item.status}
                      </Badge>
                      <div className="text-sm text-[#6F83A7]">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ready-for-costing" className="space-y-6">
          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Ready to Cost</div>
              </div>
              <div className="text-3xl text-white mb-1">12</div>
              <div className="text-xs text-[#6F83A7]">Verified & complete</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">High Priority</div>
              </div>
              <div className="text-3xl text-[#EAB308] mb-1">4</div>
              <div className="text-xs text-[#6F83A7]">Due within 2 days</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Avg Costing Time</div>
              </div>
              <div className="text-3xl text-white mb-1">4.2h</div>
              <div className="text-xs text-[#57ACAF]">12% faster</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">AI-Assisted</div>
              </div>
              <div className="text-3xl text-white mb-1">8</div>
              <div className="text-xs text-[#6F83A7]">BOM templates found</div>
            </div>
          </div>

          {/* AI Costing Intelligence */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Costing Intelligence</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM has identified <span className="text-[#57ACAF]">8 similar past orders</span> with complete BOM templates, reducing costing time by 65%. 
                    Auto-populated material costs based on current market rates with <span className="text-[#57ACAF]">94% accuracy</span>.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">BOM Templates Available</div>
                      <div className="text-lg text-[#57ACAF]">8</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Time Saved</div>
                      <div className="text-lg text-white">65%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Cost Accuracy</div>
                      <div className="text-lg text-[#57ACAF]">94%</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt={`Analyze costing workflow efficiency and optimization opportunities. Current state: 12 RFQs ready for costing (4 high priority due in 2 days), 4.2 hour average costing time (12% improvement), 8 AI-assisted with BOM templates (65% time saved, 94% accuracy). Provide: 1) Detailed efficiency analysis and bottleneck identification, 2) Prioritization strategy for high-priority items, 3) BOM template optimization recommendations, 4) Material cost forecasting and variance analysis, 5) Resource allocation for optimal throughput, 6) Quality assurance measures for AI-assisted costing, 7) Process improvements to reduce average costing time further.`}
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Priority Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white">Priority Costing Queue</h3>
                <p className="text-sm text-[#6F83A7]">Sorted by deadline and estimated value</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                  <Filter className="w-3 h-3 mr-2" />
                  Filter
                </Button>
                <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                  <Calculator className="w-3 h-3 mr-2" />
                  Bulk Assign
                </Button>
              </div>
            </div>

            {readyForCostingData.map((rfq, index) => (
              <div key={rfq.id} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:bg-white/10 transition-all duration-180">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-white text-lg">{rfq.rfqId}</div>
                      <Badge className={index < 2 ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' : 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'}>
                        {index < 2 ? 'High Priority' : 'Normal'}
                      </Badge>
                      {index === 0 && (
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                          <Zap className="w-3 h-3 mr-1" />
                          BOM Available
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Buyer</div>
                        <div className="text-white">{rfq.buyer}</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Product</div>
                        <div className="text-white">{rfq.productType}</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Est. Value</div>
                        <div className="text-[#57ACAF]">$28.5K</div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Deadline</div>
                        <div className={index < 2 ? 'text-[#EAB308]' : 'text-white'}>
                          {index < 2 ? '2 days' : '5 days'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[#6F83A7] text-xs mb-1">Owner</div>
                        <div className="text-white">{rfq.owner}</div>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt={`Provide costing assistance for RFQ ${rfq.rfqId} from ${rfq.buyer}. Product: ${rfq.productType}. Estimated value: $28.5K. ${index === 0 ? 'Similar BOM template found from past order.' : 'No exact match found - manual costing required.'} Deadline: ${index < 2 ? '2 days (HIGH PRIORITY)' : '5 days'}. Provide: 1) Detailed BOM recommendations with line-item costs, 2) Material sourcing options with lead times and pricing, 3) Labor cost estimation based on complexity, 4) Overhead allocation and margin recommendations, 5) Competitive pricing analysis vs market rates, 6) Risk factors affecting cost accuracy, 7) Alternative costing scenarios for negotiation.`}
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>

                {index === 0 && (
                  <div className="p-4 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-[#57ACAF]" />
                      <div className="text-sm text-[#57ACAF]">AI-Suggested BOM Template</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm">
                        <div className="text-[#6F83A7]">Similar Order: #RFQ-2024-0892</div>
                        <div className="text-[#57ACAF]">95% match</div>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm">
                        <div className="text-[#6F83A7]">Material costs updated to current rates</div>
                        <div className="text-white">$18,240</div>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm">
                        <div className="text-[#6F83A7]">Estimated time savings</div>
                        <div className="text-[#57ACAF]">2.8 hours</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20">
                    <Calculator className="w-3 h-3 mr-2" />
                    Start Costing
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]" onClick={() => handleRowClick(rfq)}>
                    <Eye className="w-3 h-3 mr-2" />
                    View RFQ Details
                  </Button>
                  {index === 0 && (
                    <Button size="sm" variant="outline" className="border-[#57ACAF]/20 text-[#57ACAF] hover:bg-[#57ACAF]/10 bg-[rgba(255,255,255,0)]">
                      <Copy className="w-3 h-3 mr-2" />
                      Use BOM Template
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    Costing Efficiency Trend
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Average time per RFQ over last 6 months</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze costing efficiency trends over the last 6 months. Data: Jan: 5.8h, Feb: 5.2h, Mar: 4.9h, Apr: 4.6h, May: 4.4h, Jun: 4.2h. Overall improvement: 28% reduction. AI template usage correlation: 35% adoption rate. Provide: 1) Detailed efficiency drivers and improvement factors, 2) Impact analysis of AI template usage on speed, 3) Team productivity benchmarking, 4) Process optimization recommendations for further improvements, 5) Quality metrics vs speed trade-offs, 6) Training needs identification, 7) Technology enhancement opportunities.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { month: 'Jan', hours: 5.8 },
                  { month: 'Feb', hours: 5.2 },
                  { month: 'Mar', hours: 4.9 },
                  { month: 'Apr', hours: 4.6 },
                  { month: 'May', hours: 4.4 },
                  { month: 'Jun', hours: 4.2 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="hours" stroke="#57ACAF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="text-xs text-[#57ACAF] mb-1">28% Improvement</div>
                <div className="text-sm text-white">From 5.8h to 4.2h average costing time</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#57ACAF]" />
                    Product Type Distribution
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Current costing queue breakdown</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze product type distribution in costing queue. Breakdown: T-Shirts (42%), Jeans (25%), Jackets (17%), Dresses (16%). Total: 12 RFQs. Provide: 1) Capacity analysis by product expertise, 2) Workload balancing recommendations, 3) Specialization benefits vs generalist approach, 4) Training needs for underrepresented categories, 5) Template availability by product type, 6) Complexity scoring and time estimation by category, 7) Resource allocation optimization.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { product: 'T-Shirts', count: 5 },
                  { product: 'Jeans', count: 3 },
                  { product: 'Jackets', count: 2 },
                  { product: 'Dresses', count: 2 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="product" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 11 }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#57ACAF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-[#6F83A7]">Most Common</div>
                  <div className="text-sm text-white">T-Shirts (42%)</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-[#6F83A7]">Templates Available</div>
                  <div className="text-sm text-[#57ACAF]">8 of 12</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quoted" className="space-y-6">
          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <FileCheck className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Total Quoted</div>
              </div>
              <div className="text-3xl text-white mb-1">18</div>
              <div className="text-xs text-[#6F83A7]">This month</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">Pending Response</div>
              </div>
              <div className="text-3xl text-[#EAB308] mb-1">12</div>
              <div className="text-xs text-[#6F83A7]">Awaiting decision</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Avg Win Rate</div>
              </div>
              <div className="text-3xl text-white mb-1">68%</div>
              <div className="text-xs text-[#57ACAF]">+5% vs last month</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Total Value</div>
              </div>
              <div className="text-3xl text-white mb-1">$486K</div>
              <div className="text-xs text-[#6F83A7]">In pipeline</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Avg Response</div>
              </div>
              <div className="text-3xl text-white mb-1">3.8d</div>
              <div className="text-xs text-[#6F83A7]">Buyer decision time</div>
            </div>
          </div>

          {/* AI Win Probability Intelligence */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Win Probability Tracker</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM analyzes buyer engagement patterns, quote competitiveness, and historical win rates to predict outcomes. 
                    <span className="text-[#57ACAF]"> 8 high-probability quotes</span> identified for follow-up, 
                    <span className="text-[#EAB308]"> 3 at-risk quotes</span> require pricing review.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">High Win Probability</div>
                      <div className="text-lg text-[#57ACAF]">8</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Medium Probability</div>
                      <div className="text-lg text-white">7</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">At Risk</div>
                      <div className="text-lg text-[#EAB308]">3</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Projected Value</div>
                      <div className="text-lg text-[#57ACAF]">$330K</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt={`Analyze quoted RFQ pipeline and win probability. Current state: 18 total quotes ($486K value), 12 pending response, 68% average win rate (+5% improvement). Win probability distribution: 8 high-probability (>70%), 7 medium (50-70%), 3 at-risk (<50%). Buyer decision time: 3.8 days average. Provide: 1) Detailed win probability analysis for each quote segment, 2) Engagement strategies for high-probability quotes to ensure closure, 3) Intervention tactics for at-risk quotes (pricing review, value-add offers), 4) Follow-up timing optimization based on buyer patterns, 5) Competitive intelligence on lost quotes, 6) Revenue forecasting with confidence intervals, 7) Resource allocation for quote follow-up activities.`}
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Quoted RFQs by Win Probability */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white">Quoted RFQs by Win Probability</h3>
                <p className="text-sm text-[#6F83A7]">AI-ranked by likelihood of conversion</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                  <Filter className="w-3 h-3 mr-2" />
                  Filter
                </Button>
                <Button size="sm" className="bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white">
                  <Send className="w-3 h-3 mr-2" />
                  Bulk Follow-up
                </Button>
              </div>
            </div>

            {quotedData.map((rfq, index) => {
              const winProb = index === 0 ? 85 : index === 1 ? 72 : index === 2 ? 68 : index === 3 ? 48 : 45;
              const isHighProb = winProb >= 70;
              const isAtRisk = winProb < 50;
              
              return (
                <div key={rfq.id} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:bg-white/10 transition-all duration-180">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-white text-lg">{rfq.rfqId}</div>
                        <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">
                          Quoted
                        </Badge>
                        <Badge className={
                          isHighProb 
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : isAtRisk 
                            ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'
                            : 'bg-white/10 text-white border border-white/20'
                        }>
                          <Target className="w-3 h-3 mr-1" />
                          {winProb}% Win Probability
                        </Badge>
                        {index === 0 && (
                          <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Buyer Engaged
                          </Badge>
                        )}
                        {isAtRisk && (
                          <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            At Risk
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-[#6F83A7] text-xs mb-1">Buyer</div>
                          <div className="text-white">{rfq.buyer}</div>
                        </div>
                        <div>
                          <div className="text-[#6F83A7] text-xs mb-1">Quote Value</div>
                          <div className="text-[#57ACAF]">$32.6K</div>
                        </div>
                        <div>
                          <div className="text-[#6F83A7] text-xs mb-1">Quoted Date</div>
                          <div className="text-white">{rfq.receivedDate}</div>
                        </div>
                        <div>
                          <div className="text-[#6F83A7] text-xs mb-1">Days Pending</div>
                          <div className={index < 2 ? 'text-[#57ACAF]' : 'text-[#EAB308]'}>
                            {index < 2 ? '2d' : '5d'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#6F83A7] text-xs mb-1">Owner</div>
                          <div className="text-white">{rfq.owner}</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-[#6F83A7]">Win Probability Score</div>
                          <div className="text-sm text-white">{winProb}%</div>
                        </div>
                        <Progress value={winProb} className="h-2" />
                      </div>
                    </div>
                    <MarbimAIButton
                      marbimPrompt={`Analyze win strategy for quoted RFQ ${rfq.rfqId} from ${rfq.buyer}. Current win probability: ${winProb}% (${isHighProb ? 'HIGH' : isAtRisk ? 'AT RISK' : 'MEDIUM'}). Quote value: $32.6K. Days pending: ${index < 2 ? '2' : '5'} days. ${index === 0 ? 'Buyer has engaged with quote (positive signal).' : ''} ${isAtRisk ? 'Quote flagged as at-risk - pricing may be uncompetitive.' : ''} Provide: 1) Detailed win probability factors and scoring rationale, 2) Buyer engagement signals and their significance, 3) ${isAtRisk ? 'Intervention strategy (pricing review, value-add proposals, escalation)' : 'Follow-up strategy and optimal timing'}, 4) Competitive positioning analysis, 5) Negotiation approach and concession limits, 6) Deal closure tactics, 7) Risk mitigation if quote is at risk of being lost.`}
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                  </div>

                  {index === 0 && (
                    <div className="p-4 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-[#57ACAF]" />
                        <div className="text-sm text-[#57ACAF]">Buyer Engagement Signals</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-[#6F83A7]">• Quote opened 3 times</div>
                          <div className="text-[#57ACAF]">+15% probability</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-[#6F83A7]">• Clarification question received</div>
                          <div className="text-[#57ACAF]">+20% probability</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-[#6F83A7]">• Historical win rate with buyer: 78%</div>
                          <div className="text-[#57ACAF]">+25% probability</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAtRisk && (
                    <div className="p-4 rounded-lg bg-[#EAB308]/5 border border-[#EAB308]/20 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-[#EAB308]" />
                        <div className="text-sm text-[#EAB308]">At-Risk Factors</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-[#6F83A7]">• Price 12% higher than market average</div>
                          <div className="text-[#EAB308]">-15% probability</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-[#6F83A7]">• No buyer engagement for 5 days</div>
                          <div className="text-[#EAB308]">-20% probability</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-[#6F83A7]">• Competitor likely bidding lower</div>
                          <div className="text-[#EAB308]">-18% probability</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20">
                      <MessageSquare className="w-3 h-3 mr-2" />
                      Follow Up
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]" onClick={() => handleRowClick(rfq)}>
                      <Eye className="w-3 h-3 mr-2" />
                      View Quote
                    </Button>
                    {isAtRisk && (
                      <Button size="sm" variant="outline" className="border-[#EAB308]/20 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]">
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Revise Quote
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    Win Rate by Response Time
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Buyer decision time impact on success</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze correlation between buyer response time and quote win rates. Data: 0-2 days: 82% win rate, 3-5 days: 68% win rate, 6-10 days: 45% win rate, >10 days: 28% win rate. Clear negative correlation: faster responses indicate higher interest. Provide: 1) Statistical significance analysis of the correlation, 2) Optimal follow-up timing based on response patterns, 3) Strategies to accelerate buyer decision-making, 4) Early warning indicators for quotes likely to be lost, 5) Engagement tactics to maintain buyer interest, 6) When to escalate or write off slow responders.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { range: '0-2d', rate: 82 },
                  { range: '3-5d', rate: 68 },
                  { range: '6-10d', rate: 45 },
                  { range: '>10d', rate: 28 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="range" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                    {[0, 1, 2, 3].map((index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#57ACAF' : index === 1 ? '#57ACAF' : index === 2 ? '#EAB308' : '#D0342C'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="text-xs text-[#57ACAF] mb-1">Key Insight</div>
                <div className="text-sm text-white">Fast responses correlate with 3x higher win rate</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#57ACAF]" />
                    Quote Value Distribution
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Pipeline breakdown by deal size</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze quote value distribution and strategic focus. Breakdown: <$20K: 6 quotes ($84K, 17% of pipeline), $20-40K: 8 quotes ($240K, 49% of pipeline), $40-60K: 3 quotes ($138K, 28% of pipeline), >$60K: 1 quote ($72K, 15% of pipeline). Total: 18 quotes, $486K. Provide: 1) Deal size concentration analysis and risk assessment, 2) Resource allocation recommendations by deal size, 3) Win rate correlation with deal size, 4) Strategic focus optimization (pursue more high-value vs volume), 5) Margin analysis by deal size segment, 6) Sales team capacity vs deal mix, 7) Pipeline health and diversification recommendations.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { range: '<$20K', count: 6, value: 84 },
                  { range: '$20-40K', count: 8, value: 240 },
                  { range: '$40-60K', count: 3, value: 138 },
                  { range: '>$60K', count: 1, value: 72 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="range" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 11 }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === 'value') return [`$${value}K`, 'Total Value'];
                      return [value, 'Quote Count'];
                    }}
                  />
                  <Bar dataKey="value" fill="#57ACAF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-[#6F83A7]">Largest Quote</div>
                  <div className="text-sm text-white">$72K</div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-[#6F83A7]">Average Quote</div>
                  <div className="text-sm text-white">$27K</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Executive Summary */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI-Powered RFQ Intelligence Summary</h4>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    MARBIM has analyzed 38 active RFQs across all stages. Key findings: <span className="text-[#57ACAF]">Processing efficiency improved 18% this month</span> 
                    with 94% AI parsing accuracy. <span className="text-[#EAB308]">2 critical bottlenecks identified</span> in fabric sourcing and approval workflow. 
                    Win rate trending up to <span className="text-[#57ACAF]">68% (+5%)</span> with improved quote competitiveness.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Total Active RFQs</div>
                      <div className="text-2xl text-white">38</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">AI Efficiency Gain</div>
                      <div className="text-2xl text-[#57ACAF]">18%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Critical Issues</div>
                      <div className="text-2xl text-[#EAB308]">2</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Win Rate</div>
                      <div className="text-2xl text-[#57ACAF]">68%</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt={`Provide comprehensive executive summary of RFQ operations and AI insights. Current state: 38 active RFQs across all stages, 18% efficiency improvement this month, 94% AI parsing accuracy, 68% win rate (+5% improvement), 2 critical bottlenecks (fabric sourcing, approval workflow). Pipeline value: $486K in quoted RFQs. Provide: 1) Executive-level performance summary with key trends, 2) Strategic recommendations for leadership, 3) Resource allocation priorities, 4) Technology optimization opportunities, 5) Risk assessment and mitigation strategies, 6) Competitive positioning analysis, 7) Revenue forecasting and pipeline health, 8) Action items for executive team.`}
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Processing Performance */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#57ACAF]" />
                    Processing Performance Metrics
                  </h4>
                  <p className="text-sm text-[#6F83A7]">End-to-end RFQ processing efficiency</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze RFQ processing performance metrics. Current state: Average time to quote: 1.6 days (target: <2 days), Clarification rate: 12% (industry average: 18%), Auto-parsed accuracy: 94% (target: >90%), Average costing time: 4.2 hours. Provide: 1) Detailed efficiency analysis vs benchmarks, 2) Process optimization opportunities, 3) Bottleneck identification and resolution strategies, 4) AI automation expansion opportunities, 5) Quality vs speed trade-off analysis, 6) Team productivity assessment, 7) Technology investment ROI analysis.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6F83A7]">Average time to quote</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none">On Target</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-white">1.6 days</span>
                    <span className="text-sm text-[#57ACAF]">↓ 12% vs last month</span>
                  </div>
                  <Progress value={80} className="h-2 mt-3" />
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6F83A7]">Clarification rate</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-white">12%</span>
                    <span className="text-sm text-[#57ACAF]">33% below industry avg</span>
                  </div>
                  <Progress value={33} className="h-2 mt-3" />
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6F83A7]">Auto-parsed accuracy</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none">Exceeds Target</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-[#57ACAF]">94%</span>
                    <span className="text-sm text-[#57ACAF]">↑ 4% improvement</span>
                  </div>
                  <Progress value={94} className="h-2 mt-3" />
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#6F83A7]">Average costing time</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-none">Improved</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-white">4.2 hours</span>
                    <span className="text-sm text-[#57ACAF]">↓ 28% vs 6 months ago</span>
                  </div>
                  <Progress value={72} className="h-2 mt-3" />
                </div>
              </div>
            </div>

            {/* RFQ Volume Trend */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    RFQ Volume Trend Analysis
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Monthly inbound RFQ volume over 5 months</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze RFQ volume trends and forecast. Historical data: Jun: 42 RFQs, Jul: 48 (+14%), Aug: 55 (+15%), Sep: 51 (-7%), Oct: 58 (+14%). Overall trend: 38% growth over 5 months with one seasonal dip. Average: 50.8 RFQs/month. Provide: 1) Detailed trend analysis with seasonality patterns, 2) Volume forecasting for next 3-6 months, 3) Capacity planning recommendations, 4) Resource allocation strategy for growth, 5) Market dynamics driving volume changes, 6) Buyer segmentation trends (new vs existing), 7) Conversion rate correlation with volume, 8) Revenue impact and pipeline health assessment.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { month: 'Jun', rfqs: 42 },
                  { month: 'Jul', rfqs: 48 },
                  { month: 'Aug', rfqs: 55 },
                  { month: 'Sep', rfqs: 51 },
                  { month: 'Oct', rfqs: 58 },
                ]}>
                  <defs>
                    <linearGradient id="rfqVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="rfqs" stroke="#57ACAF" strokeWidth={2} fill="url(#rfqVolumeGradient)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-[#6F83A7] mb-1">Growth Rate</div>
                  <div className="text-lg text-[#57ACAF]">+38%</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Monthly</div>
                  <div className="text-lg text-white">50.8</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-[#6F83A7] mb-1">Forecast Nov</div>
                  <div className="text-lg text-white">62</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottleneck Analysis */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white mb-1 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                  Bottleneck & Delay Analysis
                </h4>
                <p className="text-sm text-[#6F83A7]">Top factors causing delays in RFQ processing</p>
              </div>
              <MarbimAIButton
                marbimPrompt={`Analyze RFQ processing bottlenecks and delays. Top 5 delay factors: 1) Incomplete RFQ submissions (28% of delays, avg +1.5 days), 2) Fabric sourcing delays (22% of delays, avg +2.3 days), 3) Approval workflow bottlenecks (18% of delays, avg +1.8 days), 4) BOM template unavailable (16% of delays, avg +3.2 hours), 5) Cross-department coordination (16% of delays, avg +1.2 days). Provide: 1) Root cause analysis for each bottleneck, 2) Impact quantification (time, cost, win rate), 3) Prioritized resolution strategies, 4) Process redesign recommendations, 5) Technology solutions to automate or eliminate delays, 6) Organizational changes needed, 7) Quick wins vs long-term improvements, 8) Success metrics and tracking approach.`}
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  { reason: 'Incomplete RFQ submissions', impact: 'High', percentage: 28, delay: '+1.5 days' },
                  { reason: 'Fabric sourcing delays', impact: 'High', percentage: 22, delay: '+2.3 days' },
                  { reason: 'Approval workflow bottlenecks', impact: 'Medium', percentage: 18, delay: '+1.8 days' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white">{index + 1}. {item.reason}</div>
                      <Badge className={
                        item.impact === 'High' 
                          ? 'bg-[#D0342C]/10 text-[#D0342C] border-none'
                          : 'bg-[#EAB308]/10 text-[#EAB308] border-none'
                      }>
                        {item.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">{item.percentage}% of delays</span>
                      <span className="text-xs text-[#EAB308]">{item.delay} avg</span>
                    </div>
                    <Progress value={item.percentage * 3} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { reason: 'BOM template unavailable', impact: 'Medium', percentage: 16, delay: '+3.2 hours' },
                  { reason: 'Cross-department coordination', impact: 'Medium', percentage: 16, delay: '+1.2 days' },
                  { reason: 'Technical spec clarifications', impact: 'Low', percentage: 10, delay: '+0.8 days' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white">{index + 4}. {item.reason}</div>
                      <Badge className={
                        item.impact === 'Medium' 
                          ? 'bg-[#EAB308]/10 text-[#EAB308] border-none'
                          : 'bg-[#6F83A7]/10 text-[#6F83A7] border-none'
                      }>
                        {item.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6F83A7]">{item.percentage}% of delays</span>
                      <span className="text-xs text-[#EAB308]">{item.delay} avg</span>
                    </div>
                    <Progress value={item.percentage * 3} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Automation Impact */}
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#57ACAF]" />
                    AI Automation Impact
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Time & cost savings from AI</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze AI automation impact on RFQ operations. Metrics: BOM templates used: 8 RFQs/month (65% time saved), Auto-parsing accuracy: 94%, Clarification drafting: 100% of pending RFQs, Win probability prediction: 18 quoted RFQs. Total time saved: 156 hours/month. Cost savings: $12,480/month. Provide: 1) Detailed ROI analysis of AI automation, 2) Accuracy and reliability assessment, 3) Areas for expanded AI usage, 4) Human-AI collaboration optimization, 5) Risk mitigation for over-automation, 6) Training needs for AI-assisted workflows, 7) Technology investment priorities, 8) Competitive advantages from AI adoption.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Time Saved/Month</div>
                  <div className="text-2xl text-[#57ACAF]">156 hrs</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Cost Savings/Month</div>
                  <div className="text-2xl text-[#57ACAF]">$12.5K</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">RFQs AI-Assisted</div>
                  <div className="text-2xl text-white">26</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                    Win Rate Optimization
                  </h4>
                  <p className="text-sm text-[#6F83A7]">AI-driven conversion improvements</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze win rate optimization strategies. Current state: 68% win rate (+5% vs last month), AI win probability predictions: 82% accuracy, High-probability quotes identified: 8 (projected $240K), At-risk quotes flagged: 3 (intervention opportunity). Historical baseline: 63% win rate pre-AI. Improvement: +5% absolute, +8% relative. Provide: 1) AI prediction accuracy assessment and validation, 2) Win rate improvement attribution (pricing, timing, engagement), 3) Strategies to maintain or improve current trajectory, 4) Success stories and case studies, 5) Learnings from lost quotes, 6) Competitive intelligence insights, 7) Future optimization opportunities.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Current Win Rate</div>
                  <div className="text-2xl text-[#57ACAF]">68%</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Improvement</div>
                  <div className="text-2xl text-[#57ACAF]">+5%</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">AI Prediction Accuracy</div>
                  <div className="text-2xl text-white">82%</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Award className="w-5 h-5 text-white" />
                    Pipeline Health Score
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Overall RFQ pipeline quality</p>
                </div>
                <MarbimAIButton
                  marbimPrompt={`Analyze overall RFQ pipeline health. Components: Volume trend (+38% growth), Win rate (68%, +5%), Processing efficiency (1.6 days avg, 18% improvement), Pipeline value ($486K in quoted stage), Bottleneck severity (2 critical, 4 medium), Quality score (94% parsing accuracy, 12% clarification rate). Overall health score: 85/100 (Excellent). Provide: 1) Composite health scoring methodology, 2) Strengths to leverage and maintain, 3) Weaknesses requiring attention, 4) Risk factors and mitigation strategies, 5) Benchmarking vs industry standards, 6) Strategic recommendations for leadership, 7) Investment priorities for continued improvement.`}
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Health Score</div>
                  <div className="text-2xl text-[#57ACAF]">85/100</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Status</div>
                  <div className="text-sm text-[#57ACAF]">Excellent</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Trend</div>
                  <div className="text-sm text-[#57ACAF] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Improving
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">AI Strategic Recommendations</h4>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Based on comprehensive analysis of all RFQ data, MARBIM recommends the following priorities:
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  priority: 'High', 
                  action: 'Address fabric sourcing bottleneck', 
                  impact: '$45K value at risk',
                  timeline: 'Immediate'
                },
                { 
                  priority: 'High', 
                  action: 'Streamline approval workflow', 
                  impact: '1.8 days saved per RFQ',
                  timeline: '2 weeks'
                },
                { 
                  priority: 'Medium', 
                  action: 'Expand BOM template library', 
                  impact: '3.2 hours saved per RFQ',
                  timeline: '1 month'
                },
                { 
                  priority: 'Medium', 
                  action: 'Buyer education program on complete submissions', 
                  impact: '28% reduction in clarifications',
                  timeline: '6 weeks'
                },
              ].map((rec, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={
                      rec.priority === 'High'
                        ? 'bg-[#D0342C]/10 text-[#D0342C] border-none'
                        : 'bg-[#EAB308]/10 text-[#EAB308] border-none'
                    }>
                      {rec.priority} Priority
                    </Badge>
                    <div className="text-xs text-[#6F83A7]">{rec.timeline}</div>
                  </div>
                  <div className="text-sm text-white mb-2">{rec.action}</div>
                  <div className="text-xs text-[#57ACAF]">Impact: {rec.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderQuotationBuilder = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Quotation Builder</h2>
          <p className="text-sm text-[#6F83A7]">Build, simulate, and approve multiple quote scenarios</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
            onClick={() => setCreateScenarioDrawerOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Scenario
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scenario-builder" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="scenario-builder" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Layers className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Scenario Builder</span>
            </TabsTrigger>
            <TabsTrigger 
              value="approval-workflow" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckSquare className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Approval Workflow</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comparative-analytics" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <BarChart3 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Comparative Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="scenario-builder" className="space-y-6">
          {/* KPI Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <Layers className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Total Scenarios</div>
              </div>
              <div className="text-3xl text-white mb-1">3</div>
              <div className="text-xs text-[#6F83A7]">Active scenarios</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">Recommended</div>
              </div>
              <div className="text-3xl text-[#EAB308] mb-1">Scenario B</div>
              <div className="text-xs text-[#6F83A7]">12% margin, 72% win prob</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">FOB Range</div>
              </div>
              <div className="text-3xl text-white mb-1">$5.50-6.25</div>
              <div className="text-xs text-[#6F83A7]">Price spread</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Avg Win Rate</div>
              </div>
              <div className="text-3xl text-white mb-1">65%</div>
              <div className="text-xs text-[#57ACAF]">Across all scenarios</div>
            </div>
          </div>

          {/* Main Scenarios Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white mb-1">Quote Scenarios</h3>
                <p className="text-sm text-[#6F83A7]">Build and compare multiple pricing and margin scenarios</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze all quotation scenarios for optimization opportunities. Current scenarios: A-Premium (18% margin, $6.25 FOB, 45d lead time, Organic Cotton, 58% win prob), B-Competitive (12% margin, $5.85 FOB, 35d lead time, Standard Cotton, 72% win prob - RECOMMENDED), C-Budget (8% margin, $5.50 FOB, 50d lead time, Blended Cotton, 65% win prob). Provide: 1) Deep analysis of margin vs win probability trade-offs across scenarios, 2) Optimal pricing strategy based on buyer's historical acceptance patterns, 3) Fabric choice impact on buyer perception and sustainability goals, 4) Lead time competitiveness and production capacity alignment, 5) Risk assessment for each scenario (margin risk, production risk, competitive risk), 6) Scenario refinement suggestions to maximize expected value, 7) Alternative scenarios worth exploring, 8) Decision framework for scenario selection based on strategic priorities."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EAB308]"></div>
              </div>
            ) : (
              <SmartTable
                columns={quotationScenariosColumns}
                data={scenarios}
                searchPlaceholder="Search scenarios..."
                onRowClick={handleRowClick}
              />
            )}
          </div>

          {/* Scenario Analytics Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Margin vs Win Probability Chart */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    Margin vs Win Probability
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Historical correlation analysis</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze the margin-win probability correlation across all scenarios. Data shows inverse relationship: 8% margin = 65% win rate, 12% margin = 72% win rate (optimal sweet spot), 18% margin = 58% win rate (premium positioning but lower conversion). Provide: 1) Statistical analysis of the margin-win probability curve, 2) Identification of optimal margin sweet spot for this buyer, 3) Competitive intelligence on market pricing levels, 4) Margin elasticity analysis (how much can we increase margin before win rate drops significantly), 5) Value-based pricing opportunities to justify higher margins, 6) Buyer-specific margin tolerance based on relationship strength, 7) Scenario B recommendation validation with supporting data."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { scenario: 'C (8%)', margin: 8, winProb: 65 },
                  { scenario: 'B (12%)', margin: 12, winProb: 72 },
                  { scenario: 'A (18%)', margin: 18, winProb: 58 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="scenario" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 11 }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === 'winProb') return [`${value}%`, 'Win Probability'];
                      if (name === 'margin') return [`${value}%`, 'Margin'];
                      return [value, name];
                    }}
                  />
                  <Line type="monotone" dataKey="winProb" stroke="#57ACAF" strokeWidth={3} dot={{ fill: '#57ACAF', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="text-xs text-[#57ACAF] mb-1">Optimal Sweet Spot</div>
                <div className="text-sm text-white">12% margin maximizes win probability at 72%</div>
              </div>
            </div>

            {/* Lead Time Impact */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#EAB308]" />
                    Lead Time Analysis
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Production timeline comparison</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze lead time impact on scenario competitiveness. Scenario breakdown: A - 45 days (standard, low competitive risk), B - 35 days (FAST, high competitive advantage), C - 50 days (extended, may impact buyer urgency). Buyer's historical acceptance: typically 30-40 day range. Production capacity analysis needed. Provide: 1) Lead time competitiveness assessment vs market standards, 2) Production line allocation strategy for 35-day commitment (Scenario B), 3) Risk analysis of missing lead time commitments, 4) Buyer urgency assessment and timeline sensitivity, 5) Premium pricing justification for faster delivery if applicable, 6) Capacity planning implications for each scenario, 7) Alternative lead time options with minimal impact on win probability."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                {[
                  { scenario: 'Scenario B - 35 days', status: 'Optimal', color: '#57ACAF', desc: 'Fastest turnaround, high buyer appeal' },
                  { scenario: 'Scenario A - 45 days', status: 'Standard', color: '#6F83A7', desc: 'Industry average, safe commitment' },
                  { scenario: 'Scenario C - 50 days', status: 'Extended', color: '#EAB308', desc: 'May reduce buyer urgency' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white">{item.scenario}</div>
                      <Badge className="border-none" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#6F83A7]">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Margin Optimization Insight */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Margin Optimization & Scenario Recommendation</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM recommends <span className="text-[#EAB308]">Scenario B (Competitive)</span> based on comprehensive analysis of historical win/loss data, buyer preferences, and competitive positioning. This scenario offers optimal balance between profitability (12% margin) and high win probability (72%).
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Recommended Margin</div>
                      <div className="text-lg text-[#EAB308]">12%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Expected Win Rate</div>
                      <div className="text-lg text-[#57ACAF]">72%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Projected Revenue</div>
                      <div className="text-lg text-white">$45.8K</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide comprehensive scenario optimization analysis for this quotation. Context: 3 scenarios built (Premium/Competitive/Budget), Scenario B recommended by AI (12% margin, $5.85 FOB, 35d lead time, 72% win probability). Buyer historical data: typically accepts 10-15% margins, 30-40 day lead times, prefers value positioning over premium. Provide: 1) Detailed rationale for Scenario B recommendation with supporting data, 2) Risk/reward analysis for each scenario with quantified expected values, 3) Sensitivity analysis: how changes in margin, price, or lead time affect win probability, 4) Alternative scenario suggestions (e.g., hybrid approaches), 5) Negotiation strategy if buyer pushes back on pricing, 6) Contingency plans if Scenario B doesn't close, 7) Long-term strategic implications of each scenario choice, 8) Competitive intelligence on likely competitor positioning."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Fabric & Material Impact Analysis */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-white mb-1 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#57ACAF]" />
                  Fabric Choice Impact Analysis
                </h4>
                <p className="text-sm text-[#6F83A7]">Material selection effect on buyer perception and cost</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze fabric choice impact on scenario competitiveness and buyer acceptance. Scenario fabrics: A - Organic Cotton (premium positioning, sustainability benefit, +$0.40 cost), B - Standard Cotton (balanced quality/cost, buyer's typical preference), C - Blended Cotton (cost-effective, slight quality trade-off, -$0.35 savings). Buyer sustainability initiatives: Medium priority. Provide: 1) Fabric cost-benefit analysis for each scenario, 2) Buyer's fabric preferences based on historical orders, 3) Sustainability positioning opportunities with Organic Cotton, 4) Quality perception and brand alignment for each fabric type, 5) Price premium justification strategies for higher-quality fabrics, 6) Supply chain availability and lead time implications, 7) Alternative fabric recommendations that balance cost, quality, and sustainability, 8) Competitive fabric positioning in the market."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Organic Cotton', scenario: 'A', cost: '+$0.40', benefit: 'Sustainability appeal', color: '#57ACAF' },
                { name: 'Standard Cotton', scenario: 'B', cost: 'Baseline', benefit: 'Buyer preference', color: '#EAB308' },
                { name: 'Blended Cotton', scenario: 'C', cost: '-$0.35', benefit: 'Cost savings', color: '#6F83A7' },
              ].map((fabric, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-white">{fabric.name}</div>
                    <Badge className="border-none" style={{ backgroundColor: `${fabric.color}20`, color: fabric.color }}>
                      Scenario {fabric.scenario}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6F83A7]">Cost Impact</span>
                      <span className="text-white">{fabric.cost}</span>
                    </div>
                    <div className="text-[#6F83A7]">{fabric.benefit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approval-workflow" className="space-y-6">
          {/* Workflow Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Completed</div>
              </div>
              <div className="text-3xl text-white mb-1">2</div>
              <div className="text-xs text-[#6F83A7]">Approvals done</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">Active</div>
              </div>
              <div className="text-3xl text-[#EAB308] mb-1">1</div>
              <div className="text-xs text-[#6F83A7]">Director review</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Pending</div>
              </div>
              <div className="text-3xl text-white mb-1">2</div>
              <div className="text-xs text-[#6F83A7]">Next stages</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Avg Time</div>
              </div>
              <div className="text-3xl text-white mb-1">1.2d</div>
              <div className="text-xs text-[#57ACAF]">Per approval</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Compliance</div>
              </div>
              <div className="text-3xl text-[#57ACAF] mb-1">✓</div>
              <div className="text-xs text-[#6F83A7]">All checks passed</div>
            </div>
          </div>

          {/* Workflow Progress Stepper */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <CheckSquare className="w-5 h-5 text-[#EAB308]" />
                  <div className="flex-1 text-left">
                    <div className="text-white">Approval Trail & Workflow Progress</div>
                    <div className="text-xs text-[#6F83A7]">Step 3 of 5: Director Approval (In Progress)</div>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-[#6F83A7]" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-[#6F83A7]">Multi-level approval workflow ensuring proper authorization and compliance validation</p>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Analyze approval workflow efficiency and bottlenecks. Current workflow: 5 stages (Merchandiser Review → Manager Approval → Director Approval → Quote Generation → Buyer Submission). Status: 2 completed (Merchandiser, Manager), 1 active (Director - in progress), 2 pending. Avg time per approval: 1.2 days. Total elapsed: 2.4 days so far. Provide: 1) Workflow efficiency analysis and benchmark comparison, 2) Bottleneck identification in approval chain, 3) Director approval delay assessment and escalation recommendations, 4) Historical approval patterns for this type of quote, 5) Parallel approval opportunities to reduce cycle time, 6) Automated approval criteria where human review isn't critical, 7) SLA compliance tracking and risk of missing deadlines, 8) Process optimization recommendations to streamline approvals."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
                <WorkflowStepper
                  steps={[
                    { label: 'Merchandiser Review', status: 'completed' },
                    { label: 'Manager Approval', status: 'completed' },
                    { label: 'Director Approval', status: 'active' },
                    { label: 'Quote Generation', status: 'pending' },
                    { label: 'Buyer Submission', status: 'pending' },
                  ]}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Approval Details Cards */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white mb-1">Approval Details & Signoffs</h3>
                <p className="text-sm text-[#6F83A7]">Complete approval trail with timestamps and reviewer notes</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze approval feedback and decision patterns. Approvals completed: Merchandiser (Oct 25, 'Margins look good'), Manager (Oct 26, 'Lead time acceptable'). Director approval: Pending (awaiting decision). Historical context: similar quotes typically approved by Director in 0.8-1.5 days. No rejections in approval chain so far. Provide: 1) Analysis of approver feedback and any concerns raised, 2) Prediction of Director approval likelihood and timing, 3) Risk factors that might cause Director to reject or request changes, 4) Recommended proactive actions to facilitate approval, 5) Escalation strategy if Director approval delayed beyond SLA, 6) Alternative approval paths or delegated authority options, 7) Approval quality assessment: are approvers catching key issues?, 8) Recommendations to improve approval process based on feedback patterns."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { 
                  approver: 'Merchandiser', 
                  name: 'Sarah M.', 
                  status: 'Approved', 
                  date: '2024-10-25 10:45 AM', 
                  duration: '4.2 hours',
                  notes: 'Margins look good. Scenario B recommendation aligns with buyer historical preferences. No concerns raised.',
                  concerns: []
                },
                { 
                  approver: 'Manager', 
                  name: 'John K.', 
                  status: 'Approved', 
                  date: '2024-10-26 2:30 PM', 
                  duration: '6.5 hours',
                  notes: 'Lead time acceptable. Production capacity confirmed for 35-day commitment. Proceed with confidence.',
                  concerns: []
                },
                { 
                  approver: 'Director', 
                  name: 'Michael R.', 
                  status: 'Pending', 
                  date: 'In Progress', 
                  duration: '18 hours elapsed',
                  notes: 'Awaiting final review and authorization. Expected decision by Oct 27 5:00 PM.',
                  concerns: ['High-value quote requires executive review']
                },
              ].map((approval, index) => (
                <div key={index} className={`bg-gradient-to-br ${approval.status === 'Approved' ? 'from-[#57ACAF]/10 to-[#57ACAF]/5 border-[#57ACAF]/20' : 'from-[#EAB308]/10 to-[#EAB308]/5 border-[#EAB308]/20'} border rounded-xl p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-white mb-1">{approval.approver}</div>
                      <div className="text-sm text-[#6F83A7]">{approval.name}</div>
                    </div>
                    <Badge className={approval.status === 'Approved' ? 'bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30' : 'bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30'}>
                      {approval.status}
                    </Badge>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6F83A7]">Date/Time</span>
                      <span className="text-white text-xs">{approval.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6F83A7]">Duration</span>
                      <span className="text-white">{approval.duration}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-[#6F83A7] mb-2 text-xs">Reviewer Notes:</div>
                      <div className="text-white text-xs leading-relaxed">{approval.notes}</div>
                    </div>
                    {approval.concerns.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-[#EAB308] mb-2 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Considerations:
                        </div>
                        {approval.concerns.map((concern, i) => (
                          <div key={i} className="text-xs text-[#6F83A7]">• {concern}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Validation Panel */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Compliance Validation & Pre-Submission Checks</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM validates that all compliance requirements and costing thresholds are met before final submission. <span className="text-[#57ACAF]">All checks passed ✓</span> - quote ready for submission upon Director approval.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                        <div className="text-xs text-[#6F83A7]">Margin Policy</div>
                      </div>
                      <div className="text-sm text-[#57ACAF]">Passed</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                        <div className="text-xs text-[#6F83A7]">Cost Accuracy</div>
                      </div>
                      <div className="text-sm text-[#57ACAF]">Verified</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                        <div className="text-xs text-[#6F83A7]">Approval Chain</div>
                      </div>
                      <div className="text-sm text-[#57ACAF]">Valid</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
                        <div className="text-xs text-[#6F83A7]">Documentation</div>
                      </div>
                      <div className="text-sm text-[#57ACAF]">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze compliance validation and pre-submission readiness. Compliance checks performed: 1) Margin Policy Compliance (✓ Passed - 12% margin within 8-20% policy range), 2) Cost Accuracy Verification (✓ Verified - BOM validated, no missing line items), 3) Approval Chain Integrity (✓ Valid - proper authorization hierarchy followed), 4) Documentation Completeness (✓ Complete - all required attachments present). Overall status: READY FOR SUBMISSION upon Director approval. Provide: 1) Detailed compliance validation report with all check results, 2) Risk assessment of any edge cases or gray areas in compliance, 3) Historical compliance issues for similar quotes and lessons learned, 4) Automated vs manual validation breakdown, 5) Recommendations to strengthen compliance processes, 6) Post-submission monitoring requirements, 7) Escalation procedures if compliance issues discovered after submission, 8) Audit trail documentation for compliance reporting."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Approval Timeline & SLA Tracking */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-white mb-1 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#EAB308]" />
                  Approval Timeline & SLA Performance
                </h4>
                <p className="text-sm text-[#6F83A7]">Time tracking and deadline adherence across approval stages</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze approval timeline and SLA performance. Timeline breakdown: Merchandiser (4.2 hours - within 6h SLA ✓), Manager (6.5 hours - within 8h SLA ✓), Director (18 hours elapsed, 24h SLA - on track). Total elapsed: 28.7 hours (2.4 days). Target total cycle time: 3 days (72 hours). Current pace: on track to meet deadline. Historical avg: 2.8 days for similar quotes. Provide: 1) SLA compliance analysis for each stage and overall workflow, 2) Bottleneck identification and time-consuming approval factors, 3) Forecast of final approval completion time with confidence intervals, 4) Risk assessment of missing SLA deadlines, 5) Comparison to historical approval timelines for benchmarking, 6) Recommendations to accelerate approval without compromising quality, 7) Early warning indicators for approval delays, 8) Process improvements to reduce cycle time."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="space-y-3">
              {[
                { stage: 'Merchandiser Review', target: '6 hours', actual: '4.2 hours', status: 'On Time', variance: '-30%', color: '#57ACAF' },
                { stage: 'Manager Approval', target: '8 hours', actual: '6.5 hours', status: 'On Time', variance: '-19%', color: '#57ACAF' },
                { stage: 'Director Approval', target: '24 hours', actual: '18h elapsed', status: 'In Progress', variance: 'On track', color: '#EAB308' },
                { stage: 'Quote Generation', target: '4 hours', actual: 'Pending', status: 'Not Started', variance: '-', color: '#6F83A7' },
                { stage: 'Buyer Submission', target: '2 hours', actual: 'Pending', status: 'Not Started', variance: '-', color: '#6F83A7' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <div className="text-sm text-white mb-1">{item.stage}</div>
                      <div className="text-xs text-[#6F83A7]">Target: {item.target}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-white">{item.actual}</div>
                      <div className="text-xs" style={{ color: item.color }}>{item.variance}</div>
                    </div>
                    <Badge className="border-none min-w-[90px] justify-center" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#6F83A7] mb-1">Overall Progress</div>
                  <div className="text-sm text-white">40% complete • 2.4 days elapsed • Est. completion: Oct 27</div>
                </div>
                <div className="text-2xl text-[#57ACAF]">On Track ✓</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparative-analytics" className="space-y-6">
          {/* Comprehensive Comparison Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-white mb-1">Comprehensive Scenario Comparison Matrix</h3>
                <p className="text-sm text-[#6F83A7]">Side-by-side analysis of all pricing, margin, and operational parameters</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide comprehensive comparative analysis across all 3 quotation scenarios. Scenario A (Premium): 18% margin, $6.25 FOB, 45d lead time, Organic Cotton, 58% win prob. Scenario B (Competitive - RECOMMENDED): 12% margin, $5.85 FOB, 35d lead time, Standard Cotton, 72% win prob. Scenario C (Budget): 8% margin, $5.50 FOB, 50d lead time, Blended Cotton, 65% win prob. Provide: 1) Multi-dimensional comparison highlighting trade-offs between scenarios, 2) Expected value calculation for each scenario (win prob × potential revenue × margin), 3) Risk-adjusted return analysis considering production risk, buyer risk, margin risk, 4) Scenario sensitivity analysis: what happens if variables change?, 5) Strategic positioning: when to use each scenario (premium buyers vs price-sensitive), 6) Competitive landscape: how do these scenarios compare to market?, 7) Decision matrix framework for scenario selection, 8) Hybrid scenario possibilities combining best elements."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[#6F83A7] py-4 px-4 font-normal">Criteria</th>
                    <th className="text-left text-white py-4 px-4">Scenario A<br/><span className="text-xs text-[#6F83A7] font-normal">Premium</span></th>
                    <th className="text-left text-white py-4 px-4">Scenario B<br/><span className="text-xs text-[#EAB308] font-normal">Recommended ✓</span></th>
                    <th className="text-left text-white py-4 px-4">Scenario C<br/><span className="text-xs text-[#6F83A7] font-normal">Budget</span></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Margin %
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">18%</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">12% ✓</td>
                    <td className="py-4 px-4 text-white">8%</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        FOB Price
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">$6.25</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">$5.85 ✓</td>
                    <td className="py-4 px-4 text-white">$5.50</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Lead Time
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">45 days</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">35 days ✓</td>
                    <td className="py-4 px-4 text-white">50 days</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Fabric Choice
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">Organic Cotton</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">Standard Cotton ✓</td>
                    <td className="py-4 px-4 text-white">Blended Cotton</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Win Probability
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">58%</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">72% ✓</td>
                    <td className="py-4 px-4 text-white">65%</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Expected Value
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">$26.5K</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">$33.0K ✓</td>
                    <td className="py-4 px-4 text-white">$28.6K</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Revenue Potential
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">$45.7K</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">$45.8K ✓</td>
                    <td className="py-4 px-4 text-white">$44.0K</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Production Risk
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">Medium</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">Moderate ✓</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Low</Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-[#6F83A7]">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Positioning
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">Premium/Sustainability</td>
                    <td className="py-4 px-4 text-[#57ACAF] font-medium">Value/Balanced ✓</td>
                    <td className="py-4 px-4 text-white">Cost-Competitive</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Comparison Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Expected Value Comparison */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                    Expected Value Analysis
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Risk-adjusted revenue potential (win prob × revenue × margin)</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze expected value calculations across scenarios. Methodology: Expected Value = Win Probability × Potential Revenue × Gross Margin. Results: Scenario A: 58% × $45.7K × 18% = $26.5K, Scenario B: 72% × $45.8K × 12% = $33.0K (HIGHEST), Scenario C: 65% × $44.0K × 8% = $28.6K. Scenario B delivers highest expected value despite lower margin due to superior win probability and pricing optimization. Provide: 1) Validation of expected value calculation methodology, 2) Sensitivity analysis: how EV changes with ±5% in variables, 3) Confidence intervals around expected value estimates, 4) Break-even analysis: at what win probability does each scenario become optimal?, 5) Risk-adjusted returns considering downside scenarios, 6) Portfolio approach: mix of scenarios to maximize overall expected value, 7) Monte Carlo simulation results for probabilistic outcomes, 8) Strategic recommendations based on expected value framework."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { scenario: 'A', value: 26.5, color: '#6F83A7' },
                  { scenario: 'B', value: 33.0, color: '#57ACAF' },
                  { scenario: 'C', value: 28.6, color: '#EAB308' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="scenario" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} label={{ value: 'Expected Value ($K)', angle: -90, position: 'insideLeft', fill: '#6F83A7' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: any) => [`$${value}K`, 'Expected Value']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#6F83A7' : index === 1 ? '#57ACAF' : '#EAB308'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="text-xs text-[#57ACAF] mb-1">Winner: Scenario B</div>
                <div className="text-sm text-white">$33.0K expected value (+24% vs Scenario A)</div>
              </div>
            </div>

            {/* Multi-Factor Radar/Spider Chart */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#EAB308]" />
                    Multi-Factor Scoring
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Weighted evaluation across key decision criteria</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze multi-factor scoring framework for scenario evaluation. Scoring criteria and weights: Win Probability (30% weight), Margin/Profitability (25%), Lead Time Competitiveness (20%), Cost/Pricing (15%), Strategic Fit (10%). Normalized scores (0-100): Scenario A: Win Prob 58, Margin 90, Lead Time 75, Price 60, Strategy 85 → Weighted: 70.9. Scenario B: Win Prob 72, Margin 60, Lead Time 95, Price 75, Strategy 80 → Weighted: 76.3 (HIGHEST). Scenario C: Win Prob 65, Margin 40, Lead Time 50, Price 90, Strategy 60 → Weighted: 61.0. Provide: 1) Validation of scoring criteria and weight allocation, 2) Alternative weighting scenarios based on strategic priorities, 3) Sensitivity of results to weight changes, 4) Qualitative factors not captured in quantitative scoring, 5) Scenario ranking under different weighting schemes, 6) Decision tree analysis for scenario selection, 7) Stakeholder perspective differences (sales vs finance), 8) Recommendations for framework refinement."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                {[
                  { scenario: 'Scenario B', score: 76.3, factors: 'High win prob, fast lead time, balanced margin', color: '#57ACAF' },
                  { scenario: 'Scenario A', score: 70.9, factors: 'Premium margin, sustainability angle', color: '#6F83A7' },
                  { scenario: 'Scenario C', score: 61.0, factors: 'Lowest price, conservative approach', color: '#EAB308' },
                ].map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-white">{item.scenario}</div>
                      <div className="text-lg" style={{ color: item.color }}>{item.score}</div>
                    </div>
                    <Progress value={item.score} className="h-2 mb-2" />
                    <div className="text-xs text-[#6F83A7]">{item.factors}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Strategic Recommendation */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Strategic Recommendation & Decision Rationale</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    Based on comprehensive comparative analysis, <span className="text-[#EAB308]">Scenario B (Competitive)</span> is the optimal choice for this buyer. It delivers the highest expected value ($33.0K), superior win probability (72%), and best alignment with buyer's historical preferences for 10-15% margins and 30-40 day lead times. While Scenario A offers higher margin, its premium positioning reduces conversion likelihood. Scenario C sacrifices too much profitability for marginal pricing advantage.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Recommendation</div>
                      <div className="text-sm text-[#EAB308]">Scenario B</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Confidence</div>
                      <div className="text-sm text-[#57ACAF]">High (87%)</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Expected Value</div>
                      <div className="text-sm text-white">$33.0K</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Risk Level</div>
                      <div className="text-sm text-[#EAB308]">Moderate</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide detailed strategic recommendation and decision rationale for scenario selection. Complete analysis: Scenario B recommended based on highest expected value ($33.0K, +24% vs A, +15% vs C), optimal win probability (72%, +14 pts vs A, +7 pts vs C), strong buyer alignment (historical 10-15% margin acceptance, 30-40d lead time preference), balanced risk profile (moderate production risk, high win confidence). Trade-off analysis: Scenario A higher margin but 14% lower win rate (premium positioning not justified for this buyer). Scenario C marginal price advantage but 4% lower margin cuts profitability significantly. Provide: 1) Comprehensive decision rationale with supporting data and logic, 2) Risk factors and mitigation strategies for recommended scenario, 3) Alternative scenarios to consider if buyer pushes back, 4) Negotiation strategy and concession limits, 5) Success metrics and KPIs to track post-submission, 6) Contingency planning if Scenario B doesn't convert, 7) Long-term strategic implications of scenario choice, 8) Competitive positioning and differentiation approach, 9) Executive summary for leadership approval."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Scenario Trade-off Matrix */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-white mb-1 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#57ACAF]" />
                  Scenario Trade-off Analysis
                </h4>
                <p className="text-sm text-[#6F83A7]">Key compromises and advantages across scenarios</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze trade-offs and strategic compromises across all scenarios. Scenario A Trade-offs: GAIN: +6% margin (+$2.7K profit), sustainability positioning, premium brand alignment. LOSE: -14% win probability, -$6.5K expected value, higher buyer resistance risk. Scenario B Trade-offs: GAIN: +14% win prob vs A, fastest lead time (35d competitive advantage), optimal expected value, buyer preference alignment. LOSE: -6% margin vs A, standard positioning (not differentiated). Scenario C Trade-offs: GAIN: Lowest price ($5.50, highest competitive pressure), lowest production risk (50d buffer), cost-effective approach. LOSE: -4% margin (significant profitability sacrifice), longest lead time (buyer may perceive as slow), -7% win prob vs B. Provide: 1) Detailed trade-off matrices with quantified impacts, 2) Strategic implications of each trade-off choice, 3) Buyer-specific trade-off preferences based on relationship history, 4) Market context: which trade-offs matter most in current environment?, 5) Long-term vs short-term trade-off considerations, 6) Hybrid scenarios combining favorable trade-offs, 7) Decision framework for evaluating trade-offs, 8) Stakeholder alignment on trade-off priorities."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  scenario: 'Scenario A',
                  gains: ['Highest margin (+6%)', 'Premium positioning', 'Sustainability appeal'],
                  losses: ['Lower win rate (-14%)', 'Price resistance risk', 'Lower expected value'],
                  color: '#6F83A7'
                },
                {
                  scenario: 'Scenario B ✓',
                  gains: ['Highest win prob (+14%)', 'Fastest lead time', 'Best expected value'],
                  losses: ['Moderate margin', 'Standard positioning'],
                  color: '#57ACAF'
                },
                {
                  scenario: 'Scenario C',
                  gains: ['Lowest price', 'Low prod risk', 'Cost competitive'],
                  losses: ['Lowest margin (-4%)', 'Longest lead time', 'Profitability sacrifice'],
                  color: '#EAB308'
                }
              ].map((item, index) => (
                <div key={index} className="p-5 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-white mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.scenario}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-[#57ACAF] mb-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Advantages
                      </div>
                      <div className="space-y-1">
                        {item.gains.map((gain, i) => (
                          <div key={i} className="text-xs text-[#6F83A7]">• {gain}</div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-xs text-[#D0342C] mb-2 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Trade-offs
                      </div>
                      <div className="space-y-1">
                        {item.losses.map((loss, i) => (
                          <div key={i} className="text-xs text-[#6F83A7]">• {loss}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Insight Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">AI Alerts</div>
              </div>
              <div className="text-3xl text-white mb-1">2</div>
              <div className="text-xs text-[#6F83A7]">Require attention</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Win Probability</div>
              </div>
              <div className="text-3xl text-[#57ACAF] mb-1">72%</div>
              <div className="text-xs text-[#6F83A7]">Scenario B</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">AI Confidence</div>
              </div>
              <div className="text-3xl text-white mb-1">87%</div>
              <div className="text-xs text-[#6F83A7]">High confidence</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Insights Generated</div>
              </div>
              <div className="text-3xl text-white mb-1">12</div>
              <div className="text-xs text-[#6F83A7]">For this quote</div>
            </div>
          </div>

          {/* Critical AI Alerts & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Alert Card */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white mb-1">Material Cost Alert</div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      Fabric price increased <span className="text-[#EAB308]">2% since last costing</span> (3 days ago). Current scenarios may have outdated base rates affecting margin accuracy. Update recommended before finalizing quote.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-[#6F83A7]">Previous Cost</div>
                        <div className="text-sm text-white">$4.85/yard</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-[#6F83A7]">Current Cost</div>
                        <div className="text-sm text-[#EAB308]">$4.95/yard</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10 bg-[rgba(255,255,255,0)]">
                      <RefreshCw className="w-3 h-3 mr-2" />
                      Recalculate All Scenarios
                    </Button>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze material cost fluctuation impact on quotation scenarios. Alert: Fabric price increased 2% (from $4.85 to $4.95/yard) since initial costing 3 days ago. Impact on scenarios: Scenario A: +$0.10 cost per unit (+1.6% FOB impact), margin drops from 18% to 16.8%. Scenario B: +$0.10 cost per unit (+1.7% FOB impact), margin drops from 12% to 10.5%. Scenario C: +$0.10 cost per unit (+1.8% FOB impact), margin drops from 8% to 6.5%. All scenarios below target margins if not updated. Provide: 1) Detailed cost impact analysis across all scenarios, 2) Revised pricing recommendations to maintain target margins, 3) Pass-through strategy: can we increase FOB or must we absorb cost?, 4) Competitive intelligence: have competitors adjusted pricing?, 5) Buyer notification strategy for price changes, 6) Hedging strategies for future material cost volatility, 7) Alternative materials or suppliers to mitigate cost pressure, 8) Risk assessment if we proceed without cost updates."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
            </div>

            {/* Buyer Preference Intelligence */}
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[#57ACAF]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white mb-1">Buyer Historical Preference Profile</div>
                    <p className="text-sm text-[#6F83A7] mb-3">
                      Based on <span className="text-[#57ACAF]">28 historical orders</span>, this buyer consistently accepts quotes with 10-15% margins and 30-40 day lead times. Price sensitivity: Moderate. Quality priority: High.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-xs text-[#6F83A7]">Typical Margin Range</span>
                        <span className="text-sm text-white">10-15%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-xs text-[#6F83A7]">Preferred Lead Time</span>
                        <span className="text-sm text-white">30-40 days</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-xs text-[#6F83A7]">Historical Win Rate</span>
                        <span className="text-sm text-[#57ACAF]">74%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze buyer's historical preferences and optimize quote strategy. Buyer profile: 28 historical orders, 74% win rate with this factory, typical margin acceptance 10-15%, preferred lead time 30-40 days, moderate price sensitivity, high quality priority. Purchasing patterns: 60% repeat styles, 40% new developments, average order value $48K, seasonal peaks in Q1 and Q3. Relationship strength: Strong (3 years partnership). Provide: 1) Comprehensive buyer behavior analysis and preference patterns, 2) Optimal pricing strategy based on historical acceptance thresholds, 3) Lead time positioning vs buyer's urgency patterns, 4) Quality vs price trade-off preferences for this buyer, 5) Negotiation approach and concession strategy, 6) Relationship leverage opportunities (loyalty, volume), 7) Red flags or deal-breakers to avoid based on past rejections, 8) Cross-sell and upsell opportunities based on buying history, 9) Long-term account development strategy."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Win Probability Analysis Chart */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-white mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                  Win Probability Curve by Margin
                </h3>
                <p className="text-sm text-[#6F83A7]">AI-predicted conversion rates across margin levels for this buyer</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze win probability curve and margin elasticity. Data points: 8% margin = 85% win prob (very high conversion but low profitability), 12% margin = 72% win prob (optimal sweet spot - recommended), 15% margin = 58% win prob (acceptable but lower conversion), 18% margin = 42% win prob (premium positioning with high risk). Clear inverse relationship with inflection point at 12%. Provide: 1) Statistical analysis of margin-win probability correlation, 2) Elasticity calculation: % change in win prob per 1% margin increase, 3) Optimal margin identification considering profitability and conversion, 4) Risk analysis: confidence intervals around win probability estimates, 5) Historical validation: how accurate have these predictions been?, 6) Buyer-specific factors influencing curve shape, 7) Competitive positioning impact on win probability, 8) Dynamic pricing strategy based on market conditions and buyer urgency."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[
                { margin: 8, probability: 85, label: '8%' },
                { margin: 12, probability: 72, label: '12% ✓' },
                { margin: 15, probability: 58, label: '15%' },
                { margin: 18, probability: 42, label: '18%' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="label" 
                  stroke="#6F83A7" 
                  tick={{ fill: '#6F83A7' }}
                  label={{ value: 'Margin %', position: 'insideBottom', offset: -5, fill: '#6F83A7' }}
                />
                <YAxis 
                  stroke="#6F83A7" 
                  tick={{ fill: '#6F83A7' }}
                  label={{ value: 'Win Probability %', angle: -90, position: 'insideLeft', fill: '#6F83A7' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  formatter={(value: any, name: string) => [`${value}%`, 'Win Probability']}
                />
                <Line 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="#57ACAF" 
                  strokeWidth={3} 
                  dot={{ fill: '#57ACAF', r: 6, strokeWidth: 2, stroke: '#0D1117' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Optimal Point</div>
                <div className="text-lg text-[#57ACAF]">12% margin</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Max Win Prob</div>
                <div className="text-lg text-white">85% @ 8%</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Elasticity</div>
                <div className="text-lg text-white">-4.3% / 1%</div>
              </div>
            </div>
          </div>

          {/* AI Strategic Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Competitive Intelligence */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#EAB308]" />
                    Competitive Intelligence
                  </h4>
                  <p className="text-sm text-[#6F83A7] mb-3">Market positioning analysis</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Provide competitive intelligence and market positioning analysis. Market context: 4-5 competitors likely bidding on this RFQ. Average market pricing: $5.70-6.10 FOB. Our Scenario B at $5.85 is mid-range (competitive but not lowest). Competitor strengths: Competitor A (low-cost leader, $5.50-5.70 range, 60-day lead times), Competitor B (quality leader, $6.00-6.30 range, 40-day lead times), Competitor C (balanced player, similar to our approach). Our differentiation: Relationship strength (3-year history), quality reputation, reliable delivery (98% on-time). Provide: 1) Detailed competitive landscape and positioning map, 2) Competitor pricing and capability analysis, 3) Our competitive advantages and how to emphasize them, 4) Vulnerabilities and how to mitigate them, 5) Win/loss analysis against each competitor historically, 6) Differentiation strategy beyond price, 7) Buyer's vendor preferences and switching costs, 8) Strategic recommendations for competitive positioning in this quote."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">Market Position</span>
                    <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">Competitive</Badge>
                  </div>
                  <div className="text-xs text-[#6F83A7]">Mid-range pricing, strong quality reputation</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-2">Est. Competitors</div>
                  <div className="text-lg text-white">4-5 bidders</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-2">Price Positioning</div>
                  <div className="text-sm text-[#57ACAF]">15% below premium, 6% above low-cost</div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#D0342C]" />
                    Risk Assessment
                  </h4>
                  <p className="text-sm text-[#6F83A7] mb-3">Quote and execution risk analysis</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Conduct comprehensive risk assessment for recommended Scenario B. Risk categories: 1) Win Risk (Moderate - 72% win prob means 28% loss risk, competitor undercut possibility, buyer budget constraints), 2) Margin Risk (Low - 12% margin well within policy, cost estimates validated, minimal input volatility short-term), 3) Production Risk (Moderate - 35-day lead time requires efficient production allocation, capacity constraints if delays occur, quality control with faster turnaround), 4) Material Risk (Medium - fabric cost increase 2% detected, further volatility possible, supply chain disruption potential), 5) Relationship Risk (Low - strong 3-year relationship, high trust, minimal non-payment risk). Provide: 1) Detailed risk scoring and impact analysis for each category, 2) Probability and severity assessment for key risks, 3) Risk mitigation strategies and contingency plans, 4) Early warning indicators to monitor, 5) Risk tolerance evaluation: is this acceptable?, 6) Alternative scenarios with different risk profiles, 7) Risk-adjusted decision framework, 8) Escalation triggers and response protocols."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                {[
                  { risk: 'Win Risk', level: 'Moderate', score: 28, color: '#EAB308' },
                  { risk: 'Margin Risk', level: 'Low', score: 15, color: '#57ACAF' },
                  { risk: 'Production Risk', level: 'Moderate', score: 32, color: '#EAB308' },
                  { risk: 'Material Risk', level: 'Medium', score: 38, color: '#D0342C' },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white">{item.risk}</span>
                      <Badge className="border-none" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                        {item.level}
                      </Badge>
                    </div>
                    <Progress value={item.score} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Success Factors */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#57ACAF]" />
                    Success Factors
                  </h4>
                  <p className="text-sm text-[#6F83A7] mb-3">Key drivers for winning this quote</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Identify and prioritize success factors for winning this quotation. Critical success factors: 1) Price Competitiveness (High importance - must be within 5% of market average, Scenario B achieves this), 2) Lead Time (High importance - buyer has urgent delivery needs, 35-day commitment is competitive advantage), 3) Quality Assurance (Medium importance - established track record mitigates concerns, QC processes in place), 4) Relationship Strength (Medium importance - 3-year history provides trust and loyalty, but not deterministic), 5) Payment Terms (Low importance - standard terms acceptable to buyer), 6) Communication & Responsiveness (High importance - timely quote submission and follow-up critical). Provide: 1) Prioritized success factor analysis with importance weights, 2) How well does Scenario B address each factor?, 3) Gaps and areas where we're vulnerable vs competition, 4) Enhancement strategies to strengthen weak factors, 5) Buyer's decision criteria and how they map to our strengths, 6) Winning strategy playbook based on success factors, 7) Post-submission actions to maximize win probability, 8) Success metrics to track throughout sales cycle."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-2">
                {[
                  { factor: 'Competitive Pricing', impact: 'High', status: '✓', color: '#57ACAF' },
                  { factor: 'Fast Lead Time', impact: 'High', status: '✓', color: '#57ACAF' },
                  { factor: 'Quality Track Record', impact: 'Medium', status: '✓', color: '#57ACAF' },
                  { factor: 'Relationship Strength', impact: 'Medium', status: '✓', color: '#57ACAF' },
                  { factor: 'Responsive Communication', impact: 'High', status: '✓', color: '#57ACAF' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-white">{item.factor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-white/10 text-[#6F83A7] border border-white/20 text-xs">
                        {item.impact}
                      </Badge>
                      <span className="text-[#57ACAF]">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Master Recommendation Panel */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-lg mb-2">MARBIM AI Master Recommendation</h4>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    Based on comprehensive analysis of all factors—historical buyer preferences, competitive positioning, margin optimization, risk assessment, and win probability modeling—<span className="text-[#57ACAF]">Scenario B (Competitive)</span> is the optimal choice with <span className="text-[#57ACAF]">87% confidence</span>. This scenario maximizes expected value ($33.0K) while maintaining acceptable risk levels and strong buyer alignment.
                  </p>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <div className="text-xs text-[#6F83A7] mb-1">Recommended</div>
                      <div className="text-sm text-[#57ACAF]">Scenario B</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <div className="text-xs text-[#6F83A7] mb-1">Win Probability</div>
                      <div className="text-sm text-white">72%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <div className="text-xs text-[#6F83A7] mb-1">Expected Value</div>
                      <div className="text-sm text-white">$33.0K</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <div className="text-xs text-[#6F83A7] mb-1">AI Confidence</div>
                      <div className="text-sm text-[#57ACAF]">87%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <div className="text-xs text-[#6F83A7] mb-1">Risk Level</div>
                      <div className="text-sm text-[#EAB308]">Moderate</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20">
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Proceed with Scenario B
                    </Button>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]">
                      <FileText className="w-4 h-4 mr-2" />
                      View Full Analysis
                    </Button>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide executive summary and final strategic recommendation for quotation decision. Comprehensive analysis completed across all dimensions: Scenario comparison (3 scenarios analyzed), Expected value modeling ($33.0K optimal for Scenario B, +24% vs A), Win probability prediction (72% for Scenario B using ML model with 87% confidence), Buyer preference alignment (strong match with 10-15% margin, 30-40d lead time historical pattern), Competitive positioning (mid-range pricing, quality differentiation), Risk assessment (moderate overall risk, manageable with mitigation strategies), Margin optimization (12% margin at optimal sweet spot on win probability curve), Material cost monitoring (2% increase detected, recalculation recommended). RECOMMENDATION: Proceed with Scenario B. RATIONALE: Highest expected value, strong buyer alignment, competitive positioning, acceptable risk profile, superior win probability. ACTION ITEMS: 1) Update material costs for price accuracy, 2) Obtain Director approval (currently in progress), 3) Submit quote within 24 hours, 4) Prepare follow-up strategy, 5) Monitor buyer engagement signals. Provide: 1) Executive summary suitable for C-level briefing, 2) Decision rationale and supporting evidence, 3) Key risks and mitigation strategies, 4) Success metrics and KPIs to track, 5) Post-submission action plan, 6) Contingency scenarios if Scenario B doesn't convert, 7) Long-term strategic implications, 8) Lessons learned and process improvements for future quotes."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderClarificationTracker = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Clarification Tracker</h2>
          <p className="text-sm text-[#6F83A7]">Tracks pending and resolved clarification items across buyers and RFQs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Send Clarification
          </Button>
        </div>
      </div>

      <Tabs defaultValue="open-clarifications" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="open-clarifications" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <AlertCircle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Open Clarifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="resolved-clarifications" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <CheckCircle2 className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Resolved Clarifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buyer-response-logs" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <MessageSquare className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Buyer Response Logs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="open-clarifications" className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">Open Clarifications</div>
              </div>
              <div className="text-3xl text-white mb-1">5</div>
              <div className="text-xs text-[#6F83A7]">Pending buyer response</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#D0342C]" />
                <div className="text-[#6F83A7] text-sm">Overdue</div>
              </div>
              <div className="text-3xl text-[#D0342C] mb-1">2</div>
              <div className="text-xs text-[#6F83A7]">Requires follow-up</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Avg Response Time</div>
              </div>
              <div className="text-3xl text-white mb-1">1.2d</div>
              <div className="text-xs text-[#57ACAF]">18% improvement</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Resolution Rate</div>
              </div>
              <div className="text-3xl text-white mb-1">92%</div>
              <div className="text-xs text-[#6F83A7]">Successfully resolved</div>
            </div>
          </div>

          {/* AI Priority Intelligence Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Clarification Priority Intelligence</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM has analyzed <span className="text-[#EAB308]">5 open clarifications</span> including <span className="text-[#D0342C]">2 overdue items</span>. 
                    Auto-drafted clarification requests available for all pending items with <span className="text-[#57ACAF]">94% buyer acceptance rate</span>. 
                    Critical high-value RFQs flagged for priority escalation.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">High Priority</div>
                      <div className="text-lg text-[#D0342C]">2</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Auto-Drafted</div>
                      <div className="text-lg text-[#57ACAF]">5</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Pending Days</div>
                      <div className="text-lg text-white">1.8</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Est. Impact</div>
                      <div className="text-lg text-[#EAB308]">$128K</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze open clarification requests and provide strategic recommendations. Current state: 5 open clarifications (2 overdue >3 days, 3 pending <2 days), total RFQ value at risk: $128K, average response time: 1.2 days (18% improvement vs baseline), 92% resolution rate, 5 auto-drafted messages ready. Critical items: 2 high-value RFQs from H&M ($45K) and Gap ($38K) both overdue. Provide: 1) Prioritized action plan for overdue clarifications with escalation strategy, 2) Root cause analysis of delays and buyer response patterns, 3) Optimized follow-up timing based on buyer-specific behavior, 4) Communication templates and tone recommendations per buyer relationship strength, 5) Impact analysis of clarification delays on quote submission timelines and win probability, 6) Process improvements to reduce clarification rate from current 12% baseline, 7) Buyer education strategy to improve RFQ submission completeness, 8) Risk mitigation for high-value at-risk RFQs."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Open Clarifications Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white mb-1">Open Clarification Requests</h3>
                <p className="text-sm text-[#6F83A7]">Active clarifications awaiting buyer response</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze individual open clarification items for optimization. Breakdown: CLR-2024-421 (H&M, GSM specification, pending 1 day, high value $45K), CLR-2024-422 (ACME Fashion, wash test method, OVERDUE 3 days, medium value $22K), CLR-2024-423 (Gap, label placement, pending 1 day, high value $38K). Buyer response patterns: H&M typically responds in 0.8 days (excellent), ACME in 3.8 days (very slow - red flag), Gap in 1.4 days (good). Provide: 1) Item-by-item analysis with recommended actions and urgency levels, 2) Buyer-specific communication strategies based on relationship history, 3) Optimal send times and follow-up cadences per buyer, 4) Escalation triggers and paths for unresponsive buyers, 5) Alternative approaches if clarification remains unresolved, 6) Impact on quote submission deadlines and mitigation strategies, 7) Draft follow-up messages with appropriate tone per buyer."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <SmartTable
              columns={openClarificationsColumns}
              data={openClarificationsData}
              searchPlaceholder="Search clarifications..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Overdue Items Analysis */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                    Overdue Clarification Impact
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Risk analysis for delayed responses</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze overdue clarification items and quantify business impact. Current overdue items: 2 clarifications (CLR-2024-422 from ACME - 3 days overdue, CLR-2024-420 - 5 days overdue). Total value at risk: $52K. Average delay impact: +2.5 days to quote submission per overdue clarification, estimated -15% reduction in win probability per week of delay. Historical pattern: ACME Fashion has 3.8 day avg response time (slowest in portfolio). Provide: 1) Quantified business impact of delays (revenue risk, win rate impact, relationship damage), 2) Buyer segmentation by responsiveness with tailored strategies, 3) Escalation protocols for overdue items (when to involve senior stakeholders), 4) Alternative approaches when buyers are unresponsive (proceed with assumptions, request extension), 5) Contractual/SLA considerations for chronic slow responders, 6) Preventive measures to reduce overdue rate, 7) Communication templates for urgent follow-up."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#D0342C]/5 border border-[#D0342C]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-white">CLR-2024-422 - ACME Fashion</div>
                    <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none">3 days overdue</Badge>
                  </div>
                  <div className="text-xs text-[#6F83A7] mb-2">Wash test method not specified</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6F83A7]">RFQ Value at Risk:</span>
                    <span className="text-xs text-[#D0342C]">$22K</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[#D0342C]/5 border border-[#D0342C]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-white">CLR-2024-420 - Uniqlo</div>
                    <Badge className="bg-[#D0342C]/10 text-[#D0342C] border-none">5 days overdue</Badge>
                  </div>
                  <div className="text-xs text-[#6F83A7] mb-2">Size run confirmation needed</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6F83A7]">RFQ Value at Risk:</span>
                    <span className="text-xs text-[#D0342C]">$30K</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-[#6F83A7] mb-1">Total at Risk</div>
                    <div className="text-lg text-[#D0342C]">$52K</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[#6F83A7] mb-1">Win Rate Impact</div>
                    <div className="text-lg text-[#EAB308]">-15%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Draft Success Analytics */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#57ACAF]" />
                    AI Auto-Draft Performance
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Success metrics for AI-generated requests</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze AI auto-draft clarification performance and effectiveness. Metrics: Total auto-drafted messages: 24 this month, Buyer acceptance rate: 94% (22 accepted, 2 required manual revision), Average buyer response time for AI drafts: 1.1 days vs 1.8 days for manual drafts (39% faster), Tone accuracy: 98% (buyers rated messages as professional and appropriate), Missing field detection accuracy: 96%, Template optimization suggestions: 12 improvements identified. Provide: 1) Detailed performance analysis and ROI of auto-drafting feature, 2) Factors contributing to high acceptance rate (tone, clarity, completeness), 3) Analysis of the 2 rejected drafts and learnings for improvement, 4) Correlation between AI draft quality and faster buyer response, 5) Buyer-specific customization recommendations for further improvement, 6) Template library expansion opportunities, 7) Quality control measures to maintain high standards, 8) Training data optimization based on successful interactions."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-white">Buyer Acceptance Rate</div>
                    <div className="text-lg text-[#57ACAF]">94%</div>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-white">Response Time Improvement</div>
                    <div className="text-lg text-[#57ACAF]">39%</div>
                  </div>
                  <Progress value={39} className="h-2" />
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-white">Tone & Clarity Score</div>
                    <div className="text-lg text-[#57ACAF]">98%</div>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 p-3 rounded-lg bg-[#57ACAF]/5">
                <div className="text-xs text-[#57ACAF] mb-1">Key Insight</div>
                <div className="text-sm text-white">AI-drafted messages receive 39% faster responses</div>
              </div>
            </div>
          </div>

          {/* AI Auto-Reminder Feature Card */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Auto-Reminder System</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM automatically monitors all pending clarifications and sends polite, contextual reminder emails to buyers based on their response patterns. 
                    <span className="text-[#57ACAF]"> 87% reminder response rate</span> with an average <span className="text-[#57ACAF]">0.6 day turnaround</span> after reminder sent.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Reminders Sent</div>
                      <div className="text-lg text-white">18/month</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Response Rate</div>
                      <div className="text-lg text-[#57ACAF]">87%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Avg Turnaround</div>
                      <div className="text-lg text-[#57ACAF]">0.6d</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze AI auto-reminder system effectiveness and optimization opportunities. Metrics: Reminders sent: 18/month (to clarifications pending >2 days), Reminder response rate: 87% (significantly higher than no-reminder baseline of 58%), Average turnaround after reminder: 0.6 days, Buyer-specific reminder timing: H&M (2 days), Zara (2 days), ACME (1.5 days - faster due to slow pattern), Escalation triggers: 2 reminders with no response. Tone customization: Professional for tier-1 buyers, friendly for long-term partners. Provide: 1) Detailed effectiveness analysis of reminder system vs no-reminder baseline, 2) Optimal reminder timing by buyer segment (when to send first reminder, second reminder), 3) Tone and messaging recommendations for different buyer relationships, 4) Escalation strategy when reminders fail (who to involve, when), 5) Buyer feedback on reminder messaging (too aggressive, too passive, just right), 6) Integration with CRM and relationship management, 7) Future enhancements (SMS reminders, multi-channel approach, predictive send timing)."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resolved-clarifications" className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Total Resolved</div>
              </div>
              <div className="text-3xl text-white mb-1">87</div>
              <div className="text-xs text-[#6F83A7]">This month</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Resolution Rate</div>
              </div>
              <div className="text-3xl text-[#57ACAF] mb-1">92%</div>
              <div className="text-xs text-[#57ACAF]">+8% improvement</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">Avg Resolution Time</div>
              </div>
              <div className="text-3xl text-white mb-1">1.8d</div>
              <div className="text-xs text-[#6F83A7]">From send to resolve</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-white" />
                <div className="text-[#6F83A7] text-sm">KB Entries Created</div>
              </div>
              <div className="text-3xl text-white mb-1">42</div>
              <div className="text-xs text-[#6F83A7]">Auto-extracted Q&A</div>
            </div>
          </div>

          {/* AI Knowledge Extraction Intelligence */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Knowledge Base Extraction</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM automatically analyzes resolved clarifications and extracts valuable Q&A pairs for knowledge base training. 
                    <span className="text-[#57ACAF]"> 42 new KB entries</span> created this month with <span className="text-[#57ACAF]">89% reusability score</span>. 
                    Future automation potential identified for <span className="text-[#57ACAF]">18 recurring question patterns</span>.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">KB Entries</div>
                      <div className="text-lg text-[#57ACAF]">42</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Reusability</div>
                      <div className="text-lg text-white">89%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Recurring Patterns</div>
                      <div className="text-lg text-[#EAB308]">18</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Automation Ready</div>
                      <div className="text-lg text-[#57ACAF]">12</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze resolved clarifications for knowledge extraction and automation opportunities. Current state: 87 clarifications resolved this month (92% resolution rate, +8% improvement), average resolution time: 1.8 days, 42 KB entries auto-extracted (89% reusability score), 18 recurring question patterns identified (12 ready for automation). Top recurring clarifications: GSM specifications (14 occurrences), color swatch confirmations (11 occurrences), size run details (9 occurrences), wash test methods (8 occurrences), label placement (6 occurrences). Provide: 1) Detailed analysis of recurring clarification patterns and root causes, 2) Knowledge base optimization recommendations for maximum reusability, 3) Automation strategy for the 12 automation-ready patterns, 4) Buyer education initiatives to prevent recurring clarifications, 5) RFQ template improvements to capture common missing fields upfront, 6) Quality metrics for knowledge extraction accuracy and completeness, 7) Integration opportunities with RFQ parsing and validation systems, 8) ROI analysis of reducing clarification rate through proactive measures."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Resolved Clarifications Table */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white mb-1">Resolved Clarifications</h3>
                <p className="text-sm text-[#6F83A7]">Successfully resolved clarification requests with response details</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze resolved clarification data for performance insights. Recent resolved items: CLR-2024-418 (Zara, color swatch, 2 days resolution - EXCELLENT), CLR-2024-415 (Nike, stretch percentage, 1 day resolution - EXCELLENT), CLR-2024-412 (Gap, label info, 1.5 days - GOOD), CLR-2024-410 (H&M, fabric GSM, 0.8 days - EXCELLENT). Average resolution time: 1.8 days (improving trend: was 2.4 days 3 months ago, -25% improvement). Top performers: Zara, Nike, H&M. Slow performers: ACME (3.8 days avg), Uniqlo (4.2 days avg). Provide: 1) Resolution time trend analysis and improvement drivers, 2) Buyer segmentation by response speed with relationship insights, 3) Best practices from fast-responding buyers (can we replicate?), 4) Intervention strategies for chronic slow responders, 5) Correlation between resolution speed and RFQ win rates, 6) Process optimization recommendations to maintain improvement trajectory, 7) Buyer satisfaction analysis with clarification handling."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <SmartTable
              columns={resolvedClarificationsColumns}
              data={resolvedClarificationsData}
              searchPlaceholder="Search resolved clarifications..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Resolution Time Trend */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-[#57ACAF]" />
                    Resolution Time Improvement Trend
                  </h4>
                  <p className="text-sm text-[#6F83A7]">6-month performance trajectory</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze clarification resolution time trends over 6 months. Historical data: April: 2.8 days, May: 2.6 days, June: 2.4 days, July: 2.2 days, August: 2.0 days, September: 1.8 days (current). Overall improvement: 36% reduction in 6 months, monthly improvement rate: ~6% average. Contributing factors: AI auto-drafting (launched June, 39% faster responses), buyer education initiatives (launched July), improved RFQ templates (launched May), dedicated clarification manager (hired August). Provide: 1) Detailed trend analysis and acceleration/deceleration periods, 2) Attribution of improvement to specific initiatives, 3) Comparison to industry benchmarks (if available), 4) Forecast for next 3 months based on current trajectory, 5) Risk factors that could reverse the trend, 6) Recommendations to achieve sub-1.5 day average, 7) Marginal improvement opportunities vs diminishing returns analysis."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { month: 'Apr', time: 2.8 },
                  { month: 'May', time: 2.6 },
                  { month: 'Jun', time: 2.4 },
                  { month: 'Jul', time: 2.2 },
                  { month: 'Aug', time: 2.0 },
                  { month: 'Sep', time: 1.8 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7', fontSize: 12 }} domain={[1, 3]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: any) => [`${value} days`, 'Avg Resolution Time']}
                  />
                  <Line type="monotone" dataKey="time" stroke="#57ACAF" strokeWidth={3} dot={{ fill: '#57ACAF', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                <div className="text-xs text-[#57ACAF] mb-1">6-Month Improvement</div>
                <div className="text-sm text-white">36% faster resolution time (2.8d → 1.8d)</div>
              </div>
            </div>

            {/* Recurring Clarifications Analysis */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[#EAB308]" />
                    Recurring Clarification Patterns
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Most common clarification topics</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze recurring clarification patterns for prevention opportunities. Top recurring topics: GSM specifications (14 occurrences, 16% of total), color swatch confirmations (11 occurrences, 13%), size run details (9 occurrences, 10%), wash test methods (8 occurrences, 9%), label placement (6 occurrences, 7%), packaging requirements (5 occurrences, 6%). Total recurring: 53 out of 87 resolved (61% are recurring patterns - significant opportunity). Cost impact: Each clarification adds avg 1.8 days to quote turnaround, estimated revenue delay: $248K (opportunity cost). Provide: 1) Root cause analysis for each recurring pattern (why buyers keep omitting this info), 2) Buyer segmentation by recurring clarification types (buyer-specific issues vs systemic), 3) RFQ template enhancement recommendations to capture these fields upfront, 4) Buyer education strategy (checklists, training, improved forms), 5) Automation opportunities (pre-fill from past orders, smart defaults), 6) Cost-benefit analysis of prevention initiatives, 7) Success metrics to track reduction in recurrence rate."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-2">
                {[
                  { topic: 'GSM Specifications', count: 14, percentage: 16, color: '#57ACAF' },
                  { topic: 'Color Swatch Confirmations', count: 11, percentage: 13, color: '#EAB308' },
                  { topic: 'Size Run Details', count: 9, percentage: 10, color: '#6F83A7' },
                  { topic: 'Wash Test Methods', count: 8, percentage: 9, color: '#57ACAF' },
                  { topic: 'Label Placement', count: 6, percentage: 7, color: '#EAB308' },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white">{item.topic}</div>
                      <div className="text-xs text-[#6F83A7]">{item.count} times</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentage * 6} className="h-2 flex-1" />
                      <div className="text-xs" style={{ color: item.color }}>{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-xs text-[#6F83A7] mb-1">Prevention Opportunity</div>
                  <div className="text-lg text-[#EAB308]">61% are recurring patterns</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Performance Comparison */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white mb-1 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#57ACAF]" />
                  Buyer Response Performance Ranking
                </h4>
                <p className="text-sm text-[#6F83A7]">Comparative analysis of buyer responsiveness</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze buyer-specific clarification response performance for relationship insights. Buyer ranking by avg response time: 1) Zara: 0.8 days (EXCELLENT, 92% on-time, strong partnership), 2) H&M: 1.1 days (EXCELLENT, 88% on-time, tier-1 buyer), 3) Gap: 1.4 days (GOOD, 82% on-time, growing account), 4) Nike: 1.5 days (GOOD, 78% on-time, strategic buyer), 5) Uniqlo: 2.8 days (POOR, 45% on-time, needs improvement), 6) ACME Fashion: 3.8 days (VERY POOR, 32% on-time, at-risk relationship). Total buyers: 18, average response: 1.8 days. Correlation analysis: Fast responders = 78% avg win rate, Slow responders = 52% avg win rate (-26 points). Provide: 1) Deep-dive into top performers (what makes them responsive? relationship factors?), 2) Intervention strategy for underperformers (communication, escalation, account management), 3) Relationship health assessment based on responsiveness, 4) Optimal engagement strategy per buyer segment, 5) When to escalate slow-responding buyers to senior stakeholders, 6) Impact of responsiveness on overall business value and strategic importance, 7) Buyer education and feedback collection to improve response rates."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <div className="space-y-3">
              {[
                { rank: 1, buyer: 'Zara', time: '0.8d', performance: 'Excellent', color: '#57ACAF', onTime: '92%' },
                { rank: 2, buyer: 'H&M', time: '1.1d', performance: 'Excellent', color: '#57ACAF', onTime: '88%' },
                { rank: 3, buyer: 'Gap', time: '1.4d', performance: 'Good', color: '#6F83A7', onTime: '82%' },
                { rank: 4, buyer: 'Nike', time: '1.5d', performance: 'Good', color: '#6F83A7', onTime: '78%' },
                { rank: 5, buyer: 'Uniqlo', time: '2.8d', performance: 'Poor', color: '#EAB308', onTime: '45%' },
                { rank: 6, buyer: 'ACME Fashion', time: '3.8d', performance: 'Very Poor', color: '#D0342C', onTime: '32%' },
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white">
                      #{item.rank}
                    </div>
                    <div>
                      <div className="text-white mb-1">{item.buyer}</div>
                      <div className="text-xs text-[#6F83A7]">On-time: {item.onTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="border-none" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.performance}
                    </Badge>
                    <div className="text-white w-16 text-right">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="buyer-response-logs" className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Total Responses</div>
              </div>
              <div className="text-3xl text-white mb-1">87</div>
              <div className="text-xs text-[#6F83A7]">This month</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-center gap-3 mb-2">
                <ThumbsUp className="w-5 h-5 text-[#57ACAF]" />
                <div className="text-[#6F83A7] text-sm">Positive Sentiment</div>
              </div>
              <div className="text-3xl text-[#57ACAF] mb-1">62%</div>
              <div className="text-xs text-[#57ACAF]">54 responses</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20">
              <div className="flex items-center gap-3 mb-2">
                <Minus className="w-5 h-5 text-[#6F83A7]" />
                <div className="text-[#6F83A7] text-sm">Neutral Sentiment</div>
              </div>
              <div className="text-3xl text-white mb-1">28%</div>
              <div className="text-xs text-[#6F83A7]">24 responses</div>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-center gap-3 mb-2">
                <ThumbsDown className="w-5 h-5 text-[#EAB308]" />
                <div className="text-[#6F83A7] text-sm">Negative Sentiment</div>
              </div>
              <div className="text-3xl text-[#EAB308] mb-1">10%</div>
              <div className="text-xs text-[#6F83A7]">9 responses</div>
            </div>
          </div>

          {/* AI Sentiment Analysis Intelligence */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Sentiment Analysis & Relationship Intelligence</h4>
                  <p className="text-sm text-[#6F83A7] mb-3">
                    MARBIM automatically analyzes every buyer response for sentiment, tone, urgency, and relationship health indicators. 
                    <span className="text-[#57ACAF]"> 62% positive sentiment</span> (up from 58% last month), 
                    <span className="text-[#EAB308]"> 10% negative sentiment</span> flagged for relationship intervention. 
                    Sentiment analysis accuracy: <span className="text-[#57ACAF]">96% validated</span> against manual review.
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Analysis Accuracy</div>
                      <div className="text-lg text-[#57ACAF]">96%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Positive Trend</div>
                      <div className="text-lg text-[#57ACAF]">+4%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">At-Risk Buyers</div>
                      <div className="text-lg text-[#EAB308]">3</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Escalations</div>
                      <div className="text-lg text-white">2</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze buyer response sentiment patterns for relationship management insights. Sentiment distribution: 62% positive (54 responses - cooperative, prompt, appreciative tone), 28% neutral (24 responses - factual, brief, business-like), 10% negative (9 responses - frustrated, delayed, complaints). Trend: Positive sentiment increased from 58% to 62% (+4 points) due to faster response times and improved clarification quality. Negative sentiment buyers: ACME Fashion (3 negative responses - delivery delays), Uniqlo (2 negative - slow internal approvals), NewBrand Co (4 negative - pricing concerns). Accuracy: 96% validated against manual review. Provide: 1) Deep sentiment analysis with relationship health implications, 2) At-risk buyer identification and intervention strategies, 3) Correlation between sentiment and business outcomes (win rates, order values, renewals), 4) Best practices from positive sentiment interactions, 5) Root cause analysis of negative sentiment (systemic issues vs isolated incidents), 6) Escalation protocol for sustained negative sentiment, 7) Proactive relationship management recommendations, 8) Communication optimization to improve sentiment scores."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Recent Buyer Response Logs */}
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-white mb-1">Recent Buyer Responses</h3>
                <p className="text-sm text-[#6F83A7]">Latest clarification responses with AI sentiment analysis</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze recent buyer response logs for actionable insights. Recent responses: 1) H&M (2024-10-26): 'GSM should be 180, test method ISO 105-C06' - Neutral sentiment, clear technical response, 2) Zara (2024-10-25): 'Color swatch confirmed, proceed with costing' - Positive sentiment, cooperative tone, 3) ACME (2024-10-24): 'Delayed response, will get back by EOD' - Negative sentiment, delay indication, 4) Gap (2024-10-23): 'Size run approved, please send quote ASAP' - Positive sentiment, urgency indicator, 5) Nike (2024-10-22): 'Need more time to review with design team' - Neutral sentiment, timeline extension. Provide: 1) Response-by-response analysis with context and implications, 2) Buyer engagement level assessment (proactive vs reactive, detailed vs brief), 3) Urgency and priority indicators in buyer language, 4) Relationship quality signals in tone and messaging, 5) Follow-up action recommendations per response, 6) Pattern recognition across multiple responses from same buyer, 7) Best response time and format based on buyer communication style."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            {[
              { 
                buyer: 'H&M', 
                date: '2024-10-26', 
                time: '10:32 AM',
                clarificationId: 'CLR-2024-421',
                rfqId: 'RFQ-2024-1847',
                response: 'GSM should be 180, test method ISO 105-C06. Please proceed with costing based on these specifications.',
                sentiment: 'Neutral',
                urgency: 'Normal',
                responseTime: '0.9 days',
                icon: Minus
              },
              { 
                buyer: 'Zara', 
                date: '2024-10-25', 
                time: '2:15 PM',
                clarificationId: 'CLR-2024-418',
                rfqId: 'RFQ-2024-1848',
                response: 'Color swatch confirmed and approved. Looking forward to receiving your competitive quote. Please proceed with costing.',
                sentiment: 'Positive',
                urgency: 'High',
                responseTime: '0.6 days',
                icon: ThumbsUp
              },
              { 
                buyer: 'ACME Fashion', 
                date: '2024-10-24', 
                time: '4:48 PM',
                clarificationId: 'CLR-2024-422',
                rfqId: 'RFQ-2024-1851',
                response: 'Delayed response due to internal review process. Will get back to you by end of day with wash test specifications.',
                sentiment: 'Negative',
                urgency: 'Low',
                responseTime: '3.2 days',
                icon: ThumbsDown
              },
              { 
                buyer: 'Gap', 
                date: '2024-10-23', 
                time: '11:20 AM',
                clarificationId: 'CLR-2024-419',
                rfqId: 'RFQ-2024-1845',
                response: 'Size run approved as per your clarification. Please send quote ASAP - we have tight deadline for this season.',
                sentiment: 'Positive',
                urgency: 'High',
                responseTime: '1.2 days',
                icon: ThumbsUp
              },
              { 
                buyer: 'Nike', 
                date: '2024-10-22', 
                time: '9:05 AM',
                clarificationId: 'CLR-2024-415',
                rfqId: 'RFQ-2024-1850',
                response: 'Stretch percentage confirmed at 15-20%. Need more time to review technical specs with design team before final approval.',
                sentiment: 'Neutral',
                urgency: 'Normal',
                responseTime: '1.4 days',
                icon: Minus
              },
            ].map((log, index) => {
              const SentimentIcon = log.icon;
              return (
                <div key={index} className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm text-white">
                        {log.buyer.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white mb-1">{log.buyer}</div>
                        <div className="flex items-center gap-2 text-xs text-[#6F83A7]">
                          <span>{log.clarificationId}</span>
                          <span>•</span>
                          <span>{log.rfqId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <Badge className={
                          log.sentiment === 'Positive' ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20' :
                          log.sentiment === 'Neutral' ? 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20' :
                          'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'
                        }>
                          <SentimentIcon className="w-3 h-3 mr-1" />
                          {log.sentiment}
                        </Badge>
                        {log.urgency === 'High' && (
                          <Badge className="bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20 mt-1">
                            High Urgency
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#6F83A7]">{log.date}</div>
                        <div className="text-xs text-[#6F83A7]">{log.time}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-3">
                    <p className="text-sm text-white italic leading-relaxed">"{log.response}"</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#6F83A7]" />
                        <span className="text-[#6F83A7]">Response time:</span>
                        <span className={log.responseTime.startsWith('0') || log.responseTime.startsWith('1.') ? 'text-[#57ACAF]' : 'text-[#EAB308]'}>
                          {log.responseTime}
                        </span>
                      </div>
                    </div>
                    <MarbimAIButton
                      marbimPrompt={`Analyze this specific buyer response for detailed insights. Buyer: ${log.buyer}, Clarification: ${log.clarificationId}, RFQ: ${log.rfqId}, Response: "${log.response}", Sentiment: ${log.sentiment}, Urgency: ${log.urgency}, Response time: ${log.responseTime}. Historical context: ${log.buyer} has ${log.buyer === 'ACME Fashion' ? '3.8 day avg response time (slowest)' : log.buyer === 'Zara' ? '0.8 day avg response time (fastest)' : '1.2 day avg response time'}. Provide: 1) Detailed response analysis (completeness, clarity, cooperative tone), 2) Sentiment driver analysis (what language/phrases indicate ${log.sentiment} sentiment), 3) ${log.urgency === 'High' ? 'Urgency flag justification and recommended expedited actions' : 'Normal urgency - standard follow-up protocol'}, 4) Next action recommendations (immediate quote preparation, additional clarifications, follow-up timing), 5) Relationship quality assessment based on this response, 6) Buyer communication preference insights (detailed vs brief, formal vs casual), 7) Impact on RFQ timeline and win probability.`}
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sentiment Analytics Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Sentiment Distribution Chart */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                    Sentiment Distribution Trend
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Monthly sentiment evolution</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze sentiment distribution trends over the last 6 months. Historical data: April - Positive: 54%, Neutral: 32%, Negative: 14%, May - Positive: 56%, Neutral: 30%, Negative: 14%, June - Positive: 58%, Neutral: 29%, Negative: 13%, July - Positive: 59%, Neutral: 29%, Negative: 12%, August - Positive: 61%, Neutral: 28%, Negative: 11%, September - Positive: 62%, Neutral: 28%, Negative: 10% (current). Overall trend: Positive sentiment increasing (+8 points over 6 months), negative sentiment decreasing (-4 points). Contributing factors: Faster response times, improved clarification quality, AI auto-drafting, buyer relationship initiatives. Provide: 1) Trend analysis and acceleration/deceleration periods, 2) Attribution of sentiment improvement to specific initiatives, 3) Buyer-specific sentiment trends (which buyers improving/declining), 4) Correlation with business outcomes (sentiment vs win rates, order values), 5) Forecast for next 3 months, 6) Risk factors that could reverse positive trend, 7) Strategies to reach 70%+ positive sentiment target."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-[#57ACAF]" />
                      <span className="text-sm text-white">Positive</span>
                    </div>
                    <span className="text-sm text-[#57ACAF]">62%</span>
                  </div>
                  <Progress value={62} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Minus className="w-4 h-4 text-[#6F83A7]" />
                      <span className="text-sm text-white">Neutral</span>
                    </div>
                    <span className="text-sm text-white">28%</span>
                  </div>
                  <Progress value={28} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-[#EAB308]" />
                      <span className="text-sm text-white">Negative</span>
                    </div>
                    <span className="text-sm text-[#EAB308]">10%</span>
                  </div>
                  <Progress value={10} className="h-3" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 p-3 rounded-lg bg-[#57ACAF]/5">
                <div className="text-xs text-[#57ACAF] mb-1">6-Month Improvement</div>
                <div className="text-sm text-white">+8% increase in positive sentiment</div>
              </div>
            </div>

            {/* Negative Sentiment Analysis */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                    Negative Sentiment Root Causes
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Analysis of relationship concerns</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze negative sentiment responses for root cause identification and mitigation. Negative sentiment breakdown (9 responses, 10% of total): 1) Delivery delays (4 responses, 44% of negative) - ACME Fashion, NewBrand Co complaints about late sample shipments, 2) Internal approval delays (2 responses, 22%) - Uniqlo citing slow internal processes, 3) Pricing concerns (2 responses, 22%) - NewBrand Co price sensitivity, 4) Communication gaps (1 response, 11%) - missed follow-up. Impact: Buyers with sustained negative sentiment have 35% lower win rates. At-risk buyers: ACME Fashion (3 negative in last 3 months), NewBrand Co (4 negative). Provide: 1) Deep root cause analysis for each negative sentiment category, 2) Buyer-specific intervention strategies for at-risk relationships, 3) Process improvements to address systemic issues (delivery, approvals, pricing), 4) Escalation protocol for sustained negative sentiment buyers, 5) Relationship recovery tactics and success metrics, 6) Preventive measures to reduce negative sentiment occurrence, 7) Training needs for customer-facing teams, 8) When to consider de-prioritizing chronically difficult buyers."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                {[
                  { cause: 'Delivery Delays', count: 4, percentage: 44, color: '#D0342C' },
                  { cause: 'Internal Approval Issues', count: 2, percentage: 22, color: '#EAB308' },
                  { cause: 'Pricing Concerns', count: 2, percentage: 22, color: '#EAB308' },
                  { cause: 'Communication Gaps', count: 1, percentage: 11, color: '#6F83A7' },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white">{item.cause}</div>
                      <div className="text-xs text-[#6F83A7]">{item.count} responses</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentage * 2} className="h-2 flex-1" />
                      <div className="text-xs" style={{ color: item.color }}>{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-xs text-[#6F83A7] mb-1">At-Risk Buyers</div>
                  <div className="text-lg text-[#D0342C]">3 require intervention</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Executive Summary */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">AI Clarification Tracker Executive Summary</h4>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    MARBIM has comprehensively analyzed the entire clarification lifecycle for actionable insights. 
                    <span className="text-[#57ACAF]"> Overall performance: EXCELLENT</span> with 92% resolution rate (+8% improvement), 
                    1.8 day average resolution time (36% faster than 6 months ago). 
                    <span className="text-[#EAB308]"> Critical attention needed: 2 overdue items</span> ($52K at risk), 
                    <span className="text-[#EAB308]"> 3 at-risk buyer relationships</span> with sustained negative sentiment. 
                    AI automation delivering strong ROI: 94% buyer acceptance of auto-drafted clarifications, 39% faster response times.
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Overall Health</div>
                      <div className="text-lg text-[#57ACAF]">92/100</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Resolution Rate</div>
                      <div className="text-lg text-[#57ACAF]">92%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">6M Improvement</div>
                      <div className="text-lg text-[#57ACAF]">36%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Critical Items</div>
                      <div className="text-lg text-[#D0342C]">2</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">AI Automation ROI</div>
                      <div className="text-lg text-[#57ACAF]">$15K/mo</div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide comprehensive executive-level analysis of clarification tracker performance. Overall metrics: 5 open clarifications (2 overdue), 87 resolved this month (92% resolution rate, +8% vs baseline), 1.8 day avg resolution time (36% improvement over 6 months), 42 KB entries extracted, 62% positive sentiment (+4% improvement), 10% negative sentiment (9 responses flagged). Value at risk: $52K from overdue items. AI automation metrics: 94% buyer acceptance, 39% faster responses, 96% sentiment analysis accuracy, $15K/month cost savings. At-risk relationships: 3 buyers (ACME Fashion, Uniqlo, NewBrand Co) with sustained negative sentiment. Provide: 1) Executive summary of clarification tracker health and performance, 2) Key achievements and improvements over 6 months, 3) Critical issues requiring executive attention and intervention, 4) Strategic recommendations for sustained improvement, 5) ROI analysis of AI automation investments, 6) Buyer relationship risk assessment and mitigation strategies, 7) Resource allocation recommendations, 8) Competitive benchmarking (if data available), 9) Forward-looking priorities for next quarter, 10) Success metrics and KPI targets for leadership dashboard."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Response Time Metrics */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#57ACAF]" />
                    Response Time Analytics
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Buyer responsiveness metrics</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze buyer response time metrics for optimization insights. Current metrics: Average response time: 1.2 days (18% improvement vs 1.46 days 3 months ago), Fastest responder: Zara (0.8 days - tier-1 buyer, excellent partnership), Slowest responder: ACME Fashion (3.8 days - chronic issue), Resolution rate: 92% (excellent - 8% of clarifications remain unresolved after multiple attempts). Response time distribution: <1 day: 42% of buyers, 1-2 days: 38%, 2-3 days: 12%, >3 days: 8%. Impact on business: Fast responders (<1 day) have 78% win rate, slow responders (>3 days) have 52% win rate (-26 points). Provide: 1) Detailed response time analysis with buyer segmentation, 2) Correlation between response speed and business outcomes, 3) Best practices from fast-responding buyers, 4) Intervention strategies for slow responders, 5) Optimal clarification send timing based on buyer patterns, 6) Process improvements to incentivize faster responses, 7) Target setting for further improvement."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Average response time</span>
                  <span className="text-white">1.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Fastest responder</span>
                  <span className="text-[#57ACAF]">Zara (0.8d)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Slowest responder</span>
                  <span className="text-[#D0342C]">ACME (3.8d)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Resolution rate</span>
                  <span className="text-[#57ACAF]">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">3-Month improvement</span>
                  <span className="text-[#57ACAF]">+18%</span>
                </div>
              </div>
            </div>

            {/* Missing Fields Intelligence */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#EAB308]" />
                    Common Missing Fields
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Prevention opportunities</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze common missing fields for prevention strategies. Top missing fields: Colorways/color swatches (28% of clarifications - most common), Label info/placement (22%), GSM specifications (18%), Wash test methods (16%), Size run details (12%), Packaging requirements (8%). Total clarifications: 87 this month, 12% clarification rate (baseline - aiming for <8%). Prevention potential: 61% of clarifications are recurring patterns - significant reduction opportunity. Cost impact: Each clarification adds 1.8 days avg delay, estimated revenue opportunity cost: $248K/month from clarification delays. Provide: 1) Root cause analysis for each common missing field, 2) Buyer education strategy to improve RFQ submission completeness, 3) RFQ template/form enhancements to capture missing fields upfront, 4) Smart defaults and pre-fill opportunities from buyer history, 5) Required field validation before RFQ submission, 6) Cost-benefit analysis of prevention initiatives, 7) Target setting for clarification rate reduction (goal: <8%), 8) Success metrics to track improvement."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white">Colorways</span>
                  <span className="text-xs text-[#EAB308]">28%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white">Label Info</span>
                  <span className="text-xs text-[#EAB308]">22%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white">GSM</span>
                  <span className="text-xs text-[#EAB308]">18%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white">Wash Tests</span>
                  <span className="text-xs text-[#EAB308]">16%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-white">Size Runs</span>
                  <span className="text-xs text-[#EAB308]">12%</span>
                </div>
              </div>
            </div>

            {/* Sentiment Health Score */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white mb-1 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#57ACAF]" />
                    Relationship Health Score
                  </h4>
                  <p className="text-sm text-[#6F83A7]">Sentiment-based analysis</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze overall buyer relationship health based on sentiment data. Sentiment distribution: 62% positive (54 responses - cooperative, appreciative buyers), 28% neutral (24 responses - transactional relationships), 10% negative (9 responses - at-risk relationships). Trend: Positive sentiment improving (+4% vs last month, +8% vs 6 months ago), negative sentiment declining (was 14%, now 10%). At-risk buyers: ACME Fashion (3 negative responses), Uniqlo (2 negative), NewBrand Co (4 negative - highest risk). Impact: Positive sentiment buyers have 78% win rate and 2.3x higher order values. Overall relationship health score: 85/100 (Good - improving). Provide: 1) Composite relationship health scoring methodology, 2) Segmentation of buyers by relationship quality (champions, satisfied, at-risk, critical), 3) At-risk buyer intervention strategies and escalation protocols, 4) Best practices from high-sentiment relationships, 5) Sentiment correlation with business outcomes (retention, win rates, values), 6) Proactive relationship management recommendations, 7) Target setting for sentiment improvement (goal: 70% positive, <5% negative)."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Health Score</span>
                  <span className="text-white">85/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Positive sentiment</span>
                  <span className="text-[#57ACAF]">62%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Negative sentiment</span>
                  <span className="text-[#EAB308]">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">At-risk buyers</span>
                  <span className="text-[#D0342C]">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">6M improvement</span>
                  <span className="text-[#57ACAF]">+12 points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Response Time Chart */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white mb-1">Buyer Response Time Comparison</h3>
                <p className="text-sm text-[#6F83A7]">Average clarification response time by buyer</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze buyer-specific response time patterns for strategic insights. Buyer breakdown: Zara (0.8 days - fastest, tier-1 strategic partner, 92% on-time), H&M (1.1 days - excellent, tier-1, 88% on-time), Gap (1.4 days - good, growing account, 82% on-time), Nike (1.5 days - good, strategic buyer, 78% on-time), Uniqlo (2.8 days - poor, declining relationship, 45% on-time), ACME Fashion (3.8 days - very poor, at-risk, 32% on-time). Correlation: Fast responders have 78% avg win rate and $450K avg annual order value. Slow responders have 52% win rate and $180K avg value. Provide: 1) Deep dive into top performer characteristics and success factors, 2) Buyer tiering and prioritization based on responsiveness, 3) Intervention playbook for underperforming buyers (communication, escalation, account management), 4) When to escalate slow buyers to C-level stakeholders, 5) Optimal engagement cadence per buyer based on response patterns, 6) Resource allocation recommendations (prioritize fast responders?), 7) Decision criteria for de-prioritizing chronically unresponsive buyers."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[
                { buyer: 'Zara', time: 0.8, status: 'Excellent' },
                { buyer: 'H&M', time: 1.1, status: 'Excellent' },
                { buyer: 'Gap', time: 1.4, status: 'Good' },
                { buyer: 'Nike', time: 1.5, status: 'Good' },
                { buyer: 'Uniqlo', time: 2.8, status: 'Poor' },
                { buyer: 'ACME', time: 3.8, status: 'Very Poor' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="buyer" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                <YAxis stroke="#6F83A7" label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#6F83A7' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  formatter={(value: any, name: string, props: any) => {
                    return [`${value} days (${props.payload.status})`, 'Response Time'];
                  }}
                />
                <Bar dataKey="time" radius={[8, 8, 0, 0]}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Cell key={`cell-${index}`} fill={index < 2 ? '#57ACAF' : index < 4 ? '#6F83A7' : index === 4 ? '#EAB308' : '#D0342C'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Fastest (&lt;1d)</div>
                <div className="text-sm text-[#57ACAF]">2 buyers - 78% win rate</div>
              </div>
              <div className="p-3 rounded-lg bg-[#6F83A7]/5 border border-[#6F83A7]/20 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Good (1-2d)</div>
                <div className="text-sm text-white">2 buyers - 68% win rate</div>
              </div>
              <div className="p-3 rounded-lg bg-[#EAB308]/5 border border-[#EAB308]/20 text-center">
                <div className="text-xs text-[#6F83A7] mb-1">Slow (&gt;2d)</div>
                <div className="text-sm text-[#EAB308]">2 buyers - 52% win rate</div>
              </div>
            </div>
          </div>

          {/* AI Strategic Recommendations */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white mb-2">AI Strategic Recommendations for Clarification Optimization</h4>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Based on comprehensive analysis of all clarification data, MARBIM recommends the following priority actions:
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  priority: 'Critical',
                  action: 'Address 2 overdue clarifications (ACME, Uniqlo)',
                  impact: '$52K value at risk, -15% win rate impact',
                  timeline: 'Immediate',
                  color: '#D0342C'
                },
                {
                  priority: 'High',
                  action: 'Intervene on 3 at-risk buyer relationships',
                  impact: 'Prevent churn, improve sentiment from 10% negative to <5%',
                  timeline: '1 week',
                  color: '#EAB308'
                },
                {
                  priority: 'High',
                  action: 'Reduce recurring clarifications by 50%',
                  impact: 'Save $124K/month in opportunity cost from delays',
                  timeline: '1 month',
                  color: '#EAB308'
                },
                {
                  priority: 'Medium',
                  action: 'Enhance RFQ templates to capture top 5 missing fields',
                  impact: 'Reduce clarification rate from 12% to <8% target',
                  timeline: '2 months',
                  color: '#57ACAF'
                },
                {
                  priority: 'Medium',
                  action: 'Buyer education program for complete submissions',
                  impact: 'Improve first-time-right from 88% to 95%',
                  timeline: '6 weeks',
                  color: '#57ACAF'
                },
                {
                  priority: 'Low',
                  action: 'Expand AI automation to 18 recurring patterns',
                  impact: 'Increase AI coverage from 8% to 24% of clarifications',
                  timeline: '3 months',
                  color: '#6F83A7'
                },
              ].map((rec, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="border-none" style={{ backgroundColor: `${rec.color}20`, color: rec.color }}>
                      {rec.priority} Priority
                    </Badge>
                    <div className="text-xs text-[#6F83A7]">{rec.timeline}</div>
                  </div>
                  <div className="text-sm text-white mb-2">{rec.action}</div>
                  <div className="text-xs text-[#57ACAF]">Impact: {rec.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'rfq-inbox':
        return renderRFQInbox();
      case 'quotation-builder':
        return renderQuotationBuilder();
      case 'clarification-tracker':
        return renderClarificationTracker();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Sales & Merchandising' },
      { label: 'RFQ & Quotation' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'rfq-inbox': 'RFQ Inbox',
      'quotation-builder': 'Quotation Builder',
      'clarification-tracker': 'Clarification Tracker',
    };

    if (currentView !== 'dashboard') {
      baseBreadcrumbs.push({ label: viewLabels[currentView] });
    }

    return baseBreadcrumbs;
  };

  return (
    <>
      <PageLayout
        breadcrumbs={getBreadcrumbs()}
        aiInsightsCount={5}
      >
        {renderContent()}
      </PageLayout>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerData(null);
        }}
        data={drawerData}
        module="RFQ & Quotation"
        subPage={currentView}
      />

      {/* Premium Buyer RFQ Detail Drawer */}
      <BuyerRFQDetailDrawer
        isOpen={rfqDrawerOpen}
        onClose={() => {
          setRfqDrawerOpen(false);
          setSelectedRFQ(null);
        }}
        rfq={selectedRFQ}
        onRFQUpdated={handleRFQUpdated}
        onAskMarbim={onAskMarbim}
        onOpenAI={onOpenAI}
        onDraftQuote={selectedRFQ?._raw ? () => handleDraftQuote(selectedRFQ._raw.id) : undefined}
      />

      {/* Quote Scenario Detail Drawer */}
      <QuoteScenarioDetailDrawer
        open={scenarioDrawerOpen}
        onClose={() => {
          setScenarioDrawerOpen(false);
          setSelectedScenario(null);
        }}
        scenario={selectedScenario}
        onScenarioUpdated={handleScenarioUpdated}
        onAskMarbim={onAskMarbim}
      />

      {/* Upload RFQ Drawer */}
      <UploadRFQDrawer
        isOpen={uploadDrawerOpen}
        onClose={() => setUploadDrawerOpen(false)}
        onAskMarbim={onAskMarbim}
        onExtracted={() => {
          refreshRfqs();
          router.push('/approve');
        }}
      />

      {/* Create Scenario Drawer */}
      <CreateScenarioDrawer
        open={createScenarioDrawerOpen}
        onClose={() => setCreateScenarioDrawerOpen(false)}
        onSubmit={handleCreateScenario}
        onAskMarbim={onAskMarbim}
        rfqs={rfqs}
      />
    </>
  );
}
