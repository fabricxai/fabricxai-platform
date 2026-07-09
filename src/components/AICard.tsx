import image_6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe from 'figma:asset/6b4cf6e4e338085095ecc8446ad35e7b17ea5cfe.png';
import { LucideIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import { MarbimAIButton } from './MarbimAIButton';

interface AICardProps {
  title: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  marbimPrompt?: string;
  onAskMarbim?: (prompt: string) => void;
  /** Alternative content API used by some inboxes (e.g. Approve). */
  insights?: unknown[];
  onActionClick?: (id: unknown) => void;
}

export function AICard({ title, icon: Icon = Sparkles, children, className, marbimPrompt, onAskMarbim }: AICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-gradient-to-br from-[#EAB308]/10 via-[#57ACAF]/5 to-transparent backdrop-blur-sm border border-[#EAB308]/20 rounded-2xl p-5 relative overflow-hidden",
        className
      )}
    >
      {/* MARBIM AI Button - top right */}
      {onAskMarbim && (
        <button 
          onClick={() => onAskMarbim(marbimPrompt || `Tell me more about ${title.toLowerCase()}`)}
          className="absolute top-3 right-3 p-0 bg-transparent border-0 cursor-pointer transition-all duration-180 group z-10"
          title="Ask MARBIM AI Assistant"
        >
          <img
            src="/assets/marbim.svg"
            alt="Ask MARBIM"
            className="w-8 h-8 object-contain transition-transform duration-180 group-hover:scale-110"
          />
        </button>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#EAB308] to-[#57ACAF]">
          <Icon className="w-4 h-4 text-[#0D1117]" />
        </div>
        <h3 className="text-white">{title}</h3>
        {!marbimPrompt && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto"
          >
            <Sparkles className="w-4 h-4 text-[#EAB308]" />
          </motion.div>
        )}
      </div>

      {/* Mock AI-Powered Insights */}
      <div className="space-y-3 mb-4">
        {/* High Priority Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 hover:border-red-500/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">Critical: Production Delay Risk</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">High Priority</span>
              </div>
              <p className="text-xs text-[#6F83A7] mb-3">
                Machine M-203 showing 85% failure probability in next 48hrs. Could delay 3 active orders worth $245K.
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 h-7 text-xs"
                  onClick={() => {}}
                >
                  Schedule Maintenance
                </Button>
                <span className="text-xs text-[#6F83A7]">AI Confidence: 92%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Medium Priority Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 hover:border-[#EAB308]/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-[#EAB308]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">Upsell Opportunity Detected</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30">Medium</span>
              </div>
              <p className="text-xs text-[#6F83A7] mb-3">
                Customer "ABC Textiles" ordering pattern suggests 78% interest in premium fabric line. Est. value: $125K.
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-[#EAB308]/20 hover:bg-[#EAB308]/30 text-[#EAB308] border border-[#EAB308]/30 h-7 text-xs"
                  onClick={() => {}}
                >
                  Send Catalog
                </Button>
                <span className="text-xs text-[#6F83A7]">Success Rate: 78%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Low Priority Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 hover:border-[#57ACAF]/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-[#57ACAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">Cost Optimization Available</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#57ACAF]/20 text-[#57ACAF] border border-[#57ACAF]/30">Low</span>
              </div>
              <p className="text-xs text-[#6F83A7] mb-3">
                Switching to Supplier "Global Fabrics" for cotton could save $12K/month with same quality. 15 orders affected.
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-[#57ACAF]/20 hover:bg-[#57ACAF]/30 text-[#57ACAF] border border-[#57ACAF]/30 h-7 text-xs"
                  onClick={() => {}}
                >
                  Review Options
                </Button>
                <span className="text-xs text-[#6F83A7]">Savings: $12K/mo</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Predictive Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">Seasonal Demand Forecast</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">Prediction</span>
              </div>
              <p className="text-xs text-[#6F83A7] mb-3">
                Q1 demand expected to spike 35% based on historical trends. Order 2,500 extra yards of denim by Dec 15.
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 h-7 text-xs"
                  onClick={() => {}}
                >
                  Adjust Inventory
                </Button>
                <span className="text-xs text-[#6F83A7]">Model Accuracy: 89%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quality Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">Quality Improvement Trend</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">Insight</span>
              </div>
              <p className="text-xs text-[#6F83A7] mb-3">
                Defect rate dropped 42% after implementing new QC process. Continue for 3 more months to sustain improvements.
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 h-7 text-xs"
                  onClick={() => {}}
                >
                  View Report
                </Button>
                <span className="text-xs text-[#6F83A7]">Defect Rate: 2.1%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
}

interface AIInsightItemProps {
  label: string;
  value: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  marbimPrompt?: string;
  onAskMarbim?: (prompt: string) => void;
}

export function AIInsightItem({ label, value, action, marbimPrompt, onAskMarbim }: AIInsightItemProps) {
  return (
    <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm text-white mb-0.5">{label}</div>
          <div className="text-xs text-[#6F83A7]">{value}</div>
        </div>
        <div className="flex items-center gap-2">
          {marbimPrompt && onAskMarbim && (
            <MarbimAIButton 
              prompt={marbimPrompt}
              onAsk={onAskMarbim}
              variant="icon"
              size="sm"
              label={`Ask MARBIM: ${label}`}
            />
          )}
          {action && (
            <Button
              size="sm"
              onClick={action.onClick}
              className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-[#0D1117] h-7 text-xs"
            >
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}