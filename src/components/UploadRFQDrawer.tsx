import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Upload, FileText, Sparkles, AlertCircle, CheckCircle2, 
  Image as ImageIcon, File, Trash2, Calendar, DollarSign, Package,
  Users, Building2, Mail, Phone, Globe, Tag, Clock, TrendingUp,
  Target, Award, Zap, Eye, Download, RefreshCw, ChevronRight, AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { MarbimAIButton } from './MarbimAIButton';
import { toast } from 'sonner';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface UploadRFQDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskMarbim: (prompt: string) => void;
  /** Called after MARBIM drafts an RFQ into the Approve inbox. */
  onExtracted?: () => void;
}

export function UploadRFQDrawer({ isOpen, onClose, onAskMarbim, onExtracted }: UploadRFQDrawerProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [aiParsedData, setAiParsedData] = useState<any>(null);
  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real MARBIM extraction: paste text → Gemini → a pending_changes DRAFT that
  // shows up in the Approve inbox. Never writes the rfqs table directly.
  const handleExtract = async () => {
    if (rawText.trim().length < 10) {
      toast.error("Paste the buyer's RFQ text first.");
      return;
    }
    setIsExtracting(true);
    try {
      const res = await fetch('/api/extract/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Extraction failed');
      toast.success('MARBIM drafted this RFQ — review & approve it in the Approve inbox.');
      setRawText('');
      onExtracted?.();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Extraction failed');
    } finally {
      setIsExtracting(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerCompany: '',
    buyerEmail: '',
    buyerPhone: '',
    rfqTitle: '',
    productCategory: '',
    quantity: '',
    targetPrice: '',
    dueDate: '',
    deliveryDate: '',
    destination: '',
    paymentTerms: '',
    incoterms: '',
    description: '',
    specialRequirements: '',
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate AI processing
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          // Simulate AI parsed data
          setAiParsedData({
            confidence: 92,
            extractedData: {
              buyerName: 'John Smith',
              buyerCompany: 'Fashion Retail Corp',
              productCategory: 'T-Shirts',
              quantity: '50,000 pcs',
              targetPrice: '$8.50/pc',
              dueDate: '2024-12-15',
            },
            recommendations: [
              { text: 'Quantity matches your typical production capacity', confidence: 'High' },
              { text: 'Price point within competitive range', confidence: 'High' },
              { text: 'Buyer has good payment history', confidence: 'Medium' },
            ],
          });
          toast.success('RFQ files analyzed successfully!');
          setActiveTab('details');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = () => {
    toast.success('RFQ uploaded and processed successfully!');
    onClose();
    // Reset form
    setUploadedFiles([]);
    setAiParsedData(null);
    setFormData({
      buyerName: '',
      buyerCompany: '',
      buyerEmail: '',
      buyerPhone: '',
      rfqTitle: '',
      productCategory: '',
      quantity: '',
      targetPrice: '',
      dueDate: '',
      deliveryDate: '',
      destination: '',
      paymentTerms: '',
      incoterms: '',
      description: '',
      specialRequirements: '',
    });
  };

  const tabs = [
    { id: 'upload', label: 'Upload Files', icon: Upload },
    { id: 'details', label: 'RFQ Details', icon: FileText },
    { id: 'analysis', label: 'AI Analysis', icon: Sparkles },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-16 bottom-[72px] right-0 w-full max-w-[900px] bg-gradient-to-br from-[#101725] to-[#182336] border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />

              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/20">
                      <Upload className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-2xl text-white mb-1">Upload RFQ</h2>
                      <p className="text-sm text-[#6F83A7]">
                        Upload RFQ files or enter details manually
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onClose}
                    size="icon"
                    className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Files Uploaded</div>
                    <div className="text-lg text-white">{uploadedFiles.length}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">AI Confidence</div>
                    <div className="text-lg text-white">{aiParsedData ? `${aiParsedData.confidence}%` : '--'}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-1">Status</div>
                    <div className="text-lg text-white">
                      {isProcessing ? 'Processing...' : uploadedFiles.length > 0 ? 'Ready' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id ? 'text-[#57ACAF]' : 'text-[#6F83A7] hover:text-white'}
                      `}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>
                      
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="uploadRFQTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-8 py-6">
                {/* Upload Files Tab */}
                {activeTab === 'upload' && (
                  <div className="space-y-6">
                    {/* Drag & Drop Zone */}
                    <div 
                      onClick={handleFileSelect}
                      className="relative border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-[#57ACAF]/50 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-8 h-8 text-[#57ACAF]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-2">Drop RFQ files here or click to browse</h3>
                          <p className="text-sm text-[#6F83A7]">
                            Supported formats: PDF, Excel, Word, Images (Max 10MB per file)
                          </p>
                        </div>
                        <Button className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90">
                          <Upload className="w-4 h-4 mr-2" />
                          Select Files
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="*/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Paste text → MARBIM extract (real) */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#57ACAF]/5 border border-[#EAB308]/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[#EAB308]" />
                        <h3 className="text-white text-sm">Or paste the buyer&apos;s email / RFQ text</h3>
                      </div>
                      <p className="text-xs text-[#6F83A7] mb-3">
                        MARBIM reads it, drafts the RFQ, and sends it to your Approve inbox — you just
                        review and approve.
                      </p>
                      <Textarea
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        placeholder="Paste the buyer's message here — e.g. 'We'd like 5,000 organic cotton tees, 180 GSM, target $4.20/pc, delivery mid September…'"
                        className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7]/60"
                      />
                      <div className="mt-3 flex justify-end">
                        <Button
                          onClick={handleExtract}
                          disabled={isExtracting}
                          className="bg-gradient-to-r from-[#EAB308] to-[#57ACAF] text-black hover:opacity-90"
                        >
                          {isExtracting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              MARBIM is reading…
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Draft RFQ with MARBIM
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Processing Progress */}
                    {isProcessing && (
                      <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center animate-pulse">
                            <Sparkles className="w-5 h-5 text-[#EAB308]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white mb-1">AI Processing RFQ Files</h3>
                            <p className="text-sm text-[#6F83A7]">
                              Extracting buyer details, product specs, quantities, and pricing...
                            </p>
                          </div>
                        </div>
                        <Progress value={processingProgress} className="mb-2" />
                        <p className="text-xs text-[#6F83A7] text-center">{processingProgress}% Complete</p>
                      </div>
                    )}

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white">Uploaded Files ({uploadedFiles.length})</h3>
                          {aiParsedData && (
                            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              AI Analyzed
                            </Badge>
                          )}
                        </div>
                        {uploadedFiles.map((file, index) => (
                          <div 
                            key={index}
                            className="group p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-180"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                                {file.type.includes('image') ? (
                                  <ImageIcon className="w-5 h-5 text-[#6F83A7]" />
                                ) : file.type.includes('pdf') ? (
                                  <FileText className="w-5 h-5 text-[#6F83A7]" />
                                ) : (
                                  <File className="w-5 h-5 text-[#6F83A7]" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-white text-sm">{file.name}</p>
                                <p className="text-xs text-[#6F83A7]">{formatFileSize(file.size)}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Recommendations */}
                    {aiParsedData && (
                      <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#57ACAF]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white mb-1">AI Quick Insights</h3>
                            <p className="text-sm text-[#6F83A7] mb-3">
                              Confidence Score: {aiParsedData.confidence}%
                            </p>
                            <div className="space-y-2">
                              {aiParsedData.recommendations.map((rec: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-[#57ACAF] mt-0.5 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-white">{rec.text}</p>
                                    <Badge className="bg-white/10 text-[#6F83A7] border-0 text-xs mt-1">
                                      {rec.confidence} Confidence
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <MarbimAIButton
                          onClick={() => onAskMarbim('Analyze this uploaded RFQ in detail. Check if product specs match our capabilities, validate pricing against historical data, assess delivery timeline feasibility, and recommend quote strategy.')}
                          size="sm"
                          className="w-full"
                        >
                          Deep Analysis
                        </MarbimAIButton>
                      </div>
                    )}

                    {uploadedFiles.length > 0 && (
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setActiveTab('details')}
                          className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
                        >
                          Continue to Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* RFQ Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Buyer Information */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#6F83A7]" />
                        </div>
                        <h3 className="text-white">Buyer Information</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Buyer Name *</label>
                          <Input
                            value={formData.buyerName}
                            onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                            placeholder={aiParsedData?.extractedData?.buyerName || "Enter buyer name"}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Company *</label>
                          <Input
                            value={formData.buyerCompany}
                            onChange={(e) => setFormData({ ...formData, buyerCompany: e.target.value })}
                            placeholder={aiParsedData?.extractedData?.buyerCompany || "Enter company name"}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Email *</label>
                          <Input
                            type="email"
                            value={formData.buyerEmail}
                            onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                            placeholder="buyer@company.com"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Phone</label>
                          <Input
                            value={formData.buyerPhone}
                            onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RFQ Details */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#EAB308]" />
                        </div>
                        <h3 className="text-white">RFQ Details</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm text-[#6F83A7] mb-2">RFQ Title *</label>
                          <Input
                            value={formData.rfqTitle}
                            onChange={(e) => setFormData({ ...formData, rfqTitle: e.target.value })}
                            placeholder="e.g., Men's Cotton T-Shirts - Spring Collection"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Product Category *</label>
                          <Input
                            value={formData.productCategory}
                            onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                            placeholder={aiParsedData?.extractedData?.productCategory || "e.g., T-Shirts, Denim, etc."}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Quantity *</label>
                          <Input
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            placeholder={aiParsedData?.extractedData?.quantity || "e.g., 50,000 pcs"}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Target Price</label>
                          <Input
                            value={formData.targetPrice}
                            onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                            placeholder={aiParsedData?.extractedData?.targetPrice || "e.g., $8.50/pc"}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Quote Due Date *</label>
                          <Input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Delivery Date</label>
                          <Input
                            type="date"
                            value={formData.deliveryDate}
                            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Destination</label>
                          <Input
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            placeholder="e.g., Los Angeles, USA"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Payment Terms</label>
                          <Input
                            value={formData.paymentTerms}
                            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                            placeholder="e.g., 30% deposit, 70% on delivery"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6F83A7] mb-2">Incoterms</label>
                          <Input
                            value={formData.incoterms}
                            onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                            placeholder="e.g., FOB, CIF, EXW"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-[#6F83A7] mb-2">Description</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed product description, specifications, materials..."
                            className="bg-white/5 border-white/10 text-white min-h-[100px]"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-[#6F83A7] mb-2">Special Requirements</label>
                          <Textarea
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                            placeholder="Any certifications, quality standards, packaging requirements..."
                            className="bg-white/5 border-white/10 text-white min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => setActiveTab('upload')}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('analysis')}
                        className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
                      >
                        Continue to Analysis
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Analysis Tab */}
                {activeTab === 'analysis' && (
                  <div className="space-y-6">
                    {/* Capability Match */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                          <Target className="w-6 h-6 text-[#57ACAF]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Capability Match Analysis</h3>
                          <p className="text-sm text-[#6F83A7]">
                            AI evaluates if this RFQ aligns with your production capabilities
                          </p>
                        </div>
                        <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                          88% Match
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Product Category', match: 95, status: 'excellent', note: 'T-shirts are your core competency' },
                          { label: 'Quantity Volume', match: 92, status: 'excellent', note: '50K pcs fits your capacity perfectly' },
                          { label: 'Timeline', match: 75, status: 'good', note: 'Tight but achievable with priority scheduling' },
                          { label: 'Price Point', match: 82, status: 'good', note: 'Within competitive range, margins acceptable' },
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white text-sm">{item.label}</span>
                              <span className="text-[#57ACAF] text-sm">{item.match}%</span>
                            </div>
                            <Progress value={item.match} className="mb-2" />
                            <p className="text-xs text-[#6F83A7]">{item.note}</p>
                          </div>
                        ))}
                      </div>
                      <MarbimAIButton
                        onClick={() => onAskMarbim('Provide detailed capability match analysis for this RFQ. Assess product type alignment, capacity availability, timeline feasibility, quality certifications needed, and overall strategic fit.')}
                        size="sm"
                        className="w-full mt-4"
                      >
                        Detailed Capability Analysis
                      </MarbimAIButton>
                    </div>

                    {/* Win Probability */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                          <Award className="w-6 h-6 text-[#EAB308]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white mb-2">Win Probability Assessment</h3>
                          <p className="text-sm text-[#6F83A7]">
                            Based on historical data, buyer patterns, and competitive landscape
                          </p>
                        </div>
                        <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                          72% Likely
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Buyer Relationship</div>
                          <div className="text-white text-sm">New Buyer</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Competition Level</div>
                          <div className="text-white text-sm">Medium</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Price Competitiveness</div>
                          <div className="text-white text-sm">Strong</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Strategic Value</div>
                          <div className="text-white text-sm">High</div>
                        </div>
                      </div>
                      <MarbimAIButton
                        onClick={() => onAskMarbim('Calculate win probability for this RFQ. Consider buyer history, competitive pricing analysis, our production capacity, quality certifications match, and strategic relationship value. Recommend quote strategy to maximize win chance.')}
                        size="sm"
                        className="w-full"
                      >
                        Win Strategy Recommendations
                      </MarbimAIButton>
                    </div>

                    {/* Risk Assessment */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-[#6F83A7]" />
                        </div>
                        <h3 className="text-white">Risk Factors</h3>
                      </div>
                      <div className="space-y-2">
                        {[
                          { risk: 'Tight delivery timeline', severity: 'medium', mitigation: 'Allocate priority production slot' },
                          { risk: 'New buyer - payment risk', severity: 'low', mitigation: 'Request 50% deposit upfront' },
                          { risk: 'Material lead time constraints', severity: 'low', mitigation: 'Source from existing suppliers' },
                        ].map((item, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                            <AlertTriangle className={`w-4 h-4 mt-0.5 ${item.severity === 'medium' ? 'text-[#EAB308]' : 'text-[#6F83A7]'}`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white text-sm">{item.risk}</span>
                                <Badge className={`${item.severity === 'medium' ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20' : 'bg-[#6F83A7]/10 text-[#6F83A7] border-[#6F83A7]/20'} text-xs`}>
                                  {item.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-[#6F83A7]">Mitigation: {item.mitigation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => setActiveTab('details')}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('review')}
                        className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90"
                      >
                        Review & Submit
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Review & Submit Tab */}
                {activeTab === 'review' && (
                  <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-[#EAB308]" />
                        </div>
                        <div>
                          <h3 className="text-white mb-1">Ready to Submit</h3>
                          <p className="text-sm text-[#6F83A7]">Review all details before adding to RFQ inbox</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Details */}
                    <div className="space-y-4">
                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <h4 className="text-white mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#6F83A7]" />
                          Buyer Information
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-[#6F83A7]">Name:</span>
                            <span className="text-white ml-2">{formData.buyerName || 'John Smith'}</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Company:</span>
                            <span className="text-white ml-2">{formData.buyerCompany || 'Fashion Retail Corp'}</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Email:</span>
                            <span className="text-white ml-2">{formData.buyerEmail || 'buyer@company.com'}</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Phone:</span>
                            <span className="text-white ml-2">{formData.buyerPhone || '+1 (555) 000-0000'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <h4 className="text-white mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#6F83A7]" />
                          RFQ Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-[#6F83A7]">Product:</span>
                            <span className="text-white ml-2">{formData.productCategory || 'T-Shirts'}</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Quantity:</span>
                            <span className="text-white ml-2">{formData.quantity || '50,000 pcs'}</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Target Price:</span>
                            <span className="text-white ml-2">{formData.targetPrice || '$8.50/pc'}</span>
                          </div>
                          <div>
                            <span className="text-[#6F83A7]">Due Date:</span>
                            <span className="text-white ml-2">{formData.dueDate || '2024-12-15'}</span>
                          </div>
                        </div>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                          <h4 className="text-white mb-3 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-[#6F83A7]" />
                            Attached Files ({uploadedFiles.length})
                          </h4>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-[#6F83A7]">
                                <FileText className="w-4 h-4" />
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => setActiveTab('analysis')}
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Submit RFQ
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}