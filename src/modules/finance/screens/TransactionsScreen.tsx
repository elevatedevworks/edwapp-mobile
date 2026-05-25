import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FinanceTabParamList } from '../navigation/FinanceTabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FinanceStackParamList } from '../navigation/FinanceStack';
import { useTransactionsQuery } from '../api/transactions.api';
import { Screen } from '../../../components/Screen';
import { AppButton } from '../../../components/AppButton';
import { AppCard } from '../../../components/AppCard';
import { TransactionCard } from '../components/TransactionCard';

type Props = CompositeScreenProps<
  BottomTabScreenProps<FinanceTabParamList, 'Transactions'>,
  NativeStackScreenProps<FinanceStackParamList>
>;

export function TransactionsScreen({ navigation }: Props) {
  const { data, isLoading, error, refetch, isRefetching } =
    useTransactionsQuery();

  const transactions = data?.data ?? [];
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Review transactions</Text>
        </View>

        <AppButton
          title="Add Transaction"
          onPress={() => navigation.navigate('CreateTransaction')}
        />

        {isLoading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <AppCard style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not load transactions</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </Text>
            <AppButton title="Try Again" onPress={() => refetch()} />
          </AppCard>
        ) : transactions.length === 0 ? (
          <AppCard style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptyText}>
              Transactions will show here once they are recorded.
            </Text>
          </AppCard>
        ) : (
          <View style={styles.list}>
            {transactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() =>
                  navigation.navigate('TransactionDetails', {
                    transactionId: transaction.id,
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
