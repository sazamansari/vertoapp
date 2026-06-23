import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await apiClient.delete('/api/workspaces/:workspaceId', { param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Workspace deleted.');

      queryClient.invalidateQueries({
        queryKey: ['workspaces']
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[DELETE_WORKSPACE]: ', error);

      toast.error('Failed to delete workspace.');
    }
      });

  return mutation;
};
