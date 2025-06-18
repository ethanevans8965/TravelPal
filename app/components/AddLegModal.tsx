import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Leg } from '../types';
import { useTripStore } from '../stores/tripStore';
import DarkCountryPicker from './DarkCountryPicker';
import DarkDateSelector from './DarkDateSelector';

interface AddLegModalProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
  onSave: (legData: Omit<Leg, 'id'>, bypassValidation?: boolean) => void;
}

export default function AddLegModal({ visible, tripId, onClose, onSave }: AddLegModalProps) {
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { getLegsByTrip } = useTripStore();

  // Popular countries for quick selection
  const popularCountries = [
    'France',
    'Italy',
    'Spain',
    'Germany',
    'United Kingdom',
    'Japan',
    'United States',
    'Canada',
    'Australia',
    'Thailand',
  ];

  const resetForm = () => {
    setCountry('');
    setStartDate('');
    setEndDate('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validation functions
  const validateDateOverlap = (newStartDate: string, newEndDate: string): string | null => {
    if (!newStartDate || !newEndDate) return null; // Skip validation if dates are optional

    const existingLegs = getLegsByTrip(tripId).filter((leg) => leg.startDate && leg.endDate);
    const newStart = new Date(newStartDate);
    const newEnd = new Date(newEndDate);

    for (const leg of existingLegs) {
      const legStart = new Date(leg.startDate);
      const legEnd = new Date(leg.endDate);

      // Check for overlap: newStart < legEnd && newEnd > legStart
      if (newStart < legEnd && newEnd > legStart) {
        return `Date range overlaps with your ${leg.country} leg (${formatDateRange(leg.startDate, leg.endDate)}). Please choose different dates.`;
      }
    }
    return null;
  };

  const validateMinimumDuration = (startDate: string, endDate: string): string | null => {
    if (!startDate || !endDate) return null; // Skip if dates are optional

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (duration < 1) {
      return 'A leg must be at least 1 day long. Please adjust your dates.';
    }

    return null;
  };

  const validateDateRange = (startDate: string, endDate: string): string | null => {
    if (!startDate || !endDate) return null; // Skip if dates are optional

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Please enter valid dates.';
    }

    // Check if start is before end
    if (start >= end) {
      return 'End date must be after start date.';
    }

    // Check for reasonable future dates (not more than 10 years ahead)
    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);

    if (start > tenYearsFromNow || end > tenYearsFromNow) {
      return 'Dates cannot be more than 10 years in the future.';
    }

    return null;
  };

  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  const detectTripGaps = (newStartDate: string, newEndDate: string): string | null => {
    if (!newStartDate) return null; // Skip if no start date

    const existingLegs = getLegsByTrip(tripId)
      .filter((leg) => leg.startDate && leg.endDate)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    if (existingLegs.length === 0) return null;

    const newStart = new Date(newStartDate);
    const newEnd = newEndDate ? new Date(newEndDate) : null;

    // Find gaps in the trip timeline
    for (let i = 0; i < existingLegs.length; i++) {
      const currentLeg = existingLegs[i];
      const nextLeg = existingLegs[i + 1];

      const currentEnd = new Date(currentLeg.endDate);

      // Check if the new leg fits in a gap
      if (nextLeg) {
        const nextStart = new Date(nextLeg.startDate);
        const dayAfterCurrent = new Date(currentEnd);
        dayAfterCurrent.setDate(dayAfterCurrent.getDate() + 1);

        if (newStart >= dayAfterCurrent && (newEnd ? newEnd < nextStart : true)) {
          return `This leg will fill the gap between your ${currentLeg.country} and ${nextLeg.country} legs.`;
        }
      }
    }

    return null;
  };

  const validateLegOrder = (newStartDate: string): string | null => {
    if (!newStartDate) return null; // Skip if date is optional

    const existingLegs = getLegsByTrip(tripId)
      .filter((leg) => leg.startDate)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    if (existingLegs.length === 0) return null;

    const newStart = new Date(newStartDate);
    const lastLeg = existingLegs[existingLegs.length - 1];
    const lastEnd = new Date(lastLeg.endDate || lastLeg.startDate);

    // Suggest adding after the last leg
    if (newStart <= lastEnd) {
      const suggestedDate = new Date(lastEnd);
      suggestedDate.setDate(suggestedDate.getDate() + 1);
      return `For better organization, consider starting this leg after your ${lastLeg.country} leg ends (${suggestedDate.toLocaleDateString()}).`;
    }

    return null;
  };

  const validateDuplicateCountry = (countryName: string): string | null => {
    if (!countryName.trim()) return null;

    const existingLegs = getLegsByTrip(tripId);
    const duplicateLegs = existingLegs.filter(
      (leg) => leg.country.toLowerCase() === countryName.toLowerCase()
    );

    if (duplicateLegs.length > 0) {
      const legCount = duplicateLegs.length;
      const legText = legCount === 1 ? 'leg' : 'legs';

      // Show dates of existing legs if available
      const existingDates = duplicateLegs
        .filter((leg) => leg.startDate)
        .map((leg) =>
          leg.startDate ? formatDateRange(leg.startDate, leg.endDate || leg.startDate) : ''
        )
        .filter(Boolean)
        .join(', ');

      const datesText = existingDates ? ` (${existingDates})` : '';
      return `You already have ${legCount} ${legText} in ${countryName}${datesText}. Are you planning to return to this country?`;
    }

    return null;
  };

  const handleSave = () => {
    // Basic validation
    if (!country.trim()) {
      Alert.alert('Missing Country', 'Please select a country for this leg.');
      return;
    }

    // Enhanced date validation (only if both dates are provided)
    if (startDate && endDate) {
      // Basic date range validation
      const dateRangeError = validateDateRange(startDate, endDate);
      if (dateRangeError) {
        Alert.alert('Invalid Dates', dateRangeError);
        return;
      }

      // Minimum duration validation
      const durationError = validateMinimumDuration(startDate, endDate);
      if (durationError) {
        Alert.alert('Invalid Duration', durationError);
        return;
      }

      // Date overlap validation (blocking)
      const overlapError = validateDateOverlap(startDate, endDate);
      if (overlapError) {
        Alert.alert('Date Conflict', overlapError);
        return;
      }
    }

    // Single date validation (start date only)
    if (startDate && !endDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        Alert.alert('Invalid Date', 'Please enter a valid start date.');
        return;
      }
    }

    // Check for duplicate country BEFORE calling store (this prevents store validation error)
    const duplicateWarning = validateDuplicateCountry(country);
    if (duplicateWarning) {
      Alert.alert('Returning to Country?', duplicateWarning, [
        { text: 'Yes, Continue', onPress: () => proceedWithSave(true) }, // Save with bypass
        { text: 'Let Me Change', style: 'cancel' },
      ]);
      return;
    }

    // Gap detection (informational)
    if (startDate && endDate) {
      const gapInfo = detectTripGaps(startDate, endDate);
      if (gapInfo) {
        Alert.alert('Gap Filled', gapInfo, [
          { text: 'Continue', onPress: () => checkChronologicalOrderAndContinue() },
        ]);
        return;
      }
    }

    checkChronologicalOrderAndContinue();
  };

  const checkChronologicalOrderAndContinue = () => {
    // Chronological order suggestion (warning, not blocking)
    if (startDate) {
      const orderWarning = validateLegOrder(startDate);
      if (orderWarning) {
        Alert.alert('Leg Order Suggestion', orderWarning, [
          { text: 'Continue Anyway', onPress: () => proceedWithSave(false) }, // Save normally
          { text: 'Let Me Adjust', style: 'cancel' },
        ]);
        return;
      }
    }

    proceedWithSave(false); // Save normally
  };

  const checkDuplicateCountryAndSave = () => {
    // This function is no longer needed since we check duplicates first
    proceedWithSave(false);
  };

  const proceedWithSave = (bypassValidation: boolean) => {
    const legData: Omit<Leg, 'id'> = {
      tripId,
      country: country.trim(),
      startDate: startDate || '',
      endDate: endDate || '',
      budget: 0, // Default budget since we removed the field
    };

    console.log('proceedWithSave called with bypass:', bypassValidation);
    try {
      onSave(legData, bypassValidation);
      resetForm();
    } catch (error) {
      console.log('proceedWithSave error:', error);
      Alert.alert(
        'Error',
        `Failed to save leg: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const saveLeg = () => {
    // This function is deprecated - use proceedWithSave instead
    proceedWithSave(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Leg</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Country Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Country</Text>

            {/* Dark Styled Country Picker */}
            <View style={styles.countryPickerWrapper}>
              <DarkCountryPicker selectedCountry={country} onSelectCountry={setCountry} />
            </View>

            {/* Popular Countries */}
            <Text style={styles.subsectionTitle}>Popular Destinations</Text>
            <View style={styles.countryGrid}>
              {popularCountries.map((countryName) => (
                <TouchableOpacity
                  key={countryName}
                  style={[
                    styles.countryChip,
                    country === countryName && styles.countryChipSelected,
                  ]}
                  onPress={() => setCountry(countryName)}
                >
                  <Text
                    style={[
                      styles.countryChipText,
                      country === countryName && styles.countryChipTextSelected,
                    ]}
                  >
                    {countryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range (Optional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dates (Optional)</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <DarkDateSelector label="Start Date" value={startDate} onChange={setStartDate} />
              </View>
              <View style={styles.dateField}>
                <DarkDateSelector
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  minimumDate={startDate ? new Date(startDate) : undefined}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#CCCCCC',
    marginTop: 16,
    marginBottom: 8,
  },

  // Custom styling wrappers for existing components
  countryPickerWrapper: {
    marginBottom: 8,
  },

  // Popular countries styling
  countryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  countryChip: {
    backgroundColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  countryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  countryChipText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  countryChipTextSelected: {
    color: '#FFFFFF',
  },

  // Date layout
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
});
