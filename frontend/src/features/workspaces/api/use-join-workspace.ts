import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await apiClient.post('/api/workspaces/:workspaceId/join', { param, json });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Joined workspace.');

      queryClient.invalidateQueries({
        queryKey: ['workspaces']
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[JOIN_WORKSPACE]: ', error);

      toast.error('Failed to join workspace.');
    }
      });

  return mutation;
};
