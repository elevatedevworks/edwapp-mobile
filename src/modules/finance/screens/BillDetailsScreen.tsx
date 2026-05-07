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
import { useBillQuery } from '../api/bills.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';

type Props = NativeStackScreenProps<FinanceStackParamList, 'BillDetails'>;

export function BillDetailsScreen({ route, navigation }: Props) {
  const { billId } = route.params;
  const { data, isLoading, error, refetch, isRefetching } =
    useBillQuery(billId);

  const bill = data?.data;

  return (
    <Screen headerTitle="Bill Details">
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
            <Text style={styles.errorTitle}>Could not load bill</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : bill ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{bill.name}</Text>
              <Text style={styles.subtitle}>
                {bill.vendor ?? 'No vendor'} • {bill.frequency}
              </Text>
            </View>

            <AppCard style={styles.amountCard}>
              <Text style={styles.label}>Amount Due</Text>
              <Text style={styles.amount}>
                {formatCentsAsCurrency(bill.amountDueCents)}
              </Text>
            </AppCard>

            <AppButton
              title="Edit Bill"
              onPress={() =>
                navigation.navigate('EditBill', {
                  billId: bill.id,
                })
              }
            />

            {bill.accountId ? (
              <AppButton
                title="Record Payment"
                onPress={() =>
                  navigation.navigate('CreatePayment', {
                    billId: bill.id,
                    defaultAccountId: bill.accountId!,
                    amountCents: bill.amountDueCents,
                    direction: 'outflow',
                  })
                }
              />
            ) : (
              <AppCard style={styles.section}>
                <Text style={styles.notes}>
                  This bill needs an account before a payment can be recorded
                </Text>
              </AppCard>
            )}

            <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Bill Info</Text>

              <InfoRow label="Status" value={bill.status} />
              <InfoRow
                label="Due"
                value={
                  bill.dueDate
                    ? formatDisplayDate(bill.dueDate)
                    : bill.dueDayOfMonth
                    ? `Day ${bill.dueDayOfMonth} of each month`
                    : 'Not set'
                }
              />
              <InfoRow label="Autopay" value={bill.autopay ? 'Yes' : 'No'} />
              <InfoRow
                label="Account"
                value={bill.accountId ? 'Linked' : 'No account linked'}
              />
              <InfoRow label="Active" value={bill.isActive ? 'Yes' : 'No'} />
            </AppCard>

            {bill.notes ? (
              <AppCard style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notes}>{bill.notes}</Text>
              </AppCard>
            ) : null}

            <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Recordkeeping</Text>
              <InfoRow
                label="Created"
                value={formatDisplayDate(bill.createdAt)}
              />
              <InfoRow
                label="Updated"
                value={formatDisplayDate(bill.updatedAt)}
              />
            </AppCard>
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
  amountCard: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
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
});
