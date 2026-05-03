import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { AppCard } from '../components/AppCard';
import { Screen } from '../components/Screen';

export function HomeScreen() {
  const { user } = useAuth();

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>
            {user ? `Welcome, ${user.name}` : 'Welcome back'}
          </Text>
        </View>

        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Finance</Text>
          <Text style={styles.cardText}>
            Your finance module is active. Open the drawer and choose Finance to
            view bills, payments, accounts, and reminders.
          </Text>
        </AppCard>

        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Life Lessons</Text>
          <Text style={styles.cardText}>
            Coming later: notes, topics, reflections, and lessons learned.
          </Text>
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
    gap: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});
