import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';

export type DateMode = 'both' | 'start-only' | 'no-dates';

export interface DateSelection {
  mode: DateMode;
  startDate?: string;
  endDate?: string;
}

interface DateSelectionModalProps {
  visible: boolean;
  selection: DateSelection;
  onClose: () => void;
  onSave: (selection: DateSelection) => void;
}

export default function DateSelectionModal({
  visible,
  selection,
  onClose,
  onSave,
}: DateSelectionModalProps) {
  const [selectedMode, setSelectedMode] = useState<DateMode>(selection.mode);
  const [startDate, setStartDate] = useState<Date | undefined>(
    selection.startDate ? new Date(selection.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    selection.endDate ? new Date(selection.endDate) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickingStartDate, setPickingStartDate] = useState(true);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedMode(selection.mode);
      setStartDate(selection.startDate ? new Date(selection.startDate) : undefined);
      setEndDate(selection.endDate ? new Date(selection.endDate) : undefined);
      setShowDatePicker(false);
    }
  }, [visible, selection]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleModeChange = (mode: DateMode) => {
    setSelectedMode(mode);
    if (mode === 'no-dates') {
      setStartDate(undefined);
      setEndDate(undefined);
    } else if (mode === 'start-only') {
      setEndDate(undefined);
    }
  };

  const handleDateChange = (date: Date) => {
    if (pickingStartDate) {
      setStartDate(date);
      // If end date is before start date, clear it
      if (endDate && date > endDate) {
        setEndDate(undefined);
      }
    } else {
      setEndDate(date);
    }
  };

  const handleDatePickerConfirm = () => {
    setShowDatePicker(false);
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const openStartDatePicker = () => {
    setPickingStartDate(true);
    setShowDatePicker(true);
  };

  const openEndDatePicker = () => {
    setPickingStartDate(false);
    setShowDatePicker(true);
  };

  const handleSave = () => {
    const result: DateSelection = {
      mode: selectedMode,
      startDate: startDate?.toISOString(),
      endDate: selectedMode === 'both' ? endDate?.toISOString() : undefined,
    };
    onSave(result);
    onClose();
  };

  const canSave = () => {
    if (selectedMode === 'no-dates') return true;
    if (selectedMode === 'start-only') return !!startDate;
    if (selectedMode === 'both') return !!startDate && !!endDate;
    return false;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Travel Dates</Text>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSave} disabled={!canSave()}>
            <Text style={[styles.confirmButtonText, !canSave() && styles.confirmButtonDisabled]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Mode Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When are you traveling?</Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionCard, selectedMode === 'both' && styles.optionCardSelected]}
                onPress={() => handleModeChange('both')}
              >
                <View style={styles.optionContent}>
                  <FontAwesome
                    name="calendar"
                    size={18}
                    color={selectedMode === 'both' ? '#43cea2' : '#8E8E93'}
                  />
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionTitle,
                        selectedMode === 'both' && styles.optionTitleSelected,
                      ]}
                    >
                      Fixed Dates
                    </Text>
                    <Text style={styles.optionDescription}>Perfect for trips with fixed dates</Text>
                  </View>
                </View>
                {selectedMode === 'both' && (
                  <FontAwesome name="check-circle" size={20} color="#43cea2" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedMode === 'start-only' && styles.optionCardSelected,
                ]}
                onPress={() => handleModeChange('start-only')}
              >
                <View style={styles.optionContent}>
                  <FontAwesome
                    name="calendar-o"
                    size={18}
                    color={selectedMode === 'start-only' ? '#43cea2' : '#8E8E93'}
                  />
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionTitle,
                        selectedMode === 'start-only' && styles.optionTitleSelected,
                      ]}
                    >
                      Open-Ended
                    </Text>
                    <Text style={styles.optionDescription}>Great for open-ended adventures</Text>
                  </View>
                </View>
                {selectedMode === 'start-only' && (
                  <FontAwesome name="check-circle" size={20} color="#43cea2" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedMode === 'no-dates' && styles.optionCardSelected,
                ]}
                onPress={() => handleModeChange('no-dates')}
              >
                <View style={styles.optionContent}>
                  <FontAwesome
                    name="clock-o"
                    size={18}
                    color={selectedMode === 'no-dates' ? '#43cea2' : '#8E8E93'}
                  />
                  <View style={styles.optionText}>
                    <Text
                      style={[
                        styles.optionTitle,
                        selectedMode === 'no-dates' && styles.optionTitleSelected,
                      ]}
                    >
                      Flexible
                    </Text>
                    <Text style={styles.optionDescription}>Plan dates later</Text>
                  </View>
                </View>
                {selectedMode === 'no-dates' && (
                  <FontAwesome name="check-circle" size={20} color="#43cea2" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Selection */}
          {selectedMode !== 'no-dates' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Dates</Text>

              {/* Start Date */}
              <View style={styles.dateFieldContainer}>
                <Text style={styles.dateLabel}>Departure Date</Text>
                <TouchableOpacity style={styles.dateButton} onPress={openStartDatePicker}>
                  <Text style={startDate ? styles.dateText : styles.datePlaceholder}>
                    {startDate ? formatDate(startDate) : 'Select a date'}
                  </Text>
                  <FontAwesome name="calendar" size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* End Date (only for 'both' mode) */}
              {selectedMode === 'both' && (
                <View style={styles.dateFieldContainer}>
                  <Text style={[styles.dateLabel, !startDate && styles.dateLabelDisabled]}>
                    Return Date
                  </Text>
                  <TouchableOpacity
                    style={[styles.dateButton, !startDate && styles.dateButtonDisabled]}
                    onPress={() => startDate && openEndDatePicker()}
                    disabled={!startDate}
                  >
                    <Text
                      style={[
                        endDate ? styles.dateText : styles.datePlaceholder,
                        !startDate && styles.dateTextDisabled,
                      ]}
                    >
                      {endDate ? formatDate(endDate) : 'Select a date'}
                    </Text>
                    <FontAwesome
                      name="calendar"
                      size={16}
                      color={startDate ? '#8E8E93' : '#C7C7CC'}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {/* Trip Duration Display */}
              {startDate && endDate && (
                <View style={styles.durationContainer}>
                  <FontAwesome name="clock-o" size={16} color="#43cea2" />
                  <Text style={styles.durationText}>
                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))}{' '}
                    day trip
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Calendar Picker Modal */}
        <Modal
          visible={showDatePicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleDatePickerCancel}
        >
          <SafeAreaView style={styles.calendarModalContainer}>
            <View style={styles.calendarModalHeader}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleDatePickerCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {pickingStartDate ? 'Departure Date' : 'Return Date'}
              </Text>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDatePickerConfirm}>
                <Text style={styles.confirmButtonText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
              <CalendarPicker
                selectedStartDate={pickingStartDate ? startDate : endDate}
                onDateChange={handleDateChange}
                todayBackgroundColor="#f0f0f0"
                selectedDayColor="#43cea2"
                selectedDayTextColor="#FFFFFF"
                dayShape="circle"
                minDate={pickingStartDate ? new Date() : startDate}
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
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
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
  confirmButtonDisabled: {
    color: '#C7C7CC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#43cea2',
    backgroundColor: '#f8fffe',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: '#43cea2',
  },
  optionDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  dateFieldContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 8,
  },
  dateLabelDisabled: {
    color: '#C7C7CC',
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
  dateButtonDisabled: {
    opacity: 0.5,
  },
  dateText: {
    fontSize: 16,
    color: '#1A2A36',
    fontWeight: '500',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#C7C7CC',
  },
  dateTextDisabled: {
    color: '#C7C7CC',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#43cea2',
  },
  calendarModalContainer: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  calendarModalHeader: {
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
