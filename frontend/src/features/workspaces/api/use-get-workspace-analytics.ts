import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export type ProjectAnalyticsResponseType = any; export type WorkspaceAnalyticsResponseType = any;

export const useGetWorkspaceAnalytics = ({ workspaceId }: UseGetWorkspaceAnalyticsProps) => {
  const query = useQuery({
    queryKey: ['workspace-analytics', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get('/api/workspaces/:workspaceId/analytics', {
        param: { workspaceId }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
