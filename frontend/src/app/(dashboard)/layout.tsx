'use client';

import { useState, Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ModalProvider } from '@/components/modal-provider';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Suspense fallback={null}>
        <ModalProvider />
      </Suspense>

      <div className="flex size-full">
        {/* Desktop Sidebar Container */}
        <motion.div 
          initial={false}
          animate={{ 
            width: isCollapsed ? "80px" : "264px",
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="fixed left-0 top-0 z-40 hidden h-full lg:block"
        >
          <div className="relative h-full w-full">
            <Sidebar isCollapsed={isCollapsed} />
            
            {/* Collapse Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-6 z-50 size-8 rounded-full shadow-md"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="size-4" />
              </motion.div>
            </Button>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div 
          initial={false}
          animate={{ 
            paddingLeft: isCollapsed ? "80px" : "264px",
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="w-full lg:pl-[264px]"
        >
          <div className="mx-auto flex min-h-screen flex-col max-w-screen-xl">
            <Navbar />
            <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
            
            {/* Global Dashboard Footer */}
            <footer className="mt-auto flex flex-col items-center justify-center gap-1 border-t border-neutral-200/50 p-6 dark:border-neutral-800/50">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Powered by Verto</span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">Copyright © Hitbullseye 2026 | All Rights Reserved</span>
            </footer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default DashboardLayout;
