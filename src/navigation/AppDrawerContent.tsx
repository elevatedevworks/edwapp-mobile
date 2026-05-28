import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthProvider';
import { AppButton } from '../components/AppButton';

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  /* Server change */
  const canAccessDeveloperSettings = user?.role === 'admin';
  /* Server change */

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <View style={styles.userCard}>
          <Text style={styles.appName}>EDW Mobile</Text>
          <Text style={styles.userName}>{user?.name ?? 'Signed in'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Server change */}
        {canAccessDeveloperSettings && (
          <DrawerItem
            label="Developer Settings"
            onPress={() => props.navigation.navigate('DeveloperSettings')}
          />
        )}
        {/* Server change */}

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <AppButton title="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 12,
  },
  userCard: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
});
