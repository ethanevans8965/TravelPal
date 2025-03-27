import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import { formatDate, formatDateISO } from '../utils/dateUtils';

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
        <FontAwesome name="calendar" size={16} color="#666666" />
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
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholder: {
    fontSize: 16,
    color: '#999999',
  },
});