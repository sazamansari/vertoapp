import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ['current'],
    queryFn: async () => {
      const response = await apiClient.get('/api/auth/current');

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
