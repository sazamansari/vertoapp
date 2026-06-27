import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type RequestType = { json: { userId: string } };
type ResponseType = any;

export const useResendOtp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await apiClient.post('/api/auth/resend-otp', { json });
      return response;
    },
    onSuccess: () => {
      toast.success('A new OTP has been sent to your email.');
    },
    onError: (error) => {
      console.error('[RESEND_OTP]: ', error);
      toast.error(error.message || 'Failed to resend OTP');
    }
  });

  return mutation;
};
