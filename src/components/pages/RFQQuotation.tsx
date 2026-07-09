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
import { useRfqs, useQuotes, clearDemoData, type Rfq, type QuoteWithRfq } from '@/lib/data/rfqs';
import { useClarifications } from '@/lib/data/clarifications';
import { createClarification, answerClarification } from '@/app/actions/clarifications';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
const conversionByBuyerData = [
  { buyer: 'H&M', quoted: 45, won: 32, rate: 71 },
  { buyer: 'Zara', quoted: 38, won: 28, rate: 74 },
  { buyer: 'Gap', quoted: 28, won: 18, rate: 64 },
  { buyer: 'Nike', quoted: 22, won: 14, rate: 64 },
];

// RFQ Inbox Data
// Clarification Tracker Data
// Quotation Builder Data
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
  const { data: quotes, loading: quotesLoading } = useQuotes();
  const { data: clarifications, loading: clarLoading, refresh: refreshClarifications } = useClarifications();
  const router = useRouter();

  // Clarification dialogs
  const [newClarOpen, setNewClarOpen] = useState(false);
  const [newClarRfqId, setNewClarRfqId] = useState('');
  const [newClarQuestion, setNewClarQuestion] = useState('');
  const [answerClarId, setAnswerClarId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [inboxFilter, setInboxFilter] = useState('all');

  const submitClarification = async () => {
    const res = await createClarification(newClarRfqId, newClarQuestion);
    if (!res.ok) return toast.error(res.error);
    toast.success('Clarification raised.');
    setNewClarOpen(false);
    setNewClarRfqId('');
    setNewClarQuestion('');
    await refreshClarifications();
  };
  const submitAnswer = async () => {
    if (!answerClarId) return;
    const res = await answerClarification(answerClarId, answerText);
    if (!res.ok) return toast.error(res.error);
    toast.success('Clarification answered.');
    setAnswerClarId(null);
    setAnswerText('');
    await refreshClarifications();
  };
  
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
  async function loadScenarios() {
    // Zero-state: scenarios aren't wired to real data yet, so a fresh company
    // sees none (no more mock seeding). Real quote-scenario data comes in a later pass.
    try {
      const data = await db.getByModule(MODULE_NAMES.RFQ_QUOTATION);
      const scenarioData = data.filter((item: any) => item.type === 'scenario');
      setScenarios(scenarioData);
    } catch {
      setScenarios([]);
    }
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
  // Resolved Clarifications Columns
  // Quotation Scenarios Columns
  const hasDemoData = liveRfqs.some((r) => r.is_demo);
  const handleClearDemo = async () => {
    toast.loading('Clearing demo data…', { id: 'clear-demo' });
    try {
      await clearDemoData();
      await refreshRfqs();
      toast.success('Demo data cleared.', { id: 'clear-demo' });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to clear demo data', { id: 'clear-demo' });
    }
  };

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

  const renderDashboard = () => {
    const byStatus = (s: string) => liveRfqs.filter((r) => r.status === s).length;
    const openN = byStatus('open');
    const quotedN = byStatus('quoted');
    const wonN = byStatus('won');
    const lostN = byStatus('lost');
    const decided = wonN + lostN;
    const winRate = decided > 0 ? Math.round((wonN / decided) * 100) : null;

    const kpis = [
      { label: 'Open RFQs', value: String(openN), icon: FileText, color: '#6F83A7' },
      { label: 'Quoted', value: String(quotedN), icon: FileCheck, color: '#EAB308' },
      { label: 'Won', value: String(wonN), icon: Award, color: '#57ACAF' },
      { label: 'Win Rate', value: winRate === null ? '—' : `${winRate}%`, icon: TrendingUp, color: '#57ACAF' },
    ];

    const segments = [
      { label: 'Open', count: openN, color: '#6F83A7' },
      { label: 'Quoted', count: quotedN, color: '#EAB308' },
      { label: 'Won', count: wonN, color: '#57ACAF' },
      { label: 'Lost', count: lostN, color: '#D0342C' },
    ];
    const totalForBar = liveRfqs.length || 1;

    const recent = liveRfqs.slice(0, 6);
    const statusBadge: Record<string, string> = {
      open: 'bg-[#6F83A7]/15 text-[#6F83A7]',
      quoted: 'bg-[#EAB308]/15 text-[#EAB308]',
      won: 'bg-[#57ACAF]/15 text-[#57ACAF]',
      lost: 'bg-[#D0342C]/15 text-[#D0342C]',
      cancelled: 'bg-[#6F83A7]/15 text-[#6F83A7]',
    };

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">RFQ &amp; Quotation</h2>
            <p className="text-sm text-[#6F83A7]">Your buyer request pipeline, from inbox to won.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 text-white" onClick={() => router.push('/rfq-quotation/rfq-inbox')}>
              <FileText className="w-4 h-4 mr-2" />
              RFQ Inbox
            </Button>
            <Button
              className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
              onClick={() => onAskMarbim?.('Summarize my RFQ pipeline: what is open, what needs a quote, and where are we winning or losing?')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ask MARBIM
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-[#6F83A7]">Loading pipeline…</p>
        ) : liveRfqs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAB308]/10">
              <FileText className="h-6 w-6 text-[#EAB308]" />
            </div>
            <h3 className="text-white text-lg font-medium">No RFQs yet</h3>
            <p className="mt-2 mx-auto max-w-md text-sm text-[#6F83A7]">
              Upload or paste a buyer&apos;s request and MARBIM drafts the RFQ for you to approve.
            </p>
            <Button className="mt-5 bg-[#EAB308] hover:bg-[#EAB308]/90 text-black" onClick={() => router.push('/rfq-quotation/rfq-inbox')}>
              Go to RFQ Inbox
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {kpis.map((k) => (
                <div key={k.label} className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <k.icon className="w-4 h-4" style={{ color: k.color }} />
                    <span className="text-xs text-[#6F83A7]">{k.label}</span>
                  </div>
                  <div className="text-2xl text-white">{k.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white mb-4">Pipeline</h3>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
                  {segments.map((s) => (
                    <div key={s.label} style={{ width: `${(s.count / totalForBar) * 100}%`, backgroundColor: s.color }} />
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {segments.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#6F83A7]">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                      <span className="text-white">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">Recent RFQs</h3>
                  <button className="text-sm text-[#57ACAF] hover:underline" onClick={() => router.push('/rfq-quotation/rfq-inbox')}>
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {recent.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleRowClick(mapRfqToInbox(r))}
                      className="w-full flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-white truncate">{r.title}</div>
                        <div className="text-xs text-[#6F83A7]">
                          {r.buyer?.company_name ?? '—'}
                          {r.quantity ? ` · ${r.quantity.toLocaleString()} ${r.unit}` : ''}
                        </div>
                      </div>
                      <Badge className={`${statusBadge[r.status] || statusBadge.open} shrink-0`}>{r.status}</Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const renderRFQInbox = () => {
    const count = (s: string) => liveRfqs.filter((r) => r.status === s).length;
    const filterTabs = [
      { key: 'all', label: `All (${liveRfqs.length})` },
      { key: 'open', label: `Open (${count('open')})` },
      { key: 'quoted', label: `Quoted (${count('quoted')})` },
      { key: 'won', label: `Won (${count('won')})` },
      { key: 'lost', label: `Lost (${count('lost')})` },
    ];
    const filtered =
      inboxFilter === 'all' ? rfqs : rfqs.filter((r: any) => r._raw?.status === inboxFilter);

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">RFQ Inbox</h2>
            <p className="text-sm text-[#6F83A7]">
              Every buyer request in one place. Add one by uploading the buyer&apos;s email or PDF.
            </p>
          </div>
          <Button
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
            onClick={() => setUploadDrawerOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            New RFQ from document
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {filterTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setInboxFilter(t.key)}
              className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                inboxFilter === t.key
                  ? 'bg-[#EAB308] text-black font-medium'
                  : 'bg-white/5 text-[#6F83A7] hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <SmartTable
            columns={allRFQsColumns}
            data={filtered}
            onRowClick={handleRowClick}
            loading={rfqsLoading}
            emptyMessage={
              inboxFilter === 'all'
                ? "No RFQs yet. Click 'New RFQ from document' and paste a buyer email — MARBIM drafts it for your approval."
                : `No ${inboxFilter} RFQs.`
            }
            searchPlaceholder="Search RFQs..."
          />
        </div>
      </>
    );
  };

  const renderQuotationBuilder = () => {
    const money = (n: number) =>
      `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const statusColor: Record<string, string> = {
      Draft: 'bg-[#6F83A7]/15 text-[#6F83A7]',
      Sent: 'bg-[#EAB308]/15 text-[#EAB308]',
      Accepted: 'bg-[#57ACAF]/15 text-[#57ACAF]',
      Rejected: 'bg-[#D0342C]/15 text-[#D0342C]',
    };
    const rows = quotes.map((q: QuoteWithRfq) => {
      const total =
        Number(q.material_cost) + Number(q.labor_cost) + Number(q.overhead_cost) + Number(q.freight_cost);
      return {
        id: q.id,
        rfq: q.rfq?.title ?? '—',
        buyer: q.rfq?.buyer?.company_name ?? '—',
        totalCost: money(total),
        margin: `${Number(q.margin_pct)}%`,
        fob: `${q.currency} ${Number(q.fob_price).toFixed(2)}`,
        leadTime: q.lead_time_days ? `${q.lead_time_days}d` : '—',
        status: q.status.charAt(0).toUpperCase() + q.status.slice(1),
      };
    });
    const draftCount = quotes.filter((q) => q.status === 'draft').length;
    const sentCount = quotes.filter((q) => q.status === 'sent').length;
    const acceptedCount = quotes.filter((q) => q.status === 'accepted').length;
    const avgMargin = quotes.length
      ? Math.round(quotes.reduce((s, q) => s + Number(q.margin_pct), 0) / quotes.length)
      : null;

    const cols: Column[] = [
      { key: 'rfq', label: 'RFQ', sortable: true },
      { key: 'buyer', label: 'Buyer', sortable: true },
      { key: 'totalCost', label: 'Total Cost' },
      { key: 'margin', label: 'Margin' },
      { key: 'fob', label: 'FOB Price', render: (v: string) => <span className="font-medium text-[#57ACAF]">{v}</span> },
      { key: 'leadTime', label: 'Lead Time' },
      { key: 'status', label: 'Status', render: (v: string) => <Badge className={statusColor[v] || statusColor.Draft}>{v}</Badge> },
    ];

    const kpis = [
      { label: 'Total Quotes', value: String(quotes.length), icon: FileText, color: '#57ACAF' },
      { label: 'Drafts', value: String(draftCount), icon: Layers, color: '#6F83A7' },
      { label: 'Sent', value: String(sentCount), icon: Send, color: '#EAB308' },
      { label: 'Avg Margin', value: avgMargin === null ? '—' : `${avgMargin}%`, icon: TrendingUp, color: '#57ACAF' },
    ];

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Quotation Builder</h2>
            <p className="text-sm text-[#6F83A7]">
              Priced responses to buyer RFQs — MARBIM drafts the costs, the engine computes FOB.
            </p>
          </div>
          <Button
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
            onClick={() => router.push('/rfq-quotation/rfq-inbox')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New quote from an RFQ
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((k) => (
            <div key={k.label} className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
                <span className="text-xs text-[#6F83A7]">{k.label}</span>
              </div>
              <div className="text-2xl text-white">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-start gap-2 rounded-xl border border-[#57ACAF]/20 bg-[#57ACAF]/5 px-4 py-3 text-sm text-[#6F83A7]">
          <Sparkles className="mt-0.5 h-4 w-4 text-[#57ACAF] shrink-0" />
          <span>
            The number is real, not guessed: <span className="text-white">FOB = (Material + Labor + Overhead
            + Freight) ÷ (1 − Margin%)</span>. MARBIM proposes the cost lines; the engine computes the FOB.
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-white mb-4">Quotes</h3>
          <SmartTable
            columns={cols}
            data={rows}
            loading={quotesLoading}
            emptyMessage="No quotes yet. Open an RFQ and click 'Draft quote with MARBIM' — the priced quote lands in your Approve inbox, then appears here."
            searchPlaceholder="Search quotes..."
          />
        </div>
      </>
    );
  };

  const renderClarificationTracker = () => {
    const openClar = clarifications.filter((c) => c.status === 'open');
    const answeredClar = clarifications.filter((c) => c.status === 'answered');

    const ClarCard = ({ c }: { c: (typeof clarifications)[number] }) => (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-[#6F83A7]">
              {c.rfq?.title ?? 'RFQ'}
              {c.rfq?.buyer?.company_name ? ` · ${c.rfq.buyer.company_name}` : ''}
            </div>
            <p className="text-white mt-1 break-words">{c.question}</p>
            {c.answer && (
              <p className="mt-2 text-sm text-[#57ACAF]">
                <span className="text-[#6F83A7]">Answer:</span> {c.answer}
              </p>
            )}
          </div>
          {c.status === 'open' ? (
            <Button
              size="sm"
              onClick={() => {
                setAnswerClarId(c.id);
                setAnswerText('');
              }}
              className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black shrink-0"
            >
              Answer
            </Button>
          ) : (
            <Badge className="bg-[#57ACAF]/15 text-[#57ACAF] shrink-0">Answered</Badge>
          )}
        </div>
      </div>
    );

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Clarification Tracker</h2>
            <p className="text-sm text-[#6F83A7]">
              Missing specs on a buyer RFQ? Track the questions and answers here before costing.
            </p>
          </div>
          <Button
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
            onClick={() => setNewClarOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New clarification
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-[#EAB308]" />
              <span className="text-xs text-[#6F83A7]">Open</span>
            </div>
            <div className="text-2xl text-white">{openClar.length}</div>
          </div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#57ACAF]" />
              <span className="text-xs text-[#6F83A7]">Answered</span>
            </div>
            <div className="text-2xl text-white">{answeredClar.length}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white mb-3">Open</h3>
            {clarLoading ? (
              <p className="text-sm text-[#6F83A7]">Loading…</p>
            ) : openClar.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-[#6F83A7]">
                No open clarifications. Raise one when a buyer RFQ is missing specs you need to cost it.
              </div>
            ) : (
              <div className="space-y-3">
                {openClar.map((c) => (
                  <ClarCard key={c.id} c={c} />
                ))}
              </div>
            )}
          </div>

          {answeredClar.length > 0 && (
            <div>
              <h3 className="text-white mb-3">Resolved</h3>
              <div className="space-y-3">
                {answeredClar.map((c) => (
                  <ClarCard key={c.id} c={c} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New clarification dialog */}
        <Dialog open={newClarOpen} onOpenChange={setNewClarOpen}>
          <DialogContent className="sm:max-w-md bg-[#0F1420] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>New clarification</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-sm text-white/90">RFQ</span>
                <Select value={newClarRfqId} onValueChange={setNewClarRfqId}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select an RFQ" />
                  </SelectTrigger>
                  <SelectContent>
                    {liveRfqs.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <span className="text-sm text-white/90">Question</span>
                <Textarea
                  value={newClarQuestion}
                  onChange={(e) => setNewClarQuestion(e.target.value)}
                  placeholder="e.g. Please confirm GSM and the exact size run (S–XXL?)."
                  className="min-h-[90px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={submitClarification}
                disabled={!newClarRfqId || !newClarQuestion.trim()}
                className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
              >
                Raise clarification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Answer dialog */}
        <Dialog open={!!answerClarId} onOpenChange={(o) => !o && setAnswerClarId(null)}>
          <DialogContent className="sm:max-w-md bg-[#0F1420] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Answer clarification</DialogTitle>
            </DialogHeader>
            <Textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Buyer's answer / resolution…"
              className="min-h-[90px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]"
            />
            <DialogFooter>
              <Button
                onClick={submitAnswer}
                className="w-full bg-[#57ACAF] hover:bg-[#57ACAF]/90 text-white"
              >
                Mark answered
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };

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
        {hasDemoData && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#EAB308]/30 bg-[#EAB308]/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-[#EAB308]">
              <Sparkles className="w-4 h-4" />
              <span>
                <span className="font-medium">Demo data</span> — these RFQs, buyers and quotes are
                sample records to explore the platform.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearDemo}
              className="border-[#EAB308]/40 text-[#EAB308] hover:bg-[#EAB308]/10 shrink-0"
            >
              Clear demo data
            </Button>
          </div>
        )}
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
