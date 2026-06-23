import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface useGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
  const query = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get('/api/workspaces/:workspaceId', {
        param: { workspaceId }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
