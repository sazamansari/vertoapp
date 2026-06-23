'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useRouter } from 'next/navigation';

export const WorkspaceIdSettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: initialValues, isLoading } = useGetWorkspace({ workspaceId });
  const { isAdmin, isLoading: isLoadingMember } = useCurrentMember(workspaceId);

  if (isLoading || isLoadingMember) return <PageLoader />;

  if (!isAdmin) {
    router.push(`/workspaces/${workspaceId}`);
    return null;
  }

  if (!initialValues) return <PageError message="Workspace not found." />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
