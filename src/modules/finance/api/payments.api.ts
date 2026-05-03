import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import {
  CreatePaymentInput,
  PaymentResponse,
  PaymentsResponse,
  UpdatePaymentInput,
} from '../types/payment.types';

export function usePaymentsQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'payments'],
    queryFn: () => authenticatedRequest<PaymentsResponse>('/finance/payments'),
  });
}

export function usePaymentQuery(paymentId: string, enabled = true) {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'payments', paymentId],
    queryFn: () =>
      authenticatedRequest<PaymentResponse>(`/finance/payments/${paymentId}`),
    enabled: Boolean(paymentId) && enabled,
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

/**
 * Backend TODO:
 * Add PATCH /finance/payments/:paymentId before enabling this in the UI.
 */
export function useUpdatePaymentMutation(paymentId: string) {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdatePaymentInput) =>
      authenticatedRequest<PaymentResponse>(`/finance/payments/${paymentId}`, {
        method: 'PATCH',
        body: values,
      }),
    onSuccess: async data => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'payments'] }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'payments', paymentId],
        }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'summary'] }),
        data.data.billId
          ? queryClient.invalidateQueries({
              queryKey: ['finance', 'bills', data.data.billId],
            })
          : Promise.resolve(),
      ]);
    },
  });
}
