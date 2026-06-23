import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await apiClient.delete('/api/members/:memberId', { param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Member deleted.');

      queryClient.invalidateQueries({
        queryKey: ['members', data.workspaceId],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[DELETE_MEMBER]: ', error);

      toast.error('Failed to delete member.');
    }
      });

  return mutation;
};
