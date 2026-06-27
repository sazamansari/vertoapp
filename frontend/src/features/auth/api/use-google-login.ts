import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;
type RequestType = { credential?: string; accessToken?: string };

export const useGoogleLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/api/auth/google', { json: data });
      return response;
    },
    onSuccess: () => {
      toast.success('Logged in successfully with Google!');
      window.location.href = '/';

      queryClient.invalidateQueries({
        queryKey: ['current']
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to login with Google!');
    }
  });

  return mutation;
};
