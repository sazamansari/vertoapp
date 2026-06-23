import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Logo } from './logo';
import { Navigation } from './navigation';
import { AiNavigation } from './ai-navigation';
import { Projects } from './projects';
import { WorkspaceSwitcher } from './workspaces-switcher';

interface SidebarProps {
  isCollapsed?: boolean;
}

export const Sidebar = ({ isCollapsed = false }: SidebarProps) => {
  return (
    <aside className={cn("size-full border-r border-neutral-200 bg-neutral-50 py-4 dark:border-neutral-800 dark:bg-[#1C1C1C] overflow-y-auto overflow-x-hidden flex flex-col gap-4", isCollapsed ? "items-center px-2" : "px-4")}>
      <motion.div 
        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
        className="overflow-hidden flex-shrink-0"
      >
        <Logo />
      </motion.div>

      <motion.div 
        animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto", overflow: "hidden" }}
        className="flex-shrink-0"
      >
        <Suspense>
          <WorkspaceSwitcher />
        </Suspense>
      </motion.div>

      <div className="flex-shrink-0">
        <Navigation isCollapsed={isCollapsed} />
      </div>
      
      <div className="flex-shrink-0">
        <AiNavigation isCollapsed={isCollapsed} />
      </div>

      <motion.div 
        animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto", overflow: "hidden" }}
        className="flex-1"
      >
        <Suspense>
          <Projects />
        </Suspense>
      </motion.div>
    </aside>
  );
};
