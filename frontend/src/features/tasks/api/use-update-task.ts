import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await apiClient.patch('/api/tasks/:taskId', { json, param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Task updated.');

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
      console.error('[UPDATE_TASK]: ', error);

      toast.error('Failed to update task.');
    }
      });

  return mutation;
};
