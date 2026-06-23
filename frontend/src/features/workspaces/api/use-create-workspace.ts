import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await apiClient.post('/api/workspaces', { form });

      
      return response;
    },
    onSuccess: () => {
      toast.success('Workspace created.');

      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ['workspaces']
      });
    },
    onError: (error) => {
      console.error('[CREATE_WORKSPACE]: ', error);

      toast.error('Failed to create workspace.');
    }
      });

  return mutation;
};
