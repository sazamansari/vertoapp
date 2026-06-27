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
    onSuccess: (data) => {
      toast.success('OTP sent to your email!');
      
      const userId = data?.userId;
      if (userId) {
        router.push(`/sign-up/verify?userId=${userId}`);
      } else {
        router.push('/');
      }

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
