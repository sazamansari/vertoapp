import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await apiClient.post('/api/auth/register', { json });

      
      return response;
    },
    onSuccess: () => {
      toast.success('Account created successfully!');
      window.location.href = '/';

      queryClient.invalidateQueries({
        queryKey: ['current']
      });
    },
    onError: (error) => {
      console.error('[REGISTER]: ', error);

      toast.error(error.message || 'Failed to register!');
    }
      });

  return mutation;
};
