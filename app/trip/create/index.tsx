import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../context';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import MultiCountryModal from '../../components/MultiCountryModal';
import DateSelectionModal, { DateMode, DateSelection } from '../../components/DateSelectionModal';

export default function CreateTripScreen() {
  const router = useRouter();
  const { addTrip, addLocation } = useAppContext();
  const [tripName, setTripName] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [dateSelection, setDateSelection] = useState<DateSelection>({
    mode: 'no-dates',
  });
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const getDateDisplayText = () => {
    if (dateSelection.mode === 'no-dates') {
      return 'Flexible dates';
    }
    if (dateSelection.mode === 'start-only') {
      return dateSelection.startDate
        ? `Departing ${new Date(dateSelection.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}`
        : 'Open-ended trip';
    }
    if (dateSelection.mode === 'both') {
      if (dateSelection.startDate && dateSelection.endDate) {
        const start = new Date(dateSelection.startDate);
        const end = new Date(dateSelection.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${start.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })} - ${end.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })} (${days} days)`;
      }
      return 'Fixed dates';
    }
    return 'Select dates...';
  };

  const handleCreateTrip = () => {
    if (!tripName.trim()) {
      setNameError('Trip name is required');
      return;
    }

    if (countries.length === 0) {
      setCountryError('Please select at least one country');
      return;
    }

    try {
      // Use first country as primary location for now
      const primaryCountry = countries[0];

      const locationData = {
        name: primaryCountry,
        country: primaryCountry,
        timezone: 'UTC',
      };
      addLocation(locationData);

      // Create trip with minimal required data
      const tripData = {
        name: tripName.trim(),
        locationId: 'temp-location-id', // Placeholder until actual location ID system
        destination: {
          id: 'temp-location-id',
          name: primaryCountry,
          country: primaryCountry,
          timezone: 'UTC',
        },
        countries: countries,
        dateMode: dateSelection.mode,
        startDate: dateSelection.startDate,
        endDate: dateSelection.endDate,
        budgetMethod: 'no-budget' as const,
        emergencyFundPercentage: 0,
        categories: {
          accommodation: 0,
          food: 0,
          transportation: 0,
          activities: 0,
          shopping: 0,
          other: 0,
        },
        status: 'planning' as const,
      };

      const newTrip = addTrip(tripData);

      // Navigate to trip dashboard
      router.push(`/trip/${newTrip.id}/dashboard`);
    } catch (error) {
      console.error('Error creating trip:', error);
      setNameError('Failed to create trip. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Trip</Text>
          <Text style={styles.subtitle}>
            Start planning your next adventure! You can add more details later.
          </Text>
        </View>

        <Card variant="outlined">
          <Input
            label="Trip Name"
            placeholder="e.g., Summer in Paris, Tokyo Adventure"
            value={tripName}
            onChangeText={(text) => {
              setTripName(text);
              if (nameError) setNameError('');
            }}
            error={nameError}
            leftIcon="map"
            maxLength={50}
            autoFocus
          />

          {/* Countries Selector */}
          <TouchableOpacity onPress={() => setCountryModalVisible(true)}>
            <Input
              label="Countries Visited"
              placeholder="Select countries..."
              value={countries.join(', ')}
              editable={false}
              leftIcon="globe"
              helpText={countryError || 'Select one or more countries'}
              error={countryError}
            />
          </TouchableOpacity>

          {/* Date Selection */}
          <TouchableOpacity onPress={() => setDateModalVisible(true)}>
            <Input
              label="Travel Dates"
              placeholder="Select dates..."
              value={getDateDisplayText()}
              editable={false}
              leftIcon="calendar"
              helpText="Choose your travel timeline"
            />
          </TouchableOpacity>
        </Card>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>✨ What's next?</Text>
          <Text style={styles.infoText}>
            After creating your trip, you'll get a personalized dashboard where you can:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Add destinations and dates</Text>
            <Text style={styles.featureItem}>• Set up your budget</Text>
            <Text style={styles.featureItem}>• Plan activities and bookings</Text>
            <Text style={styles.featureItem}>• Track expenses</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Cancel" variant="secondary" onPress={() => router.back()} fullWidth />
          <Button
            title="Create Trip"
            onPress={handleCreateTrip}
            icon="arrow-right"
            fullWidth
            disabled={!tripName.trim() || countries.length === 0}
          />
        </View>
      </ScrollView>

      {/* Country Modal */}
      <MultiCountryModal
        visible={countryModalVisible}
        selected={countries}
        onClose={() => setCountryModalVisible(false)}
        onSave={(selected) => {
          setCountries(selected);
          if (selected.length > 0 && countryError) setCountryError('');
        }}
      />

      {/* Date Modal */}
      <DateSelectionModal
        visible={dateModalVisible}
        selection={dateSelection}
        onClose={() => setDateModalVisible(false)}
        onSave={(selection) => setDateSelection(selection)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#F0F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E0F4F6',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#057B8C',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  featureList: {
    gap: 4,
  },
  featureItem: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 'auto',
    paddingTop: 16,
  },
});
