import { useQuery } from '@tanstack/react-query';

import type { TaskStatus } from '@/features/tasks/types';
import { apiClient } from '@/lib/api-client';

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export const useGetTasks = ({ workspaceId, projectId, status, search, assigneeId, dueDate }: useGetTasksProps) => {
  const query = useQuery({
    queryKey: ['tasks', workspaceId, projectId, status, search, assigneeId, dueDate],
    queryFn: async () => {
      const response = await apiClient.get('/api/tasks', {
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
        }
      });

      
      const { data } = response;

      return data;
    }
      });

  return query;
};
