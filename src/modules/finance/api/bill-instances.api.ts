import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import {
  BillInstanceResponse,
  BillInstancesResponse,
  CreateBillInstanceInput,
} from '../types/bill-instances.types';

export function useBillInstancesQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'bill-instances'],
    queryFn: () =>
      authenticatedRequest<BillInstancesResponse>('/finance/bill-instances'),
  });
}

export function useBillInstanceQuery(billInstanceId: string) {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'bill-instance', billInstanceId],
    queryFn: () =>
      authenticatedRequest<BillInstanceResponse>(
        `/finance/bill-instances/${billInstanceId}`,
      ),
    enabled: Boolean(billInstanceId),
  });
}

export function useCreateBillInstanceMutation() {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateBillInstanceInput) =>
      authenticatedRequest<BillInstanceResponse>('/finance/bill-instances', {
        method: 'POST',
        body: values,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['finance', 'bill-instances'],
        }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'reports'] }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'bills'] }),
      ]);
    },
  });
}
