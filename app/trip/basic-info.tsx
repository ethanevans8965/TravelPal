import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import CountryPicker from '../components/CountryPicker';
import DatePickerField from '../components/DatePickerField';

export default function BasicInfoScreen() {
  const router = useRouter();
  const { method } = useLocalSearchParams<{ method: 'total' | 'daily' }>();
  
  const [destination, setDestination] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelStyle, setTravelStyle] = useState<'Budget' | 'Mid-range' | 'Luxury' | null>(null);

  const isFormValid = destination && selectedCountry && startDate && endDate && travelStyle;

  const navigateToNext = () => {
    if (!isFormValid) return;

    const nextScreen = method === 'total' ? 'total-budget' : 'daily-budget';
    
    router.push({
      pathname: `/trip/${nextScreen}`,
      params: {
        destination,
        country: selectedCountry,
        startDate,
        endDate,
        travelStyle,
      }
    } as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Basic Trip Information</Text>
      <Text style={styles.subtitle}>Tell us about your trip</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>City/Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Where are you going?"
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Country</Text>
        <CountryPicker 
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
        />
      </View>

      <DatePickerField
        label="Start Date"
        value={startDate}
        onChange={setStartDate}
      />

      <DatePickerField
        label="End Date"
        value={endDate}
        onChange={setEndDate}
        minimumDate={startDate ? new Date(startDate) : undefined}
      />

      <View style={styles.formGroup}>
        <Text style={styles.label}>Travel Style</Text>
        <View style={styles.travelStyleContainer}>
          <TouchableOpacity
            style={[
              styles.travelStyleButton,
              travelStyle === 'Budget' && styles.selectedTravelStyle,
            ]}
            onPress={() => setTravelStyle('Budget')}
          >
            <FontAwesome
              name="money"
              size={20}
              color={travelStyle === 'Budget' ? '#FF6B6B' : '#666666'}
            />
            <Text
              style={[
                styles.travelStyleText,
                travelStyle === 'Budget' && styles.selectedTravelStyleText,
              ]}
            >
              Budget
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.travelStyleButton,
              travelStyle === 'Mid-range' && styles.selectedTravelStyle,
            ]}
            onPress={() => setTravelStyle('Mid-range')}
          >
            <FontAwesome
              name="star-half-o"
              size={20}
              color={travelStyle === 'Mid-range' ? '#FF6B6B' : '#666666'}
            />
            <Text
              style={[
                styles.travelStyleText,
                travelStyle === 'Mid-range' && styles.selectedTravelStyleText,
              ]}
            >
              Mid-range
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.travelStyleButton,
              travelStyle === 'Luxury' && styles.selectedTravelStyle,
            ]}
            onPress={() => setTravelStyle('Luxury')}
          >
            <FontAwesome
              name="star"
              size={20}
              color={travelStyle === 'Luxury' ? '#FF6B6B' : '#666666'}
            />
            <Text
              style={[
                styles.travelStyleText,
                travelStyle === 'Luxury' && styles.selectedTravelStyleText,
              ]}
            >
              Luxury
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={navigateToNext}
          disabled={!isFormValid}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  formGroup: {
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
  },
  travelStyleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  travelStyleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedTravelStyle: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF0F0',
  },
  travelStyleText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 8,
  },
  selectedTravelStyleText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});