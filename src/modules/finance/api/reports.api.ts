import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import { ReportsOverviewResponse } from '../types/reports.types';

export function useReportsOverviewQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'reports', 'overview'],
    queryFn: () =>
      authenticatedRequest<ReportsOverviewResponse>(
        '/finance/reports/overview',
      ),
  });
}
