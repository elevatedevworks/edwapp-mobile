import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AccountsScreen } from '../screens/AccountsScreen';
import { BillsScreen } from '../screens/BillsScreen';
import { FinanceHomeScreen } from '../screens/FinanceHomeScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FinanceTabParamList = {
  Overview: undefined;
  Bills: undefined;
  Payments: undefined;
  Accounts: undefined;
};

const Tab = createBottomTabNavigator<FinanceTabParamList>();

export function FinanceTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          borderTopColor: '#E2E8F0',
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen name="Overview" component={FinanceHomeScreen} />
      <Tab.Screen name="Bills" component={BillsScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
    </Tab.Navigator>
  );
}
