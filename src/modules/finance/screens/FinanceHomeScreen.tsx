import React from 'react';
import {
  ActivityIndicator,
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
import { formatDisplayDate } from '../../../utils/formatDate';
import { useFinanceSummaryQuery } from '../api/financeSummary.api';

export function FinanceHomeScreen() {
  const { data, isLoading, error, refetch, isRefetching } =
    useFinanceSummaryQuery();

  const summary = data?.data;

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
              Could not load finance summary
            </Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : summary ? (
          <>
            <View style={styles.grid}>
              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Accounts</Text>
                <Text style={styles.statValue}>{summary.accounts.count}</Text>
                <Text style={styles.statMeta}>
                  {formatCentsAsCurrency(summary.accounts.totalBalanceCents)}
                </Text>
              </AppCard>

              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Active Bills</Text>
                <Text style={styles.statValue}>
                  {summary.bills.activeCount}
                </Text>
                <Text style={styles.statMeta}>
                  {formatCentsAsCurrency(summary.bills.monthlyTotalCents)} / mo
                </Text>
              </AppCard>

              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Recent Payments</Text>
                <Text style={styles.statValue}>
                  {summary.payments.recent.length}
                </Text>
                <Text style={styles.statMeta}>latest activity</Text>
              </AppCard>

              <AppCard style={styles.statCard}>
                <Text style={styles.statLabel}>Reminders</Text>
                <Text style={styles.statValue}>
                  {summary.reminders.upcoming.length}
                </Text>
                <Text style={styles.statMeta}>upcoming</Text>
              </AppCard>
            </View>

            <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Reminders</Text>

              {summary.reminders.upcoming.length === 0 ? (
                <Text style={styles.emptyText}>No upcoming reminders.</Text>
              ) : (
                summary.reminders.upcoming.map(reminder => (
                  <View key={reminder.id} style={styles.listItem}>
                    <View style={styles.listText}>
                      <Text style={styles.itemTitle}>{reminder.title}</Text>
                      <Text style={styles.itemMeta}>
                        {formatDisplayDate(reminder.remindAt)}
                      </Text>
                    </View>

                    <Text style={styles.status}>{reminder.status}</Text>
                  </View>
                ))
              )}
            </AppCard>

            <AppCard style={styles.section}>
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
            </AppCard>
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
    paddingTop: 12,
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
  status: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'capitalize',
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
