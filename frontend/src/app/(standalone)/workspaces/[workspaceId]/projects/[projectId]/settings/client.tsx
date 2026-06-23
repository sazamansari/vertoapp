'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useRouter } from 'next/navigation';

export const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const router = useRouter();
  
  const { data: initialValues, isLoading } = useGetProject({ projectId });
  const { isAdmin, isLoading: isLoadingMember } = useCurrentMember(initialValues?.workspaceId || '');

  if (isLoading || isLoadingMember) return <PageLoader />;
  if (!initialValues) return <PageError message="Project not found." />;

  if (!isAdmin) {
    router.push(`/workspaces/${initialValues.workspaceId}/projects/${projectId}`);
    return null;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};
