import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';
import { formatDate, formatDateISO } from '../utils/dateUtils';

interface DarkDateSelectorProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minimumDate?: Date;
}

export default function DarkDateSelector({
  label,
  value,
  onChange,
  minimumDate,
}: DarkDateSelectorProps) {
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

  const handleClearDate = () => {
    setSelectedDate(undefined);
    onChange('');
    setShowModal(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowModal(true)}>
          <Text style={value ? styles.dateText : styles.placeholder}>
            {value ? formatDate(value) : 'Optional'}
          </Text>
          <FontAwesome name="calendar" size={18} color="#CCCCCC" />
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
            <TouchableOpacity style={styles.actionButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <View style={styles.headerActions}>
              {value && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClearDate}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calendarContainer}>
            <CalendarPicker
              selectedStartDate={selectedDate}
              onDateChange={handleDateChange}
              todayBackgroundColor="#404040"
              selectedDayColor="#007AFF"
              selectedDayTextColor="#FFFFFF"
              dayShape="circle"
              minDate={minimumDate}
              textStyle={{
                fontFamily: undefined,
                color: '#FFFFFF',
              }}
              monthTitleStyle={{
                fontWeight: '600',
                fontSize: 18,
                color: '#FFFFFF',
              }}
              yearTitleStyle={{
                fontWeight: '600',
                fontSize: 18,
                color: '#FFFFFF',
              }}
              previousTitleStyle={{
                color: '#007AFF',
                fontSize: 16,
              }}
              nextTitleStyle={{
                color: '#007AFF',
                fontSize: 16,
              }}
              dayLabelsWrapper={{
                borderTopWidth: 0,
                borderBottomWidth: 0,
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
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  dateText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#171717',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FF453A',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#262626',
    margin: 20,
    borderRadius: 16,
  },
});
