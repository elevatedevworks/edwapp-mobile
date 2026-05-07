import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { AppSelect } from '../../../components/AppSelect';
import { AppTextInput } from '../../../components/AppTextInput';
import { FormScreen } from '../../../components/FormScreen';
import { dollarsToCents } from '../utils/finance.utils';
import {
  AccountTypeOption,
  accountTypeOptions,
  accountTypeSelectOptions,
  activeOptions,
} from '../constants/account.constants';

const accountFormSchema = z
  .object({
    name: z.string().min(1, 'Account name is required'),
    type: z.enum(accountTypeOptions),
    institution: z.string().optional(),
    currentBalance: z.string().min(1, 'Current balance is required'),
    isActive: z.enum(['true', 'false']),
    notes: z.string().optional(),
    creditLimitCents: z.string().optional(),
    statementClosingDay: z.string().optional(),
    paymentDueDay: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.type !== 'credit_card') {
      return;
    }

    const creditLimitCents = dollarsToCents(values.creditLimitCents ?? '');

    if (creditLimitCents === null || creditLimitCents <= 0) {
      context.addIssue({
        code: 'custom',
        path: ['creditLimit'],
        message: 'Enter a valid credit limit',
      });
    }

    const statementClosingDay = Number(values.statementClosingDay);

    if (
      !Number.isInteger(statementClosingDay) ||
      statementClosingDay < 1 ||
      statementClosingDay > 31
    ) {
      context.addIssue({
        code: 'custom',
        path: ['statementClosingDay'],
        message: 'Enter a day between 1 and 31',
      });
    }

    const paymentDueDay = Number(values.paymentDueDay);

    if (
      !Number.isInteger(paymentDueDay) ||
      paymentDueDay < 1 ||
      paymentDueDay > 31
    ) {
      context.addIssue({
        code: 'custom',
        path: ['paymentDueDay'],
        message: 'Enter a day between 1 and 31',
      });
    }
  });

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export type AccountFormSubmitValues = {
  name: string;
  type: AccountTypeOption;
  institution?: string;
  currentBalanceCents: number;
  isActive: boolean;
  notes?: string;
  creditLimitCents?: number;
  statementClosingDay?: number;
  paymentDueDay?: number;
};

type AccountFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  initialValues: AccountFormValues;
  isSubmitting: boolean;
  submitError?: unknown;
  onSubmit: (values: AccountFormSubmitValues) => Promise<void>;
};

export function AccountForm({
  title,
  subtitle,
  submitLabel,
  initialValues,
  isSubmitting,
  submitError,
  onSubmit,
}: AccountFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: initialValues,
  });

  const selectedAccountType = watch('type');
  const isCreditCard = selectedAccountType === 'credit_card';

  async function handleFormSubmit(values: AccountFormValues) {
    const currentBalanceCents = dollarsToCents(values.currentBalance);

    if (currentBalanceCents === null) {
      setError('currentBalance', {
        message: 'Enter a valid balance',
      });
      return;
    }

    const creditLimitCents =
      values.type === 'credit_card'
        ? dollarsToCents(values.creditLimitCents ?? '')
        : null;

    await onSubmit({
      name: values.name.trim(),
      type: values.type,
      institution: values.institution?.trim() || undefined,
      currentBalanceCents,
      isActive: values.isActive === 'true',
      notes: values.notes?.trim() || undefined,
      creditLimitCents:
        values.type === 'credit_card' && creditLimitCents !== null
          ? creditLimitCents
          : undefined,
      statementClosingDay:
        values.type === 'credit_card'
          ? Number(values.statementClosingDay)
          : undefined,
      paymentDueDay:
        values.type === 'credit_card'
          ? Number(values.paymentDueDay)
          : undefined,
    });
  }

  return (
    <FormScreen headerTitle={title}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <AppCard style={styles.card}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Account Name"
              placeholder="Enter Account Name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <AppSelect
              label="Account Type"
              value={value}
              options={accountTypeSelectOptions}
              placeholder="Select account type"
              onChange={onChange}
              error={errors.type?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="institution"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Institution"
              placeholder="Enter Institution"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.institution?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="currentBalance"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Current Balance"
              placeholder="Enter balance"
              keyboardType="decimal-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.currentBalance?.message}
            />
          )}
        />

        {isCreditCard ? (
          <>
            <Controller
              control={control}
              name="creditLimitCents"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextInput
                  label="Credit Limit"
                  placeholder="5000.00"
                  keyboardType="decimal-pad"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.creditLimitCents?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="statementClosingDay"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextInput
                  label="Statement Closing Day"
                  placeholder="15"
                  keyboardType="number-pad"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.statementClosingDay?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="paymentDueDay"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextInput
                  label="Payment Due Day"
                  placeholder="1"
                  keyboardType="number-pad"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.paymentDueDay?.message}
                />
              )}
            />
          </>
        ) : null}

        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <AppSelect
              label="Status"
              value={value}
              options={activeOptions}
              placeholder="Select status"
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
          style={styles.submitButton}
        />
      </AppCard>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
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
  notesInput: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  submitButton: {
    marginTop: 48,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
  },
});
