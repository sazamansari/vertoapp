import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api-client';

export const usePredictCompletion = () => {
  return useMutation({
    mutationFn: async ({ taskId, workspaceId, projectId }: { taskId: string; workspaceId: string; projectId: string }) => {
      const response = await apiClient.post('/api/ai/predict/completion', {
        json: { taskId, workspaceId, projectId }
      });
      return response;
    },
    onSuccess: () => toast.success('Prediction generated'),
    onError: () => toast.error('Failed to generate prediction')
      });
};
