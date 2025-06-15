import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from './context';
import { FontAwesome } from '@expo/vector-icons';
import { Trip, TripStatus } from './types';
import { useRouter } from 'expo-router';
import SwipeableTripCard from './components/SwipeableTripCard';
import { getStatusConfig } from './utils/tripStatus';

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

// Filter tabs based on new status system (excluding cancelled from main tabs)
type FilterTab = 'draft' | 'planning' | 'ready' | 'active' | 'completed';

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
    { id: 'draft', label: 'Draft', icon: 'edit' },
    { id: 'planning', label: 'Planning', icon: 'calendar' },
    { id: 'ready', label: 'Ready', icon: 'check-circle' },
    { id: 'active', label: 'Active', icon: 'map-marker' },
    { id: 'completed', label: 'Completed', icon: 'camera' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabScrollView}
      contentContainerStyle={styles.tabScrollContent}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
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
    </ScrollView>
  );
};

export default function TripsScreen() {
  const { trips, deleteTrip, calculateTripStatus, calculateCompletionPercentage } = useAppContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('planning');

  // Calculate current status for each trip and group them
  const tripsWithStatus = trips.map((trip) => ({
    ...trip,
    currentStatus: calculateTripStatus(trip),
    completionPercentage: calculateCompletionPercentage(trip),
  }));

  // Calculate trip counts by status (excluding cancelled)
  const tripCounts = tripsWithStatus.reduce(
    (counts, trip) => {
      if (trip.currentStatus !== 'cancelled') {
        counts[trip.currentStatus as FilterTab] += 1;
      }
      return counts;
    },
    {
      draft: 0,
      planning: 0,
      ready: 0,
      active: 0,
      completed: 0,
    } as Record<FilterTab, number>
  );

  // Filter trips based on active tab
  const filteredTrips = tripsWithStatus.filter((trip) => trip.currentStatus === activeTab);

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

  const renderTripCard = (trip: any, index: number, array: any[]) => {
    const tripLength = calculateTripLength(trip.startDate, trip.endDate);
    const statusConfig = getStatusConfig(trip.currentStatus);

    // Get destination name from trip.destination or fallback
    const destinationName = trip.destination?.name || 'Unknown destination';

    // Create helper functions for the old interface
    const getStatusColor = (status: string) => statusConfig.color;
    const getStatusDisplayText = (status: string) => statusConfig.label;

    return (
      <SwipeableTripCard
        key={trip.id}
        trip={trip}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTrip}
        destinationName={destinationName}
        tripLength={tripLength}
        dateBasedStatus={trip.currentStatus}
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
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.subtitle}>
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddNewTrip}>
        <FontAwesome name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} tripCounts={tripCounts} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="suitcase" size={64} color="#E5E5E5" />
            <Text style={styles.emptyTitle}>No {activeTab} trips</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'draft' && 'Start planning your next adventure!'}
              {activeTab === 'planning' && 'Create a new trip to start planning.'}
              {activeTab === 'ready' && 'Complete your trip planning to see ready trips here.'}
              {activeTab === 'active' && 'No trips currently in progress.'}
              {activeTab === 'completed' && 'Your travel memories will appear here.'}
            </Text>
            {(activeTab === 'draft' || activeTab === 'planning') && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddNewTrip}>
                <Text style={styles.emptyButtonText}>Create New Trip</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.tripsList}>
            {filteredTrips.map((trip, index, array) => renderTripCard(trip, index, array))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  addButton: {
    position: 'absolute',
    top: 75,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabScrollView: {
    maxHeight: 60,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  activeTabBadgeText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tripsList: {
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
