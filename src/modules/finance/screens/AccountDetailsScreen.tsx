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
import { useAccountQuery } from '../api/accounts.api';
import { FinanceStackParamList } from '../navigation/FinanceStack';

type Props = NativeStackScreenProps<FinanceStackParamList, 'AccountDetails'>;

export function AccountDetailsScreen({ route, navigation }: Props) {
  const { accountId } = route.params;
  const { data, isLoading, error, refetch, isRefetching } =
    useAccountQuery(accountId);

  const account = data?.data;

  return (
    <Screen>
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
            <Text style={styles.errorTitle}>Could not load account</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : account ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{account.name}</Text>
              <Text style={styles.subtitle}>
                {account.institution ?? 'No institution'} • {account.type}
              </Text>
            </View>

            <AppCard style={styles.balanceCard}>
              <Text style={styles.label}>Current Balance</Text>
              <Text style={styles.balance}>
                {formatCentsAsCurrency(account.currentBalanceCents)}
              </Text>
            </AppCard>

            <AppButton
              title="Edit Account"
              onPress={() =>
                navigation.navigate('EditAccount', {
                  accountId: account.id,
                })
              }
            />

            <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Account Info</Text>

              <InfoRow label="Type" value={account.type} />
              <InfoRow
                label="Institution"
                value={account.institution ?? 'Not set'}
              />
              <InfoRow
                label="Status"
                value={account.isActive ? 'Active' : 'Inactive'}
              />
            </AppCard>

            {account.notes ? (
              <AppCard style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notes}>{account.notes}</Text>
              </AppCard>
            ) : null}

            <AppCard style={styles.section}>
              <Text style={styles.sectionTitle}>Recordkeeping</Text>
              <InfoRow
                label="Created"
                value={formatDisplayDate(account.createdAt)}
              />
              <InfoRow
                label="Updated"
                value={formatDisplayDate(account.updatedAt)}
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
  balanceCard: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  balance: {
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
