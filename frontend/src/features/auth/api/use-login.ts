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
      toast.success('Logged in successfully!');
      window.location.href = '/';

      queryClient.invalidateQueries({
        queryKey: ['current']
      });
    },
    onError: (error: any) => {
      if (error?.data?.requiresVerification && error?.data?.userId) {
        toast.error('Email not verified. Redirecting to verification...');
        router.push(`/sign-up/verify?userId=${error.data.userId}`);
        return;
      }
      toast.error(error.message || 'Email or Password is incorrect!');
    }
      });

  return mutation;
};
