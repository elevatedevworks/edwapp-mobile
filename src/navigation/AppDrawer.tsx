import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { FinanceStack } from '../modules/finance/navigation/FinanceStack';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AppDrawerContent } from './AppDrawerContent';

export type AppDrawerParamList = {
  Home: undefined;
  Finance: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<AppDrawerParamList>();

function renderDrawerContent(props: DrawerContentComponentProps) {
  return <AppDrawerContent {...props} />;
}

export function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#2563EB',
        drawerInactiveTintColor: '#334155',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="Finance"
        component={FinanceStack}
        options={{ title: 'Finance' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Drawer.Navigator>
  );
}
