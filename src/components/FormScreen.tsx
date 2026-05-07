import React from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Screen } from './Screen';

type FormScreenProps = {
  headerTitle?: string;
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
};

export function FormScreen({
  headerTitle,
  children,
  contentContainerStyle,
}: FormScreenProps) {
  return (
    <Screen headerTitle={headerTitle && headerTitle}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={24}
          extraHeight={80}
          enableAutomaticScroll
          showsVerticalScrollIndicator={false}
        >
          {children}
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 120,
    gap: 16,
  },
});
