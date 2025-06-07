import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../context';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function CreateTripScreen() {
  const router = useRouter();
  const { addTrip, addLocation } = useAppContext();
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  const handleCreateTrip = () => {
    if (!tripName.trim()) {
      setError('Trip name is required');
      return;
    }

    try {
      // Create location if destination is provided
      let locationData = null;
      if (destination.trim()) {
        locationData = {
          name: destination.trim(),
          country: destination.trim(),
          timezone: 'UTC',
        };
        addLocation(locationData);
      }

      // Create trip with minimal required data
      const tripData = {
        name: tripName.trim(),
        locationId: locationData ? 'temp-location-id' : 'temp-location-id', // Required field
        destination: locationData
          ? {
              id: 'temp-location-id',
              name: destination.trim(),
              country: destination.trim(),
              timezone: 'UTC',
            }
          : undefined,
        startDate: undefined,
        endDate: undefined,
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
      setError('Failed to create trip. Please try again.');
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
              if (error) setError('');
            }}
            error={error}
            leftIcon="map"
            maxLength={50}
            autoFocus
          />

          <Input
            label="Destination (Optional)"
            placeholder="e.g., France, Japan"
            value={destination}
            onChangeText={setDestination}
            leftIcon="globe"
            helpText="You can add or change this later"
          />
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
            disabled={!tripName.trim()}
          />
        </View>
      </ScrollView>
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
