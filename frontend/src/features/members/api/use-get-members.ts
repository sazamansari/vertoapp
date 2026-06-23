import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get('/api/members', { query: { workspaceId } });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
