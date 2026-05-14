import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../../../components/AppCard';
import { formatCentsAsCurrency } from '../../../utils/formatCurrency';
import { formatDisplayDate } from '../../../utils/formatDate';
import { Transaction } from '../types/transactions.types';

type TransactionCardProps = {
  transaction: Transaction;
  onPress?: () => void;
};

export function TransactionCard({
  transaction,
  onPress,
}: TransactionCardProps) {
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>
              {formatCentsAsCurrency(transaction.amountCents)}
            </Text>

            <Text style={styles.meta}>
              {formatDisplayDate(transaction.transactionDate)} •{' '}
              {transaction.kind}
            </Text>
          </View>

          <Text
            style={[
              styles.direction,
              transaction.kind === 'expense' ? styles.outflow : styles.inflow,
            ]}
          >
            {transaction.kind}
          </Text>
        </View>

        {transaction.description ? (
          <Text style={styles.detail}>Ref: {transaction.description}</Text>
        ) : null}

        {transaction.notes ? (
          <Text style={styles.notes}>{transaction.notes}</Text>
        ) : null}
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  meta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  direction: {
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
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeMuted: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  detail: {
    fontSize: 13,
    color: '#334155',
  },
  notes: {
    fontSize: 13,
    color: '#64748B',
  },
});
