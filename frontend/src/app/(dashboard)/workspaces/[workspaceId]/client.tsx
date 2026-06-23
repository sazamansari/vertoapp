'use client';

import { formatDistanceToNow } from 'date-fns';
import { Activity, CheckCircle2, FolderIcon, LayoutDashboard, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';

import { StatCard } from '@/components/ui/stat-card';
import { PremiumTaskList } from '@/features/tasks/components/premium-task-list';
import { PremiumProjectList } from '@/features/projects/components/premium-project-list';
import { PremiumAiWidget } from '@/features/ai/components/premium-ai-widget';

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

import { useCurrent } from '@/features/auth/api/use-current';

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: user, isLoading: isLoadingUser } = useCurrent();
  const { data: workspaceAnalytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
  const { member, isLoading: isLoadingMember } = useCurrentMember(workspaceId);

  const isLoading = isLoadingAnalytics || isLoadingTasks || isLoadingProjects || isLoadingMembers || isLoadingMember || isLoadingUser;

  if (isLoading) return <PageLoader />;
  if (!workspaceAnalytics || !tasks || !projects || !members) return <PageError message="Failed to load workspace data." />;



  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left Column (Span 8) */}
        <div className="flex flex-col gap-6 xl:col-span-8">
          {/* KPI Stat Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Tasks"
              value={workspaceAnalytics.taskCount}
              icon={Target}
              color="indigo"
              trend={{ value: workspaceAnalytics.taskDifference, label: "from last month" }}
              delay={0.1}
            />
            <StatCard
              title="Completed Tasks"
              value={workspaceAnalytics.completedTaskCount}
              icon={CheckCircle2}
              color="emerald"
              trend={{ value: workspaceAnalytics.completedTaskDifference, label: "from last month" }}
              delay={0.2}
            />
            <StatCard
              title="Active Projects"
              value={projects.total}
              icon={FolderIcon}
              color="amber"
              delay={0.3}
            />
            <StatCard
              title="Team Members"
              value={members.total}
              icon={Users}
              color="blue"
              delay={0.4}
            />
          </motion.div>

          {/* Recent Tasks */}
          <motion.div variants={itemVariants}>
            <PremiumTaskList data={tasks.documents.slice(0, 5) as any} total={tasks.total} />
          </motion.div>

          {/* Active Projects */}
          <motion.div variants={itemVariants}>
            <PremiumProjectList data={projects.documents as any} total={projects.total} />
          </motion.div>
        </div>

        {/* Right Column (Span 4) */}
        <div className="flex flex-col gap-6 xl:col-span-4">
          <motion.div variants={itemVariants} className="sticky top-24">
            <PremiumAiWidget />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
