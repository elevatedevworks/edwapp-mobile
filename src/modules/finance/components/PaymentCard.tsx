import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../../../components/AppCard';
import { formatCentsAsCurrency } from '../../../utils/formatCurrency';
import { formatDisplayDate } from '../../../utils/formatDate';
import { Payment } from '../types/payment.types';

type PaymentCardProps = {
  payment: Payment;
  onPress?: () => void;
};

export function PaymentCard({ payment, onPress }: PaymentCardProps) {
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>
              {formatCentsAsCurrency(payment.amountCents)}
            </Text>

            <Text style={styles.meta}>
              {formatDisplayDate(payment.paymentDate)} • {payment.method}
            </Text>
          </View>

          <Text
            style={[
              styles.direction,
              payment.direction === 'outflow' ? styles.outflow : styles.inflow,
            ]}
          >
            {payment.direction}
          </Text>
        </View>

        <View style={styles.badgeRow}>
          {payment.billId ? (
            <Text style={styles.badgeMuted}>Bill linked</Text>
          ) : (
            <Text style={styles.badgeMuted}>No bill</Text>
          )}

          {payment.accountId ? (
            <Text style={styles.badgeMuted}>Account linked</Text>
          ) : (
            <Text style={styles.badgeMuted}>No account</Text>
          )}
        </View>

        {payment.reference ? (
          <Text style={styles.detail}>Ref: {payment.reference}</Text>
        ) : null}

        {payment.notes ? (
          <Text style={styles.notes}>{payment.notes}</Text>
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
