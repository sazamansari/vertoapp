import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await apiClient.delete('/api/projects/:projectId', { param });

      
      return response;
    },
    onSuccess: ({ data }) => {
      toast.success('Project deleted.');

      queryClient.invalidateQueries({
        queryKey: ['projects', data.workspaceId],
        exact: true
      });
      queryClient.invalidateQueries({
        queryKey: ['project', data.$id],
        exact: true
      });
    },
    onError: (error) => {
      console.error('[DELETE_PROJECT]: ', error);

      toast.error('Failed to delete project.');
    }
      });

  return mutation;
};
