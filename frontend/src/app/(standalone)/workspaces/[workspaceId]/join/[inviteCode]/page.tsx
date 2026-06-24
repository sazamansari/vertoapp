import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';

import { WorkspaceIdJoinClient } from './client';

const WorkspaceIdJoinPage = async ({ params }: { params: Promise<{ workspaceId: string, inviteCode: string }> }) => {
  const resolvedParams = await params;
  const user = await getCurrent();

  if (!user) redirect(`/sign-in?callbackUrl=/workspaces/${resolvedParams.workspaceId}/join/${resolvedParams.inviteCode}`);

  return <WorkspaceIdJoinClient />;
};

export default WorkspaceIdJoinPage;
