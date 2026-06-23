import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

export const useAnalyzePerformance = () => {
  return useMutation({
    mutationFn: async ({ workspaceId, memberId }: { workspaceId: string; memberId: string }) => {
      const response = await apiClient.post('/api/ai/analyze/performance', {
        json: { workspaceId, memberId }
      });
      return response;
    },
    onSuccess: () => toast.success('Performance analysis complete'),
    onError: () => toast.error('Failed to analyze performance')
      });
};
