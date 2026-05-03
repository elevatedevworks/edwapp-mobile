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
