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
import { useAccountsQuery } from '../api/accounts.api';
import { AccountCard } from '../components/AccountCard';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { FinanceTabParamList } from '../navigation/FinanceTabs';

type Props = CompositeScreenProps<
  BottomTabScreenProps<FinanceTabParamList, 'Accounts'>,
  NativeStackScreenProps<FinanceStackParamList>
>;

export function AccountsScreen({ navigation }: Props) {
  const { data, isLoading, error, refetch, isRefetching } = useAccountsQuery();

  const accounts = data?.data ?? [];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Accounts</Text>
          <Text style={styles.subtitle}>
            View balances and accounts connected to your finance module.
          </Text>
        </View>

        <AppButton
          title="Create Account"
          onPress={() => navigation.navigate('CreateAccount')}
        />

        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load accounts</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : accounts.length === 0 ? (
          <AppCard style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No accounts yet</Text>
            <Text style={styles.emptyText}>
              Accounts will show here once they are added.
            </Text>
          </AppCard>
        ) : (
          <View style={styles.list}>
            {accounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                onPress={() =>
                  navigation.navigate('AccountDetails', {
                    accountId: account.id,
                  })
                }
              />
            ))}
          </View>
        )}
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
  list: {
    gap: 12,
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
  emptyBox: {
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
});
