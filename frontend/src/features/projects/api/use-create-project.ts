import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await apiClient.post('/api/projects', { form });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Project created.');

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[CREATE_PROJECT]: ', error);

      toast.error('Failed to create project.');
    }
      });

  return mutation;
};
