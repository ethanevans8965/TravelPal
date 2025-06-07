import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'; // react-native-calendar-picker uses moment

export default function DateSelectionScreen() {
  const router = useRouter();
  const { tripName, country } = useLocalSearchParams();
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);

  const handleDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(undefined); // Reset end date when start date changes
    }
  };

  const handleNext = () => {
    router.push({
      pathname: '/trip/create/no-budget/review',
      params: {
        tripName,
        country,
        startDate: selectedStartDate?.toISOString() || '',
        endDate: selectedEndDate?.toISOString() || '',
      },
    } as any);
  };

  const handleSkip = () => {
    router.push({
      pathname: '/trip/create/no-budget/review',
      params: {
        tripName,
        country,
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Trip Dates</Text>
        <Text style={styles.subtitle}>When did/do/will you travel? (Optional)</Text>

        <CalendarPicker
          allowRangeSelection={true}
          onDateChange={handleDateChange}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          todayBackgroundColor="#f0f0f0"
          selectedDayColor="#057B8C"
          selectedDayTextColor="#FFFFFF"
          selectedRangeStyle={{ backgroundColor: '#057B8C' }}
          selectedRangeStartStyle={{ borderTopLeftRadius: 999, borderBottomLeftRadius: 999 }}
          selectedRangeEndStyle={{ borderTopRightRadius: 999, borderBottomRightRadius: 999 }}
          dayShape="circle"
          // Allow past dates for travel records
          // Hide month/year navigation titles if needed, can customize later
          // previousTitle=""
          // nextTitle=""
          // monthTitleStyle={{ display: 'none' }}
          // yearTitleStyle={{ display: 'none' }}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedStartDate && !selectedEndDate && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!selectedStartDate && !selectedEndDate}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  dateContainer: {
    gap: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  dateInputDisabled: {
    opacity: 0.5,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#333333',
  },
  dateValuePlaceholder: {
    color: '#999999',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 'auto',
  },
  skipButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 12,
    padding: 16,
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
