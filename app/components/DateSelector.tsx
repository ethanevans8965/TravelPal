import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';
import { formatDate, formatDateISO } from '../utils/dateUtils';

interface DateSelectorProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minimumDate?: Date;
}

export default function DateSelector({ label, value, onChange, minimumDate }: DateSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onChange(formatDateISO(selectedDate));
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setSelectedDate(value ? new Date(value) : undefined);
    setShowModal(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowModal(true)}>
          <Text style={value ? styles.dateText : styles.placeholder}>
            {value ? formatDate(value) : 'Select a date'}
          </Text>
          <FontAwesome name="calendar" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            <CalendarPicker
              selectedStartDate={selectedDate}
              onDateChange={handleDateChange}
              todayBackgroundColor="#f0f0f0"
              selectedDayColor="#43cea2"
              selectedDayTextColor="#FFFFFF"
              dayShape="circle"
              minDate={minimumDate || new Date()}
              textStyle={{
                fontFamily: undefined,
                color: '#1A2A36',
              }}
              monthTitleStyle={{
                fontWeight: '600',
                fontSize: 18,
                color: '#1A2A36',
              }}
              yearTitleStyle={{
                fontWeight: '600',
                fontSize: 18,
                color: '#1A2A36',
              }}
              previousTitleStyle={{
                color: '#43cea2',
                fontSize: 16,
              }}
              nextTitleStyle={{
                color: '#43cea2',
                fontSize: 16,
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateText: {
    fontSize: 16,
    color: '#1A2A36',
    fontWeight: '500',
  },
  placeholder: {
    fontSize: 16,
    color: '#C7C7CC',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A36',
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#43cea2',
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
