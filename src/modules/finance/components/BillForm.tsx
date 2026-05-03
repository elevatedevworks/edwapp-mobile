import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { AppSelect, SelectOption } from '../../../components/AppSelect';
import { AppTextInput } from '../../../components/AppTextInput';
import { Screen } from '../../../components/Screen';
import { FinanceAccount } from '../types/account.types';

const frequencyOptions = [
  'one-time',
  'weekly',
  'monthly',
  'quarterly',
  'annual',
] as const;

export type BillFrequencyOption = (typeof frequencyOptions)[number];

const frequencySelectOptions: SelectOption<BillFrequencyOption>[] = [
  { label: 'One-time', value: 'one-time' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annual', value: 'annual' },
];

const statusOptions: SelectOption<'active' | 'inactive'>[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const autopayOptions: SelectOption<'true' | 'false'>[] = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' },
];

const activeOptions: SelectOption<'true' | 'false'>[] = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

const billFormSchema = z
  .object({
    accountId: z.string().optional(),
    name: z.string().min(1, 'Bill name is required'),
    vendor: z.string().optional(),
    amount: z.string().min(1, 'Amount is required'),
    frequency: z.enum(frequencyOptions),
    dueDayOfMonth: z.string().optional(),
    dueDate: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    autopay: z.enum(['true', 'false']),
    isActive: z.enum(['true', 'false']),
    notes: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.frequency === 'monthly') {
      if (!values.dueDayOfMonth?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['dueDayOfMonth'],
          message: 'Due day of month is required for monthly bills',
        });
      }

      return;
    }

    if (!values.dueDate?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dueDate'],
        message: 'Due date is required for this frequency',
      });
    }
  });

export type BillFormValues = z.infer<typeof billFormSchema>;

export type BillFormSubmitValues = {
  accountId?: string;
  name: string;
  vendor?: string;
  amountDueCents: number;
  dueDate: string | null;
  dueDayOfMonth: number | null;
  frequency: BillFrequencyOption;
  status: 'active' | 'inactive';
  autopay: boolean;
  notes?: string;
  isActive: boolean;
};

type BillFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  accounts: FinanceAccount[];
  isAccountsLoading: boolean;
  initialValues: BillFormValues;
  isSubmitting: boolean;
  submitError?: unknown;
  onSubmit: (values: BillFormSubmitValues) => Promise<void>;
};

function dollarsToCents(value: string) {
  const normalized = value.replace(/[^0-9.]/g, '');
  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return Math.round(numberValue * 100);
}

