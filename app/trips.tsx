import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from './context';
import { FontAwesome } from '@expo/vector-icons';
import { Trip } from './types';
import { useRouter } from 'expo-router';
import SwipeableTripCard from './components/SwipeableTripCard';

// Date-dependent status calculation
const getDateBasedStatus = (trip: Trip): 'planning' | 'upcoming' | 'active' | 'completed' => {
  const now = new Date();
  const start = trip.startDate ? new Date(trip.startDate) : null;
  const end = trip.endDate ? new Date(trip.endDate) : null;

  // If no dates are set, it's still in planning
  if (!start || !end) return 'planning';

  // Set time to start of day for accurate comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (today < startDate) return 'upcoming';
  if (today >= startDate && today <= endDate) return 'active';
  if (today > endDate) return 'completed';

  return 'planning';
};

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
    case 'upcoming':
      return '#FF9500';
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

const getStatusDisplayText = (status: string) => {
  switch (status) {
    case 'planning':
      return 'Planning';
    case 'upcoming':
      return 'Upcoming';
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
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

type FilterTab = 'upcoming' | 'planning' | 'completed';

const TabSelector = ({
  activeTab,
  onTabChange,
  tripCounts,
}: {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  tripCounts: Record<FilterTab, number>;
}) => {
  const tabs: { id: FilterTab; label: string; icon: string }[] = [
    { id: 'upcoming', label: 'Upcoming', icon: 'clock-o' },
    { id: 'planning', label: 'Planning', icon: 'edit' },
    { id: 'completed', label: 'Completed', icon: 'check' },
  ];

  return (
    <View style={styles.tabRow}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab, { flex: 1 }]}
          onPress={() => onTabChange(tab.id)}
        >
          <FontAwesome
            name={tab.icon as any}
            size={14}
            color={activeTab === tab.id ? '#FFFFFF' : '#8E8E93'}
          />
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.label}
          </Text>
          {tripCounts[tab.id] > 0 && (
            <View style={[styles.tabBadge, activeTab === tab.id && styles.activeTabBadge]}>
              <Text
                style={[styles.tabBadgeText, activeTab === tab.id && styles.activeTabBadgeText]}
              >
                {tripCounts[tab.id]}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function TripsScreen() {
  const { trips, deleteTrip } = useAppContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('upcoming');

  // Separate active trips from others
  const activeTrips = trips.filter((trip) => getDateBasedStatus(trip) === 'active');
  const otherTrips = trips.filter((trip) => getDateBasedStatus(trip) !== 'active');

  // Calculate trip counts by status (excluding active trips)
  const tripCounts = otherTrips.reduce(
    (counts, trip) => {
      const status = getDateBasedStatus(trip);
      if (status !== 'active') {
        counts[status as FilterTab] += 1;
      }
      return counts;
    },
    {
      upcoming: 0,
      planning: 0,
      completed: 0,
    } as Record<FilterTab, number>
  );

  // Filter trips based on active tab (excluding active trips)
  const filteredTrips = otherTrips.filter((trip) => getDateBasedStatus(trip) === activeTab);

  const handleAddNewTrip = () => {
    router.push('/trip/create' as any);
  };

  const handleEditTrip = (trip: Trip) => {
    // TODO: Navigate to edit trip screen
    Alert.alert('Edit Trip', 'Edit trip functionality will be implemented soon!');
  };

  const handleDeleteTrip = (tripId: string) => {
    const tripToDelete = trips.find((t) => t.id === tripId);
    if (!tripToDelete) return;

    try {
      deleteTrip(tripId);
      Alert.alert('Success', `"${tripToDelete.name}" has been deleted successfully!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete trip. Please try again.');
      console.error('Error deleting trip:', error);
    }
  };

  const renderTripCard = (trip: Trip, index: number, array: Trip[]) => {
    const location = undefined; // We'll get this from the context if needed
    const tripLength = calculateTripLength(trip.startDate, trip.endDate);
    const dateBasedStatus = getDateBasedStatus(trip);

    // Get destination name from location, trip.destination, or fallback
    const destinationName =
      trip.destination?.country || trip.destination?.name || 'Unknown destination';

    return (
      <SwipeableTripCard
        key={trip.id}
        trip={trip}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTrip}
        destinationName={destinationName}
        tripLength={tripLength}
        dateBasedStatus={dateBasedStatus}
        getStatusColor={getStatusColor}
        getStatusDisplayText={getStatusDisplayText}
        getTravelStyleColor={getTravelStyleColor}
        formatDate={formatDate}
        isLast={index === array.length - 1}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>My Trips</Text>
            <Text style={styles.subtitle}>
              {trips.length === 0
                ? 'Start planning your next adventure!'
                : `${trips.length} trip${trips.length === 1 ? '' : 's'}`}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNewTrip}>
            <FontAwesome name="plus" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="plane" size={64} color="#E5E5E5" />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to create your first trip and start planning your adventure!
            </Text>
          </View>
        ) : (
          <>
            {/* Active Trips Section */}
            {activeTrips.length > 0 && (
              <View style={styles.activeTripsSection}>
                <View style={styles.sectionHeader}>
                  <FontAwesome name="plane" size={20} color="#34C759" />
                  <Text style={styles.sectionTitle}>
                    Active Trip{activeTrips.length > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.tripsContainer}>
                  {activeTrips.map((trip, index) => renderTripCard(trip, index, activeTrips))}
                </View>
              </View>
            )}

            {/* Tabs and Other Trips */}
            {otherTrips.length > 0 && (
              <>
                <TabSelector
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  tripCounts={tripCounts}
                />

                {filteredTrips.length === 0 ? (
                  <View style={styles.emptyState}>
                    <FontAwesome name="search" size={64} color="#E5E5E5" />
                    <Text style={styles.emptyTitle}>No {activeTab} trips</Text>
                    <Text style={styles.emptySubtitle}>
                      You don't have any trips in this category yet.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.tripsContainer}>
                    {filteredTrips.map((trip, index) => renderTripCard(trip, index, filteredTrips))}
                  </View>
                )}
              </>
            )}
          </>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addButton: {
    backgroundColor: '#057B8C',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  activeTripsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 0,
    marginRight: 0,
    marginLeft: 0,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#057B8C',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#057B8C',
  },
  activeTabBadgeText: {
    color: '#FFFFFF',
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
});
