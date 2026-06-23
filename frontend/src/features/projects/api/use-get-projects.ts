import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface useGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  const query = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get('/api/projects', {
        query: { workspaceId }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
