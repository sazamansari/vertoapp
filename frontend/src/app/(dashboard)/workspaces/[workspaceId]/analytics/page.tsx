'use client';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { Analytics } from '@/components/analytics';
import { PageLoader } from '@/components/page-loader';
import { PageError } from '@/components/page-error';

const WorkspaceAnalyticsPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading, error } = useGetWorkspaceAnalytics({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !data) {
    return <PageError message="Failed to load workspace analytics" />;
  }

  return (
    <div className="flex h-full flex-col gap-y-4 p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workspace Analytics</h1>
      </div>
      <Analytics data={data} />
    </div>
  );
};

export default WorkspaceAnalyticsPage;
