import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from './context';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Trip } from './types';

const getTravelStyleColor = (travelStyle?: string) => {
  switch (travelStyle?.toLowerCase()) {
    case 'budget':
      return '#34C759';
    case 'mid-range':
      return '#FF9500';
    case 'luxury':
      return '#AF52DE';
    default:
      return '#8E8E93';
  }
};

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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const calculateTripLength = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const TripCard = ({ trip }: { trip: Trip }) => {
  const { locations } = useAppContext();
  const location = locations.find((l) => l.id === trip.locationId);
  const tripLength = calculateTripLength(trip.startDate, trip.endDate);

  // Get destination name from location, trip.destination, or fallback
  const destinationName =
    location?.country ||
    location?.name ||
    trip.destination?.country ||
    trip.destination?.name ||
    'Unknown destination';

  return (
    <TouchableOpacity style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripTitleContainer}>
          <Text style={styles.tripName}>{trip.name}</Text>
          <Text style={styles.tripDestination}>{destinationName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={14} color="#8E8E93" />
          <Text style={styles.detailText}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            {tripLength && ` (${tripLength} days)`}
          </Text>
        </View>

        {trip.travelStyle && (
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={14} color={getTravelStyleColor(trip.travelStyle)} />
            <Text style={styles.detailText}>{trip.travelStyle} Travel</Text>
          </View>
        )}

        {trip.dailyBudget && (
          <View style={styles.detailRow}>
            <FontAwesome name="money" size={14} color="#8E8E93" />
            <Text style={styles.detailText}>
              ${trip.dailyBudget}/day
              {trip.totalBudget && ` (Total: $${trip.totalBudget.toLocaleString()})`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.tripFooter}>
        <View style={styles.categoryIndicators}>
          {Object.entries(trip.categories)
            .slice(0, 3)
            .map(([category, amount]) => (
              <View key={category} style={styles.categoryDot}>
                <Text style={styles.categoryAmount}>${amount}</Text>
                <Text style={styles.categoryName}>{category}</Text>
              </View>
            ))}
          {Object.keys(trip.categories).length > 3 && (
            <Text style={styles.moreCategories}>
              +{Object.keys(trip.categories).length - 3} more
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TripsScreen() {
  const { trips } = useAppContext();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Trips',
          headerStyle: {
            backgroundColor: '#057B8C',
          },
          headerTintColor: '#FFFFFF',
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>
          <Text style={styles.subtitle}>
            {trips.length === 0
              ? 'Start planning your next adventure!'
              : `${trips.length} trip${trips.length === 1 ? '' : 's'}`}
          </Text>
        </View>

        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="plane" size={64} color="#E5E5E5" />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to create your first trip and start planning your adventure!
            </Text>
          </View>
        ) : (
          <View style={styles.tripsContainer}>
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  tripsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tripCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  tripName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 15,
    color: '#8E8E93',
  },
  statusBadge: {
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
  tripDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#1C1C1E',
    marginLeft: 8,
    flex: 1,
  },
  tripFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
  },
  categoryIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryDot: {
    marginRight: 16,
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  categoryName: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  moreCategories: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});
