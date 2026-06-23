'use server';

import { getSessionCookie } from '@/lib/auth';
import { AUTH_COOKIE } from '@/features/auth/constants';

export const getWorkspaces = async () => {
  try {
    const session = await getSessionCookie();
    if (!session) return { documents: [], total: 0 };

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/workspaces`, {
      method: 'GET',
      headers: {
        'Cookie': `${AUTH_COOKIE}=${session}`,
      },
    });

    if (!response.ok) return { documents: [], total: 0 };

    const { data } = await response.json();
    return data;
  } catch {
    return { documents: [], total: 0 };
  }
};
