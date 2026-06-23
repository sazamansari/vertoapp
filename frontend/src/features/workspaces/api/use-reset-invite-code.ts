import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await apiClient.post('/api/workspaces/:workspaceId/resetInviteCode', { param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Invite code reset.');

      queryClient.invalidateQueries({
        queryKey: ['workspaces']
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[RESET_INVITE_CODE]: ', error);

      toast.error('Failed to reset invite code.');
    }
      });

  return mutation;
};
