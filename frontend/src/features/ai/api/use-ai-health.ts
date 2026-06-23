import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export type AiHealthResponse = {
  status: 'online' | 'offline';
  service: string;
};

export const useAiHealth = () => {
  return useQuery<AiHealthResponse, Error>({
    queryKey: ['ai-health'],
    queryFn: async () => {
      const response = await apiClient.get('/api/ai/health');
      return response as AiHealthResponse;
    },
    refetchInterval: 60000, // Check health every 60s
  });
};
