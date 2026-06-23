import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await apiClient.post('/api/tasks', { json });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Task created.');

      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics', data.workspaceId],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics', data.projectId],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', data.workspaceId],
        exact: false
      });
    },
    onError: (error) => {
      console.error('[CREATE_TASK]: ', error);

      toast.error('Failed to create task.');
    }
      });

  return mutation;
};
