import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../../../../app/context'; // Corrected context hook import
import { Trip } from '../../../../app/types'; 

export default function ReviewTripScreen() {
  const router = useRouter();
  const { tripName, country, startDate, endDate } = useLocalSearchParams();
  const { addTrip } = useAppContext();

  // Function to format date string for display
  const formatDateDisplay = (dateString: string | string[] | undefined) => {
    if (!dateString || Array.isArray(dateString)) return 'Not specified';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Not specified';
    }
  };

  const handleCreateTrip = () => {
    // Ensure startDate and endDate are strings or undefined as per Trip type
    const tripStartDate = startDate && !Array.isArray(startDate) ? new Date(startDate).toISOString() : undefined;
    const tripEndDate = endDate && !Array.isArray(endDate) ? new Date(endDate).toISOString() : undefined;

    const newTrip: Trip = {
      id: Date.now().toString(), // Simple unique ID based on timestamp
      name: Array.isArray(tripName) ? tripName[0] : tripName || 'New Trip',
      locationId: Array.isArray(country) ? country[0] : country || 'Unknown', // Using country as locationId for now
      startDate: tripStartDate,
      endDate: tripEndDate,
      status: 'planning', // Default status
      budget: 0, // No budget for this scenario
      expenses: [], // Start with no expenses
      currency: 'USD', // Default currency, could be made selectable later
    };

    addTrip(newTrip);
    console.log('Trip created:', newTrip);

    // Navigate to the main trips list after creation
    router.push('/trips'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Review Your Trip</Text>
        <Text style={styles.subtitle}>Please review the details before creating your trip.</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trip Name:</Text>
            <Text style={styles.detailValue}>{Array.isArray(tripName) ? tripName[0] : tripName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Destination:</Text>
            <Text style={styles.detailValue}>{Array.isArray(country) ? country[0] : country}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dates:</Text>
            <Text style={styles.detailValue}>
              {startDate && endDate ? 
                `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}` 
                : startDate ? formatDateDisplay(startDate) : endDate ? formatDateDisplay(endDate) : 'Not specified'
              }
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTrip}
        >
          <Text style={styles.createButtonText}>Create Trip</Text>
          <FontAwesome name="check" size={16} color="#FFFFFF" />
        </TouchableOpacity>
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
  detailsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#666666',
    flexShrink: 1, // Allow text to wrap
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 12,
    padding: 16,
    marginTop: 'auto',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 