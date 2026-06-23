import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

export const useRecommendTeam = () => {
  return useMutation({
    mutationFn: async ({ projectId, workspaceId, requirements }: { projectId: string; workspaceId: string; requirements: string[] }) => {
      const response = await apiClient.post('/api/ai/recommend/team', {
        json: { projectId, workspaceId, requirements }
      });
      return response;
    },
    onSuccess: () => toast.success('Team recommendations generated'),
    onError: () => toast.error('Failed to generate team recommendations')
      });
};
