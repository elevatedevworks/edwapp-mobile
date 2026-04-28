import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { AppButton } from '../components/AppButton';
import { Screen } from '../components/Screen';
import { useDashboardQuery } from '../api/dashboard.api';
import { AppCard } from '../components/AppCard';
import { formatCentsAsCurrency } from '../utils/formatCurrency';
import { formatDisplayDate } from '../utils/formatDate';

export function DashboardScreen() {
  const { user, signOut } = useAuth();
  const { data, isLoading, error, refetch } = useDashboardQuery();

  const summary = data?.data;

  return (
    <Screen>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Dashboard</Text>

          <Text style={styles.subtitle}>
            {user ? `Welcome, ${user.name}` : 'Welcome back'}
          </Text>

          {isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : error ? (
            <AppCard style={styles.errorBox}>
              <Text style={styles.errorTitle}>Could not load dashboard</Text>
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
                    {formatCentsAsCurrency(summary.bills.monthlyTotalCents)}
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
                        <Text>{formatDisplayDate(reminder.remindAt)}</Text>
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
                      <Text style={styles.status}>{payment.direction}</Text>
                    </View>
                  ))
                )}
              </AppCard>
            </>
          ) : null}

          <AppButton
            title="Sign Out"
            onPress={signOut}
            style={styles.signOut}
          />
        </View>
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  loader: {
    marginTop: 32,
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
    fontSize: 16,
    color: '#7F1D1D',
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
    fontWeight: '600',
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
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'capitalize',
  },
  signOut: {
    marginTop: 8,
  },
});
