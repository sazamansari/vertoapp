import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await apiClient.patch('/api/projects/:projectId', { form, param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Project updated.');

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['project', data.$id],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['tasks', data.workspaceId, data.$id],
        exact: false
      });
    },
    onError: (error) => {
      console.error('[UPDATE_PROJECT]: ', error);

      toast.error('Failed to update project.');
    }
      });

  return mutation;
};
