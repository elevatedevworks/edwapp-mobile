import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AccountForm,
  AccountFormSubmitValues,
  AccountFormValues,
} from '../components/AccountForm';
import { useCreateAccountMutation } from '../api/accounts.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';

type Props = NativeStackScreenProps<FinanceStackParamList, 'CreateAccount'>;

const initialValues: AccountFormValues = {
  name: '',
  type: 'checking',
  institution: '',
  currentBalance: '',
  isActive: 'true',
  notes: '',
  creditLimitCents: '',
  statementClosingDay: '',
  paymentDueDay: '',
};

export function CreateAccountScreen({ navigation }: Props) {
  const createAccountMutation = useCreateAccountMutation();

  async function handleSubmit(values: AccountFormSubmitValues) {
    await createAccountMutation.mutateAsync({
      name: values.name,
      type: values.type,
      institution: values.institution,
      currentBalanceCents: values.currentBalanceCents,
      isActive: values.isActive,
      notes: values.notes,
      creditLimitCents: values.creditLimitCents,
      statementClosingDay: values.statementClosingDay,
      paymentDueDay: values.paymentDueDay,
    });

    navigation.goBack();
  }

  return (
    <AccountForm
      title="Create Account"
      subtitle="Add a checking, savings, credit card, cash, or other account."
      submitLabel="Create Account"
      initialValues={initialValues}
      isSubmitting={createAccountMutation.isPending}
      submitError={createAccountMutation.error}
      onSubmit={handleSubmit}
    />
  );
}
