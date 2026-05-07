import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AccountsScreen } from '../screens/AccountsScreen';
import { BillsScreen } from '../screens/BillsScreen';
import { FinanceHomeScreen } from '../screens/FinanceHomeScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type FinanceTabParamList = {
  Overview: undefined;
  Bills: undefined;
  Payments: undefined;
  Accounts: undefined;
  Reports: undefined;
};

type TabIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

function OverviewTabIcon({ color, size, focused }: TabIconProps) {
  return (
    <MaterialCommunityIcons
      name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
      color={color}
      size={size}
    />
  );
}

function AccountsTabIcon({ color, size, focused }: TabIconProps) {
  return (
    <MaterialCommunityIcons
      name={focused ? 'wallet' : 'wallet-outline'}
      color={color}
      size={size}
    />
  );
}

function BillsTabIcon({ color, size, focused }: TabIconProps) {
  return (
    <MaterialCommunityIcons
      name={focused ? 'file-document' : 'file-document-outline'}
      color={color}
      size={size}
    />
  );
}

// function ReportsTabIcon({ color, size, focused }: TabIconProps) {
//   return (
//     <MaterialCommunityIcons
//       name={focused ? 'chart-box' : 'chart-box-outline'}
//       color={color}
//       size={size}
//     />
//   );
// }

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
      <Tab.Screen
        name="Overview"
        component={FinanceHomeScreen}
        options={{
          tabBarIcon: OverviewTabIcon,
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          tabBarIcon: BillsTabIcon,
        }}
      />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          tabBarIcon: AccountsTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
