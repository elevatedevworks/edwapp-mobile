import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

export type SelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type AppSelectProps<TValue extends string> = {
  label: string;
  value: TValue | '';
  options: SelectOption<TValue>[];
  placeholder?: string;
  error?: string;
  onChange: (value: TValue) => void;
  style?: ViewStyle;
};

export function AppSelect<TValue extends string>({
  label,
  value,
  options,
  placeholder = 'Select and option',
  error,
  onChange,
  style,
}: AppSelectProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );

  function handleSelect(nextValue: TValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.trigger, error ? styles.triggerError : null]}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedOption ? styles.placeholderText : null,
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>

              <Pressable onPress={() => setIsOpen(false)}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <View style={styles.optionList}>
              {options.map(option => {
                const isSelected = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={[styles.option, isSelected && styles.optionSelected]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>

                    {isSelected && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  trigger: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: '#DC2626',
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  chevron: {
    fontSize: 22,
    color: '#64748B',
    marginLeft: 12,
  },
  error: {
    fontSize: 13,
    color: '#DC2626',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563EB',
  },
  closeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  optionList: {
    gap: 8,
  },
  option: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  optionTextSelected: {
    color: '#1E3A8A',
  },
  check: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
});