function parseDueDay(value?: string) {
  if (!value?.trim()) {
    return null;
  }

  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 31) {
    return null;
  }

  return numberValue;
}

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseApiDate(value?: string | null) {
  if (!value) {
    return new Date();
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

export function BillForm({
  title,
  subtitle,
  submitLabel,
  accounts,
  isAccountsLoading,
  initialValues,
  isSubmitting,
  submitError,
  onSubmit,
}: BillFormProps) {
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: initialValues,
  });

  const selectedFrequency = watch('frequency');
  const selectedDueDate = watch('dueDate');

  function handleFrequencyChange(frequency: BillFrequencyOption) {
    setValue('frequency', frequency, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (frequency === 'monthly') {
      setValue('dueDate', '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      setValue('dueDayOfMonth', '', {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (!selectedDueDate) {
        setValue('dueDate', formatDateForApi(new Date()), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }

  function handleDueDateChange(
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) {
    if (Platform.OS === 'android') {
      setShowDueDatePicker(false);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    setValue('dueDate', formatDateForApi(selectedDate), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleFormSubmit(values: BillFormValues) {
    const amountDueCents = dollarsToCents(values.amount);

    if (!amountDueCents || amountDueCents <= 0) {
      setError('amount', {
        message: 'Enter a valid amount',
      });
      return;
    }

    let dueDayOfMonth: number | null = null;
    let dueDate: string | null = null;

    if (values.frequency === 'monthly') {
      dueDayOfMonth = parseDueDay(values.dueDayOfMonth);

      if (!dueDayOfMonth) {
        setError('dueDayOfMonth', {
          message: 'Enter a day between 1 and 31',
        });
        return;
      }
    } else {
      dueDate = values.dueDate || null;

      if (!dueDate) {
        setError('dueDate', {
          message: 'Select a due date',
        });
        return;
      }
    }

    await onSubmit({
      accountId: values.accountId || undefined,
      name: values.name.trim(),
      vendor: values.vendor?.trim() || undefined,
      amountDueCents,
      dueDate,
      dueDayOfMonth,
      frequency: values.frequency,
      status: values.status,
      autopay: values.autopay === 'true',
      notes: values.notes?.trim() || undefined,
      isActive: values.isActive === 'true',
    });
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <AppCard style={styles.card}>
              <Controller
                control={control}
                name="accountId"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label="Linked Account"
                    value={value ?? ''}
                    options={[
                      { label: 'No account', value: '' },
                      ...accounts.map(account => ({
                        label: `${account.name} • ${
                          account.institution ?? account.type
                        }`,
                        value: account.id,
                      })),
                    ]}
                    placeholder={
                      isAccountsLoading
                        ? 'Loading accounts...'
                        : 'Select account'
                    }
                    onChange={onChange}
                    error={errors.accountId?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Bill Name"
                    placeholder="Rent"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="vendor"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Vendor"
                    placeholder="Landlord, Dominion Energy, Verizon"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.vendor?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Amount Due"
                    placeholder="100.00"
                    keyboardType="decimal-pad"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.amount?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="frequency"
                render={({ field: { value } }) => (
                  <AppSelect
                    label="Frequency"
                    value={value}
                    options={frequencySelectOptions}
                    placeholder="Select frequency"
                    onChange={handleFrequencyChange}
                    error={errors.frequency?.message}
                  />
                )}
              />

              {selectedFrequency === 'monthly' ? (
                <Controller
                  control={control}
                  name="dueDayOfMonth"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextInput
                      label="Due Day of Month"
                      placeholder="1"
                      keyboardType="number-pad"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.dueDayOfMonth?.message}
                    />
                  )}
                />
              ) : (
                <View style={styles.fieldGroup}>
                  <Text style={styles.inputLabel}>Due Date</Text>

                  <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDueDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {selectedDueDate || 'Select due date'}
                    </Text>
                  </Pressable>

                  {errors.dueDate?.message ? (
                    <Text style={styles.errorText}>
                      {errors.dueDate.message}
                    </Text>
                  ) : null}

                  {showDueDatePicker ? (
                    <DateTimePicker
                      value={parseApiDate(selectedDueDate)}
                      mode="date"
                      display="default"
                      onChange={handleDueDateChange}
                    />
                  ) : null}
                </View>
              )}

              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label="Status"
                    value={value}
                    options={statusOptions}
                    placeholder="Select status"
                    onChange={onChange}
                    error={errors.status?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="autopay"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label="Autopay"
                    value={value}
                    options={autopayOptions}
                    placeholder="Select autopay"
                    onChange={onChange}
                    error={errors.autopay?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="isActive"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label="Active"
                    value={value}
                    options={activeOptions}
                    placeholder="Select active status"
                    onChange={onChange}
                    error={errors.isActive?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Notes"
                    placeholder="Optional notes"
                    multiline
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.notes?.message}
                    style={styles.notesInput}
                  />
                )}
              />

              {submitError ? (
                <Text style={styles.errorText}>
                  {submitError instanceof Error
                    ? submitError.message
                    : 'Something went wrong'}
                </Text>
              ) : null}

              <AppButton
                title={submitLabel}
                onPress={handleSubmit(handleFormSubmit)}
                isLoading={isSubmitting}
              />
            </AppCard>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  card: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  dateButton: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#0F172A',
  },
  notesInput: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
  },
});
