import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { AppSelect, SelectOption } from '../../../components/AppSelect';
import { AppTextInput } from '../../../components/AppTextInput';
import { Screen } from '../../../components/Screen';
import { useAccountQuery, useUpdateAccountMutation } from '../api/accounts.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { FormScreen } from '../../../components/FormScreen';

type Props = NativeStackScreenProps<FinanceStackParamList, 'EditAccount'>;

const accountTypeOptions = [
  'checking',
  'savings',
  'credit_card',
  'cash',
  'other',
] as const;

type AccountTypeOption = (typeof accountTypeOptions)[number];

const accountTypeSelectOptions: SelectOption<AccountTypeOption>[] = [
  { label: 'Checking', value: 'checking' },
  { label: 'Savings', value: 'savings' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Cash', value: 'cash' },
  { label: 'Other', value: 'other' },
];

const activeOptions: SelectOption<'true' | 'false'>[] = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

const editAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  type: z.enum(accountTypeOptions),
  institution: z.string().optional(),
  currentBalance: z.string().min(1, 'Current balance is required'),
  isActive: z.enum(['true', 'false']),
  notes: z.string().optional(),
});

type EditAccountFormValues = z.infer<typeof editAccountSchema>;

function dollarsToCents(value: string) {
  const normalized = value.replace(/[^0-9.-]/g, '');
  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return Math.round(numberValue * 100);
}

function isValidAccountType(value: string): value is AccountTypeOption {
  return (
    value === 'checking' ||
    value === 'savings' ||
    value === 'credit_card' ||
    value === 'cash' ||
    value === 'other'
  );
}

export function EditAccountScreen({ route, navigation }: Props) {
  const { accountId } = route.params;

  const { data, isLoading, error } = useAccountQuery(accountId);
  const updateAccountMutation = useUpdateAccountMutation(accountId);

  const account = data?.data;

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (error || !account) {
    return (
      <Screen>
        <View style={styles.content}>
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load account</Text>
            <Text style={styles.errorText}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
          </AppCard>
        </View>
      </Screen>
    );
  }

  const defaultValues: EditAccountFormValues = {
    name: account.name,
    type: isValidAccountType(account.type) ? account.type : 'other',
    institution: account.institution ?? '',
    currentBalance: (account.currentBalanceCents / 100).toFixed(2),
    isActive: account.isActive ? 'true' : 'false',
    notes: account.notes ?? '',
  };

  return (
    <EditAccountForm
      defaultValues={defaultValues}
      isSubmitting={updateAccountMutation.isPending}
      submitError={updateAccountMutation.error}
      onSubmit={async values => {
        const currentBalanceCents = dollarsToCents(values.currentBalance);

        if (currentBalanceCents === null) {
          return {
            field: 'currentBalance' as const,
            message: 'Enter a valid balance',
          };
        }

        await updateAccountMutation.mutateAsync({
          name: values.name.trim(),
          type: values.type,
          institution: values.institution?.trim() || undefined,
          currentBalanceCents,
          isActive: values.isActive === 'true',
          notes: values.notes?.trim() || undefined,
        });

        navigation.goBack();

        return null;
      }}
    />
  );
}

type EditAccountFormProps = {
  defaultValues: EditAccountFormValues;
  isSubmitting: boolean;
  submitError?: unknown;
  onSubmit: (
    values: EditAccountFormValues,
  ) => Promise<{ field: keyof EditAccountFormValues; message: string } | null>;
};

function EditAccountForm({
  defaultValues,
  isSubmitting,
  submitError,
  onSubmit,
}: EditAccountFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues,
  });

  async function handleFormSubmit(values: EditAccountFormValues) {
    const result = await onSubmit(values);

    if (result) {
      setError(result.field, {
        message: result.message,
      });
    }
  }

  return (
    <FormScreen>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Account</Text>
        <Text style={styles.subtitle}>
          Update account balance, type, institution, or status.
        </Text>
      </View>

      <AppCard style={styles.card}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Account Name"
              placeholder="Checking"
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
              placeholder="Chase, Truliant, Capital One"
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
              placeholder="1250.00"
              keyboardType="decimal-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.currentBalance?.message}
            />
          )}
        />

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
              : 'Could not update account'}
          </Text>
        ) : null}

        <AppButton
          title="Save Changes"
          onPress={handleSubmit(handleFormSubmit)}
          isLoading={isSubmitting}
          style={styles.submitButton}
        />
      </AppCard>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
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
  notesInput: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  errorBox: {
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 48,
  },
});
