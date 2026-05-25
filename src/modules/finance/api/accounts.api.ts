import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../../../api/useAuthenticatedApi';
import {
  AccountResponse,
  AccountsResponse,
  CreateAccountInput,
  UpdateAccountInput,
} from '../types/account.types';

export function useAccountsQuery() {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'accounts'],
    queryFn: () => authenticatedRequest<AccountsResponse>('/finance/accounts'),
  });
}

export function useAccountQuery(accountId: string) {
  const { authenticatedRequest } = useAuthenticatedApi();

  return useQuery({
    queryKey: ['finance', 'accounts', accountId],
    queryFn: () =>
      authenticatedRequest<AccountResponse>(`/finance/accounts/${accountId}`),
    enabled: Boolean(accountId),
  });
}

export function useCreateAccountMutation() {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateAccountInput) =>
      authenticatedRequest<AccountResponse>('/finance/accounts', {
        method: 'POST',
        body: values,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'reports'] }),
      ]);
    },
  });
}

export function useUpdateAccountMutation(accountId: string) {
  const { authenticatedRequest } = useAuthenticatedApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateAccountInput) =>
      authenticatedRequest<AccountResponse>(`/finance/accounts/${accountId}`, {
        method: 'PATCH',
        body: values,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'accounts', accountId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['finance', 'reports', 'overview'],
        }),
      ]);
    },
  });
}
