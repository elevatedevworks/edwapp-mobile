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
import { useBillsQuery } from '../api/bills.api';
import { BillCard } from '../components/BillCard';

import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { FinanceTabParamList } from '../navigation/FinanceTabs';

type Props = CompositeScreenProps<
  BottomTabScreenProps<FinanceTabParamList, 'Bills'>,
  NativeStackScreenProps<FinanceStackParamList>
>;

export function BillsScreen({ navigation }: Props) {
  const { data, isLoading, error, refetch, isRefetching } = useBillsQuery();

  const bills = data?.data ?? [];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bills</Text>
          <Text style={styles.subtitle}>
            Track recurring bills, due dates, and connected accounts.
          </Text>
        </View>

        <AppButton
          title="Create Bill"
          onPress={() => navigation.navigate('CreateBill')}
        />

        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load bills</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : bills.length === 0 ? (
          <AppCard style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No bills yet</Text>
            <Text style={styles.emptyText}>
              Your active bills will show here once they are added.
            </Text>
          </AppCard>
        ) : (
          <View style={styles.list}>
            {bills.map(bill => (
              <BillCard
                key={bill.id}
                bill={bill}
                onPress={() =>
                  navigation.navigate('BillDetails', { billId: bill.id })
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
