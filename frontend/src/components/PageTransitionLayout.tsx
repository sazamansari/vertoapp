'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionLayoutProps {
  children: ReactNode;
}

export function PageTransitionLayout({ children }: PageTransitionLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
