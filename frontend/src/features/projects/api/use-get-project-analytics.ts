import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

export type ProjectAnalyticsResponseType = any; export type WorkspaceAnalyticsResponseType = any;

export const useGetProjectAnalytics = ({ projectId }: UseGetProjectAnalyticsProps) => {
  const query = useQuery({
    queryKey: ['project-analytics', projectId],
    queryFn: async () => {
      const response = await apiClient.get('/api/projects/:projectId/analytics', {
        param: { projectId }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
