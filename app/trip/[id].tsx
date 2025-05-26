import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppContext } from '../context';
import { FontAwesome } from '@expo/vector-icons';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning':
      return '#007AFF';
    case 'active':
      return '#34C759';
    case 'completed':
      return '#8E8E93';
    case 'cancelled':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { trips, locations } = useAppContext();

  const trip = trips.find((t) => t.id === id);
  const location = locations.find((l) => l.id === trip?.locationId);

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  const destinationName =
    location?.country ||
    location?.name ||
    trip.destination?.country ||
    trip.destination?.name ||
    'Unknown destination';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tripName}>{trip.name}</Text>
        <Text style={styles.destination}>{destinationName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Details</Text>
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Text>
        </View>

        {trip.travelStyle && (
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>{trip.travelStyle} Travel</Text>
          </View>
        )}

        {trip.dailyBudget && (
          <View style={styles.detailRow}>
            <FontAwesome name="money" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>
              ${trip.dailyBudget}/day
              {trip.totalBudget && ` (Total: $${trip.totalBudget.toLocaleString()})`}
            </Text>
          </View>
        )}
      </View>

      {Object.keys(trip.categories).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Categories</Text>
          {Object.entries(trip.categories).map(([category, amount]) => (
            <View key={category} style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryAmount}>${amount}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tripName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  destination: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryName: {
    fontSize: 16,
    color: '#1C1C1E',
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#057B8C',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 50,
  },
});
