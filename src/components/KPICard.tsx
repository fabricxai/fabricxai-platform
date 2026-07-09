import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './ui/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export function KPICard({ title, value, change, changeLabel, icon: Icon, trend = 'neutral', onClick }: KPICardProps) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' }}
      onClick={onClick}
      className={cn(
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-180",
        onClick && "cursor-pointer hover:bg-white/10"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#EAB308]/20 to-[#57ACAF]/20">
          <Icon className="w-5 h-5 text-[#EAB308]" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs",
            isPositive && "bg-[#57ACAF]/10 text-[#57ACAF]",
            isNegative && "bg-[#D0342C]/10 text-[#D0342C]",
            !isPositive && !isNegative && "bg-white/5 text-[#6F83A7]"
          )}>
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>

      <div>
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
          className="text-white mb-1"
        >
          {value}
        </motion.div>
        <div className="text-sm text-[#6F83A7]">{title}</div>
        {changeLabel && (
          <div className="text-xs text-[#6F83A7] mt-1">{changeLabel}</div>
        )}
      </div>
    </motion.div>
  );
}
