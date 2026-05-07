export type AccountType =
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'cash'
  | 'other'
  | string;

export type FinanceAccount = {
  id: string;
  name: string;
  type: AccountType;
  institution: string | null;
  currentBalanceCents: number;
  creditLimitCents: number | null;
  statementClosingDay: number | null;
  paymentDueDay: number | null;
  isActive: boolean;
  notes: string | null;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountsResponse = {
  data: FinanceAccount[];
};

export type AccountResponse = {
  data: FinanceAccount;
};

export type CreateAccountInput = {
  name: string;
  type: string;
  institution?: string;
  currentBalanceCents: number;
  creditLimitCents?: number;
  statementClosingDay?: number;
  paymentDueDay?: number;
  isActive: boolean;
  notes?: string;
};

export type UpdateAccountInput = {
  name: string;
  type: string;
  institution?: string;
  currentBalanceCents: number;
  isActive: boolean;
  notes?: string;
};
