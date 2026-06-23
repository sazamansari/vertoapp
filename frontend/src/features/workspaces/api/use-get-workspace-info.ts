import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface useGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({ workspaceId }: useGetWorkspaceInfoProps) => {
  const query = useQuery({
    queryKey: ['workspace-info', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get('/api/workspaces/:workspaceId/info', {
        param: { workspaceId }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
