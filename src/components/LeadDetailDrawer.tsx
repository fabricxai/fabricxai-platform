import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Send,
  FileText,
  MessageSquare,
  Clock,
  Star,
  ExternalLink,
  Sparkles,
  Award,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Package,
  Lightbulb,
  Eye,
  Link as LinkIcon
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface LeadDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
  onAskMarbim?: (prompt: string) => void;
  onSendEmail?: () => void;
}

export function LeadDetailDrawer({
  isOpen,
  onClose,
  lead,
  onAskMarbim,
  onSendEmail
}: LeadDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!lead) return null;

  // Compute engagement metrics
  const engagementScore = lead.engagementScore || 85;
  const fitScore = lead.fitScore || 90;
  const recencyScore = lead.recencyScore || 78;
  const overallScore = lead.score || 85;

  // Sample interaction history
  const interactions = [
    {
      date: 'Nov 28, 2024',
      time: '10:30 AM',
      type: 'email',
      subject: 'Re: Custom denim order inquiry',
      description: 'Opened email "Winter Collection 2024" and clicked on 3 links',
      sentiment: 'positive'
    },
    {
      date: 'Nov 25, 2024',
      time: '2:15 PM',
      type: 'whatsapp',
      subject: 'WhatsApp conversation',
      description: 'Discussed pricing for 5,000 unit order. Showed interest in organic cotton.',
      sentiment: 'positive'
    },
    {
      date: 'Nov 22, 2024',
      time: '11:45 AM',
      type: 'call',
      subject: 'Discovery call',
      description: '25-minute call discussing product requirements and timeline',
      sentiment: 'positive'
    },
    {
      date: 'Nov 20, 2024',
      time: '9:00 AM',
      type: 'email',
      subject: 'Product catalog request',
      description: 'Downloaded product catalog and pricing sheet',
      sentiment: 'neutral'
    },
    {
      date: 'Nov 18, 2024',
      time: '4:30 PM',
      type: 'system',
      subject: 'Lead created',
      description: 'Lead created from website form submission',
      sentiment: 'neutral'
    }
  ];

  // Sample documents
  const documents = [
    {
      name: 'Product_Catalog_2024.pdf',
      type: 'PDF',
      uploadDate: 'Nov 20, 2024',
      size: '2.4 MB',
      tag: 'Catalog',
      aiSummary: 'Contains 45 SKUs across 3 categories with tiered pricing structure'
    },
    {
      name: 'Company_Profile.pdf',
      type: 'PDF',
      uploadDate: 'Nov 18, 2024',
      size: '1.8 MB',
      tag: 'Company Info',
      aiSummary: 'Boutique fashion brand focused on sustainable denim with 12 retail locations'
    },
    {
      name: 'Technical_Specifications.xlsx',
      type: 'Excel',
      uploadDate: 'Nov 22, 2024',
      size: '450 KB',
      tag: 'Specs',
      aiSummary: 'Detailed fabric specifications and quality requirements for organic cotton'
    }
  ];

  // AI-generated insights
  const aiRecommendations = [
    {
      title: 'High Conversion Probability',
      description: 'Lead shows 92% buying signals - frequent engagement, specific product questions, and budget discussion initiated.',
      action: 'Send Custom Quote',
      priority: 'high'
    },
    {
      title: 'Optimal Contact Window',
      description: 'Historical data shows this lead is most responsive Tuesday-Thursday, 10 AM - 3 PM EST.',
      action: 'Schedule Follow-up',
      priority: 'medium'
    },
    {
      title: 'Cross-Sell Opportunity',
      description: 'Based on inquiry patterns, 78% likely to be interested in our new sustainable packaging options.',
      action: 'Add to Proposal',
      priority: 'medium'
    },
    {
      title: 'Competitor Intelligence',
      description: 'Lead previously engaged with 2 competitors. Our pricing is 8% more competitive on organic fabrics.',
      action: 'Highlight Advantage',
      priority: 'low'
    }
  ];

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      case 'system':
        return <Activity className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-[#57ACAF] bg-[#57ACAF]/10 border-[#57ACAF]/20';
      case 'negative':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-[#6F83A7] bg-[#6F83A7]/10 border-[#6F83A7]/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#EAB308]/10 border-[#EAB308]/20 text-[#EAB308]';
      case 'medium':
        return 'bg-[#57ACAF]/10 border-[#57ACAF]/20 text-[#57ACAF]';
      default:
        return 'bg-[#6F83A7]/10 border-[#6F83A7]/20 text-[#6F83A7]';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[900px] p-0 bg-gradient-to-br from-[#101725] to-[#182336] border-l border-white/10"
      >
        {/* Accessibility - Screen reader only */}
        <SheetTitle className="sr-only">
          Lead Details - {lead.leadName || lead.contactName || 'Unknown Lead'}
        </SheetTitle>
        <SheetDescription className="sr-only">
          Detailed information about {lead.leadName || lead.contactName || 'this lead'} from {lead.company || 'company'}, including contact information, activity history, documents, and AI-powered insights.
        </SheetDescription>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_#EAB308_0%,_transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_#57ACAF_0%,_transparent_50%)]" />
            </div>

            <div className="relative p-6 pb-0">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 text-[#6F83A7] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Header Content */}
              <div className="flex items-start gap-4 mb-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20 shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0 mt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl text-white truncate">
                      {lead.leadName || lead.contactName || 'Lead Details'}
                    </h2>
                    <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 shrink-0">
                      {lead.status || 'Active'}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6F83A7]">{lead.company || 'Company Unknown'}</p>
                </div>

                {/* Overall Score */}
                <div className="shrink-0 text-right">
                  <div className="text-2xl text-white mb-1">{overallScore}%</div>
                  <div className="text-xs text-[#6F83A7]">Lead Score</div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-4 gap-3 pb-6">
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Engagement</div>
                  <div className="text-lg text-white">{engagementScore}%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Fit Score</div>
                  <div className="text-lg text-white">{fitScore}%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Recency</div>
                  <div className="text-lg text-white">{recencyScore}%</div>
                </div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-[#6F83A7] mb-1">Value</div>
                  <div className="text-lg text-white">{lead.estimatedValue || '$50K'}</div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent -mx-6 px-6">
                <div className="flex items-center gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                          ${
                            activeTab === tab.id
                              ? 'text-[#57ACAF]'
                              : 'text-[#6F83A7] hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="relative z-10">{tab.label}</span>

                        {/* Animated underline */}
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeLeadDetailTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-8 py-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-[#57ACAF]" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-xs text-[#6F83A7]">Email</span>
                        </div>
                        <p className="text-white text-sm">{lead.email || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-xs text-[#6F83A7]">Phone</span>
                        </div>
                        <p className="text-white text-sm">{lead.phone || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-xs text-[#6F83A7]">Location</span>
                        </div>
                        <p className="text-white text-sm">{lead.location || lead.country || 'N/A'}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <Globe className="w-4 h-4 text-[#6F83A7]" />
                          <span className="text-xs text-[#6F83A7]">Source</span>
                        </div>
                        <p className="text-white text-sm">{lead.source || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight: Lead Summary */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white mb-1 flex items-center gap-2">
                          AI Lead Summary
                          <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-0 text-xs">
                            AI Generated
                          </Badge>
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {lead.leadName || 'This lead'} from <strong>{lead.company || 'an established company'}</strong> shows strong buying signals with a {overallScore}% lead score. 
                          High engagement across multiple touchpoints including email ({engagementScore}% engagement score) and direct communication. 
                          Strong product-market fit ({fitScore}% fit score) with recent activity ({recencyScore}% recency score).
                          Estimated deal value: <strong>{lead.estimatedValue || '$50K-100K'}</strong>.
                        </p>
                      </div>
                    </div>
                    {onAskMarbim && (
                      <Button
                        size="sm"
                        onClick={() => onAskMarbim(`Generate a detailed analysis and strategy for converting lead ${lead.leadName} from ${lead.company}`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-md"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Get AI Strategy
                      </Button>
                    )}
                  </div>

                  {/* Company Details */}
                  <div className="space-y-4">
                    <h3 className="text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#57ACAF]" />
                      Company Details
                    </h3>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-sm text-[#6F83A7]">Industry</span>
                        <span className="text-white text-sm">{lead.industry || 'Fashion & Retail'}</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-sm text-[#6F83A7]">Company Size</span>
                        <span className="text-white text-sm">{lead.companySize || '50-200 employees'}</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-sm text-[#6F83A7]">Annual Revenue</span>
                        <span className="text-white text-sm">{lead.revenue || '$5M - $10M'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6F83A7]">Website</span>
                        <a 
                          href={lead.website || '#'} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#57ACAF] text-sm hover:underline flex items-center gap-1"
                        >
                          {lead.website || 'N/A'}
                          {lead.website && <ExternalLink className="w-3 h-3" />}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#57ACAF]" />
                      Score Breakdown
                    </h3>
                    <div className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">Engagement Score</span>
                          <span className="text-sm text-[#EAB308]">{engagementScore}%</span>
                        </div>
                        <Progress value={engagementScore} className="h-2" />
                        <p className="text-xs text-[#6F83A7] mt-1">Based on email opens, clicks, and response rate</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">Fit Score</span>
                          <span className="text-sm text-[#57ACAF]">{fitScore}%</span>
                        </div>
                        <Progress value={fitScore} className="h-2" />
                        <p className="text-xs text-[#6F83A7] mt-1">Profile match with ideal customer criteria</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">Recency Score</span>
                          <span className="text-sm text-[#6F83A7]">{recencyScore}%</span>
                        </div>
                        <Progress value={recencyScore} className="h-2" />
                        <p className="text-xs text-[#6F83A7] mt-1">Time since last interaction</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#57ACAF]" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => {
                          onSendEmail?.();
                          toast.success('Opening email composer...');
                        }}
                        className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Call
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Create RFQ
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Send Quote
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#57ACAF]" />
                      Activity Timeline
                    </h3>
                    <Badge className="bg-white/5 text-[#6F83A7] border border-white/10">
                      {interactions.length} interactions
                    </Badge>
                  </div>

                  {/* AI Activity Insights */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white mb-1 flex items-center gap-2">
                          Activity Pattern Analysis
                          <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-0 text-xs">
                            AI Generated
                          </Badge>
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed mb-3">
                          This lead shows consistent engagement with an average response time of 2.3 hours. 
                          Peak activity occurs between 10 AM - 3 PM EST on weekdays. 
                          Email engagement rate is 35% above average, suggesting high interest level.
                        </p>
                        {onAskMarbim && (
                          <Button
                            size="sm"
                            onClick={() => onAskMarbim(`Analyze the complete activity pattern and engagement history for ${lead.leadName}, and suggest the best next steps`)}
                            className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-md"
                          >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Get Engagement Insights
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    {interactions.map((interaction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative pl-8 pb-4 border-l-2 border-white/10 last:border-0 last:pb-0"
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 border-2 border-[#101725]" />

                        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center">
                                {getInteractionIcon(interaction.type)}
                              </div>
                              <div>
                                <h4 className="text-white text-sm">{interaction.subject}</h4>
                                <p className="text-xs text-[#6F83A7]">
                                  {interaction.date} at {interaction.time}
                                </p>
                              </div>
                            </div>
                            <Badge className={`${getSentimentColor(interaction.sentiment)} text-xs`}>
                              {interaction.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/70 ml-10">{interaction.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#57ACAF]" />
                      Documents & Files
                    </h3>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>

                  {/* AI Document Insights */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white mb-1 flex items-center gap-2">
                          Document Intelligence
                          <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-0 text-xs">
                            AI Generated
                          </Badge>
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed mb-3">
                          AI has analyzed {documents.length} documents and extracted key insights about requirements, 
                          budget constraints, and technical specifications. All documents indicate preference for 
                          sustainable materials and eco-friendly production processes.
                        </p>
                        {onAskMarbim && (
                          <Button
                            size="sm"
                            onClick={() => onAskMarbim(`Analyze all documents from ${lead.leadName} and provide a comprehensive summary of their requirements and preferences`)}
                            className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-md"
                          >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Analyze All Documents
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document List */}
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/10 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-sm mb-1 truncate">{doc.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-[#6F83A7]">
                                <span>{doc.uploadDate}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                                <Badge className="bg-[#6F83A7]/10 text-[#6F83A7] border-0 text-xs">
                                  {doc.tag}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* AI Summary */}
                        {doc.aiSummary && (
                          <div className="ml-13 p-3 rounded-lg bg-[#EAB308]/5 border border-[#EAB308]/10">
                            <div className="flex items-start gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-[#EAB308] shrink-0 mt-0.5" />
                              <p className="text-xs text-white/70 leading-relaxed">{doc.aiSummary}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insights Tab */}
              {activeTab === 'ai-insights' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#EAB308]" />
                      AI-Powered Insights
                    </h3>
                    <Badge className="bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20">
                      {aiRecommendations.length} recommendations
                    </Badge>
                  </div>

                  {/* Main AI Summary */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EAB308]/20 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-[#EAB308]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white mb-2">Lead Intelligence Summary</h4>
                        <p className="text-sm text-white/80 leading-relaxed">
                          Based on comprehensive analysis of {interactions.length} interactions, {documents.length} documents, 
                          and behavioral patterns, this lead presents a <strong className="text-[#EAB308]">high-priority conversion opportunity</strong>. 
                          The combination of strong engagement metrics, clear buying signals, and favorable timing suggests 
                          a {overallScore}% probability of conversion within the next 30 days.
                        </p>
                      </div>
                    </div>
                    {onAskMarbim && (
                      <Button
                        onClick={() => onAskMarbim(`Provide a comprehensive conversion strategy for ${lead.leadName} including specific tactics, timeline, and resource requirements`)}
                        className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-md"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Generate Conversion Strategy
                      </Button>
                    )}
                  </div>

                  {/* AI Recommendations */}
                  <div className="space-y-3">
                    {aiRecommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#57ACAF]/30 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/10 flex items-center justify-center shrink-0 group-hover:from-[#57ACAF]/30 group-hover:to-[#57ACAF]/20 transition-all">
                              <Lightbulb className="w-5 h-5 text-[#57ACAF]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white">{rec.title}</h4>
                                <Badge className={`${getPriorityColor(rec.priority)} text-xs`}>
                                  {rec.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-white/70 leading-relaxed">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-13">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (onAskMarbim) {
                                onAskMarbim(`Help me implement: ${rec.title} for ${lead.leadName}`);
                              } else {
                                toast.success(`Action: ${rec.action}`);
                              }
                            }}
                            className="bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-md"
                          >
                            {rec.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Next Best Actions */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20">
                    <h4 className="text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                      Suggested Next Steps
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-6 h-6 rounded bg-[#57ACAF]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#57ACAF] text-xs">1</span>
                        </div>
                        <p className="text-sm text-white/80 flex-1">
                          Send personalized follow-up email within next 24 hours (optimal engagement window)
                        </p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-6 h-6 rounded bg-[#57ACAF]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#57ACAF] text-xs">2</span>
                        </div>
                        <p className="text-sm text-white/80 flex-1">
                          Prepare custom quote highlighting sustainable options and competitive pricing
                        </p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-6 h-6 rounded bg-[#57ACAF]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#57ACAF] text-xs">3</span>
                        </div>
                        <p className="text-sm text-white/80 flex-1">
                          Schedule product demonstration or factory tour within 7-10 days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
