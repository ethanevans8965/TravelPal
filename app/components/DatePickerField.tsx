import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // Changed from FontAwesome
import { formatDate, formatDateISO } from '../utils/dateUtils';
import { useAppTheme } from '../../src/theme/ThemeContext';

type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minimumDate?: Date;
};

export default function DatePickerField({ 
  label, 
  value, 
  onChange,
  minimumDate 
}: DatePickerFieldProps) {
  const theme = useAppTheme();
  const [show, setShow] = useState(false);
  
  // Convert string date to Date object for the picker
  const dateValue = value ? new Date(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(formatDateISO(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShow(true)}
      >
        <Text style={value ? styles.dateText : styles.placeholder}>
          {value ? formatDate(value) : 'Select a date'}
        </Text>
        <Ionicons name="calendar-outline" size={theme.typography.fontSizes.large} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg, // 24
  },
  label: {
    fontSize: theme.typography.fontSizes.medium, // 16
    fontWeight: theme.typography.fontWeights.semibold, // 600
    color: theme.colors.text,
    fontFamily: theme.typography.primaryFont,
    marginBottom: theme.spacing.sm, // 8
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm + theme.spacing.xs, // 12
    padding: theme.spacing.md, // 16
    // fontSize for the container does not make sense, it's on dateText/placeholder
    borderWidth: theme.borders.borderWidthSmall,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: theme.typography.fontSizes.medium, // 16
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  placeholder: {
    fontSize: theme.typography.fontSizes.medium, // 16
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.textTertiary,
  },
});