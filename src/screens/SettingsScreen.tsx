import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Screen } from '../components/Screen';

export function SettingsScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your EDW Mobile session</Text>
        </View>

        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Signed in as</Text>
          <Text style={styles.name}>{user?.name ?? 'Unknown user'}</Text>
          <Text style={styles.meta}>{user?.email}</Text>
          <Text style={styles.meta}>Role: {user?.role}</Text>
        </AppCard>

        <View style={styles.spacer} />

        <AppButton title="Sign Out" onPress={signOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 16,
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
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  meta: {
    fontSize: 14,
    color: '#64748B',
  },
  spacer: {
    flex: 1,
  },
});
