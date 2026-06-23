import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  delay?: number;
}

const colorMap = {
  indigo: 'text-indigo-600 dark:text-indigo-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  amber: 'text-amber-600 dark:text-amber-400',
  rose: 'text-rose-600 dark:text-rose-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
};

const bgMap = {
  indigo: 'bg-indigo-50 dark:bg-indigo-500/10',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10',
  amber: 'bg-amber-50 dark:bg-amber-500/10',
  rose: 'bg-rose-50 dark:bg-rose-500/10',
  blue: 'bg-blue-50 dark:bg-blue-500/10',
  purple: 'bg-purple-50 dark:bg-purple-500/10',
};

export const StatCard = ({ title, value, icon: Icon, trend, color = 'indigo', delay = 0 }: StatCardProps) => {
  const isPositive = trend && trend.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: 'spring', stiffness: 100 }}
      className="h-full"
    >
      <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
        
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            <p className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{value}</p>
          </div>
          <div className={cn("flex size-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110", bgMap[color], colorMap[color])}>
            <Icon className="size-5" />
          </div>
        </div>
        
        {trend && (
          <div className="mt-5 flex items-center gap-x-2 text-xs">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                isPositive 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
              )}
            >
              {isPositive ? '+' : ''}{trend.value}%
            </div>
            <span className="text-neutral-500 dark:text-neutral-400">{trend.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
