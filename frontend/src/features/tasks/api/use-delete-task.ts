import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await apiClient.delete('/api/tasks/:taskId', { param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Task deleted.');

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
      queryClient.invalidateQueries({
        queryKey: ['task', data.$id],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[DELETE_TASK]: ', error);

      toast.error('Failed to delete task.');
    }
      });

  return mutation;
};
