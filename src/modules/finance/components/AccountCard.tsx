import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../../../components/AppCard';
import { formatCentsAsCurrency } from '../../../utils/formatCurrency';
import { FinanceAccount } from '../types/account.types';

type AccountCardProps = {
  account: FinanceAccount;
  onPress?: () => void;
};

export function AccountCard({ account, onPress }: AccountCardProps) {
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{account.name}</Text>

            <Text style={styles.meta}>
              {account.institution ? `${account.institution} • ` : ''}
              {account.type === 'credit_card' ? 'Credit Card' : account.type}
            </Text>
          </View>

          <View style={styles.balanceGroup}>
            <Text style={styles.balance}>
              {formatCentsAsCurrency(account.currentBalanceCents)}
            </Text>
            <Text style={account.isActive ? styles.active : styles.inactive}>
              {account.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {account.notes ? (
          <Text style={styles.notes}>{account.notes}</Text>
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
  balanceGroup: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  active: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    backgroundColor: '#DCFCE7',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  inactive: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  notes: {
    fontSize: 13,
    color: '#64748B',
  },
});
