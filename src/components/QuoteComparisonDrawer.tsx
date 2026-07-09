import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, DollarSign, Clock, Award, TrendingUp, AlertCircle, Download, CheckCircle, Sparkles, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Minus, Upload, Paperclip, File, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { MarbimAIButton } from './MarbimAIButton';

interface Quote {
  id: string;
  supplier: string;
  totalPrice: number;
  unitPrice: number;
  leadTime: string;
  qualityScore: number;
  complianceScore: number;
  sustainabilityScore: number;
  paymentTerms: string;
  warranty: string;
  certifications: string[];
  minimumOrder: number;
  location: string;
  responseTime: string;
  aiScore: number;
}

interface QuoteComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfqId: string;
  quotes: Quote[];
  onAskMarbim: (prompt: string) => void;
}

export const QuoteComparisonDrawer: React.FC<QuoteComparisonDrawerProps> = ({
  isOpen,
  onClose,
  rfqId,
  quotes,
  onAskMarbim,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'breakdown' | 'ai-analysis'>('overview');
  const [selectedForAward, setSelectedForAward] = useState<string | null>(null);

  const handleAskMarbim = (prompt: string) => {
    onAskMarbim(prompt);
    onClose();
  };

  const handleAwardRFQ = (quoteId: string, supplier: string) => {
    setSelectedForAward(quoteId);
    toast.success(`RFQ awarded to ${supplier}`, {
      description: 'Purchase order generation initiated',
    });
  };

  // Calculate statistics
  const avgPrice = quotes.reduce((sum, q) => sum + q.totalPrice, 0) / quotes.length;
  const lowestPrice = Math.min(...quotes.map(q => q.totalPrice));
  const highestPrice = Math.max(...quotes.map(q => q.totalPrice));
  const avgLeadTime = quotes.reduce((sum, q) => sum + parseInt(q.leadTime), 0) / quotes.length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'comparison', label: 'Side-by-Side', icon: FileText },
    { id: 'breakdown', label: 'Cost Breakdown', icon: DollarSign },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-16 bottom-[72px] right-0 w-full max-w-[1200px] bg-gradient-to-br from-[#101725] to-[#182336] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              </div>

              <div className="relative flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl mb-1">Quote Comparison</h2>
                    <p className="text-[#6F83A7]">{rfqId} • {quotes.length} Quotes Received</p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/10 text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="relative grid grid-cols-4 gap-3">
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Price</div>
                  <div className="text-lg text-white">${avgPrice.toLocaleString()}</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Best Price</div>
                  <div className="text-lg text-[#57ACAF]">${lowestPrice.toLocaleString()}</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Avg Lead Time</div>
                  <div className="text-lg text-white">{Math.round(avgLeadTime)} days</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Price Range</div>
                  <div className="text-lg text-white">{Math.round(((highestPrice - lowestPrice) / lowestPrice) * 100)}%</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-8 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-180 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black shadow-lg shadow-[#EAB308]/20'
                          : 'bg-white/5 text-[#6F83A7] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* AI Recommendation Card */}
                    <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">AI Recommended Winner</h3>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            Based on weighted scoring (Price 40%, Lead Time 30%, Quality 30%), MARBIM recommends <span className="text-[#EAB308]">{quotes[0]?.supplier}</span> with an overall score of {quotes[0]?.aiScore}/100.
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">Best Value</Badge>
                            <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">Fast Delivery</Badge>
                            <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">High Quality</Badge>
                          </div>
                        </div>
                      </div>
                      <MarbimAIButton
                        prompt={`Analyze all ${quotes.length} quotes for ${rfqId} and provide detailed recommendation with justification. Include risk analysis, cost-benefit breakdown, and negotiation suggestions.`}
                        onClick={handleAskMarbim}
                        label="Deep Analysis"
                      />
                    </div>

                    {/* Quote Cards */}
                    <div className="space-y-4">
                      {quotes.map((quote, index) => (
                        <div
                          key={quote.id}
                          className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-180"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/5 flex items-center justify-center border border-[#57ACAF]/30">
                                <span className="text-[#57ACAF] font-semibold">#{index + 1}</span>
                              </div>
                              <div>
                                <h3 className="text-white mb-1">{quote.supplier}</h3>
                                <p className="text-sm text-[#6F83A7]">{quote.location}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className="bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30">
                                    AI Score: {quote.aiScore}/100
                                  </Badge>
                                  {index === 0 && (
                                    <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                                      <Award className="w-3 h-3 mr-1" />
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl text-white mb-1">${quote.totalPrice.toLocaleString()}</div>
                              <div className="text-sm text-[#6F83A7]">${quote.unitPrice}/unit</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-1">Lead Time</div>
                              <div className="text-white">{quote.leadTime} days</div>
                            </div>
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-1">Quality Score</div>
                              <div className="text-white">{quote.qualityScore}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-1">Payment Terms</div>
                              <div className="text-white">{quote.paymentTerms}</div>
                            </div>
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-1">Response Time</div>
                              <div className="text-white">{quote.responseTime}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              onClick={() => handleAwardRFQ(quote.id, quote.supplier)}
                              className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                            >
                              <Award className="w-4 h-4 mr-2" />
                              Award RFQ
                            </Button>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                              onClick={() => setActiveTab('comparison')}
                            >
                              Compare
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Side-by-Side Comparison */}
                {activeTab === 'comparison' && (
                  <div className="space-y-6">
                    {/* AI Insights */}
                    <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Comparison Insights</h3>
                          <p className="text-sm text-[#6F83A7]">
                            Price variance of {Math.round(((highestPrice - lowestPrice) / lowestPrice) * 100)}% suggests room for negotiation. Quality scores are consistent across top 3 suppliers.
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton
                        prompt={`Provide detailed side-by-side comparison of all quotes for ${rfqId}. Highlight key differences, identify outliers, and suggest negotiation strategies for each supplier.`}
                        onClick={handleAskMarbim}
                        label="Compare All"
                      />
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-3 text-sm text-[#6F83A7] font-normal sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">
                              Criteria
                            </th>
                            {quotes.map((quote) => (
                              <th key={quote.id} className="text-center p-3 text-sm text-white min-w-[180px]">
                                {quote.supplier}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Price Row */}
                          <tr className="border-b border-white/10">
                            <td className="p-3 text-white sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">Total Price</td>
                            {quotes.map((quote) => (
                              <td key={quote.id} className="p-3 text-center">
                                <div className="text-white">${quote.totalPrice.toLocaleString()}</div>
                                <div className="flex items-center justify-center gap-1 text-xs mt-1">
                                  {quote.totalPrice === lowestPrice ? (
                                    <>
                                      <ArrowDownRight className="w-3 h-3 text-green-400" />
                                      <span className="text-green-400">Lowest</span>
                                    </>
                                  ) : quote.totalPrice === highestPrice ? (
                                    <>
                                      <ArrowUpRight className="w-3 h-3 text-red-400" />
                                      <span className="text-red-400">Highest</span>
                                    </>
                                  ) : (
                                    <span className="text-[#6F83A7]">
                                      {((quote.totalPrice - lowestPrice) / lowestPrice * 100).toFixed(1)}% higher
                                    </span>
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>

                          {/* Lead Time Row */}
                          <tr className="border-b border-white/10">
                            <td className="p-3 text-white sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">Lead Time</td>
                            {quotes.map((quote) => (
                              <td key={quote.id} className="p-3 text-center text-white">
                                {quote.leadTime} days
                              </td>
                            ))}
                          </tr>

                          {/* Quality Score Row */}
                          <tr className="border-b border-white/10">
                            <td className="p-3 text-white sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">Quality Score</td>
                            {quotes.map((quote) => (
                              <td key={quote.id} className="p-3">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-white">{quote.qualityScore}%</span>
                                  <Progress value={quote.qualityScore} className="h-2 w-24" />
                                </div>
                              </td>
                            ))}
                          </tr>

                          {/* Compliance Score Row */}
                          <tr className="border-b border-white/10">
                            <td className="p-3 text-white sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">Compliance</td>
                            {quotes.map((quote) => (
                              <td key={quote.id} className="p-3">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-white">{quote.complianceScore}%</span>
                                  <Progress value={quote.complianceScore} className="h-2 w-24" />
                                </div>
                              </td>
                            ))}
                          </tr>

                          {/* Sustainability Row */}
                          <tr className="border-b border-white/10">
                            <td className="p-3 text-white sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">Sustainability</td>
                            {quotes.map((quote) => (
                              <td key={quote.id} className="p-3">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-white">{quote.sustainabilityScore}%</span>
                                  <Progress value={quote.sustainabilityScore} className="h-2 w-24" />
                                </div>
                              </td>
                            ))}
                          </tr>

                          {/* Payment Terms Row */}
                          <tr className="border-b border-white/10">
                            <td className="p-3 text-white sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">Payment Terms</td>
                            {quotes.map((quote) => (
                              <td key={quote.id} className="p-3 text-center text-white">
                                {quote.paymentTerms}
                              </td>
                            ))}
                          </tr>

                          {/* AI Score Row */}
                          <tr>
                            <td className="p-3 text-white sticky left-0 bg-gradient-to-br from-[#101725] to-[#182336]">AI Overall Score</td>
                            {quotes.map((quote) => (
                              <td key={quote.id} className="p-3">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-[#EAB308] text-lg">{quote.aiScore}/100</span>
                                  <Progress value={quote.aiScore} className="h-2 w-24" />
                                </div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab 3: Cost Breakdown */}
                {activeTab === 'breakdown' && (
                  <div className="space-y-6">
                    {/* AI Cost Analysis */}
                    <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <PieChart className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Cost Breakdown Analysis</h3>
                          <p className="text-sm text-[#6F83A7]">
                            MARBIM has identified hidden costs and calculated total cost of ownership for each supplier including shipping, duties, and quality-related expenses.
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton
                        prompt={`Provide comprehensive total cost of ownership analysis for all quotes in ${rfqId}. Include hidden costs, risk premiums, quality costs, and long-term value comparison.`}
                        onClick={handleAskMarbim}
                        label="TCO Analysis"
                      />
                    </div>

                    {/* Cost Breakdown Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {quotes.map((quote) => (
                        <div
                          key={quote.id}
                          className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-white">{quote.supplier}</h3>
                            <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                              ${quote.totalPrice.toLocaleString()}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                              <span className="text-sm text-[#6F83A7]">Base Price</span>
                              <span className="text-white">${(quote.totalPrice * 0.75).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                              <span className="text-sm text-[#6F83A7]">Shipping & Logistics</span>
                              <span className="text-white">${(quote.totalPrice * 0.12).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                              <span className="text-sm text-[#6F83A7]">Customs & Duties</span>
                              <span className="text-white">${(quote.totalPrice * 0.08).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                              <span className="text-sm text-[#6F83A7]">Quality Assurance</span>
                              <span className="text-white">${(quote.totalPrice * 0.05).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-t border-white/10 mt-2">
                              <span className="text-white font-medium">Total Cost</span>
                              <span className="text-[#EAB308] text-lg">${quote.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Cost Per Unit Breakdown */}
                          <div className="mt-4 p-3 rounded-lg bg-white/5">
                            <div className="text-xs text-[#6F83A7] mb-2">Per Unit Cost</div>
                            <div className="text-xl text-white">${quote.unitPrice}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: AI Analysis */}
                {activeTab === 'ai-analysis' && (
                  <div className="space-y-6">
                    {/* AI Comprehensive Analysis */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">MARBIM AI Analysis</h3>
                          <p className="text-sm text-[#6F83A7]">
                            Comprehensive AI-powered analysis of all quotes with predictive insights and recommendations.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <MarbimAIButton
                          prompt={`Analyze risk factors for all quotes in ${rfqId}. Include supplier reliability, delivery risks, quality risks, and payment risks with mitigation strategies.`}
                          onClick={handleAskMarbim}
                          label="Risk Assessment"
                          variant="outline"
                        />
                        <MarbimAIButton
                          prompt={`Provide negotiation strategy for each supplier in ${rfqId}. Include target prices, leverage points, and alternative scenarios.`}
                          onClick={handleAskMarbim}
                          label="Negotiation Guide"
                          variant="outline"
                        />
                        <MarbimAIButton
                          prompt={`Compare long-term value proposition of all suppliers for ${rfqId}. Consider partnership potential, scalability, and strategic fit.`}
                          onClick={handleAskMarbim}
                          label="Strategic Value"
                          variant="outline"
                        />
                        <MarbimAIButton
                          prompt={`Identify hidden costs and potential savings opportunities across all quotes for ${rfqId}. Include recommendations for cost optimization.`}
                          onClick={handleAskMarbim}
                          label="Cost Optimization"
                          variant="outline"
                        />
                      </div>
                    </div>

                    {/* Scoring Breakdown */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4">AI Scoring Methodology</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Price Competitiveness (40%)</span>
                            <span className="text-white">Weighted Score</span>
                          </div>
                          <p className="text-sm text-[#6F83A7] mb-2">
                            Evaluates total cost of ownership including hidden costs, payment terms impact, and price stability.
                          </p>
                        </div>
                        <Separator className="bg-white/10" />
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Lead Time & Delivery (30%)</span>
                            <span className="text-white">Weighted Score</span>
                          </div>
                          <p className="text-sm text-[#6F83A7] mb-2">
                            Considers delivery reliability, historical on-time performance, and production capacity.
                          </p>
                        </div>
                        <Separator className="bg-white/10" />
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Quality & Compliance (30%)</span>
                            <span className="text-white">Weighted Score</span>
                          </div>
                          <p className="text-sm text-[#6F83A7] mb-2">
                            Evaluates quality certifications, compliance history, sustainability scores, and defect rates.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top Recommendations */}
                    <div className="space-y-4">
                      <h3 className="text-white">AI Recommendations by Category</h3>
                      {[
                        { title: 'Best Overall Value', supplier: quotes[0]?.supplier, reason: 'Optimal balance of price, quality, and delivery time', color: 'EAB308' },
                        { title: 'Fastest Delivery', supplier: quotes[1]?.supplier, reason: 'Shortest lead time with reliable track record', color: '57ACAF' },
                        { title: 'Highest Quality', supplier: quotes[0]?.supplier, reason: 'Superior certifications and quality metrics', color: '6F83A7' },
                      ].map((rec, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl bg-gradient-to-br from-[#${rec.color}]/10 to-[#${rec.color}]/5 border border-[#${rec.color}]/20`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Award className={`w-4 h-4 text-[#${rec.color}]`} />
                                <h4 className="text-white">{rec.title}</h4>
                              </div>
                              <p className="text-sm text-white mb-1">{rec.supplier}</p>
                              <p className="text-sm text-[#6F83A7]">{rec.reason}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                <FileText className="w-4 h-4" />
                <span>{quotes.length} quotes received</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success('Quote comparison exported', {
                      description: 'PDF report downloaded successfully',
                    });
                  }}
                  className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
