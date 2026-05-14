import { SelectOption } from '../../../components/AppSelect';

export const frequencyOptions = [
  'one-time',
  'weekly',
  'monthly',
  'quarterly',
  'annual',
] as const;

export type BillFrequencyOption = (typeof frequencyOptions)[number];

export const frequencySelectOptions: SelectOption<BillFrequencyOption>[] = [
  { label: 'One-time', value: 'one-time' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annual', value: 'annual' },
];

export const statusOptions: SelectOption<'active' | 'inactive'>[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const autopayOptions: SelectOption<'true' | 'false'>[] = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' },
];

export const activeOptions: SelectOption<'true' | 'false'>[] = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];
