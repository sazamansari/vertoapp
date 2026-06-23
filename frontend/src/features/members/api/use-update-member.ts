import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await apiClient.patch('/api/members/:memberId', { param, json });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Member updated.');

      queryClient.invalidateQueries({
        queryKey: ['members', data.workspaceId],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[UPDATE_MEMBER]: ', error);

      toast.error('Failed to update member.');
    }
      });

  return mutation;
};
