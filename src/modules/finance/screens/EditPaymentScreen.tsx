import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCard } from '../../../components/AppCard';
import { Screen } from '../../../components/Screen';
import { FinanceStackParamList } from '../navigation/FinanceStack';

type Props = NativeStackScreenProps<FinanceStackParamList, 'EditPayment'>;

export function EditPaymentScreen({ route }: Props) {
  const { paymentId } = route.params;

  return (
    <Screen headerTitle="Edit Payment">
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Payment</Text>
          <Text style={styles.subtitle}>
            This screen is ready for the payment update endpoint.
          </Text>
        </View>

        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Backend endpoint needed</Text>
          <Text style={styles.cardText}>
            Add PATCH /finance/payments/{paymentId} on the server, then wire
            this screen to update amount, date, method, reference, account,
            bill, and notes.
          </Text>

          <Text style={styles.meta}>Payment ID: {paymentId}</Text>
        </AppCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
  card: {
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  meta: {
    fontSize: 13,
    color: '#64748B',
  },
});
