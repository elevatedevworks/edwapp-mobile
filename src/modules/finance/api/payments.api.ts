import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import {
  CreatePaymentInput,
  PaymentResponse,
  PaymentsResponse,
} from '../types/payment.types';

export function usePaymentsQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'payments'],
    queryFn: () => authenticatedRequest<PaymentsResponse>('/finance/payments'),
  });
}

export function useCreatePaymentMutation() {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreatePaymentInput) =>
      authenticatedRequest<PaymentResponse>('/finance/payments', {
        method: 'POST',
        body: values,
      }),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'payments'] }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'summary'] }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'bills'] }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'bills', variables.billId],
        }),
      ]);
    },
  });
}
