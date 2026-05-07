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
import { AppTextInput } from '../../../components/AppTextInput';
import { Screen } from '../../../components/Screen';
import { useCreatePaymentMutation } from '../api/payments.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { useAccountsQuery } from '../api/accounts.api';
import { AppSelect } from '../../../components/AppSelect';
import { dollarsToCents } from '../utils/finance.utils';

type Props = NativeStackScreenProps<FinanceStackParamList, 'CreatePayment'>;

const createPaymentSchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  amount: z.string().min(1, 'Amount is required'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  method: z.string().min(1, 'Method is required'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function CreatePaymentScreen({ route, navigation }: Props) {
  const {
    billId,
    defaultAccountId,
    amountCents: initialAmountCents,
    direction,
  } = route.params;
  const createPaymentMutation = useCreatePaymentMutation();
  const { data: accountsData, isLoading: isAccountsLoading } =
    useAccountsQuery();
  const accounts = accountsData?.data ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      accountId: defaultAccountId ?? '',
      amount: initialAmountCents ? (initialAmountCents / 100).toFixed(2) : '',
      paymentDate: getTodayDateString(),
      method: direction === 'inflow' ? 'deposit' : 'cash',
      reference: '',
      notes: '',
    },
  });

  async function onSubmit(values: CreatePaymentFormValues) {
    const amountCents = dollarsToCents(values.amount);

    if (!amountCents || amountCents <= 0) {
      setError('amount', {
        message: 'Enter a valid payment amount',
      });
      return;
    }

    await createPaymentMutation.mutateAsync({
      accountId: values.accountId,
      billId: billId ?? null,
      amountCents,
      paymentDate: values.paymentDate,
      direction,
      method: values.method.trim(),
      reference: values.reference?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
    });

    navigation.goBack();
  }

  return (
    <Screen headerTitle="Create Payment">
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
              <Text style={styles.title}>
                {direction === 'inflow' ? 'Add Income' : 'Record Payment'}
              </Text>
              <Text style={styles.subtitle}>
                {direction === 'inflow'
                  ? 'Record income deposited into an account.'
                  : 'Record a bill payment from an account.'}
              </Text>
            </View>

            <AppCard style={styles.card}>
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
                name="paymentDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Payment Date"
                    placeholder="YYYY-MM-DD"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.paymentDate?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="accountId"
                render={({ field: { onChange, value } }) => (
                  <AppSelect
                    label={
                      direction === 'inflow'
                        ? 'Deposit To Account'
                        : 'Payment Account'
                    }
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

              <Controller
                control={control}
                name="method"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Method"
                    placeholder="cash, card, ach, check"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.method?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="reference"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    label="Reference"
                    placeholder="Confirmation number"
                    autoCapitalize="none"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={errors.reference?.message}
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

              {createPaymentMutation.error ? (
                <Text style={styles.errorText}>
                  {createPaymentMutation.error instanceof Error
                    ? createPaymentMutation.error.message
                    : 'Could not create payment'}
                </Text>
              ) : null}

              <AppButton
                title={direction === 'inflow' ? 'Save Income' : 'Save Payment'}
                onPress={handleSubmit(onSubmit)}
                isLoading={createPaymentMutation.isPending}
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
