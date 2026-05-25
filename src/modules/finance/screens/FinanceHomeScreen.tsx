import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { Screen } from '../../../components/Screen';
import { formatCentsAsCurrency } from '../../../utils/formatCurrency';
import { useReportsOverviewQuery } from '../api/reports.api';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { FinanceTabParamList } from '../navigation/FinanceTabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../navigation/FinanceStack';

type Props = CompositeScreenProps<
  BottomTabScreenProps<FinanceTabParamList, 'Overview'>,
  NativeStackScreenProps<FinanceStackParamList>
>;

export function FinanceHomeScreen({ navigation }: Props) {
  const { data, isLoading, error, refetch, isRefetching } =
    useReportsOverviewQuery();

  const overview = data?.data;

  console.log(overview?.upcomingBills);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Finance</Text>
          <Text style={styles.subtitle}>
            Bills, payments, accounts, and upcoming reminders.
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              Could not load finance overview
            </Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : overview ? (
          <>
            <View style={styles.grid}>
              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Accounts</Text>
                <Text style={styles.statValue}>{overview.accounts.count}</Text>
                <Text style={styles.statMeta}>
                  {formatCentsAsCurrency(overview.accounts.totalBalanceCents)}
                </Text>
              </AppCard>

              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Active Bills</Text>
                <Text style={styles.statValue}>
                  {overview.bills.activeCount}
                </Text>
                <Text style={styles.statMeta}>
                  {formatCentsAsCurrency(overview.bills.monthlyTotalCents)} / mo
                </Text>
              </AppCard>

              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Cash Flow</Text>
                <Text style={styles.statValue}>
                  {formatCentsAsCurrency(overview.cashFlow.netCents)}
                </Text>
                <Text style={styles.statMeta}>
                  In: {formatCentsAsCurrency(overview.cashFlow.inflowCents)}
                </Text>
                <Text style={styles.statMeta}>
                  Out: {formatCentsAsCurrency(overview.cashFlow.outflowCents)}
                </Text>
              </AppCard>

              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Credit Cards</Text>
                <Text style={styles.statValue}>
                  {formatCentsAsCurrency(
                    overview.creditCards.totalCurrentCreditBalanceCents,
                  )}
                </Text>
                <Text style={styles.statMeta}>
                  Avail:{' '}
                  {formatCentsAsCurrency(
                    overview.creditCards.totalAvailableCreditCents,
                  )}
                </Text>
                <Text style={styles.statMeta}>
                  {formatCentsAsCurrency(
                    overview.creditCards.totalAvailableCreditCents,
                  )}
                </Text>
              </AppCard>
            </View>

            <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Bills</Text>

              {overview.upcomingBills.length === 0 ? (
                <Text style={styles.emptyText}>No upcoming bills.</Text>
              ) : (
                overview.upcomingBills.map(bill => (
                  <Pressable
                    key={bill.billId}
                    onPress={() =>
                      navigation.navigate('BillDetails', {
                        billId: bill.billId,
                      })
                    }
                  >
                    <View style={styles.listItem}>
                      <View style={styles.listText}>
                        <Text style={styles.itemTitle}>{bill.billName}</Text>
                        <Text style={styles.itemMeta}>{bill.dueDate}</Text>
                      </View>
                      <View style={styles.upcomingStatus}>
                        <Text style={styles.status}>{bill.status}</Text>
                        {bill.status === 'unpaid' && (
                          <Text style={styles.statusAmount}>
                            {formatCentsAsCurrency(bill.amountDueCents)}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))
              )}
            </AppCard>

            {/* <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Payments</Text>

              {summary.payments.recent.length === 0 ? (
                <Text style={styles.emptyText}>No recent payments.</Text>
              ) : (
                summary.payments.recent.map(payment => (
                  <View key={payment.id} style={styles.listItem}>
                    <View style={styles.listText}>
                      <Text style={styles.itemTitle}>
                        {formatCentsAsCurrency(payment.amountCents)}
                      </Text>
                      <Text style={styles.itemMeta}>
                        {payment.method} •{' '}
                        {formatDisplayDate(payment.paymentDate)}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.paymentDirection,
                        payment.direction === 'outflow'
                          ? styles.outflow
                          : styles.inflow,
                      ]}
                    >
                      {payment.direction}
                    </Text>
                  </View>
                ))
              )}
            </AppCard> */}
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
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
  loader: {
    marginTop: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    minHeight: 118,
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  statMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    paddingBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 12,
  },
  listText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  upcomingStatus: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'capitalize',
  },
  statusAmount: {
    marginTop: 5,
  },
  paymentDirection: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  outflow: {
    color: '#991B1B',
    backgroundColor: '#FEE2E2',
  },
  inflow: {
    color: '#166534',
    backgroundColor: '#DCFCE7',
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
