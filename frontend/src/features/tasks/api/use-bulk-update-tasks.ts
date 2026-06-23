import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await apiClient.post('/api/tasks/bulk-update', { json });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Tasks updated.');

      queryClient.invalidateQueries({
        queryKey: ['workspace-analytics', data.workspaceId],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['project-analytics'],
        exact: false
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', data.workspaceId],
        exact: false
      });
    },
    onError: (error) => {
      console.error('[BULK_UPDATE_TASKS]: ', error);

      toast.error('Failed to update tasks.');
    }
      });

  return mutation;
};
