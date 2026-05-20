import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';

type AppDatePickerProps = {
  label: string;
  value: string;
  onDateChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  style?: ViewStyle;
};

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseApiDate(value?: string) {
  if (!value) {
    return new Date();
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

export function AppDatePicker({
  label,
  value,
  onDateChange,
  error,
  placeholder = 'Select date',
  style,
}: AppDatePickerProps) {
  function handleValueChange(
    _event: DateTimePickerChangeEvent,
    selectedDate?: Date,
  ) {
    if (!selectedDate) {
      return;
    }

    onDateChange(formatDateForApi(selectedDate));
  }

  function openDatePicker() {
    const currentDate = parseApiDate(value);

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentDate,
        mode: 'date',
        display: 'default',
        onValueChange: handleValueChange,
        onDismiss: () => {},
      });

      return;
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={[styles.dateButton, error ? styles.dateButtonError : null]}
        onPress={openDatePicker}
      >
        <Text
          style={[styles.dateButtonText, !value ? styles.placeholder : null]}
        >
          {value || placeholder}
        </Text>
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={parseApiDate(value)}
          mode="date"
          display="default"
          onValueChange={handleValueChange}
          onDismiss={() => {}}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  dateButton: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  dateButtonError: {
    borderColor: '#DC2626',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#0F172A',
  },
  placeholder: {
    color: '#94A3B8',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
  },
});
