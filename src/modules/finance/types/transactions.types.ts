export type TransactionKind =
  | 'expense'
  | 'income'
  | 'transfer'
  | 'adjustment'
  | 'credit_card_purchase'
  | string;

export type Transaction = {
  id: string;
  ownerUserId: string;
  kind: TransactionKind;
  accountId: string;
  counterpartyAccountId: string | null;
  linkedBillId: string | null;
  amountCents: number;
  transactionDate: string;
  description: string;
  notes: string | null;
};

export type TransactionsResponse = {
  data: Transaction[];
};

export type TransactionResponse = {
  data: Transaction;
};

export type CreateTransactionInput = {
  kind: TransactionKind;
  accountId: string;
  counterpartyAccountId?: string | null;
  linkedBillId?: string | null;
  amountCents: number;
  transactionDate: string;
  description: string;
  notes?: string;
};
