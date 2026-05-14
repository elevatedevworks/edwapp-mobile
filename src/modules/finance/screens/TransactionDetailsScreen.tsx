import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { Screen } from '../../../components/Screen';
import { formatCentsAsCurrency } from '../../../utils/formatCurrency';
import { formatDisplayDate } from '../../../utils/formatDate';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { useTransactionQuery } from '../api/transactions.api';

type Props = NativeStackScreenProps<
  FinanceStackParamList,
  'TransactionDetails'
>;

export function TransactionDetailsScreen({ route }: Props) {
  const { transactionId } = route.params;
  const { data, isLoading, error, refetch, isRefetching } =
    useTransactionQuery(transactionId);

  const transaction = data?.data;

  return (
    <Screen headerTitle="Transaction Details">
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load transaction</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : transaction ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>
                {formatCentsAsCurrency(transaction.amountCents)}
              </Text>
              <Text style={styles.subtitle}>{transaction.kind}</Text>
            </View>

            <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Info</Text>

              <InfoRow
                label="Payment Date"
                value={formatDisplayDate(transaction.transactionDate)}
              />
              <InfoRow label="Kind" value={transaction.kind} />
              <InfoRow
                label="Account Id"
                value={transaction.accountId ?? 'Not set'}
              />
              <InfoRow
                label="Counter Party Account Id"
                value={
                  transaction.counterpartyAccountId
                    ? 'Linked'
                    : 'No counter party account linked'
                }
              />
              <InfoRow
                label="Account"
                value={transaction.linkedBillId ? 'Linked' : 'No bill linked'}
              />
            </AppCard>

            {transaction.description ? (
              <AppCard style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.notes}>{transaction.description}</Text>
              </AppCard>
            ) : null}

            {transaction.notes ? (
              <AppCard style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notes}>{transaction.notes}</Text>
              </AppCard>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 16,
  },
  loader: {
    marginTop: 32,
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
    textTransform: 'capitalize',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  notes: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
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
  errorMessage: {
    fontSize: 14,
    color: '#7F1D1D',
  },
  helperText: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
  },
});
