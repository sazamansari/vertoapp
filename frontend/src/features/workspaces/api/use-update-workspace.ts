import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await apiClient.patch('/api/workspaces/:workspaceId', { form, param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Workspace updated.');

      queryClient.invalidateQueries({
        queryKey: ['workspaces']
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[UPDATE_WORKSPACE]: ', error);

      toast.error('Failed to update workspace.');
    }
      });

  return mutation;
};
