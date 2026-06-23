import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { json?: any, param?: any, form?: any, query?: any };

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await apiClient.post('/api/auth/login', { json });

      
      return response;
    },
    onSuccess: () => {
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ['current']
      });
    },
    onError: () => {
      toast.error('Email or Password is incorrect!');
    }
      });

  return mutation;
};
