'use client';

import { Settings, Users, LayoutDashboard, FolderIcon, CheckCircle2, Kanban, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { motion } from 'framer-motion';

const routes = [
  {
    label: 'Dashboard',
    href: '',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    href: '#projects', // Fallback anchor until Projects has its own distinct hub route, we use the sidebar's projects list anyway
    icon: FolderIcon,
  },
  {
    label: 'Issues',
    href: '/tasks',
    icon: CheckCircle2,
  },
  {
    label: 'Boards',
    href: '/tasks?view=kanban', // Using task kanban view as the board route
    icon: Kanban,
  },
  {
    label: 'Analytics',
    href: '/analytics', // Fallback route
    icon: BarChart3,
  },
  {
    label: 'Members',
    href: '/members',
    icon: Users,
    adminOnly: true,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    adminOnly: true,
  },
];

interface NavigationProps {
  isCollapsed?: boolean;
}

export const Navigation = ({ isCollapsed }: NavigationProps) => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { isAdmin } = useCurrentMember(workspaceId);

  return (
    <ul className="flex flex-col gap-y-1 py-1">
      <div className="mb-2 px-4 text-xs font-semibold tracking-wider text-neutral-500">Workspace</div>
      {routes.map((route) => {
        if (route.adminOnly && !isAdmin) return null;

        // Ensure analytics/projects goes to the root if not implemented, or just link there.
        // For the sake of the UI demo, we'll map them appropriately.
        const isExternal = route.href.includes('?');
        const basePath = route.href.split('?')[0];
        let fullHref = `/workspaces/${workspaceId}${route.href}`;
        if (route.href.startsWith('#')) {
          fullHref = `/workspaces/${workspaceId}`;
        }
        
        // Exact match or active section logic
        const isActive = route.href === '' 
          ? pathname === `/workspaces/${workspaceId}` 
          : pathname.includes(`/workspaces/${workspaceId}${basePath}`);

        const Icon = route.icon;

        return (
          <li key={route.label} className="relative px-2">
            {isActive && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-x-2 inset-y-0 rounded-md bg-neutral-100 shadow-sm dark:bg-neutral-800/80"
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              />
            )}
            <Link
              href={fullHref}
              title={isCollapsed ? route.label : undefined}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-100',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <Icon
                className={cn(
                  'size-4 transition-colors',
                  isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100',
                )}
              />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
