import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mic, Paperclip, Sparkles, FileText, BarChart3, AlertCircle, File, Image as ImageIcon, Plus, History, Clock, MessageSquare, Trash2, TrendingUp, DollarSign, CheckCircle, XCircle, ArrowRight, Brain, Zap, Table as TableIcon, LineChart, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import marbimAILogo from 'figma:asset/e5bbcfaaf08b208473c04b5ae611365f951076ab.png';
import {
  LineChart as RechartsLine,
  Line,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  currentModule?: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface ActionButton {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  onClick?: () => void;
}

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

interface ChartData {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  xKey?: string;
  yKey?: string;
  title?: string;
}

interface ReasoningStep {
  step: number;
  title: string;
  description: string;
  status: 'completed' | 'processing' | 'pending';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: AttachedFile[];
  processingSteps?: string[];
  reasoning?: ReasoningStep[];
  table?: TableData;
  chart?: ChartData;
  actions?: ActionButton[];
  isProcessing?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  module: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}

// Module configuration with quick prompts and colors
const moduleConfig: Record<string, {
  name: string;
  color: string;
  quickPrompts: string[];
}> = {
  'lead-management': {
    name: 'Lead Management',
    color: '#57ACAF',
    quickPrompts: [
      "Summarize today's new leads",
      "Score this uploaded CSV by fit and intent",
      "Generate follow-up email for high-fit leads",
      "What channel is performing best this week?"
    ]
  },
  'buyer-management': {
    name: 'Buyer Management',
    color: '#6F83A7',
    quickPrompts: [
      "Summarize last 30 days of Buyer ACME",
      "Generate renewal checklist for Tier-A buyer",
      "What's ACME's current sentiment trend?",
      "Show all unresolved issues with buyers"
    ]
  },
  'supplier-evaluation': {
    name: 'Supplier Evaluation',
    color: '#57ACAF',
    quickPrompts: [
      "Show top 5 suppliers for 180 GSM knit fabric",
      "Compare quotes from these suppliers",
      "Which supplier has highest reliability score?",
      "List certificates expiring this month"
    ]
  },
  'rfq-quotation': {
    name: 'RFQ & Quotation',
    color: '#EAB308',
    quickPrompts: [
      "Parse this RFQ PDF",
      "List missing fields and clarify with buyer",
      "Generate cost scenarios (12%, 15%, 18% margin)",
      "Compare this quote with past 3 orders"
    ]
  },
  'costing': {
    name: 'Costing',
    color: '#EAB308',
    quickPrompts: [
      "Build cost sheet for Style D-220",
      "Compare A/B/C margin scenarios",
      "Find reasons for margin drop",
      "Generate visual breakdown by cost category"
    ]
  },
  'production-planning': {
    name: 'Production Planning',
    color: '#57ACAF',
    quickPrompts: [
      "Recalculate master plan",
      "Detect bottlenecks",
      "Suggest reallocation for Line 4",
      "Why is Order 182 delayed?"
    ]
  },
  'workforce-management': {
    name: 'Workforce Management',
    color: '#6F83A7',
    quickPrompts: [
      "Build tomorrow's shift plan",
      "Show absenteeism risk",
      "Recommend training for low efficiency lines",
      "Who's missing from Line 6 today?"
    ]
  },
  'quality-control': {
    name: 'Quality Control',
    color: '#57ACAF',
    quickPrompts: [
      "Summarize today's QC reports",
      "Generate buyer pack for Order 230",
      "Find top 3 defect types this week",
      "Why is Line 2's DHU high?"
    ]
  },
  'shipment': {
    name: 'Shipment & Delivery',
    color: '#6F83A7',
    quickPrompts: [
      "Track all shipments due this week",
      "Generate document pack for PO #209",
      "Alert buyers for delayed containers",
      "Any delay on Buyer X's shipment?"
    ]
  },
  'finance': {
    name: 'Finance',
    color: '#EAB308',
    quickPrompts: [
      "Show overdue invoices",
      "Predict cashflow for next 60 days",
      "Explain margin variance by buyer",
      "Any cashflow risks next month?"
    ]
  },
  'sustainability': {
    name: 'Sustainability',
    color: '#57ACAF',
    quickPrompts: [
      "Generate GOTS report",
      "Find sustainability hotspots",
      "Compute CO₂e per product line",
      "Why did waste increase last week?"
    ]
  },
  'compliance-policy': {
    name: 'Compliance & Policy',
    color: '#6F83A7',
    quickPrompts: [
      "Draft WRAP compliance policy",
      "Show open NCs",
      "List expiring certificates",
      "Generate a new child labor policy"
    ]
  },
  'analytics': {
    name: 'Analytics & Reporting',
    color: '#EAB308',
    quickPrompts: [
      "Explain why margin dropped last quarter",
      "Generate executive summary for board",
      "Show top 3 performance KPIs",
      "Why is our on-time shipment rate falling?"
    ]
  },
  'dashboard': {
    name: 'Dashboard',
    color: '#6F83A7',
    quickPrompts: [
      "Show today's performance summary",
      "Highlight critical alerts",
      "Compare this week vs last week",
      "Generate daily executive brief"
    ]
  },
  'settings': {
    name: 'System & Settings',
    color: '#6F83A7',
    quickPrompts: [
      "Add new user",
      "Check integration health",
      "Audit all exports this week",
      "Show integrations with errors"
    ]
  }
};

export function AIAssistantPanel({ isOpen, onClose, initialPrompt, currentModule = 'dashboard' }: AIAssistantPanelProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current module config
  const config = moduleConfig[currentModule] || moduleConfig['dashboard'];

  // Load chat history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('marbim-chat-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const history = parsed.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          lastUpdated: new Date(chat.lastUpdated),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatHistory(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('marbim-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save current chat to history
  const saveCurrentChat = () => {
    if (messages.length === 0) return;

    const chatTitle = messages[0]?.content.slice(0, 50) + (messages[0]?.content.length > 50 ? '...' : '') || 'New Chat';
    
    const newChat: ChatHistory = {
      id: currentChatId || `chat-${Date.now()}`,
      title: chatTitle,
      module: currentModule,
      messages: [...messages],
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    setChatHistory(prev => {
      // If updating existing chat
      const existingIndex = prev.findIndex(chat => chat.id === newChat.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newChat;
        return updated;
      }
      // Add new chat at the beginning
      return [newChat, ...prev];
    });
  };

  // Start new chat
  const handleNewChat = () => {
    if (messages.length > 0) {
      saveCurrentChat();
      toast.success('Chat saved to history');
    }
    setMessages([]);
    setAttachedFiles([]);
    setCurrentChatId(null);
    setShowHistory(false);
  };

  // Load chat from history
  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (!chat) return;

    // Save current chat if it has messages
    if (messages.length > 0 && currentChatId !== chatId) {
      saveCurrentChat();
    }

    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowHistory(false);
    toast.success('Chat loaded');
  };

  // Delete chat from history
  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setMessages([]);
      setCurrentChatId(null);
    }
    toast.success('Chat deleted');
  };

  // Clear all history
  const clearAllHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('marbim-chat-history');
    toast.success('All chat history cleared');
  };

  // Auto-save current chat when messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      // Debounce save to avoid too many updates
      const timer = setTimeout(() => {
        saveCurrentChat();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages, currentChatId]);

  // Set initial prompt when panel opens and focus textarea
  useEffect(() => {
    if (isOpen && initialPrompt) {
      setMessage(initialPrompt);
      // Focus textarea after a short delay to ensure panel is rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          // Move cursor to end of text
          textareaRef.current.setSelectionRange(initialPrompt.length, initialPrompt.length);
        }
      }, 100);
    }
  }, [isOpen, initialPrompt]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newFiles: AttachedFile[] = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    if (newFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSend = async () => {
    if (!message.trim() && attachedFiles.length === 0) return;
    
    // Generate chat ID if this is the first message
    if (!currentChatId) {
      setCurrentChatId(`chat-${Date.now()}`);
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message || '📎 Attached files',
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userQuery = message;
    setMessage('');
    setAttachedFiles([]);
    setIsTyping(true);

    // Add processing message
    const processingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: processingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isProcessing: true,
      processingSteps: ['Analyzing query...', 'Searching knowledge base...', 'Generating insights...']
    }]);

    // Real MARBIM response — Claude reasoning grounded in the company's data.
    const history = [...messages, userMessage]
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/agent/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, module: currentModule }),
      });
      const json = await res.json();
      setMessages(prev => prev.filter(msg => msg.id !== processingMessageId));
      if (!res.ok) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: json.error || 'MARBIM had trouble responding. Please try again.',
          timestamp: new Date(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: json.text || 'I could not find anything to say about that yet.',
          timestamp: new Date(),
        }]);
      }
    } catch {
      setMessages(prev => prev.filter(msg => msg.id !== processingMessageId));
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'I could not reach the server. Please check your connection and try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const generateEnhancedResponse = (userMsg: string, module: string, context: string | null): Message => {
    const lowerMsg = userMsg.toLowerCase();
    
    // Determine if this query should include enhanced features
    const shouldShowTable = lowerMsg.includes('compare') || lowerMsg.includes('list') || lowerMsg.includes('show') || lowerMsg.includes('top');
    const shouldShowChart = lowerMsg.includes('trend') || lowerMsg.includes('analysis') || lowerMsg.includes('breakdown') || lowerMsg.includes('visual');
    const shouldShowReasoning = lowerMsg.includes('why') || lowerMsg.includes('explain') || lowerMsg.includes('analyze');
    const shouldShowActions = lowerMsg.includes('recommend') || lowerMsg.includes('suggest') || lowerMsg.includes('should');

    let content = '';
    let reasoning: ReasoningStep[] | undefined;
    let table: TableData | undefined;
    let chart: ChartData | undefined;
    let actions: ActionButton[] | undefined;

    // Generate reasoning steps
    if (shouldShowReasoning) {
      reasoning = [
        {
          step: 1,
          title: 'Data Collection',
          description: 'Retrieved relevant data from ERP database and vector knowledge base',
          status: 'completed'
        },
        {
          step: 2,
          title: 'Pattern Analysis',
          description: 'Identified trends and anomalies using ML algorithms',
          status: 'completed'
        },
        {
          step: 3,
          title: 'Root Cause Identification',
          description: 'Analyzed correlations to determine primary factors',
          status: 'completed'
        },
        {
          step: 4,
          title: 'Recommendation Generation',
          description: 'Generated actionable recommendations based on findings',
          status: 'completed'
        }
      ];
    }

    // Module-specific responses with enhanced data
    if (module === 'rfq-quotation') {
      content = "I've analyzed the quote scenarios and identified key insights:";
      
      if (shouldShowTable) {
        table = {
          headers: ['Scenario', 'Margin %', 'FOB Price', 'Lead Time', 'Win Probability'],
          rows: [
            ['Premium', '18%', '$6.25', '45 days', '58%'],
            ['Competitive', '12%', '$5.85', '35 days', '72%'],
            ['Budget', '8%', '$5.50', '50 days', '65%']
          ]
        };
      }

      if (shouldShowChart) {
        chart = {
          type: 'bar',
          title: 'Win Probability by Margin',
          data: [
            { scenario: 'Budget (8%)', winProb: 65, margin: 8 },
            { scenario: 'Competitive (12%)', winProb: 72, margin: 12 },
            { scenario: 'Premium (18%)', winProb: 58, margin: 18 }
          ],
          xKey: 'scenario',
          yKey: 'winProb'
        };
      }

      if (shouldShowActions) {
        actions = [
          {
            label: 'Approve Competitive Scenario',
            variant: 'primary',
            onClick: () => toast.success('Scenario approved - Quote will be generated')
          },
          {
            label: 'Request Buyer Clarification',
            variant: 'secondary',
            onClick: () => toast.info('Clarification request drafted')
          },
          {
            label: 'Create New Scenario',
            variant: 'secondary',
            onClick: () => toast.info('Opening scenario builder...')
          }
        ];
      }

      content += "\n\nBased on historical data with this buyer, the **Competitive scenario (12% margin)** shows the highest win probability at 72%. The Premium scenario has lower acceptance due to price sensitivity, while the Budget scenario compromises on margin unnecessarily.";
      
    } else if (module === 'costing') {
      content = "Cost analysis completed for the requested style:";
      
      if (shouldShowTable) {
        table = {
          headers: ['Category', 'Cost ($)', 'Percentage', 'Status'],
          rows: [
            ['Materials', '3.85', '62%', '↑ 7% increase'],
            ['Labor', '1.12', '18%', 'Stable'],
            ['Overhead', '1.24', '20%', 'Optimized'],
            ['Total', '6.21', '100%', '—']
          ]
        };
      }

      if (shouldShowChart) {
        chart = {
          type: 'pie',
          title: 'Cost Breakdown',
          data: [
            { name: 'Materials', value: 62, color: '#EAB308' },
            { name: 'Labor', value: 18, color: '#57ACAF' },
            { name: 'Overhead', value: 20, color: '#6F83A7' }
          ]
        };
      }

      if (shouldShowActions) {
        actions = [
          {
            label: 'Review Alternate Suppliers',
            variant: 'primary',
            onClick: () => toast.success('Opening supplier comparison...')
          },
          {
            label: 'Optimize BOM',
            variant: 'secondary',
            onClick: () => toast.info('BOM optimization in progress...')
          }
        ];
      }

      content += "\n\n**Key Finding:** Material costs increased 7% due to cotton price surge. I found an alternate supplier offering 4% lower cost with similar quality ratings.";
      
    } else if (module === 'production-planning') {
      content = "Production analysis shows a bottleneck on Line 4:";
      
      if (shouldShowTable) {
        table = {
          headers: ['Line', 'Capacity', 'Current Load', 'Utilization', 'Status'],
          rows: [
            ['Line 1', '500 pcs', '480 pcs', '96%', '✓ Optimal'],
            ['Line 2', '500 pcs', '390 pcs', '78%', '⚠ Underutilized'],
            ['Line 3', '600 pcs', '595 pcs', '99%', '⚠ At Capacity'],
            ['Line 4', '550 pcs', '620 pcs', '113%', '✗ Over Capacity']
          ]
        };
      }

      if (shouldShowChart) {
        chart = {
          type: 'bar',
          title: 'Line Utilization %',
          data: [
            { line: 'Line 1', utilization: 96 },
            { line: 'Line 2', utilization: 78 },
            { line: 'Line 3', utilization: 99 },
            { line: 'Line 4', utilization: 113 }
          ],
          xKey: 'line',
          yKey: 'utilization'
        };
      }

      if (shouldShowActions) {
        actions = [
          {
            label: 'Reallocate to Line 2',
            variant: 'primary',
            onClick: () => toast.success('Reallocation scheduled')
          },
          {
            label: 'Schedule Overtime',
            variant: 'secondary',
            onClick: () => toast.info('Overtime request created')
          },
          {
            label: 'View Detailed Plan',
            variant: 'secondary',
            onClick: () => toast.info('Opening master plan...')
          }
        ];
      }

      content += "\n\n**Recommendation:** Shift 150 pcs from Line 4 to Line 2 to balance load and avoid delays.";
      
    } else if (module === 'quality-control') {
      content = "QC analysis reveals top defect patterns:";
      
      if (shouldShowTable) {
        table = {
          headers: ['Defect Type', 'Count', 'Line', 'Trend', 'Impact'],
          rows: [
            ['Broken Stitch', '24', 'Line 2', '↑ 12%', 'High'],
            ['Color Shade', '18', 'Line 5', '↓ 5%', 'Medium'],
            ['Measurement', '15', 'Line 1', 'Stable', 'Medium'],
            ['Puckering', '12', 'Line 3', '↑ 8%', 'Low']
          ]
        };
      }

      if (shouldShowChart) {
        chart = {
          type: 'line',
          title: 'DHU Trend (Last 7 Days)',
          data: [
            { day: 'Mon', dhu: 2.8 },
            { day: 'Tue', dhu: 3.1 },
            { day: 'Wed', dhu: 3.5 },
            { day: 'Thu', dhu: 3.9 },
            { day: 'Fri', dhu: 4.2 },
            { day: 'Sat', dhu: 4.0 },
            { day: 'Sun', dhu: 3.7 }
          ],
          xKey: 'day',
          yKey: 'dhu'
        };
      }

      if (shouldShowActions) {
        actions = [
          {
            label: 'Schedule Operator Training',
            variant: 'primary',
            onClick: () => toast.success('Training scheduled')
          },
          {
            label: 'Inspect Machine Settings',
            variant: 'secondary',
            onClick: () => toast.info('Maintenance ticket created')
          },
          {
            label: 'Generate QC Report',
            variant: 'secondary',
            onClick: () => toast.success('Report generated')
          }
        ];
      }

      content += "\n\n**Root Cause:** Line 2's broken stitch defects traced to needle alignment issue. Immediate corrective action recommended.";
      
    } else {
      // Default response
      content = context 
        ? `Based on relevant data:\n\n${generateMockResponse(userMsg, module)}\n\n📊 Context retrieved from knowledge base with ${context.split('\n').length} relevant documents.`
        : generateMockResponse(userMsg, module);
    }

    return {
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      reasoning,
      table,
      chart,
      actions
    };
  };

  const generateMockResponse = (userMsg: string, module: string): string => {
    const responses: Record<string, string> = {
      'lead-management': "I've analyzed today's new leads. You have 12 new leads with an average fit score of 78%. 3 leads show high intent based on website engagement. Shall I prioritize them for immediate follow-up?",
      'buyer-management': "Buyer ACME has placed 8 orders in the last 30 days totaling $247K. Sentiment analysis shows positive trend (+12%) with 92% on-time delivery satisfaction. One pending issue regarding sample approval.",
      'rfq-quotation': "I've parsed the RFQ PDF. Found 3 missing specifications: fabric weight tolerance, packing method, and test requirements. Shall I draft a clarification email to the buyer?",
      'costing': "Cost sheet for Style D-220 shows material cost at 62%, labor at 18%, and overhead at 20%. Margin drop is due to 7% fabric price increase. I found an alternate supplier offering 4% lower cost.",
      'production-planning': "Order 182 is delayed due to fabric ETA slip of 2 days. I recommend overtime on Line 5 or reallocating capacity from Line 3 which is currently at 78% utilization.",
      'quality-control': "Line 2's DHU increased to 4.2% due to broken stitch defects (+12%). Root cause analysis suggests needle alignment issue. Recommend immediate operator retraining and equipment check.",
      'shipment': "Container 8X-12 for Buyer X is delayed 24 hours due to port congestion in Chittagong. Revised ETA: March 15. Shall I notify the buyer with updated tracking information?",
      'finance': "Analysis shows potential cashflow shortfall on March 12th due to delayed shipment invoicing. Recommend prioritizing payment follow-up with ACME Corp ($84K outstanding).",
      'sustainability': "Waste increased 5% last week primarily in cutting department. New fabric layout inefficiency detected. Recommend marker plan optimization to reduce waste by estimated 3.2%.",
      'compliance-policy': "Drafting WRAP compliance policy based on SMETA 6.1 standards and local labor regulations. Policy includes child labor prevention, working hours, health & safety protocols. Ready for review.",
    };
    
    return responses[module] || "I'm analyzing your request and cross-referencing with real-time data from the ERP system. How can I assist you further with this?";
  };

  const renderChart = (chart: ChartData) => {
    const COLORS = ['#EAB308', '#57ACAF', '#6F83A7', '#D0342C', '#57ACAF'];

    if (chart.type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chart.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chart.data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{
                backgroundColor: '#1a1f2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chart.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsLine data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey={chart.xKey} 
              stroke="#6F83A7" 
              tick={{ fill: '#6F83A7', fontSize: 11 }}
            />
            <YAxis 
              stroke="#6F83A7" 
              tick={{ fill: '#6F83A7', fontSize: 11 }}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: '#1a1f2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={chart.yKey} 
              stroke="#EAB308" 
              strokeWidth={2}
              dot={{ fill: '#EAB308', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </RechartsLine>
        </ResponsiveContainer>
      );
    }

    if (chart.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsBar data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey={chart.xKey} 
              stroke="#6F83A7" 
              tick={{ fill: '#6F83A7', fontSize: 11 }}
            />
            <YAxis 
              stroke="#6F83A7" 
              tick={{ fill: '#6F83A7', fontSize: 11 }}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: '#1a1f2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey={chart.yKey} fill="#57ACAF" radius={[4, 4, 0, 0]} />
          </RechartsBar>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Panel - slide from right with 300ms */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-16 bottom-[72px] w-full max-w-[680px] z-50 flex flex-col p-1 overflow-hidden"
          >
            {/* Glowing yellow border wrapper */}
            <div className="relative h-full w-full rounded-lg overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308] via-[#EAB308]/60 to-[#EAB308] rounded-lg opacity-80" />
              
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/40 via-transparent to-[#EAB308]/40 rounded-lg blur-sm" />
              
              {/* Main content container with inner padding */}
              <div className="relative h-full w-full m-[2px] bg-gradient-to-br from-[#1a1f2e] to-[#252b3b] shadow-2xl rounded-lg flex flex-col overflow-hidden">
                {/* Shadow overlay for depth */}
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(234,179,8,0.15)] pointer-events-none rounded-lg" />
            {/* Header with module tag */}
            <div className="relative px-6 py-4 border-b border-white/10 bg-[#101725]/50 backdrop-blur-sm rounded-tl-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Pulsing MARBIM logo */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [1, 0.9, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 8
                    }}
                  >
                    <img src={marbimAILogo} alt="MARBIM AI" className="h-8" />
                  </motion.div>
                  <div>
                    <h2 className="text-white">MARBIM — Your AI Assistant</h2>
                    <p className="text-xs text-[#6F83A7]">
                      Currently in <span style={{ color: config.color }}>{config.name}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* History Toggle */}
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    variant="ghost"
                    size="sm"
                    className={`text-[#6F83A7] hover:text-white hover:bg-white/10 transition-colors ${
                      showHistory ? 'bg-white/10 text-white' : ''
                    }`}
                  >
                    <History className="w-4 h-4" />
                  </Button>
                  {/* New Chat */}
                  <Button
                    onClick={handleNewChat}
                    variant="ghost"
                    size="sm"
                    className="text-[#6F83A7] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  {/* Close */}
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-[#6F83A7] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2">
                {config.quickPrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-[#6F83A7] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-180"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* History Panel - Slide down when active */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-b border-white/10 bg-[#101725]/30 overflow-hidden"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#EAB308]" />
                        <h3 className="text-white font-medium">Chat History</h3>
                        <span className="text-xs text-[#6F83A7]">({chatHistory.length} conversations)</span>
                      </div>
                      {chatHistory.length > 0 && (
                        <Button
                          onClick={clearAllHistory}
                          size="sm"
                          variant="ghost"
                          className="text-[#D0342C] hover:text-white hover:bg-[#D0342C]/10 h-auto py-1 px-2"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Clear All
                        </Button>
                      )}
                    </div>

                    <ScrollArea className="h-[280px]">
                      {chatHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <MessageSquare className="w-12 h-12 text-[#6F83A7] mb-3 opacity-50" />
                          <p className="text-sm text-[#6F83A7]">No chat history yet</p>
                          <p className="text-xs text-[#6F83A7] mt-1">Start a conversation to save it here</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {chatHistory.map((chat) => (
                            <motion.button
                              key={chat.id}
                              onClick={() => loadChat(chat.id)}
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.99 }}
                              className={`w-full text-left p-4 rounded-xl border transition-all duration-180 group ${
                                currentChatId === chat.id
                                  ? 'bg-[#EAB308]/10 border-[#EAB308]/30'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-[#EAB308] flex-shrink-0" />
                                    <h4 className="text-sm text-white font-medium truncate">{chat.title}</h4>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-[#6F83A7]">
                                    <span>{moduleConfig[chat.module]?.name || chat.module}</span>
                                    <span>•</span>
                                    <span>{chat.messages.length} messages</span>
                                    <span>•</span>
                                    <span>{new Date(chat.lastUpdated).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => deleteChat(chat.id, e)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#D0342C]/10 transition-all duration-180"
                                >
                                  <Trash2 className="w-4 h-4 text-[#D0342C]" />
                                </button>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Window with proper overflow handling */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="w-12 h-12 text-[#EAB308] mx-auto mb-4" />
                      <h3 className="text-white mb-2">AI-Powered Insights Ready</h3>
                      <p className="text-sm text-[#6F83A7] max-w-md">
                        Ask me anything about {config.name.toLowerCase()}. I can analyze data, 
                        generate reports, detect risks, and suggest next steps.
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-xl ${
                            msg.role === 'user'
                              ? 'bg-[#EAB308]/10 border border-[#EAB308]/30 text-white'
                              : 'bg-[#252b3b] border-l-2 border-[#EAB308] text-white'
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <img src={marbimAILogo} alt="MARBIM" className="h-4" />
                              <span className="text-xs text-[#EAB308]">MARBIM AI</span>
                            </div>
                          )}

                          {/* Processing State */}
                          {msg.isProcessing && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Brain className="w-5 h-5 text-[#EAB308]" />
                                </motion.div>
                                <span className="text-sm text-[#EAB308]">Processing your request...</span>
                              </div>
                              <div className="space-y-2">
                                {msg.processingSteps?.map((step, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.3 }}
                                    className="flex items-center gap-2 text-xs text-[#6F83A7]"
                                  >
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 1, repeat: Infinity }}
                                      className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"
                                    />
                                    {step}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Reasoning Steps */}
                          {msg.reasoning && (
                            <div className="mb-4 space-y-2">
                              <div className="flex items-center gap-2 mb-3">
                                <Brain className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-xs text-[#57ACAF] uppercase tracking-wide">AI Reasoning Process</span>
                              </div>
                              {msg.reasoning.map((step) => (
                                <div key={step.step} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#57ACAF]/20 text-[#57ACAF] text-xs shrink-0">
                                    {step.step}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm text-white font-medium">{step.title}</span>
                                      {step.status === 'completed' && (
                                        <CheckCircle className="w-3.5 h-3.5 text-[#57ACAF]" />
                                      )}
                                    </div>
                                    <p className="text-xs text-[#6F83A7]">{step.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Main Content */}
                          {!msg.isProcessing && (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          )}
                          
                          {/* Table Data */}
                          {msg.table && (
                            <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/10">
                                <TableIcon className="w-4 h-4 text-[#EAB308]" />
                                <span className="text-xs text-[#EAB308] uppercase tracking-wide">Data Table</span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                      {msg.table.headers.map((header, idx) => (
                                        <th key={idx} className="px-3 py-2 text-left text-[#6F83A7] font-medium">
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {msg.table.rows.map((row, rowIdx) => (
                                      <tr key={rowIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        {row.map((cell, cellIdx) => (
                                          <td key={cellIdx} className="px-3 py-2 text-white">
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Chart Data */}
                          {msg.chart && (
                            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center gap-2 mb-3">
                                <BarChart3 className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-xs text-[#57ACAF] uppercase tracking-wide">
                                  {msg.chart.title || 'Visual Analysis'}
                                </span>
                              </div>
                              {renderChart(msg.chart)}
                            </div>
                          )}

                          {/* Action Buttons */}
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-[#EAB308]" />
                                <span className="text-xs text-[#EAB308] uppercase tracking-wide">Recommended Actions</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {msg.actions.map((action, idx) => (
                                  <Button
                                    key={idx}
                                    onClick={action.onClick}
                                    size="sm"
                                    className={
                                      action.variant === 'primary'
                                        ? 'bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70'
                                        : action.variant === 'success'
                                        ? 'bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30 hover:bg-[#57ACAF]/30'
                                        : action.variant === 'danger'
                                        ? 'bg-[#D0342C]/20 text-[#D0342C] border border-[#D0342C]/30 hover:bg-[#D0342C]/30'
                                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                    }
                                  >
                                    {action.label}
                                    <ArrowRight className="w-3 h-3 ml-1.5" />
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Show attachments if any */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.attachments.map(file => (
                                <div
                                  key={file.id}
                                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10"
                                >
                                  {file.preview ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      className="w-12 h-12 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded bg-[#EAB308]/10 border border-[#EAB308]/20 flex items-center justify-center">
                                      <FileText className="w-6 h-6 text-[#EAB308]" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white truncate">{file.name}</p>
                                    <p className="text-xs text-[#6F83A7]">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="mt-3 text-xs text-[#6F83A7]">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="relative border-t border-white/10 bg-[#101725]/50 backdrop-blur-sm p-4">
              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachedFiles.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 group"
                    >
                      <FileText className="w-4 h-4 text-[#EAB308]" />
                      <span className="text-xs text-white truncate max-w-[120px]">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-[#D0342C]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                {/* File Attach Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-[#6F83A7] hover:text-white hover:bg-white/10"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                {/* Message Input */}
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask MARBIM anything..."
                  className="flex-1 min-h-[44px] max-h-[120px] resize-none bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] focus:border-[#EAB308]/50"
                  rows={1}
                />

                {/* Send Button */}
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() && attachedFiles.length === 0}
                  className="shrink-0 bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 text-black hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 shadow-lg shadow-[#EAB308]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
