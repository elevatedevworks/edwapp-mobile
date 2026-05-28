// src/screens/DeveloperSettingsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import {
  API_URLS,
  type ApiEnvironment,
  getApiEnvironment,
  setApiEnvironment,
} from '../config/apiEnvironment';
import { useAuth } from '../auth/AuthProvider';

// Adjust this import to match your actual auth hook/context location

export function DeveloperSettingsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [apiEnv, setApiEnv] = useState<ApiEnvironment>('mac');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canAccessDeveloperSettings =
    user?.role === 'admin' || user?.role === 'internal';

  const isUsingPi = apiEnv === 'pi';

  useEffect(() => {
    async function loadSavedEnvironment() {
      try {
        const savedEnv = await getApiEnvironment();
        setApiEnv(savedEnv);
      } catch (error) {
        console.error('Failed to load API environment:', error);
        Alert.alert(
          'Developer Settings Error',
          'Could not load the saved API environment.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (canAccessDeveloperSettings) {
      loadSavedEnvironment();
    } else {
      setIsLoading(false);
    }
  }, [canAccessDeveloperSettings]);

  async function handleToggle(value: boolean) {
    const nextEnv: ApiEnvironment = value ? 'pi' : 'mac';

    try {
      setIsSaving(true);

      await setApiEnvironment(nextEnv);
      setApiEnv(nextEnv);

      queryClient.clear();

      Alert.alert(
        'API Environment Updated',
        `The app is now using the ${nextEnv.toUpperCase()} API.`,
      );
    } catch (error) {
      console.error('Failed to update API environment:', error);

      Alert.alert(
        'Update Failed',
        'Could not update the API environment. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading developer settings...</Text>
      </View>
    );
  }

  if (!canAccessDeveloperSettings) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Developer Settings</Text>

        <View style={styles.card}>
          <Text style={styles.warningTitle}>Access Denied</Text>
          <Text style={styles.description}>
            You do not have permission to access developer settings.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Developer Settings</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textGroup}>
            <Text style={styles.label}>Use Pi API</Text>

            <Text style={styles.description}>
              Switch between your Mac development server and your Pi server.
            </Text>
          </View>

          <Switch
            value={isUsingPi}
            onValueChange={handleToggle}
            disabled={isSaving}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.detailLabel}>Current Environment</Text>
          <Text style={styles.detailValue}>{apiEnv.toUpperCase()}</Text>

          <Text style={styles.detailLabel}>Current API URL</Text>
          <Text style={styles.urlValue}>{API_URLS[apiEnv]}</Text>
        </View>

        {isSaving && (
          <View style={styles.savingRow}>
            <ActivityIndicator size="small" />
            <Text style={styles.savingText}>Saving...</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.noteTitle}>Note</Text>
        <Text style={styles.description}>
          Switching API environments clears cached app data so the screens
          reload from the selected backend.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textGroup: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  details: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  detailValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  urlValue: {
    marginTop: 4,
    fontSize: 13,
    color: '#334155',
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  savingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#475569',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#991b1b',
  },
});
