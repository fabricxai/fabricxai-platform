'use client';

import { useState, useMemo } from 'react';
import { usePendingChanges, type PendingChange } from '@/lib/data/pending-changes';
import { approvePendingChange, rejectPendingChange } from '@/app/actions/pending-changes';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard, AIInsightItem } from '../AICard';
import { SmartTable, Column, StatusBadge } from '../SmartTable';
import { ApprovalDetailDrawer } from '../ApprovalDetailDrawer';
import { 
  CheckCircle, Clock, AlertTriangle, XCircle, Filter, 
  Download, TrendingUp, TrendingDown, DollarSign, FileText,
  Users, Calendar, Target, Sparkles, BarChart3, Award,
  Eye, MessageSquare, Shield, Activity, Building2, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

const columns: Column[] = [
  { key: 'title', label: 'Request Title', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'requestedBy', label: 'Requested By', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { 
    key: 'amount', 
    label: 'Amount', 
    sortable: true,
    render: (value: string) => (
      <span className="font-medium text-white">{value}</span>
    )
  },
  { 
    key: 'daysWaiting', 
    label: 'Days Waiting', 
    sortable: true,
    render: (value: number, row: any) => {
      if (row.status !== 'Pending') return <span className="text-[#6F83A7]">-</span>;
      return (
        <Badge 
          variant="outline" 
          className={
            value >= 3 
              ? 'border-red-500/30 bg-red-500/10 text-red-400' 
              : value >= 2
              ? 'border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308]'
              : 'border-[#57ACAF]/30 bg-[#57ACAF]/10 text-[#57ACAF]'
          }
        >
          {value}d
        </Badge>
      );
    }
  },
  { 
    key: 'priority', 
    label: 'Priority', 
    sortable: true,
    render: (value: string) => {
      const colors = {
        High: 'border-red-500/30 bg-red-500/10 text-red-400',
        Medium: 'border-[#EAB308]/30 bg-[#EAB308]/10 text-[#EAB308]',
        Low: 'border-[#57ACAF]/30 bg-[#57ACAF]/10 text-[#57ACAF]',
      };
      return (
        <Badge variant="outline" className={colors[value as keyof typeof colors] || colors.Low}>
          {value}
        </Badge>
      );
    }
  },
  { 
    key: 'status', 
    label: 'Status', 
    sortable: true,
    render: (value: string) => <StatusBadge status={value} />
  },
];

// Map a live pending_changes row → the shape this inbox renders. MARBIM / the
// extraction flow write these rows; approving one commits it to its module table.
function mapPendingChange(c: PendingChange) {
  const daysWaiting = Math.max(
    0,
    Math.floor((Date.now() - new Date(c.created_at).getTime()) / 86_400_000),
  );
  const amount = (c.payload?.target_price ?? c.payload?.amount ?? c.payload?.fob_price) as
    | number
    | undefined;
  return {
    id: c.id,
    title: c.summary ?? `${c.action} ${c.target_table}`,
    type: c.module,
    amount: amount != null ? `$${Number(amount).toLocaleString()}` : 'N/A',
    status: (c.status.charAt(0).toUpperCase() + c.status.slice(1)) as
      | 'Pending'
      | 'Approved'
      | 'Rejected',
    requestedBy: c.source === 'manual' ? 'You' : 'MARBIM',
    department: c.module,
    submittedDate: c.created_at.slice(0, 10),
    priority: (c.ai_confidence ?? 0) >= 0.8 ? 'Low' : daysWaiting >= 3 ? 'High' : 'Medium',
    description: c.summary ?? '',
    details: JSON.stringify(c.payload, null, 2),
    approvalChain: 'MARBIM → You',
    daysWaiting,
    aiScore: Math.round((c.ai_confidence ?? 0) * 100),
    _raw: c,
  };
}

export function Approve() {
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('all');
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);

  // Live data — replaces the former hardcoded mock array (kept below only as
  // dead reference during the module rollout; the inbox now reads real rows).
  const { data: pendingChanges, loading, refresh: refreshPending } = usePendingChanges();
  const approvalsData = useMemo(() => pendingChanges.map(mapPendingChange), [pendingChanges]);

  const handleApprove = async (approval: any) => {
    const res = await approvePendingChange(approval.id);
    if (res.ok) toast.success('Approved — committed to your records.');
    else toast.error(res.error);
    await refreshPending();
  };
  const handleReject = async (approval: any, reason: string) => {
    const res = await rejectPendingChange(approval.id, reason);
    if (res.ok) toast.success('Rejected — nothing was written.');
    else toast.error(res.error);
    await refreshPending();
  };

  const handleRowClick = (row: any) => {
    setSelectedApproval(row);
    setDrawerOpen(true);
  };

  const handleAskMarbim = (prompt: string) => {
    toast.success('Opening AI Assistant...');
    console.log('AI Prompt:', prompt);
  };

  const handleOpenAI = () => {
    // Open AI panel
  };

  // Filter data based on active view
  const getFilteredData = () => {
    switch (activeView) {
      case 'pending':
        return approvalsData.filter(a => a.status === 'Pending');
      case 'approved':
        return approvalsData.filter(a => a.status === 'Approved');
      case 'rejected':
        return approvalsData.filter(a => a.status === 'Rejected');
      case 'urgent':
        return approvalsData.filter(a => a.status === 'Pending' && (a.priority === 'High' || a.daysWaiting >= 3));
      default:
        return approvalsData;
    }
  };

  const pendingCount = approvalsData.filter(a => a.status === 'Pending').length;
  const approvedCount = approvalsData.filter(a => a.status === 'Approved').length;
  const rejectedCount = approvalsData.filter(a => a.status === 'Rejected').length;
  const urgentCount = approvalsData.filter(a => a.status === 'Pending' && (a.priority === 'High' || a.daysWaiting >= 3)).length;
  
  const reviewed = approvedCount + rejectedCount;
  const approvalRate = reviewed > 0 ? Math.round((approvedCount / reviewed) * 100) : null;
  const totalPendingAmount = approvalsData
    .filter(a => a.status === 'Pending')
    .reduce((sum, a) => {
      const amount = parseFloat(a.amount.replace(/[$,]/g, ''));
      return isNaN(amount) ? sum : sum + amount;
    }, 0);

  return (
    <PageLayout breadcrumbs={[{ label: 'Approve' }]}>
      {/* KPI Cards — real counts, no invented trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Pending Approvals"
          value={pendingCount.toString()}
          icon={Clock}
          subtitle={totalPendingAmount > 0 ? `$${(totalPendingAmount / 1000).toFixed(0)}K total value` : 'Awaiting your review'}
        />
        <KPICard
          title="Urgent Requests"
          value={urgentCount.toString()}
          icon={AlertTriangle}
          subtitle={urgentCount > 0 ? 'Need action soon' : 'None urgent'}
        />
        <KPICard
          title="Approved"
          value={approvedCount.toString()}
          icon={CheckCircle}
          subtitle="Committed to records"
        />
        <KPICard
          title="Approval Rate"
          value={approvalRate === null ? '—' : `${approvalRate}%`}
          icon={TrendingUp}
          subtitle={reviewed > 0 ? `${rejectedCount} rejected` : 'No decisions yet'}
        />
      </div>

      {/* AI Insights & Quick Actions - Collapsible */}
      <Collapsible open={aiInsightsOpen} onOpenChange={setAiInsightsOpen} className="mb-6">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl hover:bg-[#EAB308]/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#EAB308]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-medium">AI-Powered Insights &amp; Quick Actions</h3>
                <p className="text-xs text-[#6F83A7]">Appear as MARBIM reviews your approvals</p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-[#6F83A7] transition-transform duration-300 ${aiInsightsOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-[#6F83A7]">
              MARBIM will flag risky approvals, batch similar items and suggest actions here as
              requests come through. Nothing to review right now.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Content - Full Width */}
      <div className="space-y-6">
          {/* Tabs for filtering */}
          <Tabs defaultValue="all" value={activeView} onValueChange={setActiveView}>
            <div className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20 mb-6">
              <TabsList className="w-full bg-transparent border-0 p-0 h-auto grid grid-cols-5 gap-1.5">
                <TabsTrigger 
                  value="all" 
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <FileText className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  All ({approvalsData.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="pending"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <Clock className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="urgent"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <AlertTriangle className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Urgent ({urgentCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="approved"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Approved ({approvedCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected"
                  className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
                >
                  <XCircle className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
                  Rejected ({rejectedCount})
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <SmartTable
            title="Approval Requests"
            data={getFilteredData()}
            columns={columns}
            onRowClick={handleRowClick}
            loading={loading}
            emptyMessage="Nothing to approve yet. When MARBIM drafts an RFQ, quote or change, it lands here for your review."
            searchPlaceholder="Search approval requests..."
            actions={
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5"
                  onClick={() => toast.info('Bulk actions coming soon')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Bulk Approve
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black shadow-lg shadow-[#EAB308]/20"
                  onClick={() => handleAskMarbim('Show me approval recommendations for pending requests')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Insights
                </Button>
              </div>
            }
          />
      </div>

      {/* Detail Drawer */}
      {selectedApproval && (
        <ApprovalDetailDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          approval={selectedApproval}
          onAskMarbim={handleAskMarbim}
          onOpenAI={handleOpenAI}
          onApprove={selectedApproval?._raw ? handleApprove : undefined}
          onReject={selectedApproval?._raw ? handleReject : undefined}
        />
      )}
    </PageLayout>
  );
}