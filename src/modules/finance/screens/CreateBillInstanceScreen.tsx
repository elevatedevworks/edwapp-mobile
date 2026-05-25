import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import {
  BillInstanceForm,
  BillInstanceFormSubmitValues,
  BillInstanceFormValues,
} from '../components/BillInstanceForm';
import { useCreateBillInstanceMutation } from '../api/bill-instances.api';

type Props = NativeStackScreenProps<
  FinanceStackParamList,
  'CreateBillInstance'
>;

const initialValues: BillInstanceFormValues = {
  periodYear: '',
  periodMonth: '',
  dueDate: '',
  amountDueCents: '',
  notes: '',
};

export function CreateBillInstanceScreen({ route, navigation }: Props) {
  const { billId } = route.params;

  const createBillInstanceMutation = useCreateBillInstanceMutation();

  async function handleSubmit(values: BillInstanceFormSubmitValues) {
    console.log(values);
    await createBillInstanceMutation.mutateAsync({
      billId,
      periodYear: values.periodYear,
      periodMonth: values.periodMonth,
      dueDate: values.dueDate,
      amountDueCents: values.amountDueCents,
      notes: values.notes,
    });

    navigation.goBack();
  }

  return (
    <BillInstanceForm
      title="Create Bill Instance"
      subtitle="Add a recurring bill and optionally link it to an account."
      submitLabel="Create Bill Instance"
      billId={billId}
      initialValues={initialValues}
      isSubmitting={createBillInstanceMutation.isPending}
      submitError={createBillInstanceMutation.error}
      onSubmit={handleSubmit}
    />
  );
}
