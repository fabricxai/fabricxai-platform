import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, FileText, Truck, Calendar, DollarSign, Package, MapPin, Clock, CheckCircle, AlertCircle, Download, Paperclip, File, Trash2, User, Building, Mail, Phone, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { MarbimAIButton } from './MarbimAIButton';

interface AwardedRFQ {
  rfqId: string;
  supplier: string;
  awardedDate: string;
  totalAmount: number;
  poNumber: string;
  poStatus: string;
  deliveryDate: string;
  deliveryStatus: string;
  paymentTerms: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  contractTerms: {
    warranty: string;
    qualityStandards: string;
    deliveryTerms: string;
    penalties: string;
  };
  justification: {
    priceScore: number;
    qualityScore: number;
    deliveryScore: number;
    overallScore: number;
    reason: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  timeline: Array<{
    date: string;
    event: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
}

interface AwardedRFQDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: AwardedRFQ | null;
  onAskMarbim: (prompt: string) => void;
}

export const AwardedRFQDetailDrawer: React.FC<AwardedRFQDetailDrawerProps> = ({
  isOpen,
  onClose,
  rfq,
  onAskMarbim,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'contract' | 'tracking' | 'documents'>('summary');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: number; type: string }>>([
    { name: 'Award_Letter.pdf', size: 245000, type: 'application/pdf' },
    { name: 'Contract_Signed.pdf', size: 1200000, type: 'application/pdf' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!rfq) return null;

  const handleAskMarbim = (prompt: string) => {
    onAskMarbim(prompt);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached successfully`);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'summary', label: 'Award Summary', icon: Award },
    { id: 'contract', label: 'Contract Terms', icon: FileText },
    { id: 'tracking', label: 'Delivery Tracking', icon: Truck },
    { id: 'documents', label: 'Documents', icon: Paperclip },
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
            className="fixed top-16 bottom-[72px] right-0 w-full max-w-[1000px] bg-gradient-to-br from-[#101725] to-[#182336] border-l border-white/10 shadow-2xl z-50 flex flex-col"
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
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl mb-1">Awarded RFQ</h2>
                    <p className="text-[#6F83A7]">{rfq.rfqId} • {rfq.supplier}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                        Awarded
                      </Badge>
                      <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border border-[#6F83A7]/20">
                        PO: {rfq.poNumber}
                      </Badge>
                    </div>
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
                  <div className="text-xs text-[#6F83A7] mb-1">Contract Value</div>
                  <div className="text-lg text-white">${rfq.totalAmount.toLocaleString()}</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Awarded Date</div>
                  <div className="text-lg text-white">{rfq.awardedDate}</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Delivery Due</div>
                  <div className="text-lg text-white">{rfq.deliveryDate}</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">AI Score</div>
                  <div className="text-lg text-[#EAB308]">{rfq.justification.overallScore}/100</div>
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
                {/* Tab 1: Award Summary */}
                {activeTab === 'summary' && (
                  <div className="space-y-6">
                    {/* AI Justification Card */}
                    <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Award Justification</h3>
                          <p className="text-sm text-[#6F83A7] mb-3">
                            {rfq.justification.reason}
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-2 rounded-lg bg-white/5">
                              <div className="text-xs text-[#6F83A7] mb-1">Price Score</div>
                              <div className="text-lg text-white">{rfq.justification.priceScore}%</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5">
                              <div className="text-xs text-[#6F83A7] mb-1">Quality Score</div>
                              <div className="text-lg text-white">{rfq.justification.qualityScore}%</div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5">
                              <div className="text-xs text-[#6F83A7] mb-1">Delivery Score</div>
                              <div className="text-lg text-white">{rfq.justification.deliveryScore}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <MarbimAIButton
                        prompt={`Provide detailed analysis of the award decision for ${rfq.rfqId} to ${rfq.supplier}. Include alternative scenarios, risk factors, and recommendations for contract management.`}
                        onClick={handleAskMarbim}
                        label="Deep Analysis"
                      />
                    </div>

                    {/* Order Items */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {rfq.items.map((item, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="text-white mb-1">{item.description}</div>
                                <div className="text-sm text-[#6F83A7]">
                                  Quantity: {item.quantity.toLocaleString()} units @ ${item.unitPrice}/unit
                                </div>
                              </div>
                              <div className="text-white text-lg">${item.total.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                        <Separator className="bg-white/10 my-4" />
                        <div className="flex items-center justify-between py-3">
                          <span className="text-white font-medium">Total Contract Value</span>
                          <span className="text-[#EAB308] text-2xl">${rfq.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Supplier Contact */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4">Supplier Contact</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <div className="text-xs text-[#6F83A7] mb-1">Contact Person</div>
                            <div className="text-white">{rfq.contactPerson.name}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                            <Building className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <div className="text-xs text-[#6F83A7] mb-1">Company</div>
                            <div className="text-white">{rfq.supplier}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <div className="text-xs text-[#6F83A7] mb-1">Email</div>
                            <div className="text-white">{rfq.contactPerson.email}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <div className="text-xs text-[#6F83A7] mb-1">Phone</div>
                            <div className="text-white">{rfq.contactPerson.phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PO Status */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1">Purchase Order Status</h3>
                            <p className="text-sm text-[#6F83A7] mb-2">
                              PO Number: {rfq.poNumber}
                            </p>
                            <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                              {rfq.poStatus}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                          onClick={() => toast.success('PO downloaded successfully')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PO
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Contract Terms */}
                {activeTab === 'contract' && (
                  <div className="space-y-6">
                    {/* AI Contract Review */}
                    <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Contract Terms Overview</h3>
                          <p className="text-sm text-[#6F83A7]">
                            MARBIM has reviewed the contract terms and identified key obligations, risks, and compliance requirements.
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton
                        prompt={`Review contract terms for ${rfq.rfqId} with ${rfq.supplier}. Identify risks, suggest improvements, and flag any compliance issues or unfavorable terms.`}
                        onClick={handleAskMarbim}
                        label="Review Contract"
                      />
                    </div>

                    {/* Contract Details */}
                    <div className="space-y-4">
                      {/* Warranty Terms */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1">Warranty Terms</h3>
                            <p className="text-sm text-[#6F83A7]">{rfq.contractTerms.warranty}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quality Standards */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1">Quality Standards</h3>
                            <p className="text-sm text-[#6F83A7]">{rfq.contractTerms.qualityStandards}</p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Terms */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5 text-[#6F83A7]" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1">Delivery Terms</h3>
                            <p className="text-sm text-[#6F83A7]">{rfq.contractTerms.deliveryTerms}</p>
                          </div>
                        </div>
                      </div>

                      {/* Penalties & Liquidated Damages */}
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-white mb-1">Penalties & Liquidated Damages</h3>
                            <p className="text-sm text-[#6F83A7]">{rfq.contractTerms.penalties}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Terms */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <DollarSign className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-2">Payment Terms</h3>
                          <p className="text-sm text-[#6F83A7] mb-3">{rfq.paymentTerms}</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30">
                              Net {rfq.paymentTerms}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Delivery Tracking */}
                {activeTab === 'tracking' && (
                  <div className="space-y-6">
                    {/* AI Tracking Insights */}
                    <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Delivery Status</h3>
                          <p className="text-sm text-[#6F83A7]">
                            Order is on track for delivery by {rfq.deliveryDate}. MARBIM is monitoring progress and will alert you of any delays.
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton
                        prompt={`Analyze delivery timeline for ${rfq.rfqId} from ${rfq.supplier}. Identify potential delays, suggest mitigation strategies, and provide real-time tracking insights.`}
                        onClick={handleAskMarbim}
                        label="Track Delivery"
                      />
                    </div>

                    {/* Timeline */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4">Delivery Timeline</h3>
                      <div className="space-y-4">
                        {rfq.timeline.map((event, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  event.status === 'completed'
                                    ? 'bg-[#57ACAF]/20 border-2 border-[#57ACAF]'
                                    : event.status === 'in-progress'
                                    ? 'bg-[#EAB308]/20 border-2 border-[#EAB308]'
                                    : 'bg-white/5 border-2 border-white/10'
                                }`}
                              >
                                {event.status === 'completed' ? (
                                  <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                                ) : event.status === 'in-progress' ? (
                                  <Clock className="w-5 h-5 text-[#EAB308]" />
                                ) : (
                                  <Clock className="w-5 h-5 text-[#6F83A7]" />
                                )}
                              </div>
                              {index < rfq.timeline.length - 1 && (
                                <div className="w-0.5 h-12 bg-white/10 my-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="text-white mb-1">{event.event}</div>
                              <div className="text-sm text-[#6F83A7]">{event.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Progress */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <h3 className="text-white mb-4">Overall Progress</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6F83A7]">Production Progress</span>
                          <span className="text-white">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-[#6F83A7] mb-1">Days Remaining</div>
                            <div className="text-xl text-white">12</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-[#6F83A7] mb-1">Quality Checks</div>
                            <div className="text-xl text-[#57ACAF]">3/4</div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-[#6F83A7] mb-1">On-Time Score</div>
                            <div className="text-xl text-white">95%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Documents */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    {/* AI Document Management */}
                    <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center shrink-0">
                          <Paperclip className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Document Repository</h3>
                          <p className="text-sm text-[#6F83A7]">
                            All contract documents, certificates, and compliance records are stored securely and organized by MARBIM.
                          </p>
                        </div>
                      </div>
                      <MarbimAIButton
                        prompt={`Analyze all documents for ${rfq.rfqId}. Check for completeness, identify missing documents, and verify compliance with contract requirements.`}
                        onClick={handleAskMarbim}
                        label="Verify Docs"
                      />
                    </div>

                    {/* Upload Section */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <h3 className="text-white mb-4">Upload Documents</h3>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="*/*"
                        className="hidden"
                      />
                      <Button
                        onClick={handleAttachClick}
                        variant="outline"
                        className="w-full border-dashed border-2 border-white/20 hover:border-[#57ACAF]/50 bg-white/5 hover:bg-white/10 text-white h-24"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Paperclip className="w-6 h-6 text-[#57ACAF]" />
                          <span>Click to upload or drag and drop</span>
                          <span className="text-xs text-[#6F83A7]">PDF, DOC, XLS, or any file type</span>
                        </div>
                      </Button>
                    </div>

                    {/* Attached Files */}
                    {attachedFiles.length > 0 && (
                      <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <h3 className="text-white mb-4">Attached Documents ({attachedFiles.length})</h3>
                        <div className="space-y-2">
                          {attachedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180 group"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <File className="w-5 h-5 text-[#57ACAF] shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-sm truncate">{file.name}</div>
                                  <div className="text-xs text-[#6F83A7]">{formatFileSize(file.size)}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="hover:bg-white/5"
                                  onClick={() => toast.success('File downloaded')}
                                >
                                  <Download className="w-4 h-4 text-[#57ACAF]" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="hover:bg-red-500/10"
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Document Checklist */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <h3 className="text-white mb-4">Required Documents Checklist</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Award Letter', status: 'completed' },
                          { name: 'Signed Contract', status: 'completed' },
                          { name: 'Quality Certificates', status: 'pending' },
                          { name: 'Insurance Documents', status: 'pending' },
                          { name: 'Compliance Certificates', status: 'in-progress' },
                        ].map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                          >
                            <div className="flex items-center gap-3">
                              {doc.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-[#57ACAF]" />
                              ) : doc.status === 'in-progress' ? (
                                <Clock className="w-5 h-5 text-[#EAB308]" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-[#6F83A7]" />
                              )}
                              <span className="text-white">{doc.name}</span>
                            </div>
                            <Badge
                              className={
                                doc.status === 'completed'
                                  ? 'bg-[#57ACAF]/20 text-[#57ACAF] border-[#57ACAF]/30'
                                  : doc.status === 'in-progress'
                                  ? 'bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30'
                                  : 'bg-[#6F83A7]/20 text-[#6F83A7] border-[#6F83A7]/30'
                              }
                            >
                              {doc.status === 'completed' ? 'Complete' : doc.status === 'in-progress' ? 'In Progress' : 'Pending'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                <Award className="w-4 h-4" />
                <span>Awarded on {rfq.awardedDate}</span>
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
                    toast.success('Award summary exported', {
                      description: 'PDF report downloaded successfully',
                    });
                  }}
                  className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
