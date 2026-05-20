import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../../../components/AppCard';
import { formatCentsAsCurrency } from '../../../utils/formatCurrency';
import { BillInstance } from '../types/bill-instances.types';

type BillInstanceCardProps = {
  billInstance: BillInstance;
  onPress?: () => void;
};

export function BillInstanceCard({
  billInstance,
  onPress,
}: BillInstanceCardProps) {
  const dueText = billInstance.dueDate
    ? `Due ${billInstance.dueDate}`
    : 'No due date set';

  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{billInstance.amountDueCents}</Text>
            <Text style={styles.meta}>{dueText}</Text>
          </View>

          <View style={styles.amountGroup}>
            <Text style={styles.amount}>
              {formatCentsAsCurrency(billInstance.amountDueCents)}
            </Text>
            <Text
              style={[
                styles.status,
                billInstance.status === 'paid' ? styles.paid : styles.unpaid,
              ]}
            >
              {billInstance.status}
            </Text>
          </View>
        </View>

        {billInstance.notes ? (
          <Text style={styles.notes}>{billInstance.notes}</Text>
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
  },
  amountGroup: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  notes: {
    fontSize: 13,
    color: '#64748B',
  },
  unpaid: {
    color: '#991B1B',
    backgroundColor: '#FEE2E2',
  },
  paid: {
    color: '#166534',
    backgroundColor: '#DCFCE7',
  },
});
