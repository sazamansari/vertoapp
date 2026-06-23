import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { MemberRole } from '../types';

interface CurrentMemberResponse {
  success: boolean;
  data: {
    member: {
      $id: string;
      role: MemberRole;
      workspaceId: string;
      userId: string;
    }
  };
}

export const useCurrentMember = (workspaceId: string) => {
  const query = useQuery<CurrentMemberResponse>({
    queryKey: ['current-member', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/members/workspace/${workspaceId}/me`);
      return response;
    },
    enabled: !!workspaceId,
  });

  const member = query.data?.data.member;
  const role = member?.role;
  const isAdmin = role === MemberRole.ADMIN;
  const isMember = role === MemberRole.MEMBER;

  return {
    ...query,
    member,
    role,
    isAdmin,
    isMember,
  };
};
