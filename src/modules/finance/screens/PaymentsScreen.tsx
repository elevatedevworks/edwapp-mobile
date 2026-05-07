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
import { PaymentCard } from '../components/PaymentCard';
import { usePaymentsQuery } from '../api/payments.api';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { FinanceTabParamList } from '../navigation/FinanceTabs';

type Props = CompositeScreenProps<
  BottomTabScreenProps<FinanceTabParamList, 'Payments'>,
  NativeStackScreenProps<FinanceStackParamList>
>;

export function PaymentsScreen({ navigation }: Props) {
  const { data, isLoading, error, refetch, isRefetching } = usePaymentsQuery();

  const payments = data?.data ?? [];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>
            Review bill payments and financial activity.
          </Text>
        </View>

        <AppButton
          title="Add Income"
          onPress={() =>
            navigation.navigate('CreatePayment', {
              defaultAccountId: null,
              billId: null,
              amountCents: undefined,
              direction: 'inflow',
            })
          }
        />

        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load payments</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : payments.length === 0 ? (
          <AppCard style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No payments yet</Text>
            <Text style={styles.emptyText}>
              Payments will show here once they are recorded.
            </Text>
          </AppCard>
        ) : (
          <View style={styles.list}>
            {payments.map(payment => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onPress={() =>
                  navigation.navigate('PaymentDetails', {
                    paymentId: payment.id,
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
