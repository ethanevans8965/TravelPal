import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SelectorOption {
  key: string;
  label: string;
  [key: string]: any; // Allow additional properties
}

interface SelectorFieldProps {
  label: string;
  value: SelectorOption | null;
  placeholder: string;
  options: SelectorOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: SelectorOption) => void;
  renderValue?: (option: SelectorOption) => string;
  renderOption?: (option: SelectorOption) => string;
}

export default function SelectorField({
  label,
  value,
  placeholder,
  options,
  isOpen,
  onToggle,
  onSelect,
  renderValue,
  renderOption,
}: SelectorFieldProps) {
  const displayValue = value ? (renderValue ? renderValue(value) : value.label) : placeholder;

  return (
    <View style={styles.container}>
      {/* Selector Button */}
      <TouchableOpacity style={styles.selectorField} onPress={onToggle}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.selectorContent}>
          <Text style={[styles.selectorValue, !value && styles.placeholderText]}>
            {displayValue}
          </Text>
          <FontAwesome name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#8E8E93" />
        </View>
      </TouchableOpacity>

      {/* Options List */}
      {isOpen && (
        <View style={styles.pickerContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.pickerItem}
              onPress={() => onSelect(option)}
            >
              <Text style={styles.pickerItemText}>
                {renderOption ? renderOption(option) : option.label}
              </Text>
              {value?.key === option.key && <FontAwesome name="check" size={16} color="#43cea2" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  selectorField: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 8,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorValue: {
    fontSize: 16,
    color: '#1A2A36',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#C7C7CC',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#1A2A36',
    fontWeight: '500',
  },
});
