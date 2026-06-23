import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type AiInsightsResponse = {
  success: boolean;
  insights: {
    velocity: string;
    riskLevel: string;
    efficiency: string;
    deliveryForecast: string;
  };
};

export const useGetAiInsights = (workspaceId: string) => {
  return useQuery<AiInsightsResponse, Error>({
    queryKey: ['ai-insights', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get('/api/ai/insights', {
        query: { workspaceId }
      });
      return response as AiInsightsResponse;
    },
    enabled: !!workspaceId,
  });
};
