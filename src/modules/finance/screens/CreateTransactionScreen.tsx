import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FinanceStackParamList } from '../navigation/FinanceStack';
import { useCreateTransactionMutation } from '../api/transactions.api';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dollarsToCents, getTodayDateString } from '../utils/finance.utils';
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
import { Screen } from '../../../components/Screen';
import { AppCard } from '../../../components/AppCard';
import { AppTextInput } from '../../../components/AppTextInput';
import { AppSelect } from '../../../components/AppSelect';
import { useAccountsQuery } from '../api/accounts.api';
import { AppButton } from '../../../components/AppButton';
import {
  transactionKindOptions,
  transactionKindSelectOptions,
} from '../constants/transaction.constants';

type Props = NativeStackScreenProps<FinanceStackParamList, 'CreateTransaction'>;

const createTransactionSchema = z.object({
  kind: z.enum(transactionKindOptions),
  accountId: z.string().min(1, 'Account is required'),
  counterpartyAccountId: z.string().optional(),
  linkedBillId: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
  transactionDate: z.string().min(1, 'Transaction date is required'),
  description: z.string().min(1, 'Description is required'),
  notes: z.string().optional(),
});

type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;

export function CreateTransactionScreen({ navigation }: Props) {
  const createTransactionMutation = useCreateTransactionMutation();

  const { data: accountsData, isLoading: isAccountsLoading } =
    useAccountsQuery();
  const accounts = accountsData?.data ?? [];

  // const { data: counterpartyAccountsData, isLoading: isCounterpartyAccountsLoading } =
  //   useAccountsQuery();
  // const counterpartyAccounts = counterpartyAccountsData?.data ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      kind: 'expense',
      accountId: '',
      counterpartyAccountId: '',
      linkedBillId: '',
      amount: '',
      transactionDate: getTodayDateString(),
      description: '',
      notes: '',
    },
  });

  const selectedTransactionKind = watch('kind');
  const isTransfer = selectedTransactionKind === 'transfer';

  const isIncome = selectedTransactionKind === 'income';

  async function onSubmit(values: CreateTransactionFormValues) {
    const amountCents = dollarsToCents(values.amount);

    if (!amountCents || amountCents <= 0) {
      setError('amount', {
        message: 'Enter a valid payment amount',
      });
      return;
    }

    console.log('Values', values);
    console.log('Amount Cents', amountCents);

    await createTransactionMutation.mutateAsync({
      kind: values.kind,
      accountId: values.accountId,
      counterpartyAccountId: values.counterpartyAccountId?.trim() || undefined,
      linkedBillId: values.linkedBillId || undefined,
      amountCents,
      transactionDate: values.transactionDate,
      description: values.description,
      notes: values.notes,
    });

    navigation.goBack();
  }

  return (
    <Screen headerTitle="Create Transaction">
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
              <Text style={styles.title}>Create Transaction</Text>
              <Text style={styles.subtitle}>
                Record a transaction (expense, income, transfer)
              </Text>
            </View>

            <AppCard style={styles.card}>
              <Controller
                control={control}
                name="kind"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label="Type"
                    value={value}
                    options={transactionKindSelectOptions}
                    placeholder="Select transaction type"
                    onChange={onChange}
                    error={errors.kind?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Amount"
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
                name="transactionDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Transaction Date"
                    placeholder="YYYY-MM-DD"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.transactionDate?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="accountId"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label={isIncome ? 'To Account' : 'From Account'}
                    value={value}
                    options={accounts.map(account => ({
                      label: `${account.name} • ${
                        account.institution ?? account.type
                      }`,
                      value: account.id,
                    }))}
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

              {isTransfer ? (
                <Controller
                  control={control}
                  name="counterpartyAccountId"
                  render={({ field: { onChange, value } }) => (
                    <AppSelect
                      label="Account"
                      value={value}
                      options={accounts.map(account => ({
                        label: `${account.name} • ${
                          account.institution ?? account.type
                        }`,
                        value: account.id,
                      }))}
                      placeholder={
                        isAccountsLoading
                          ? 'Loading accounts...'
                          : 'Select account'
                      }
                      onChange={onChange}
                      error={errors.counterpartyAccountId?.message}
                    />
                  )}
                />
              ) : null}

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Description"
                    placeholder="Enter Description"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.description?.message}
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

              {createTransactionMutation.error ? (
                <Text style={styles.errorText}>
                  {createTransactionMutation.error instanceof Error
                    ? createTransactionMutation.error.message
                    : 'Could not create payment'}
                </Text>
              ) : null}
              <AppButton
                title="Create Transaction"
                onPress={handleSubmit(onSubmit)}
                isLoading={createTransactionMutation.isPending}
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
    height: 96,
    textAlignVertical: 'top',
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: 20,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
  },
});
