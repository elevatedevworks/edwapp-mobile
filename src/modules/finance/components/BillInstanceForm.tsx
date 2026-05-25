import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { AppTextInput } from '../../../components/AppTextInput';
import { FormScreen } from '../../../components/FormScreen';
import { dollarsToCents } from '../utils/finance.utils';
import { AppDatePicker } from '../../../components/AppDatePicker';

const billInstanceFormSchema = z.object({
  periodYear: z.string().min(1, 'Year is required'),
  periodMonth: z.string().min(1, 'Month is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  amountDueCents: z.string().min(1, 'Amount is required'),
  amountPaidCents: z.string().optional(),
  notes: z.string().optional(),
});

export type BillInstanceFormValues = z.infer<typeof billInstanceFormSchema>;

export type BillInstanceFormSubmitValues = {
  billId: string;
  periodYear: number;
  periodMonth: number;
  amountDueCents: number;
  amountPaidCents?: number;
  dueDate: string;
  notes?: string;
};

type BillInstanceFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  billId: string;
  initialValues: BillInstanceFormValues;
  isSubmitting: boolean;
  submitError?: unknown;
  onSubmit: (values: BillInstanceFormSubmitValues) => Promise<void>;
};

function parsePeriodMonth(value: string) {
  if (!value?.trim()) {
    return 0;
  }

  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 1 || numberValue > 12) {
    return 0;
  }

  return numberValue;
}

function parsePeriodYear(value: string) {
  if (!value?.trim()) {
    return 0;
  }

  const numberValue = Number(value);

  if (
    !Number.isInteger(numberValue) ||
    numberValue < 2000 ||
    numberValue > 2100
  ) {
    return 0;
  }

  return numberValue;
}

export function BillInstanceForm({
  title,
  subtitle,
  submitLabel,
  billId,
  initialValues,
  isSubmitting,
  submitError,
  onSubmit,
}: BillInstanceFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<BillInstanceFormValues>({
    resolver: zodResolver(billInstanceFormSchema),
    defaultValues: initialValues,
  });

  const selectedDueDate = watch('dueDate');

  async function handleFormSubmit(values: BillInstanceFormValues) {
    const amountDueCents = dollarsToCents(values.amountDueCents);

    if (!amountDueCents || amountDueCents <= 0) {
      setError('amountDueCents', {
        message: 'Enter a valid amount',
      });
      return;
    }

    let periodMonth: number = parsePeriodMonth(values.periodMonth);
    let periodYear: number = parsePeriodYear(values.periodYear);

    await onSubmit({
      billId,
      periodYear,
      periodMonth,
      dueDate: values.dueDate,
      amountDueCents,
      notes: values.notes?.trim() || undefined,
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
          name="periodMonth"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Month"
              placeholder="1"
              keyboardType="number-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.periodMonth?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="periodYear"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Year"
              placeholder="1"
              keyboardType="number-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.periodYear?.message}
            />
          )}
        />

        <AppDatePicker
          label="Due Date"
          value={selectedDueDate}
          placeholder="Select due date"
          onDateChange={value =>
            setValue('dueDate', value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          error={errors.dueDate?.message}
        />

        <Controller
          control={control}
          name="amountDueCents"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Amount Due"
              placeholder="100.00"
              keyboardType="decimal-pad"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={errors.amountDueCents?.message}
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
        />
      </AppCard>
    </FormScreen>
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
  fieldGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  dateButton: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#0F172A',
  },
  notesInput: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 14,
    marginBottom: 60,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
  },
});
