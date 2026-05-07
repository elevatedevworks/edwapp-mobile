import { SelectOption } from '../../../components/AppSelect';

export const accountTypeOptions = [
  'checking',
  'savings',
  'credit_card',
  'cash',
  'other',
] as const;

export type AccountTypeOption = (typeof accountTypeOptions)[number];

export const accountTypeSelectOptions: SelectOption<AccountTypeOption>[] = [
  { label: 'Checking', value: 'checking' },
  { label: 'Savings', value: 'savings' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Cash', value: 'cash' },
  { label: 'Other', value: 'other' },
];

export const activeOptions: SelectOption<'true' | 'false'>[] = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];
