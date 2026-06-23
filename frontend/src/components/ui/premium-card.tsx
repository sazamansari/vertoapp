import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ children, className, gradient = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all dark:border-white/10 dark:bg-neutral-900/60",
          gradient && "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-indigo-500/5 before:via-transparent before:to-purple-500/5",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";
