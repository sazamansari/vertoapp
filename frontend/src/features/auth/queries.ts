'use server';

import { getSessionCookie } from '@/lib/auth';
import { AUTH_COOKIE } from '@/features/auth/constants';

export const getCurrent = async () => {
  try {
    const session = await getSessionCookie();
    if (!session) return null;

    const API_URL = process.env.INTERNAL_API_URL || 'http://localhost:5001';
    const response = await fetch(`${API_URL}/api/auth/current`, {
      method: 'GET',
      headers: {
        'Cookie': `${AUTH_COOKIE}=${session}`,
      },
    });

    if (!response.ok) return null;

    const { data } = await response.json();
    return data;
  } catch {
    return null;
  }
};
