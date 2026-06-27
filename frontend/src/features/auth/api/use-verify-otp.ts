import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type RequestType = { json: { userId: string; otp: string } };
type ResponseType = any;

export const useVerifyOtp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await apiClient.post('/api/auth/verify-otp', { json });
      return response;
    },
    onSuccess: () => {
      toast.success('Email verified successfully!');
      router.push('/');
      
      queryClient.invalidateQueries({
        queryKey: ['current']
      });
    },
    onError: (error) => {
      console.error('[VERIFY_OTP]: ', error);
      toast.error(error.message || 'Failed to verify OTP');
    }
  });

  return mutation;
};
