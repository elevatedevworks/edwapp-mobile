import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BillForm,
  BillFormSubmitValues,
  BillFormValues,
} from '../components/BillForm';
import { useAccountsQuery } from '../api/accounts.api';
import { useCreateBillMutation } from '../api/bills.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';

type Props = NativeStackScreenProps<FinanceStackParamList, 'CreateBill'>;

const initialValues: BillFormValues = {
  accountId: '',
  name: '',
  vendor: '',
  amount: '',
  dueDayOfMonth: '',
  dueDate: '',
  frequency: 'monthly',
  status: 'active',
  autopay: 'false',
  isActive: 'true',
  notes: '',
};

export function CreateBillScreen({ navigation }: Props) {
  const { data: accountsData, isLoading: isAccountsLoading } =
    useAccountsQuery();
  const accounts = accountsData?.data ?? [];

  const createBillMutation = useCreateBillMutation();

  async function handleSubmit(values: BillFormSubmitValues) {
    const response = await createBillMutation.mutateAsync({
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
    });

    navigation.replace('BillDetails', {
      billId: response.data.id,
    });
  }

  return (
    <BillForm
      title="Create Bill"
      subtitle="Add a recurring bill and optionally link it to an account."
      submitLabel="Create Bill"
      accounts={accounts}
      isAccountsLoading={isAccountsLoading}
      initialValues={initialValues}
      isSubmitting={createBillMutation.isPending}
      submitError={createBillMutation.error}
      onSubmit={handleSubmit}
    />
  );
}
