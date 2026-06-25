'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, BrainCircuit, Activity, ShieldAlert, Zap, PieChart, Lightbulb, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

const aiRoutes = [
  { label: 'AI Assistant', href: '/ai', icon: Sparkles },
  { label: 'AI Sprint Planner', href: '/ai', icon: Zap },
  { label: 'AI Team Health', href: '/ai', icon: Activity },
  { label: 'AI Risk Center', href: '/ai', icon: ShieldAlert },
  { label: 'AI Workload Analysis', href: '/ai', icon: BrainCircuit },
  { label: 'AI Analytics', href: '/ai', icon: PieChart },
  { label: 'AI Insights', href: '/ai', icon: Lightbulb },
];

interface AiNavigationProps {
  isCollapsed?: boolean;
}

export const AiNavigation = ({ isCollapsed }: AiNavigationProps) => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useState(false);

  const isAnyAiRouteActive = aiRoutes.some((route) => pathname.includes(`/workspaces/${workspaceId}${route.href}`));

  // Automatically open the accordion if an AI route is active, but only initialize once.
  // Using simple state here since we don't want it snapping open/closed constantly.

  return (
    <div className="flex flex-col gap-y-1">
      {/* Group Header */}
      <div 
        className={cn(
          "flex items-center justify-between cursor-pointer rounded-md px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
          isCollapsed && "justify-center px-2"
        )}
        onClick={() => setIsOpen(!isOpen)}
        title={isCollapsed ? "TaskOrbit" : undefined}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="size-4" />
          {!isCollapsed && <span>TaskOrbit</span>}
        </div>
        {!isCollapsed && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown className="size-4 text-neutral-500" />
          </motion.div>
        )}
      </div>

      {/* Collapsible Submenus */}
      <AnimatePresence>
        {(isOpen || isCollapsed) && (
          <motion.ul 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn("flex flex-col gap-y-1 overflow-hidden", isCollapsed && "items-center")}
          >
            {aiRoutes.map((route) => {
              const fullHref = `/workspaces/${workspaceId}${route.href}`;
              const isActive = pathname === fullHref;
              const Icon = route.icon;

              return (
                <li key={route.label} className="relative px-2">
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="active-ai-nav"
                      className="absolute inset-x-2 inset-y-0 rounded-lg bg-indigo-500/10 shadow-sm dark:bg-indigo-500/20"
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    />
                  )}
                  <Link
                    href={fullHref}
                    title={isCollapsed ? route.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-indigo-700 dark:text-indigo-400'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
                      isCollapsed && 'justify-center px-0 py-2.5'
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 transition-colors',
                        isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100',
                        isCollapsed && 'size-5'
                      )}
                    />
                    {!isCollapsed && <span>{route.label}</span>}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
