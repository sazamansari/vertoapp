import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface useGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: useGetProjectProps) => {
  const query = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get('/api/projects/:projectId', {
        param: { projectId }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
