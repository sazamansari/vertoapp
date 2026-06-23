'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, Plus, Search, UserPlus, CheckCircle2, FolderIcon } from 'lucide-react';
import { format } from 'date-fns';

import { UserButton } from '@/features/auth/components/user-button';
import { useCurrent } from '@/features/auth/api/use-current';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';

import { MobileSidebar } from './mobile-sidebar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: user } = useCurrent();
  const { data: workspace } = useGetWorkspace({ workspaceId });
  const { open: openCreateTask } = useCreateTaskModal();
  const { open: openCreateProject } = useCreateProjectModal();

  const userName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  const today = format(new Date(), 'EEEE, MMMM do');

  return (
    <nav className="flex items-center justify-between border-b border-neutral-200/50 bg-white/50 px-6 py-4 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-950/50 sticky top-0 z-10">
      <div className="hidden flex-col lg:flex">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {greeting}, {userName}
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {workspace?.name ? <span className="font-medium text-indigo-600 dark:text-indigo-400">{workspace.name}</span> : <span>Workspace</span>}
          <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <span>{today}</span>
        </p>
      </div>

      <MobileSidebar />

      <div className="flex items-center gap-x-4">
        <div className="hidden relative md:block">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="h-9 w-64 rounded-md border border-neutral-200 bg-neutral-50 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:bg-neutral-950"
          />
        </div>

        <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
          <Bell className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm dark:bg-indigo-600 dark:hover:bg-indigo-700">
              <Plus className="size-4" />
              <span className="hidden sm:inline">New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => openCreateTask()} className="gap-2 cursor-pointer">
              <CheckCircle2 className="size-4" />
              New Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openCreateProject()} className="gap-2 cursor-pointer">
              <FolderIcon className="size-4" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/workspaces/${workspaceId}/members`)} className="gap-2 cursor-pointer">
              <UserPlus className="size-4" />
              Invite Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="pl-2 border-l border-neutral-200 dark:border-neutral-800">
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
