import { useCallback } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { apiRequest, ApiError } from './client';

type AuthenticatedApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export function useAuthenticatedApi() {
  const { token, signOut } = useAuth();

  const authenticatedRequest = useCallback(
    async <TResponse>(
      path: string,
      options: AuthenticatedApiOptions = {},
    ): Promise<TResponse> => {
      if (!token) {
        throw new Error('No auth token found');
      }

      try {
        return await apiRequest<TResponse>(path, {
          ...options,
          token,
        });
      } catch (error) {
        if (error instanceof ApiError && error.message.includes('401')) {
          await signOut();
        }

        throw error;
      }
    },
    [token, signOut],
  );

  return { authenticatedRequest };
}
