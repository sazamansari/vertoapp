import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/lib/api-client';

type ResponseType = any;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await apiClient.post('/api/auth/logout');

      return response;
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries();
    }
      });

  return mutation;
};
