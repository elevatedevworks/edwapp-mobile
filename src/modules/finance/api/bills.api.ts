import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import {
  BillDetailsResponse,
  BillResponse,
  BillsResponse,
  CreateBillInput,
  UpdateBillInput,
} from '../types/bill.types';

export function useBillsQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'bills'],
    queryFn: () => authenticatedRequest<BillsResponse>('/finance/bills'),
  });
}

export function useBillQuery(billId: string) {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'bills', billId],
    queryFn: () =>
      authenticatedRequest<BillResponse>(`/finance/bills/${billId}`),
    enabled: Boolean(billId),
  });
}

export function useBillDetailsQuery(billId: string) {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'bills', billId, 'details'],
    queryFn: () =>
      authenticatedRequest<BillDetailsResponse>(
        `/finance/bills/${billId}/details`,
      ),
    enabled: Boolean(billId),
  });
}

export function useCreateBillMutation() {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateBillInput) =>
      authenticatedRequest<BillResponse>('/finance/bills', {
        method: 'POST',
        body: values,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'bills'] }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'reports'] }),
      ]);
    },
  });
}

export function useUpdateBillMutation(billId: string) {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateBillInput) =>
      authenticatedRequest<BillResponse>(`/finance/bills/${billId}`, {
        method: 'PATCH',
        body: values,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'bills'] }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'bills', billId],
        }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'summary'] }),
      ]);
    },
  });
}
