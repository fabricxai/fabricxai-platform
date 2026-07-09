import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import { 
  X, Edit2, Send, Copy, Download, BarChart3, 
  FileText, Clock, Calendar, DollarSign, CheckCircle,
  Target, AlertCircle, Eye, MessageSquare, Package,
  Sparkles, Settings, Trash2, User, Building2, Mail,
  Phone, Globe, MapPin, TrendingUp, Award, Layers,
  Shield, AlertTriangle, Plus, Minus, Save, Paperclip,
  FileCheck, Zap, History, Users, Calculator, TrendingDown,
  Info, ChevronRight, Upload, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface BuyerRFQDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
  /** MARBIM drafts a priced quote for this RFQ (queued for approval). */
  onDraftQuote?: () => void;
}

export function BuyerRFQDetailDrawer({ 
  isOpen, 
  onClose, 
  rfq,
  onAskMarbim,
  onOpenAI,
  onDraftQuote
}: BuyerRFQDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, item: 'Premium Cotton T-Shirts - 200 GSM', quantity: 5000, unit: 'pcs', unitPrice: 8.50, total: 42500 },
    { id: 2, item: 'Polyester Joggers - Regular Fit', quantity: 3000, unit: 'pcs', unitPrice: 12.75, total: 38250 },
    { id: 3, item: 'Shipping & Handling', quantity: 1, unit: 'lot', unitPrice: 1250, total: 1250 },
  ]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler to send prompt to AI and close this drawer
  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  // File attachment handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!rfq) return null;

  // Mock data for Buyer RFQ details
  const rfqTimeline = [
    { stage: 'RFQ Received', date: rfq.receivedDate || '2024-10-25', status: 'completed', icon: FileText },
    { stage: 'Initial Review', date: '2024-10-25', status: 'completed', icon: Eye },
    { stage: 'Clarification Sent', date: '2024-10-26', status: 'completed', icon: MessageSquare },
    { stage: 'Costing Analysis', date: '2024-10-27', status: 'current', icon: Calculator },
    { stage: 'Quote Preparation', date: '2024-10-28', status: 'pending', icon: FileCheck },
    { stage: 'Quote Submission', date: '2024-10-29', status: 'pending', icon: Send },
  ];

  const specifications = [
    { category: 'Product Type', requirement: `${rfq.productType} - Premium Quality`, status: 'verified', icon: Package, compliance: '100%' },
    { category: 'Quality Standards', requirement: 'ISO 9001, AQL 2.5', status: 'verified', icon: Shield, compliance: '100%' },
    { category: 'Order Quantity', requirement: '5,000 pieces minimum', status: 'verified', icon: BarChart3, compliance: '100%' },
    { category: 'Delivery Terms', requirement: 'FOB Port, 45 days', status: 'pending', icon: Calendar, compliance: '95%' },
    { category: 'Compliance', requirement: 'OEKO-TEX, GOTS Certified', status: 'verified', icon: Award, compliance: '100%' },
    { category: 'Packaging', requirement: 'Poly bags, carton boxes', status: 'pending', icon: Package, compliance: '90%' },
  ];

  const competitorAnalysis = [
    { supplier: 'Competitor A', price: 9.20, leadTime: 50, quality: 'High', winProb: 25 },
    { supplier: 'Competitor B', price: 8.80, leadTime: 55, quality: 'Medium', winProb: 20 },
    { supplier: 'Your Quote', price: 8.50, leadTime: 45, quality: 'High', highlight: true, winProb: 55 },
  ];

  const communications = [
    {
      id: 1,
      timestamp: '2 hours ago',
      sender: 'John Smith - H&M Buyer',
      message: 'Can you confirm the fabric weight tolerance? We need ±5% maximum for consistency.',
      type: 'question',
      sentiment: 'neutral',
      priority: 'high'
    },
    {
      id: 2,
      timestamp: '5 hours ago',
      sender: 'Sarah Chen - You',
      message: 'Thank you for the RFQ. We\'re reviewing specifications and will have a competitive quote ready by EOD today.',
      type: 'reply',
      sentiment: 'positive',
      priority: 'normal'
    },
    {
      id: 3,
      timestamp: '1 day ago',
      sender: 'John Smith - H&M Buyer',
      message: 'Attached are the detailed technical specifications, quality requirements, and compliance standards for this order.',
      type: 'message',
      sentiment: 'neutral',
      priority: 'normal'
    },
  ];

  const costingBreakdown = [
    { category: 'Raw Materials', amount: 45200, percentage: 55, subItems: [
      { name: 'Fabric & Trims', amount: 32500 },
      { name: 'Accessories', amount: 12700 }
    ]},
    { category: 'Direct Labor', amount: 12300, percentage: 15, subItems: [
      { name: 'Cutting & Sewing', amount: 9800 },
      { name: 'Quality Control', amount: 2500 }
    ]},
    { category: 'Manufacturing Overhead', amount: 8200, percentage: 10, subItems: [
      { name: 'Factory Overhead', amount: 5200 },
      { name: 'Equipment & Utilities', amount: 3000 }
    ]},
    { category: 'Logistics', amount: 6150, percentage: 8, subItems: [
      { name: 'Shipping', amount: 4500 },
      { name: 'Handling & Documentation', amount: 1650 }
    ]},
    { category: 'Profit Margin', amount: 10150, percentage: 12, subItems: [] },
  ];

  const totalCost = costingBreakdown.reduce((sum, item) => sum + item.amount, 0);

  const pricingScenarios = [
    { 
      name: 'Aggressive', 
      unitPrice: 8.20, 
      margin: 8, 
      winProb: 75, 
      risk: 'High',
      description: 'Lowest pricing to maximize win probability'
    },
    { 
      name: 'Competitive', 
      unitPrice: 8.50, 
      margin: 12, 
      winProb: 68, 
      risk: 'Medium',
      description: 'Balanced approach with healthy margins',
      recommended: true
    },
    { 
      name: 'Premium', 
      unitPrice: 8.95, 
      margin: 18, 
      winProb: 45, 
      risk: 'Low',
      description: 'Higher margins with value-added services'
    },
  ];

  const historicalData = [
    { month: 'Jul', quotes: 12, won: 8, rate: 67 },
    { month: 'Aug', quotes: 15, won: 11, rate: 73 },
    { month: 'Sep', quotes: 18, won: 13, rate: 72 },
    { month: 'Oct', quotes: 14, won: 10, rate: 71 },
  ];

  const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.00; // No tax typically for B2B
  const total = subtotal + tax;

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, {
      id: quoteItems.length + 1,
      item: 'New Item',
      quantity: 0,
      unit: 'pcs',
      unitPrice: 0,
      total: 0
    }]);
  };

  const removeQuoteItem = (id: number) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const updateQuoteItem = (id: number, field: string, value: any) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-16 bottom-[72px] w-full max-w-[1000px] bg-gradient-to-br from-[#101725] to-[#182336] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5 flex-shrink-0">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl text-white">{rfq.rfqId}</h2>
                        <Badge className={
                          rfq.status === 'Needs Clarification'
                            ? 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20' 
                            : rfq.status === 'Ready for Costing'
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : rfq.status === 'Quoted'
                            ? 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                            : rfq.status === 'Closed - Won'
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                            : 'bg-[#D0342C]/10 text-[#D0342C] border border-[#D0342C]/20'
                        }>
                          {rfq.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6F83A7]">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {rfq.buyer}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {rfq.productType}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Received: {rfq.receivedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Est. Value</div>
                      <div className="text-lg text-white">$82K</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Target Margin</div>
                      <div className="text-lg text-white">12%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-[#6F83A7] mb-1">Win Probability</div>
                      <div className="text-lg text-[#57ACAF]">68%</div>
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/20">
                      <div className="text-xs text-[#EAB308] mb-1">Days Active</div>
                      <div className="text-lg text-white">3</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-start gap-2 ml-6">
                  {onDraftQuote && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#EAB308] to-[#57ACAF] text-black border-none hover:opacity-90 shadow-lg shadow-[#EAB308]/20"
                      onClick={onDraftQuote}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Draft quote with MARBIM
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                    onClick={() => toast.success('Quote submitted')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Quote
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                    onClick={() => toast.info('Edit RFQ details')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sleek Tabs Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'costing', label: 'Costing Details', icon: Calculator },
                  { id: 'requirements', label: 'Requirements', icon: FileText },
                  { id: 'communication', label: 'Communication', icon: MessageSquare },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id 
                          ? 'text-[#57ACAF]' 
                          : 'text-[#6F83A7] hover:text-white'
                        }
                      `}
                    >
                      {/* Tab Icon & Label */}
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>

                      {/* Active Indicator */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeBuyerRFQTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* AI Strategic Analysis Card */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 rounded-xl border border-[#EAB308]/20 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div>
                            <h3 className="text-white">Strategic RFQ Analysis</h3>
                            <p className="text-xs text-[#6F83A7]">AI-powered win probability & recommendations</p>
                          </div>
                        </div>
                        <MarbimAIButton
                          prompt={`Analyze this RFQ from ${rfq.buyer} for ${rfq.productType}. Provide strategic insights on: 1) Win probability analysis 2) Competitive positioning 3) Pricing strategy recommendations 4) Risk factors 5) Buyer history insights.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#6F83A7]">Win Probability</span>
                          <span className="text-[#57ACAF]">68% - Strong Position</span>
                        </div>
                        <Progress value={68} className="h-2 bg-white/5" />
                        <p className="text-sm text-white/70 mt-3">
                          Based on historical data with {rfq.buyer}, your competitive pricing, and quality track record, 
                          this RFQ shows strong potential. Consider emphasizing lead time advantage and sustainability credentials.
                        </p>
                      </div>
                    </div>

                    {/* Timeline & Key Information */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* RFQ Timeline */}
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white flex items-center gap-2">
                            <History className="w-4 h-4 text-[#57ACAF]" />
                            RFQ Timeline
                          </h3>
                          <MarbimAIButton
                            prompt={`Analyze the RFQ timeline for ${rfq.rfqId}. Identify any delays, suggest action items, and recommend optimal response strategy.`}
                            onAskMarbim={handleAskMarbim}
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          {rfqTimeline.map((stage, idx) => {
                            const StageIcon = stage.icon;
                            return (
                              <div key={idx} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  stage.status === 'completed' 
                                    ? 'bg-[#57ACAF]/20' 
                                    : stage.status === 'current'
                                    ? 'bg-[#EAB308]/20'
                                    : 'bg-white/5'
                                }`}>
                                  <StageIcon className={`w-4 h-4 ${
                                    stage.status === 'completed' 
                                      ? 'text-[#57ACAF]' 
                                      : stage.status === 'current'
                                      ? 'text-[#EAB308]'
                                      : 'text-[#6F83A7]'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm text-white">{stage.stage}</div>
                                  <div className="text-xs text-[#6F83A7]">{stage.date}</div>
                                </div>
                                {stage.status === 'completed' && (
                                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Buyer Information */}
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#57ACAF]" />
                            Buyer Information
                          </h3>
                          <MarbimAIButton
                            prompt={`Provide comprehensive buyer profile for ${rfq.buyer}. Include: 1) Past order history 2) Payment patterns 3) Typical order characteristics 4) Negotiation preferences 5) Key relationship insights.`}
                            onAskMarbim={handleAskMarbim}
                            size="sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7]">Company</div>
                              <div className="text-sm text-white">{rfq.buyer}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7]">Contact Person</div>
                              <div className="text-sm text-white">John Smith</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7]">Email</div>
                              <div className="text-sm text-white">john.smith@{rfq.buyer.toLowerCase().replace(/\s+/g, '')}.com</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs text-[#6F83A7]">Buyer Tier</div>
                              <div className="text-sm">
                                <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                                  Tier A - Strategic
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Competitive Analysis */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#57ACAF]" />
                          Competitive Positioning
                        </h3>
                        <MarbimAIButton
                          prompt={`Analyze competitive landscape for this RFQ. Compare our quote against typical competitor pricing, identify our competitive advantages, and suggest differentiation strategies.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left text-xs text-[#6F83A7] py-2">Supplier</th>
                              <th className="text-left text-xs text-[#6F83A7] py-2">Unit Price</th>
                              <th className="text-left text-xs text-[#6F83A7] py-2">Lead Time</th>
                              <th className="text-left text-xs text-[#6F83A7] py-2">Quality</th>
                              <th className="text-left text-xs text-[#6F83A7] py-2">Win Probability</th>
                            </tr>
                          </thead>
                          <tbody>
                            {competitorAnalysis.map((comp, idx) => (
                              <tr 
                                key={idx} 
                                className={`border-b border-white/5 ${comp.highlight ? 'bg-[#57ACAF]/10' : ''}`}
                              >
                                <td className="py-3 text-sm text-white">
                                  {comp.supplier}
                                  {comp.highlight && <Badge className="ml-2 bg-[#EAB308]/10 text-[#EAB308] border-none text-xs">You</Badge>}
                                </td>
                                <td className="py-3 text-sm text-white">${comp.price}</td>
                                <td className="py-3 text-sm text-white">{comp.leadTime} days</td>
                                <td className="py-3">
                                  <Badge className={
                                    comp.quality === 'High' 
                                      ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                                      : 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                                  }>
                                    {comp.quality}
                                  </Badge>
                                </td>
                                <td className="py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white/5 rounded-full h-1.5">
                                      <div 
                                        className={`h-full rounded-full ${comp.highlight ? 'bg-[#57ACAF]' : 'bg-[#6F83A7]'}`}
                                        style={{ width: `${comp.winProb}%` }}
                                      />
                                    </div>
                                    <span className={comp.highlight ? 'text-[#57ACAF]' : 'text-white'}>
                                      {comp.winProb}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Win Probability Chart */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                          Historical Win Rate Performance
                        </h3>
                        <MarbimAIButton
                          prompt={`Analyze our historical win rate trends. Identify patterns, seasonal variations, and provide recommendations to improve quote success rate.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={historicalData}>
                          <defs>
                            <linearGradient id="winRateGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="month" stroke="#6F83A7" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#6F83A7" style={{ fontSize: '12px' }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#182336',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="rate" 
                            stroke="#57ACAF" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#winRateGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Costing Tab */}
                {activeTab === 'costing' && (
                  <div className="space-y-6">
                    {/* AI Costing Optimization Card */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 rounded-xl border border-[#EAB308]/20 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div>
                            <h3 className="text-white">AI Costing Optimization</h3>
                            <p className="text-xs text-[#6F83A7]">Intelligent cost breakdown & margin recommendations</p>
                          </div>
                        </div>
                        <MarbimAIButton
                          prompt={`Analyze the costing structure for this RFQ. Provide recommendations on: 1) Cost optimization opportunities 2) Margin analysis 3) Material sourcing alternatives 4) Production efficiency improvements 5) Competitive pricing strategy.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-[#6F83A7]">Total Cost</div>
                          <div className="text-xl text-white">${totalCost.toLocaleString()}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-[#6F83A7]">Target Margin</div>
                          <div className="text-xl text-[#57ACAF]">12%</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-[#6F83A7]">Quote Price</div>
                          <div className="text-xl text-[#EAB308]">${total.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#57ACAF]" />
                          Detailed Cost Breakdown
                        </h3>
                        <MarbimAIButton
                          prompt={`Review each cost component in detail. Identify which costs are above industry benchmarks and suggest specific actions to reduce costs while maintaining quality.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-4">
                        {costingBreakdown.map((cost, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white">{cost.category}</span>
                                <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20 text-xs">
                                  {cost.percentage}%
                                </Badge>
                              </div>
                              <span className="text-white">${cost.amount.toLocaleString()}</span>
                            </div>
                            <Progress value={cost.percentage} className="h-2 bg-white/5" />
                            {cost.subItems && cost.subItems.length > 0 && (
                              <div className="ml-4 space-y-1 mt-2">
                                {cost.subItems.map((sub, subIdx) => (
                                  <div key={subIdx} className="flex items-center justify-between text-xs">
                                    <span className="text-[#6F83A7]">{sub.name}</span>
                                    <span className="text-white/70">${sub.amount.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost Distribution Pie Chart */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <h3 className="text-white mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                          Cost Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={costingBreakdown}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ category, percentage }) => `${category?.split(' ')[0] || ''} ${percentage}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="amount"
                            >
                              {costingBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={
                                  index === 0 ? '#57ACAF' :
                                  index === 1 ? '#EAB308' :
                                  index === 2 ? '#6F83A7' :
                                  index === 3 ? '#8B9DC3' :
                                  '#C5D0E6'
                                } />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#182336',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pricing Scenarios */}
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#57ACAF]" />
                            Pricing Scenarios
                          </h3>
                          <MarbimAIButton
                            prompt={`Evaluate the three pricing scenarios. Recommend the optimal pricing strategy considering buyer relationship, market conditions, and business objectives.`}
                            onClick={handleAskMarbim}
                            label="Scenario Analysis"
                            variant="compact"
                          />
                        </div>
                        <div className="space-y-3">
                          {pricingScenarios.map((scenario, idx) => (
                            <div 
                              key={idx}
                              className={`p-3 rounded-lg border ${
                                scenario.recommended 
                                  ? 'bg-[#57ACAF]/10 border-[#57ACAF]/30' 
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-white">{scenario.name}</span>
                                  {scenario.recommended && (
                                    <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-xs">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-white">${scenario.unitPrice}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-[#6F83A7]">Margin:</span>
                                  <span className="text-white ml-1">{scenario.margin}%</span>
                                </div>
                                <div>
                                  <span className="text-[#6F83A7]">Win:</span>
                                  <span className="text-[#57ACAF] ml-1">{scenario.winProb}%</span>
                                </div>
                                <div>
                                  <span className="text-[#6F83A7]">Risk:</span>
                                  <span className={`ml-1 ${
                                    scenario.risk === 'Low' ? 'text-[#57ACAF]' :
                                    scenario.risk === 'Medium' ? 'text-[#EAB308]' :
                                    'text-[#D0342C]'
                                  }`}>{scenario.risk}</span>
                                </div>
                              </div>
                              <p className="text-xs text-white/70 mt-2">{scenario.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quote Builder */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-[#57ACAF]" />
                          Quote Line Items
                        </h3>
                        <div className="flex items-center gap-2">
                          <MarbimAIButton
                            prompt={`Review the quote line items for completeness and accuracy. Suggest any missing items, validate pricing, and ensure all buyer requirements are addressed.`}
                            onAskMarbim={handleAskMarbim}
                            size="sm"
                          />
                          <Button
                            size="sm"
                            onClick={addQuoteItem}
                            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {quoteItems.map((item, idx) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex-1 grid grid-cols-5 gap-3">
                              <Input
                                value={item.item}
                                onChange={(e) => updateQuoteItem(item.id, 'item', e.target.value)}
                                className="col-span-2 bg-white/5 border-white/10 text-white"
                                placeholder="Item description"
                              />
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuoteItem(item.id, 'quantity', parseFloat(e.target.value))}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Qty"
                              />
                              <Input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => updateQuoteItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Unit Price"
                              />
                              <div className="flex items-center justify-end text-white">
                                ${item.total.toLocaleString()}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeQuoteItem(item.id)}
                              className="text-white/60 hover:text-[#D0342C] hover:bg-[#D0342C]/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#6F83A7]">Subtotal</span>
                            <span className="text-white">${subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-lg">
                            <span className="text-white">Total Quote Value</span>
                            <span className="text-[#EAB308]">${total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Requirements Tab */}
                {activeTab === 'requirements' && (
                  <div className="space-y-6">
                    {/* AI Requirements Validation Card */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 rounded-xl border border-[#EAB308]/20 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div>
                            <h3 className="text-white">AI Requirements Compliance Check</h3>
                            <p className="text-xs text-[#6F83A7]">Automated validation of buyer specifications</p>
                          </div>
                        </div>
                        <MarbimAIButton
                          prompt={`Perform comprehensive compliance check on all buyer requirements. Flag any gaps, ambiguities, or potential issues. Suggest clarification questions and risk mitigation strategies.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="p-3 rounded-lg bg-[#57ACAF]/10">
                          <div className="text-xs text-[#57ACAF]">Verified</div>
                          <div className="text-xl text-white">4/6</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#EAB308]/10">
                          <div className="text-xs text-[#EAB308]">Pending</div>
                          <div className="text-xl text-white">2/6</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-[#6F83A7]">Compliance</div>
                          <div className="text-xl text-[#57ACAF]">97%</div>
                        </div>
                      </div>
                    </div>

                    {/* Specifications Checklist */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                          Buyer Specifications
                        </h3>
                        <MarbimAIButton
                          prompt={`Analyze each specification requirement in detail. Identify any specifications that may be difficult to meet and suggest alternatives or clarifications needed.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-3">
                        {specifications.map((spec, idx) => {
                          const SpecIcon = spec.icon;
                          return (
                            <div 
                              key={idx}
                              className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180"
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                spec.status === 'verified' 
                                  ? 'bg-[#57ACAF]/20' 
                                  : 'bg-[#EAB308]/20'
                              }`}>
                                <SpecIcon className={`w-5 h-5 ${
                                  spec.status === 'verified' 
                                    ? 'text-[#57ACAF]' 
                                    : 'text-[#EAB308]'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm text-white">{spec.category}</span>
                                  <Badge className={
                                    spec.status === 'verified'
                                      ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                                      : 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20'
                                  }>
                                    {spec.status === 'verified' ? 'Verified' : 'Pending'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-white/70 mb-2">{spec.requirement}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-[#6F83A7]">Compliance:</span>
                                  <Progress value={parseInt(spec.compliance)} className="h-1.5 bg-white/5 flex-1 max-w-[100px]" />
                                  <span className="text-xs text-[#57ACAF]">{spec.compliance}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technical Specifications */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#57ACAF]" />
                            Product Details
                          </h3>
                          <MarbimAIButton
                            prompt={`Review product specifications and compare with our production capabilities. Identify any technical challenges and suggest solutions.`}
                            onClick={handleAskMarbim}
                            label="Tech Review"
                            variant="compact"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Product Type</div>
                            <div className="text-sm text-white">{rfq.productType}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Material</div>
                            <div className="text-sm text-white">Premium Cotton 200 GSM</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Color Options</div>
                            <div className="text-sm text-white">White, Black, Navy (3 colors)</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Sizes</div>
                            <div className="text-sm text-white">S, M, L, XL, XXL</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-1">Printing</div>
                            <div className="text-sm text-white">Screen print (2 locations)</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#57ACAF]" />
                            Quality & Compliance
                          </h3>
                          <MarbimAIButton
                            prompt={`Check all quality and compliance requirements. Verify our certifications match buyer needs and identify any compliance gaps.`}
                            onClick={handleAskMarbim}
                            label="Compliance Check"
                            variant="compact"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                              <div className="text-sm text-white">ISO 9001:2015</div>
                            </div>
                            <div className="text-xs text-white/70">Quality Management Certified</div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                              <div className="text-sm text-white">OEKO-TEX Standard 100</div>
                            </div>
                            <div className="text-xs text-white/70">Textile Safety Certified</div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                              <div className="text-sm text-white">GOTS Certified</div>
                            </div>
                            <div className="text-xs text-white/70">Organic Cotton Verified</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <Info className="w-4 h-4 text-[#6F83A7]" />
                              <div className="text-sm text-white">AQL 2.5 Inspection</div>
                            </div>
                            <div className="text-xs text-white/70">Standard quality level</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attachments & Documents */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-[#57ACAF]" />
                          Buyer Documents & Attachments
                        </h3>
                        <MarbimAIButton
                          prompt={`Summarize key information from buyer attachments. Extract critical requirements, specifications, and terms from all documents.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: 'Technical_Specifications_v2.pdf', size: '2.4 MB', type: 'PDF' },
                          { name: 'Quality_Standards.xlsx', size: '850 KB', type: 'Excel' },
                          { name: 'Design_Mockups.zip', size: '12.3 MB', type: 'Archive' },
                          { name: 'Terms_and_Conditions.docx', size: '340 KB', type: 'Word' },
                        ].map((file, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[#57ACAF]" />
                              </div>
                              <div>
                                <div className="text-sm text-white">{file.name}</div>
                                <div className="text-xs text-[#6F83A7]">{file.size} • {file.type}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Communication Tab */}
                {activeTab === 'communication' && (
                  <div className="space-y-6">
                    {/* AI Communication Assistant Card */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 rounded-xl border border-[#EAB308]/20 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div>
                            <h3 className="text-white">AI Communication Insights</h3>
                            <p className="text-xs text-[#6F83A7]">Sentiment analysis & response suggestions</p>
                          </div>
                        </div>
                        <MarbimAIButton
                          prompt={`Analyze all communications with ${rfq.buyer} for this RFQ. Provide: 1) Sentiment analysis 2) Key concerns or questions 3) Suggested responses 4) Communication strategy recommendations 5) Risk flags.`}
                          onAskMarbim={handleAskMarbim}
                          size="sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-[#6F83A7]">Total Messages</div>
                          <div className="text-xl text-white">{communications.length}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#57ACAF]/10">
                          <div className="text-xs text-[#57ACAF]">Positive Tone</div>
                          <div className="text-xl text-white">67%</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#EAB308]/10">
                          <div className="text-xs text-[#EAB308]">Needs Response</div>
                          <div className="text-xl text-white">1</div>
                        </div>
                      </div>
                    </div>

                    {/* Communication Thread */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#57ACAF]" />
                          Communication History
                        </h3>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                          onClick={() => toast.success('Compose new message')}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {communications.map((comm) => (
                          <div 
                            key={comm.id}
                            className={`p-4 rounded-lg border ${
                              comm.priority === 'high'
                                ? 'bg-[#EAB308]/5 border-[#EAB308]/20'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center text-white text-sm">
                                  {comm.sender.split(' ')[0][0]}
                                </div>
                                <div>
                                  <div className="text-sm text-white">{comm.sender}</div>
                                  <div className="text-xs text-[#6F83A7]">{comm.timestamp}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {comm.priority === 'high' && (
                                  <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                                    High Priority
                                  </Badge>
                                )}
                                <Badge className={
                                  comm.sentiment === 'positive'
                                    ? 'bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20'
                                    : 'bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20'
                                }>
                                  {comm.type}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-white/90 mb-3">{comm.message}</p>
                            {comm.type === 'question' && (
                              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                <MarbimAIButton
                                  prompt={`Draft a professional response to this buyer question: "${comm.message}". Include technical details and maintain positive tone.`}
                                  onClick={handleAskMarbim}
                                  label="AI Draft Response"
                                  variant="compact"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                                >
                                  Reply
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Response Templates */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#57ACAF]" />
                            Quick Response Templates
                          </h3>
                          <MarbimAIButton
                            prompt={`Generate 5 contextually relevant quick response templates for this RFQ conversation. Include acknowledgment, clarification request, update, and follow-up templates.`}
                            onClick={handleAskMarbim}
                            label="Generate Templates"
                            variant="compact"
                          />
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: 'Acknowledge Receipt', preview: 'Thank you for your RFQ. We are reviewing...' },
                            { label: 'Request Clarification', preview: 'Could you please provide more details on...' },
                            { label: 'Quote Update', preview: 'We have prepared a competitive quote...' },
                            { label: 'Follow-up', preview: 'Following up on our previous discussion...' },
                          ].map((template, idx) => (
                            <button
                              key={idx}
                              onClick={() => toast.success(`Template applied: ${template.label}`)}
                              className="w-full text-left p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180"
                            >
                              <div className="text-sm text-white mb-1">{template.label}</div>
                              <div className="text-xs text-[#6F83A7]">{template.preview}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#57ACAF]" />
                            Compose New Message
                          </h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">To</label>
                            <Input
                              value={`${rfq.buyer} - John Smith`}
                              readOnly
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Subject</label>
                            <Input
                              placeholder={`Re: ${rfq.rfqId}`}
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-[#6F83A7] mb-1 block">Message</label>
                            <Textarea
                              placeholder="Type your message..."
                              rows={6}
                              className="bg-white/5 border-white/10 text-white resize-none"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white border-none hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70"
                              onClick={() => toast.success('Message sent')}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send Message
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                              onClick={handleAttachClick}
                            >
                              <Paperclip className="w-4 h-4" />
                            </Button>
                          </div>
                          {attachedFiles.length > 0 && (
                            <div className="space-y-2">
                              {attachedFiles.map((file, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-180"
                                >
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-[#6F83A7]" />
                                    <span className="text-sm text-white">{file.name}</span>
                                    <span className="text-xs text-[#6F83A7]">({formatFileSize(file.size)})</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="text-white/60 hover:text-[#D0342C] hover:bg-[#D0342C]/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="*/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </>
      )}
    </AnimatePresence>
  );
}
