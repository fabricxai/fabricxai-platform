import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  X, CheckCircle, XCircle, Clock, User, Building2, 
  DollarSign, Calendar, AlertTriangle, FileText, 
  MessageSquare, History, Paperclip, Send, Edit2,
  Sparkles, TrendingUp, TrendingDown, Target, Shield,
  Mail, Phone, MapPin, Award, Info, ChevronRight,
  AlertCircle, ThumbsUp, ThumbsDown, Users, BarChart3,
  Zap, FileCheck, Eye, Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';
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
  Cell,
} from 'recharts';

interface ApprovalDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  approval: any;
  onAskMarbim?: (prompt: string) => void;
  onOpenAI?: () => void;
  /** Real commit/reject of the underlying pending change. */
  onApprove?: (approval: any) => Promise<void> | void;
  onReject?: (approval: any, reason: string) => Promise<void> | void;
}

export function ApprovalDetailDrawer({
  isOpen,
  onClose,
  approval,
  onAskMarbim,
  onOpenAI,
  onApprove,
  onReject
}: ApprovalDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleAskMarbim = (prompt: string) => {
    if (onAskMarbim) {
      onAskMarbim(prompt);
    }
    if (onOpenAI) {
      onOpenAI();
    }
  };

  const handleApprove = async () => {
    if (onApprove) {
      await onApprove(approval);
      onClose();
      return;
    }
    toast.success('Request approved successfully');
    onClose();
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    if (onReject) {
      await onReject(approval, comment);
      onClose();
      return;
    }
    toast.success('Request rejected');
    onClose();
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    toast.success('Comment added successfully');
    setComment('');
    setShowCommentBox(false);
  };

  if (!approval) return null;

  // Mock data for approval analysis
  const approvalHistory = [
    { stage: 'Submitted', date: approval.submittedDate, user: approval.requestedBy, status: 'completed', icon: Send },
    { stage: 'Manager Review', date: '2024-10-25', user: 'Alice Johnson', status: 'completed', icon: Eye },
    { stage: 'Director Approval', date: '2024-10-26', user: 'Bob Smith', status: 'current', icon: CheckCircle },
    { stage: 'CFO Sign-off', date: 'Pending', user: 'CFO', status: 'pending', icon: Award },
  ];

  const historicalData = [
    { month: 'Jul', approved: 45, rejected: 8, avgTime: 2.1 },
    { month: 'Aug', approved: 52, rejected: 6, avgTime: 1.9 },
    { month: 'Sep', approved: 48, rejected: 7, avgTime: 2.3 },
    { month: 'Oct', approved: 61, rejected: 5, avgTime: 2.0 },
  ];

  const riskFactors = [
    { factor: 'Amount within budget', status: 'pass', icon: DollarSign, detail: 'Within Q4 allocation' },
    { factor: 'Requestor authority', status: 'pass', icon: Shield, detail: 'Authorized for this limit' },
    { factor: 'Timing alignment', status: 'warning', icon: Clock, detail: 'Outside standard cycle' },
    { factor: 'Historical pattern', status: 'pass', icon: TrendingUp, detail: 'Consistent with past' },
  ];

  const comments = [
    {
      id: 1,
      user: 'Alice Johnson',
      role: 'Manager',
      timestamp: '2 hours ago',
      comment: 'Budget allocation looks reasonable. Moving forward to director approval.',
      sentiment: 'positive'
    },
    {
      id: 2,
      user: 'Bob Smith',
      role: 'Director',
      timestamp: '30 mins ago',
      comment: 'Need clarification on the timeline for material delivery.',
      sentiment: 'neutral'
    },
  ];

  const similarRequests = [
    { title: 'PO-2721 - Raw Materials', amount: '$42K', status: 'Approved', time: '1.8 days', outcome: 'success' },
    { title: 'PO-2689 - Fabric Order', amount: '$38K', status: 'Approved', time: '2.1 days', outcome: 'success' },
    { title: 'PO-2567 - Supplies', amount: '$51K', status: 'Rejected', time: '3.2 days', outcome: 'rejected' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
      case 'Medium': return { bg: 'bg-[#EAB308]/10', border: 'border-[#EAB308]/20', text: 'text-[#EAB308]' };
      case 'Low': return { bg: 'bg-[#57ACAF]/10', border: 'border-[#57ACAF]/20', text: 'text-[#57ACAF]' };
      default: return { bg: 'bg-[#6F83A7]/10', border: 'border-[#6F83A7]/20', text: 'text-[#6F83A7]' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return { bg: 'bg-[#57ACAF]/10', border: 'border-[#57ACAF]/20', text: 'text-[#57ACAF]' };
      case 'Pending': return { bg: 'bg-[#EAB308]/10', border: 'border-[#EAB308]/20', text: 'text-[#EAB308]' };
      case 'Rejected': return { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' };
      default: return { bg: 'bg-[#6F83A7]/10', border: 'border-[#6F83A7]/20', text: 'text-[#6F83A7]' };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'analysis', label: 'AI Analysis', icon: Sparkles },
    { id: 'history', label: 'Timeline', icon: History },
    { id: 'similar', label: 'Similar Cases', icon: FileCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Request Details Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#57ACAF]" />
                Request Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Type</span>
                  <span className="text-sm text-white">{approval.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Amount</span>
                  <span className="text-lg font-medium text-white">{approval.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Status</span>
                  <Badge className={`${getStatusColor(approval.status).bg} ${getStatusColor(approval.status).border} ${getStatusColor(approval.status).text} border`}>
                    {approval.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Priority</span>
                  <Badge className={`${getPriorityColor(approval.priority).bg} ${getPriorityColor(approval.priority).border} ${getPriorityColor(approval.priority).text} border`}>
                    {approval.priority}
                  </Badge>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Requested By</span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-sm text-white">{approval.requestedBy}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Department</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-sm text-white">{approval.department}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6F83A7]">Submitted Date</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6F83A7]" />
                    <span className="text-sm text-white">{approval.submittedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#57ACAF]" />
                Description
              </h3>
              <p className="text-sm text-[#6F83A7] leading-relaxed">{approval.description}</p>
            </div>

            {/* Details */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#57ACAF]" />
                Full Details
              </h3>
              <p className="text-sm text-[#6F83A7] leading-relaxed">{approval.details}</p>
            </div>

            {/* Approval Chain */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#57ACAF]" />
                Approval Chain
              </h3>
              <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                {approval.approvalChain.split(' → ').map((step: string, idx: number, arr: string[]) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-white">{step}</span>
                    {idx < arr.length - 1 && <ChevronRight className="w-4 h-4" />}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Quick Insights */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">AI Quick Assessment</h3>
                  <p className="text-sm text-[#6F83A7]">MARBIM's instant recommendation</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  <span>Within budget allocation (89% confidence)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  <span>Similar requests approved in 1.9 days avg</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6F83A7]">
                  <AlertCircle className="w-4 h-4 text-[#EAB308]" />
                  <span>Timing outside standard cycle - verify urgency</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#EAB308]/20">
                <Button
                  onClick={() => handleAskMarbim(`Provide detailed approval recommendation for ${approval.title}`)}
                  className="w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Full AI Analysis
                </Button>
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            {/* Risk Assessment */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#57ACAF]" />
                Risk Assessment
              </h3>
              <div className="space-y-3">
                {riskFactors.map((risk, idx) => {
                  const Icon = risk.icon;
                  const isPass = risk.status === 'pass';
                  const isWarning = risk.status === 'warning';
                  return (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className={`w-10 h-10 rounded-lg ${isPass ? 'bg-[#57ACAF]/20' : isWarning ? 'bg-[#EAB308]/20' : 'bg-red-500/20'} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${isPass ? 'text-[#57ACAF]' : isWarning ? 'text-[#EAB308]' : 'text-red-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{risk.factor}</span>
                          {isPass ? (
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                          ) : isWarning ? (
                            <AlertTriangle className="w-4 h-4 text-[#EAB308]" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <p className="text-xs text-[#6F83A7]">{risk.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Historical Trends */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                Approval Trends - {approval.department}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#6F83A7" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6F83A7" style={{ fontSize: '12px' }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#182336',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="approved" fill="#57ACAF" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="rejected" fill="#EF4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[#57ACAF]" />
                  <span className="text-xs text-[#6F83A7]">Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-xs text-[#6F83A7]">Rejected</span>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Decision Recommendation</h3>
                  <p className="text-sm text-[#6F83A7]">Based on historical patterns and risk analysis</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="p-4 rounded-lg bg-[#57ACAF]/10 border border-[#57ACAF]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-5 h-5 text-[#57ACAF]" />
                    <span className="text-white font-medium">Recommend Approval</span>
                    <Badge className="ml-auto bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30">
                      85% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-[#6F83A7]">
                    Request aligns with budget, similar requests have 92% approval rate, and timing is within acceptable range.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleAskMarbim(`Why should I approve/reject ${approval.title}? Provide detailed reasoning.`)}
                variant="outline"
                className="w-full border-[#EAB308]/30 text-white hover:bg-[#EAB308]/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask MARBIM for Details
              </Button>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                <History className="w-4 h-4 text-[#57ACAF]" />
                Approval Timeline
              </h3>
              <div className="space-y-4">
                {approvalHistory.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';
                  return (
                    <div key={idx} className="relative">
                      {idx < approvalHistory.length - 1 && (
                        <div className={`absolute left-5 top-12 w-px h-12 ${isCompleted ? 'bg-[#57ACAF]' : 'bg-white/10'}`} />
                      )}
                      <div className={`flex items-start gap-4 p-4 rounded-xl ${isCurrent ? 'bg-[#EAB308]/10 border border-[#EAB308]/20' : isCompleted ? 'bg-white/5 border border-white/10' : 'bg-white/[0.02] border border-white/5'}`}>
                        <div className={`w-10 h-10 rounded-lg ${isCurrent ? 'bg-[#EAB308]/20' : isCompleted ? 'bg-[#57ACAF]/20' : 'bg-white/5'} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#EAB308]' : isCompleted ? 'text-[#57ACAF]' : 'text-[#6F83A7]'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium text-sm">{stage.stage}</span>
                            {isCompleted && <CheckCircle className="w-4 h-4 text-[#57ACAF]" />}
                            {isCurrent && <Clock className="w-4 h-4 text-[#EAB308]" />}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                            <span>{stage.user}</span>
                            <span>•</span>
                            <span>{stage.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#57ACAF]" />
                Comments & Discussion
              </h3>
              <div className="space-y-4 mb-4">
                {comments.length > 0 ? (
                  comments.map((cmt) => (
                    <div key={cmt.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">{cmt.user}</span>
                            <span className="text-xs text-[#6F83A7]">•</span>
                            <span className="text-xs text-[#6F83A7]">{cmt.role}</span>
                          </div>
                          <span className="text-xs text-[#6F83A7]">{cmt.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#6F83A7] leading-relaxed">{cmt.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-[#6F83A7] mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-[#6F83A7]">No comments yet</p>
                  </div>
                )}
              </div>

              {showCommentBox ? (
                <div className="space-y-3">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comment or feedback..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddComment}
                      className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white"
                    >
                      Post Comment
                    </Button>
                    <Button
                      onClick={() => {
                        setShowCommentBox(false);
                        setComment('');
                      }}
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowCommentBox(true)}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
              )}
            </div>
          </div>
        );

      case 'similar':
        return (
          <div className="space-y-6">
            {/* Similar Requests */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#57ACAF]" />
                Similar Approval Requests
              </h3>
              <p className="text-sm text-[#6F83A7] mb-6">
                Historical requests similar to this one based on amount, type, and department
              </p>
              <div className="space-y-3">
                {similarRequests.map((req, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{req.title}</span>
                          <Badge className={`${getStatusColor(req.status).bg} ${getStatusColor(req.status).border} ${getStatusColor(req.status).text} border text-xs`}>
                            {req.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {req.amount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {req.time}
                          </span>
                        </div>
                      </div>
                      {req.outcome === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pattern Analysis */}
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Pattern Insights</h3>
                  <p className="text-sm text-[#6F83A7]">MARBIM's analysis of similar requests</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#6F83A7]">
                    Similar requests in this amount range have a <span className="text-[#57ACAF] font-medium">92% approval rate</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-[#57ACAF] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#6F83A7]">
                    Average approval time for {approval.department}: <span className="text-white font-medium">1.9 days</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#EAB308] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#6F83A7]">
                    Requests above $40K typically require additional CFO review
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#EAB308]/20">
                <Button
                  onClick={() => handleAskMarbim(`Show me detailed pattern analysis for ${approval.type} requests in ${approval.department}`)}
                  variant="outline"
                  className="w-full border-[#EAB308]/30 text-white hover:bg-[#EAB308]/10"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View Full Pattern Analysis
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
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
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5" />
              
              <div className="relative px-8 py-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 shadow-lg shadow-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-medium text-white mb-2">{approval.title}</h2>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(approval.status).bg} ${getStatusColor(approval.status).border} ${getStatusColor(approval.status).text} border`}>
                          {approval.status}
                        </Badge>
                        <Badge className={`${getPriorityColor(approval.priority).bg} ${getPriorityColor(approval.priority).border} ${getPriorityColor(approval.priority).text} border`}>
                          {approval.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-[#6F83A7] hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Amount</p>
                    <p className="text-lg text-white font-medium">{approval.amount}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Type</p>
                    <p className="text-sm text-white">{approval.type}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Department</p>
                    <p className="text-sm text-white">{approval.department}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-[#6F83A7] mb-1">Days Pending</p>
                    <p className="text-lg text-white font-medium">2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center px-8 gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative px-5 py-3.5 text-sm transition-all duration-300 flex items-center gap-2
                        ${activeTab === tab.id ? 'text-[#57ACAF]' : 'text-[#6F83A7] hover:text-white'}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="relative z-10">{tab.label}</span>
                      
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeApprovalTab"
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
                {renderTabContent()}
              </ScrollArea>
            </div>

            {/* Footer Actions */}
            {approval.status === 'Pending' && (
              <div className="border-t border-white/10 p-6 bg-gradient-to-b from-transparent to-white/[0.02]">
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 text-white shadow-lg shadow-[#57ACAF]/20 py-6"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    onClick={() => setShowCommentBox(true)}
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 py-6"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Request
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
