import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../context';
import ScreenHeader from '../../components/ScreenHeader';

export default function TripSelectionScreen() {
  const { trips } = useAppContext();
  const router = useRouter();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and group trips
  const filteredTrips = useMemo(() => {
    const filtered = trips.filter(
      (trip) =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    const upcomingOngoing = filtered.filter(
      (trip) => trip.status === 'planning' || trip.status === 'active'
    );

    const past = filtered.filter((trip) => trip.status === 'completed');

    return { upcomingOngoing, past };
  }, [trips, searchQuery]);

  const handleConfirm = () => {
    if (selectedTripId) {
      router.push(`/expenses/add/expense-details?tripId=${selectedTripId}`);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const getDestinationGradient = (destination: string): [string, string, ...string[]] => {
    const gradients: { [key: string]: [string, string, ...string[]] } = {
      paris: ['#FFB6C1', '#FFC0CB', '#E6E6FA'],
      tokyo: ['#87CEEB', '#4682B4', '#6495ED'],
      rome: ['#F4A460', '#DEB887', '#D2B48C'],
      barcelona: ['#FF7F50', '#FFA07A', '#FFB347'],
      london: ['#708090', '#778899', '#B0C4DE'],
      'new york': ['#FF6347', '#FF7F50', '#FFA500'],
      default: ['#43cea2', '#185a9d'],
    };

    const destLower = destination.toLowerCase();
    for (const [key, colors] of Object.entries(gradients)) {
      if (destLower.includes(key)) {
        return colors;
      }
    }
    return gradients.default;
  };

  const renderTripCard = (trip: any) => (
    <TouchableOpacity
      key={trip.id}
      style={[styles.tripCard, selectedTripId === trip.id && styles.tripCardSelected]}
      onPress={() => setSelectedTripId(trip.id)}
    >
      <View style={styles.tripImageContainer}>
        <LinearGradient
          colors={getDestinationGradient(trip.destination?.name || '')}
          style={styles.tripImage}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome name="map-marker" size={20} color="rgba(255,255,255,0.8)" />
        </LinearGradient>
      </View>

      <View style={styles.tripDetails}>
        <Text style={styles.tripName}>{trip.name}</Text>
        <Text style={styles.tripLocation}>{trip.destination?.name || 'Unknown destination'}</Text>
        <Text style={styles.tripDates}>
          {trip.startDate && trip.endDate
            ? `${new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'Dates TBD'}
        </Text>
      </View>

      {selectedTripId === trip.id && (
        <View style={styles.selectedIndicator}>
          <FontAwesome name="check" size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Select a trip" onClose={handleClose} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search trips"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Trip Lists */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Upcoming/Ongoing Trips */}
        {filteredTrips.upcomingOngoing.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming/Ongoing</Text>
            {filteredTrips.upcomingOngoing.map(renderTripCard)}
          </View>
        )}

        {/* Past Trips */}
        {filteredTrips.past.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past</Text>
            {filteredTrips.past.map(renderTripCard)}
          </View>
        )}

        {/* Empty State */}
        {filteredTrips.upcomingOngoing.length === 0 && filteredTrips.past.length === 0 && (
          <View style={styles.emptyState}>
            <FontAwesome name="suitcase" size={48} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No trips found' : 'No trips yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create a trip first to link expenses to it'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedTripId && styles.confirmButtonDisabled]}
          disabled={!selectedTripId}
          onPress={handleConfirm}
        >
          <LinearGradient
            colors={selectedTripId ? ['#43cea2', '#185a9d'] : ['#E5E5E5', '#E5E5E5']}
            style={styles.confirmButtonGradient}
          >
            <Text
              style={[
                styles.confirmButtonText,
                !selectedTripId && styles.confirmButtonTextDisabled,
              ]}
            >
              Confirm
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A2A36',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2A36',
    marginBottom: 16,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  tripCardSelected: {
    borderColor: '#43cea2',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  tripImageContainer: {
    marginRight: 16,
  },
  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tripDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  tripName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2A36',
    marginBottom: 4,
  },
  tripLocation: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 2,
  },
  tripDates: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#43cea2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43cea2',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmButtonContainer: {
    padding: 20,
    backgroundColor: 'rgba(246,248,251,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  confirmButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  confirmButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
