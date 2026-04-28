import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedApi } from './useAuthenticatedApi';
import { DashboardSummaryResponse } from '../types/dashboard.types';

export function useDashboardQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () =>
      authenticatedRequest<DashboardSummaryResponse>('/finance/summary'),
  });
}
