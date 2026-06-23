'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useRouter } from 'next/navigation';

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: initialValues, isLoading: isLoadingWorkspace } = useGetWorkspace({ workspaceId });
  const { isAdmin, isLoading: isLoadingMember } = useCurrentMember(workspaceId);

  const { data: workspaceAnalytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });

  const isLoading = isLoadingWorkspace || isLoadingMember || isLoadingAnalytics || isLoadingMembers || isLoadingProjects || isLoadingTasks;

  if (isLoading) return <PageLoader />;

  if (!isAdmin) {
    router.push(`/workspaces/${workspaceId}`);
    return null;
  }

  if (!initialValues || !workspaceAnalytics || !members || !projects || !tasks) {
    return <PageError message="Failed to load workspace data." />;
  }

  return (
    <div className="w-full">
      <EditWorkspaceForm 
        initialValues={initialValues} 
        analytics={workspaceAnalytics}
        membersCount={members.total}
        projectsCount={projects.total}
        tasks={tasks.documents}
      />
    </div>
  );
};
