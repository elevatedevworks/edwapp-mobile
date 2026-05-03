import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinanceTabs } from './FinanceTabs';
import { BillDetailsScreen } from '../screens/BillDetailsScreen';
import { CreatePaymentScreen } from '../screens/CreatePaymentScreen';
import { CreateBillScreen } from '../screens/CreateBillScreen';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';
import { EditBillScreen } from '../screens/EditBillScreen';
import { AccountDetailsScreen } from '../screens/AccountDetailsScreen';
import { EditAccountScreen } from '../screens/EditAccountScreen';
import { PaymentDetailsScreen } from '../screens/PaymentDetailsScreen';
import { EditPaymentScreen } from '../screens/EditPaymentScreen';

export type FinanceStackParamList = {
  FinanceTabs: undefined;
  BillDetails: {
    billId: string;
  };
  CreatePayment: {
    billId: string;
    accountId: string;
    amountDueCents: number;
  };
  CreateBill: undefined;
  CreateAccount: undefined;
  EditBill: {
    billId: string;
  };
  AccountDetails: {
    accountId: string;
  };
  EditAccount: {
    accountId: string;
  };
  PaymentDetails: {
    paymentId: string;
  };
  EditPayment: {
    paymentId: string;
  };
};

const Stack = createNativeStackNavigator<FinanceStackParamList>();

export function FinanceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FinanceTabs"
        component={FinanceTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BillDetails"
        component={BillDetailsScreen}
        options={{ title: 'Bill Details' }}
      />
      <Stack.Screen
        name="CreatePayment"
        component={CreatePaymentScreen}
        options={{ title: 'Record Payment' }}
      />
      <Stack.Screen
        name="CreateBill"
        component={CreateBillScreen}
        options={{ title: 'Create Bill' }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="EditBill"
        component={EditBillScreen}
        options={{ title: 'Edit Bill' }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetailsScreen}
        options={{ title: 'Account Details' }}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{ title: 'Edit Account' }}
      />
      <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetailsScreen}
        options={{ title: 'Payment Details' }}
      />
      <Stack.Screen
        name="EditPayment"
        component={EditPaymentScreen}
        options={{ title: 'Edit Payment' }}
      />
    </Stack.Navigator>
  );
}
