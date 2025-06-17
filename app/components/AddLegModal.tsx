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
import DarkCountryPicker from './DarkCountryPicker';
import DarkDateSelector from './DarkDateSelector';

interface AddLegModalProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
  onSave: (legData: Omit<Leg, 'id'>) => void;
}

export default function AddLegModal({ visible, tripId, onClose, onSave }: AddLegModalProps) {
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const handleSave = () => {
    // Basic validation
    if (!country.trim()) {
      Alert.alert('Error', 'Please select a country');
      return;
    }

    // Date validation (only if both dates are provided)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        Alert.alert('Error', 'End date must be after start date');
        return;
      }
    }

    const legData: Omit<Leg, 'id'> = {
      tripId,
      country: country.trim(),
      startDate: startDate || '',
      endDate: endDate || '',
      budget: 0, // Default budget since we removed the field
    };

    onSave(legData);
    resetForm();
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
