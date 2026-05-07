import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { Controller, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
// import { AppSelect } from '../../../components/AppSelect';
// import { AppTextInput } from '../../../components/AppTextInput';
import { Screen } from '../../../components/Screen';
import { useAccountQuery, useUpdateAccountMutation } from '../api/accounts.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';
// import { FormScreen } from '../../../components/FormScreen';
// import { dollarsToCents } from '../utils/finance.utils';
import { AccountTypeOption } from '../constants/account.constants';
import {
  AccountForm,
  AccountFormSubmitValues,
  AccountFormValues,
} from '../components/AccountForm';

type Props = NativeStackScreenProps<FinanceStackParamList, 'EditAccount'>;

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

  const initialValues: AccountFormValues = {
    name: account.name,
    type: isValidAccountType(account.type) ? account.type : 'other',
    institution: account.institution ?? '',
    currentBalance: (account.currentBalanceCents / 100).toFixed(2),
    creditLimitCents:
      account.creditLimitCents !== null &&
      account.creditLimitCents !== undefined
        ? (account.creditLimitCents / 100).toFixed(2)
        : '',
    statementClosingDay:
      account.statementClosingDay !== null &&
      account.statementClosingDay !== undefined
        ? String(account.statementClosingDay)
        : '',
    paymentDueDay:
      account.paymentDueDay !== null && account.paymentDueDay !== undefined
        ? String(account.paymentDueDay)
        : '',
    isActive: account.isActive ? 'true' : 'false',
    notes: account.notes ?? '',
  };

  async function handleSubmit(values: AccountFormSubmitValues) {
    await updateAccountMutation.mutateAsync({
      name: values.name,
      type: values.type,
      institution: values.institution,
      currentBalanceCents: values.currentBalanceCents,
      creditLimitCents: values.creditLimitCents,
      statementClosingDay: values.statementClosingDay,
      paymentDueDay: values.paymentDueDay,
      isActive: values.isActive,
      notes: values.notes,
    });

    navigation.goBack();
  }

  return (
    <AccountForm
      title="Edit Account"
      subtitle="Update account balance, type, institution, or status."
      submitLabel="Save Changes"
      initialValues={initialValues}
      isSubmitting={updateAccountMutation.isPending}
      submitError={updateAccountMutation.error}
      onSubmit={handleSubmit}
    />
  );

  // return (
  //   <EditAccountForm
  //     defaultValues={defaultValues}
  //     isSubmitting={updateAccountMutation.isPending}
  //     submitError={updateAccountMutation.error}
  //     onSubmit={async values => {
  //       const currentBalanceCents = dollarsToCents(values.currentBalance);

  //       if (currentBalanceCents === null) {
  //         return {
  //           field: 'currentBalance' as const,
  //           message: 'Enter a valid balance',
  //         };
  //       }

  //       await updateAccountMutation.mutateAsync({
  //         name: values.name.trim(),
  //         type: values.type,
  //         institution: values.institution?.trim() || undefined,
  //         currentBalanceCents,
  //         isActive: values.isActive === 'true',
  //         notes: values.notes?.trim() || undefined,
  //       });

  //       navigation.goBack();

  //       return null;
  //     }}
  //   />
  // );
}

// type EditAccountFormProps = {
//   defaultValues: EditAccountFormValues;
//   isSubmitting: boolean;
//   submitError?: unknown;
//   onSubmit: (
//     values: EditAccountFormValues,
//   ) => Promise<{ field: keyof EditAccountFormValues; message: string } | null>;
// };

// function EditAccountForm({
//   defaultValues,
//   isSubmitting,
//   submitError,
//   onSubmit,
// }: EditAccountFormProps) {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm<EditAccountFormValues>({
//     resolver: zodResolver(editAccountSchema),
//     defaultValues,
//   });

//   async function handleFormSubmit(values: EditAccountFormValues) {
//     const result = await onSubmit(values);

//     if (result) {
//       setError(result.field, {
//         message: result.message,
//       });
//     }
//   }

//   return (
//     <FormScreen headerTitle="Edit Account">
//       <View style={styles.header}>
//         <Text style={styles.title}>Edit Account</Text>
//         <Text style={styles.subtitle}>
//           Update account balance, type, institution, or status.
//         </Text>
//       </View>

//       <AppCard style={styles.card}>
//         <Controller
//           control={control}
//           name="name"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <AppTextInput
//               label="Account Name"
//               placeholder="Checking"
//               value={value}
//               onBlur={onBlur}
//               onChangeText={onChange}
//               error={errors.name?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="type"
//           render={({ field: { onChange, value } }) => (
//             <AppSelect
//               label="Account Type"
//               value={value}
//               options={accountTypeSelectOptions}
//               placeholder="Select account type"
//               onChange={onChange}
//               error={errors.type?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="institution"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <AppTextInput
//               label="Institution"
//               placeholder="Chase, Truliant, Capital One"
//               value={value}
//               onBlur={onBlur}
//               onChangeText={onChange}
//               error={errors.institution?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="currentBalance"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <AppTextInput
//               label="Current Balance"
//               placeholder="1250.00"
//               keyboardType="decimal-pad"
//               value={value}
//               onBlur={onBlur}
//               onChangeText={onChange}
//               error={errors.currentBalance?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="isActive"
//           render={({ field: { onChange, value } }) => (
//             <AppSelect
//               label="Status"
//               value={value}
//               options={activeOptions}
//               placeholder="Select status"
//               onChange={onChange}
//               error={errors.isActive?.message}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="notes"
//           render={({ field: { onChange, onBlur, value } }) => (
//             <AppTextInput
//               label="Notes"
//               placeholder="Optional notes"
//               multiline
//               value={value}
//               onBlur={onBlur}
//               onChangeText={onChange}
//               error={errors.notes?.message}
//               style={styles.notesInput}
//             />
//           )}
//         />

//         {submitError ? (
//           <Text style={styles.errorText}>
//             {submitError instanceof Error
//               ? submitError.message
//               : 'Could not update account'}
//           </Text>
//         ) : null}

//         <AppButton
//           title="Save Changes"
//           onPress={handleSubmit(handleFormSubmit)}
//           isLoading={isSubmitting}
//           style={styles.submitButton}
//         />
//       </AppCard>
//     </FormScreen>
//   );
// }

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
