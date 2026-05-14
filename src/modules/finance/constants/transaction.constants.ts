import { SelectOption } from '../../../components/AppSelect';

export const transactionKindOptions = [
  'expense',
  'income',
  'transfer',
  'adjustment',
  'credit_card_purchase',
] as const;

export type TransactionKindOption = (typeof transactionKindOptions)[number];

export const transactionKindSelectOptions: SelectOption<TransactionKindOption>[] =
  [
    { label: 'Expense', value: 'expense' },
    { label: 'Income', value: 'income' },
    { label: 'Transfer', value: 'transfer' },
    { label: 'Adjustment', value: 'adjustment' },
    { label: 'Credit Card Purchase', value: 'credit_card_purchase' },
  ];
