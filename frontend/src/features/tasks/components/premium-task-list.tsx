import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, PlusIcon, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import type { Task } from '@/features/tasks/types';
import { TaskStatus } from '@/features/tasks/types';

interface PremiumTaskListProps {
  data: Task[];
  total: number;
}

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800',
  [TaskStatus.TODO]: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  [TaskStatus.IN_PROGRESS]: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
  [TaskStatus.IN_REVIEW]: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  [TaskStatus.DONE]: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export const PremiumTaskList = ({ data, total }: PremiumTaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();

  return (
    <PremiumCard className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Recent Tasks</h3>
          <p className="text-sm text-muted-foreground">{total} total tasks in workspace</p>
        </div>
        <Button onClick={() => createTask()} variant="secondary" size="sm" className="h-8 gap-1 rounded-full px-3">
          <PlusIcon className="size-3.5" />
          <span>New Task</span>
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {data.map((task) => (
          <motion.div key={task.$id} variants={itemVariants}>
            <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
              <motion.div 
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between rounded-xl border border-transparent bg-neutral-50 p-3 transition-colors hover:border-neutral-200 hover:bg-white dark:bg-neutral-800/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {task.status === TaskStatus.DONE ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-neutral-300 dark:text-neutral-600" />
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                      {task.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {task.project?.name || 'No Project'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`hidden sm:flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="mr-1.5 size-3.5" />
                    <span className="w-16 truncate text-right">{formatDistanceToNow(new Date(task.dueDate))}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No recent tasks found.</p>
          </div>
        )}
      </motion.div>

      <div className="mt-auto pt-6">
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>View All Tasks</Link>
        </Button>
      </div>
    </PremiumCard>
  );
};
