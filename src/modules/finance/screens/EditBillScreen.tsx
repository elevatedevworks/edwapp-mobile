import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCard } from '../../../components/AppCard';
import { Screen } from '../../../components/Screen';
import {
  BillForm,
  BillFormSubmitValues,
  BillFormValues,
} from '../components/BillForm';
import { useAccountsQuery } from '../api/accounts.api';
import { useBillQuery, useUpdateBillMutation } from '../api/bills.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { BillFrequencyOption } from '../components/BillForm';

type Props = NativeStackScreenProps<FinanceStackParamList, 'EditBill'>;

function isValidFrequency(value: string): value is BillFrequencyOption {
  return (
    value === 'one-time' ||
    value === 'weekly' ||
    value === 'monthly' ||
    value === 'quarterly' ||
    value === 'annual'
  );
}

export function EditBillScreen({ route, navigation }: Props) {
  const { billId } = route.params;

  const {
    data: billData,
    isLoading: isBillLoading,
    error: billError,
  } = useBillQuery(billId);

  const { data: accountsData, isLoading: isAccountsLoading } =
    useAccountsQuery();
  const accounts = accountsData?.data ?? [];

  const updateBillMutation = useUpdateBillMutation(billId);

  const bill = billData?.data;

  if (isBillLoading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (billError || !bill) {
    return (
      <Screen>
        <View style={styles.content}>
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load bill</Text>
            <Text style={styles.errorText}>
              {billError instanceof Error ? billError.message : 'Unknown error'}
            </Text>
          </AppCard>
        </View>
      </Screen>
    );
  }

  const initialValues: BillFormValues = {
    accountId: bill.accountId ?? '',
    name: bill.name,
    vendor: bill.vendor ?? '',
    amount: (bill.amountDueCents / 100).toFixed(2),
    dueDayOfMonth: bill.dueDayOfMonth ? String(bill.dueDayOfMonth) : '',
    dueDate: bill.dueDate ?? '',
    frequency: isValidFrequency(bill.frequency) ? bill.frequency : 'monthly',
    status: bill.status === 'inactive' ? 'inactive' : 'active',
    autopay: bill.autopay ? 'true' : 'false',
    isActive: bill.isActive ? 'true' : 'false',
    notes: bill.notes ?? '',
  };

  async function handleSubmit(values: BillFormSubmitValues) {
    await updateBillMutation.mutateAsync({
      accountId: values.accountId,
      name: values.name,
      vendor: values.vendor,
      amountDueCents: values.amountDueCents,
      dueDate: values.dueDate,
      dueDayOfMonth: values.dueDayOfMonth,
      frequency: values.frequency,
      status: values.status,
      autopay: values.autopay,
      notes: values.notes,
      isActive: values.isActive,
    });

    navigation.goBack();
  }

  return (
    <BillForm
      title="Edit Bill"
      subtitle="Update this bill's amount, schedule, account, or status."
      submitLabel="Save Changes"
      accounts={accounts}
      isAccountsLoading={isAccountsLoading}
      initialValues={initialValues}
      isSubmitting={updateBillMutation.isPending}
      submitError={updateBillMutation.error}
      onSubmit={handleSubmit}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
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
});
