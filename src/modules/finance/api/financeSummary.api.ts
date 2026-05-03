import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import { FinanceSummaryResponse } from '../types/financeSummary.types';

export function useFinanceSummaryQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance-summary'],
    queryFn: () =>
      authenticatedRequest<FinanceSummaryResponse>('/finance/summary'),
  });
}
