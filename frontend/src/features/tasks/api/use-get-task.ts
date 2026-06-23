import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

interface useGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: useGetTaskProps) => {
  const query = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await apiClient.get('/api/tasks/:taskId', {
        param: {
          taskId,
        }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
