import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { CompactHeader } from '../modules/finance/components/CompactHeader';

type ScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  headerTitle?: string;
};

export function Screen({ children, style, headerTitle }: ScreenProps) {
  return (
    <>
      {headerTitle && <CompactHeader title={headerTitle} />}

      <View style={[styles.screen, style]}>{children}</View>
      {headerTitle && <View style={styles.titleSpacer} />}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  titleSpacer: {
    paddingVertical: 30,
  },
});
