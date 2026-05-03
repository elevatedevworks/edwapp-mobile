import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../../components/Screen';

export function RemindersScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>Upcoming reminders will show here.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
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
});
