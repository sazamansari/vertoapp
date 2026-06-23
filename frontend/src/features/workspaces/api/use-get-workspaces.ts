import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await apiClient.get('/api/workspaces');

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
