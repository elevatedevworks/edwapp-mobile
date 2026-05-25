import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import {
  CreateTransactionInput,
  TransactionResponse,
  TransactionsResponse,
} from '../types/transactions.types';

export function useTransactionsQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'transactions'],
    queryFn: () =>
      authenticatedRequest<TransactionsResponse>('/finance/transactions'),
  });
}

export function useTransactionQuery(transactionId: string, enabled = true) {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'transactions', transactionId],
    queryFn: () =>
      authenticatedRequest<TransactionResponse>(
        `/finance/transactions/${transactionId}`,
      ),
    enabled: Boolean(transactionId) && enabled,
  });
}

export function useCreateTransactionMutation() {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateTransactionInput) =>
      authenticatedRequest<TransactionResponse>('/finance/transactions', {
        method: 'POST',
        body: values,
      }),
    onSuccess: async _data => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['finance', 'transactions'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'accounts'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'bills'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'reports'],
        }),
      ]);
    },
  });
}
