import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { AppSelect, SelectOption } from '../../../components/AppSelect';
import { AppTextInput } from '../../../components/AppTextInput';
import { Screen } from '../../../components/Screen';
import { useCreateAccountMutation } from '../api/accounts.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';

type Props = NativeStackScreenProps<FinanceStackParamList, 'CreateAccount'>;

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

const createAccountSchema = z
  .object({
    name: z.string().min(1, 'Account name is required'),
    type: z.enum(accountTypeOptions),
    institution: z.string().optional(),
    currentBalance: z.string().min(1, 'Current balance is required'),
    isActive: z.enum(['true', 'false']),
    notes: z.string().optional(),
    creditLimit: z.string().optional(),
    statementClosingDay: z.string().optional(),
    paymentDueDay: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.type !== 'credit_card') {
      return;
    }

    if (!values.creditLimit?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['creditLimit'],
        message: 'Credit limit is required for credit cards',
      });
    }

    if (!values.statementClosingDay?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['statementClosingDay'],
        message: 'Statement closing day is required for credit cards',
      });
    }

    if (!values.paymentDueDay?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paymentDueDay'],
        message: 'Payment due day is required for credit cards',
      });
    }
  });

type CreateAccountFormValues = z.infer<typeof createAccountSchema>;

function dollarsToCents(value: string) {
  const normalized = value.replace(/[^0-9.-]/g, '');
  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return Math.round(numberValue * 100);
}

export function CreateAccountScreen({ navigation }: Props) {
  const createAccountMutation = useCreateAccountMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'checking',
      institution: '',
      currentBalance: '',
      isActive: 'true',
      notes: '',
    },
  });

  const selectedAccountType = watch('type');
  const isCreditCard = selectedAccountType === 'credit_card';

  async function onSubmit(values: CreateAccountFormValues) {
    const currentBalanceCents = dollarsToCents(values.currentBalance);

    if (currentBalanceCents === null) {
      setError('currentBalance', {
        message: 'Enter a valid balance',
      });
      return;
    }

    await createAccountMutation.mutateAsync({
      name: values.name.trim(),
      type: values.type,
      institution: values.institution?.trim() || undefined,
      currentBalanceCents,
      isActive: values.isActive === 'true',
      notes: values.notes?.trim() || undefined,

      creditLimitCents:
        values.type === 'credit_card'
          ? dollarsToCents(values.creditLimit ?? '') ?? undefined
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

    navigation.goBack();
  }

  return (
    <Screen headerTitle="Create Account">
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Add a checking, savings, credit card, cash, or other account.
              </Text>
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
                    name="creditLimit"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AppTextInput
                        label="Credit Limit"
                        placeholder="5000.00"
                        keyboardType="decimal-pad"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        error={errors.creditLimit?.message}
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

              {createAccountMutation.error ? (
                <Text style={styles.errorText}>
                  {createAccountMutation.error instanceof Error
                    ? createAccountMutation.error.message
                    : 'Could not create account'}
                </Text>
              ) : null}

              <AppButton
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                isLoading={createAccountMutation.isPending}
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
