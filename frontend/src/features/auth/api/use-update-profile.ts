import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface UpdateProfileProps {
  json: {
    name?: string;
    imageUrl?: string;
  };
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ json }: UpdateProfileProps) => {
      const response = await apiClient.patch('/api/auth/profile', { json });
      return response;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['current'] });
    },
    onError: () => {
      toast.error('Failed to update profile.');
    }
  });
};
