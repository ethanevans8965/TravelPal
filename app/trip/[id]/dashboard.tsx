import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '../../context';
import { useTripStore } from '../../stores/tripStore';
import { Leg } from '../../types';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';
import DestinationModal from '../../components/dashboard/DestinationModal';
import LegTimeline from '../../components/LegTimeline';
import AddLegModal from '../../components/AddLegModal';

const { width: screenWidth } = Dimensions.get('window');

export default function TripDashboardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { trips, updateTrip, getTripExpenses } = useAppContext();
  const { getLegsByTrip, addLeg } = useTripStore();
  const [destinationModalVisible, setDestinationModalVisible] = useState(false);
  const [addLegModalVisible, setAddLegModalVisible] = useState(false);
  const [selectedLegId, setSelectedLegId] = useState<string | undefined>();

  const trip = trips.find((t) => t.id === id);
  const tripLegs = trip ? getLegsByTrip(trip.id) : [];

  if (!trip) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={48} color="#FFFFFF" />
          <Text style={styles.errorTitle}>Trip Not Found</Text>
          <Text style={styles.errorText}>The trip you're looking for doesn't exist.</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="secondary" />
        </View>
      </View>
    );
  }

  const expenses = getTripExpenses(trip.id);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetLeft = (trip.totalBudget || 0) - totalSpent;
  const budgetUsagePercentage = trip.totalBudget ? (totalSpent / trip.totalBudget) * 100 : 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getDateRangeText = () => {
    // Use legs data if available, fallback to trip dates
    if (tripLegs.length > 0) {
      const legsWithDates = tripLegs.filter((leg) => leg.startDate && leg.endDate);
      if (legsWithDates.length > 0) {
        const sortedLegs = legsWithDates.sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        const earliestStart = sortedLegs[0].startDate;
        const latestEnd = sortedLegs.reduce(
          (latest, leg) => (new Date(leg.endDate) > new Date(latest) ? leg.endDate : latest),
          sortedLegs[0].endDate
        );

        return `${formatDate(earliestStart)} – ${formatDate(latestEnd)}`;
      }
    }

    // Fallback to original trip dates
    if (trip.startDate && trip.endDate) {
      return `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`;
    }
    if (trip.startDate) {
      return `From ${formatDate(trip.startDate)}`;
    }
    if (trip.endDate) {
      return `Until ${formatDate(trip.endDate)}`;
    }
    return 'Flexible dates';
  };

  const getCountriesText = () => {
    // Use legs data if available
    if (tripLegs.length > 0) {
      const countries = tripLegs.map((leg) => leg.country);
      const uniqueCountries = Array.from(new Set(countries)); // Remove duplicates but preserve order of first occurrence

      if (uniqueCountries.length <= 3) {
        return uniqueCountries.join(' • ');
      } else {
        return `${uniqueCountries.slice(0, 2).join(' • ')} • +${uniqueCountries.length - 2} more`;
      }
    }

    // Fallback to original trip data
    if (trip.countries && trip.countries.length > 0) {
      return trip.countries.join(' • ');
    }
    return trip.destination?.country || 'Add destinations';
  };

  const getLegCountText = () => {
    if (tripLegs.length === 0) return '';
    if (tripLegs.length === 1) return '1 leg';
    return `${tripLegs.length} legs`;
  };

  const handleDestinationSave = async (destination: { name: string; country: string }) => {
    try {
      const updatedTrip = {
        ...trip,
        destination: {
          id: 'destination-' + Date.now(),
          name: destination.name,
          country: destination.country,
          timezone: 'UTC',
        },
        locationId: 'destination-' + Date.now(),
      };

      updateTrip(updatedTrip);
      setDestinationModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update destination. Please try again.');
    }
  };

  const handleLegSelect = (legId: string) => {
    setSelectedLegId(selectedLegId === legId ? undefined : legId);
  };

  const handleAddLeg = () => {
    setAddLegModalVisible(true);
  };

  const handleAddLegSave = (legData: Omit<Leg, 'id'>) => {
    try {
      addLeg(legData);
      setAddLegModalVisible(false);
      Alert.alert('Success', 'Leg added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add leg. Please try again.');
    }
  };

  // Get actual itinerary data or show empty state
  const getItineraryItems = () => {
    if (trip.itinerary && trip.itinerary.length > 0) {
      return trip.itinerary;
    }
    return [];
  };

  const itineraryItems = getItineraryItems();

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=960&q=80',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(23,23,23,0.3)', 'rgba(23,23,23,0.8)']}
            style={styles.heroGradient}
          >
            {/* Navigation Header */}
            <View style={styles.heroHeader}>
              <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/trips')}>
                <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => Alert.alert('Coming Soon', 'Favorites feature coming soon!')}
              >
                <FontAwesome name="heart-o" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Trip Info */}
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{trip.name}</Text>
              <View style={styles.heroSubtitle}>
                <FontAwesome name="map-pin" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroSubtitleText}>
                  {getCountriesText()}
                  {tripLegs.length > 0 && ` • ${getLegCountText()}`}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Leg Timeline */}
      {tripLegs.length > 0 && (
        <LegTimeline
          legs={tripLegs}
          selectedLegId={selectedLegId}
          onLegSelect={handleLegSelect}
          onAddLeg={handleAddLeg}
        />
      )}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <FontAwesome name="calendar" size={12} color="rgba(255,255,255,0.6)" />
              <Text style={styles.statLabel}>Dates</Text>
            </View>
            <Text style={styles.statValue}>{getDateRangeText()}</Text>
          </View>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => setDestinationModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.statHeader}>
              <FontAwesome name="globe" size={12} color="rgba(255,255,255,0.6)" />
              <Text style={styles.statLabel}>Legs</Text>
            </View>
            <Text style={styles.statValue}>{getLegCountText()}</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <FontAwesome name="credit-card" size={12} color="rgba(255,255,255,0.6)" />
              <Text style={styles.statLabel}>Budget</Text>
            </View>
            <Text style={styles.statValue}>
              {trip.totalBudget ? `$${trip.totalBudget.toLocaleString()}` : 'No budget'}
            </Text>
          </View>
        </View>

        {/* Budget Progress */}
        {trip.totalBudget && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Usage</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(budgetUsagePercentage, 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>${totalSpent.toLocaleString()} spent</Text>
                <Text style={styles.progressLabel}>${budgetLeft.toLocaleString()} left</Text>
              </View>
            </View>
          </View>
        )}

        {/* Expense Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Breakdown</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <FontAwesome name="pie-chart" size={48} color="rgba(255,255,255,0.3)" />
              <Text style={styles.chartPlaceholderText}>
                {expenses.length > 0 ? 'Chart coming soon' : 'No expenses yet'}
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming Itinerary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Itinerary</Text>
          <View style={styles.itineraryContainer}>
            {itineraryItems.length > 0 ? (
              itineraryItems.map((item, index) => (
                <View key={index} style={styles.itineraryItem}>
                  <View style={styles.itineraryIcon}>
                    <FontAwesome name={item.icon as any} size={16} color="#3B82F6" />
                  </View>
                  <View
                    style={[
                      styles.itineraryContent,
                      index < itineraryItems.length - 1 && styles.itineraryContentBorder,
                    ]}
                  >
                    <View style={styles.itineraryHeader}>
                      <Text style={styles.itineraryDate}>{item.date}</Text>
                      <Text style={styles.itineraryTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.itinerarySubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome name="calendar-o" size={48} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyStateText}>No itinerary items yet</Text>
                <Text style={styles.emptyStateSubtext}>Add activities and events to your trip</Text>
              </View>
            )}
          </View>
        </View>

        {/* Add Expense Button */}
        <TouchableOpacity
          style={styles.addExpenseButton}
          onPress={() => router.push(`/expenses/add/expense-details?tripId=${trip.id}`)}
          activeOpacity={0.8}
        >
          <FontAwesome name="plus-circle" size={20} color="#FFFFFF" />
          <Text style={styles.addExpenseText}>Add Expense</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Destination Modal */}
      <DestinationModal
        visible={destinationModalVisible}
        trip={trip}
        onClose={() => setDestinationModalVisible(false)}
        onSave={handleDestinationSave}
      />

      {/* Add Leg Modal */}
      <AddLegModal
        visible={addLegModalVisible}
        tripId={trip.id}
        onClose={() => setAddLegModalVisible(false)}
        onSave={handleAddLegSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717', // neutral-900
  },

  // Hero Section
  heroContainer: {
    height: 220, // Increased from 208 to give more space
  },
  heroImage: {
    flex: 1,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  heroButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(38,38,38,0.6)', // neutral-800/60
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    paddingHorizontal: 16,
    paddingBottom: 20, // Increased from 16 to 20
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12, // Increased from 8 to 12
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSubtitleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    lineHeight: 18, // Added line height for better text spacing
  },

  // Content
  content: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#171717',
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Quick Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(38,38,38,0.7)', // neutral-800/70
    borderWidth: 1,
    borderColor: '#404040', // neutral-700
    borderRadius: 8,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  // Budget Progress
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#262626', // neutral-800
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6', // blue-600
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },

  // Chart
  chartContainer: {
    backgroundColor: 'rgba(38,38,38,0.7)',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    padding: 16,
  },
  chartPlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 12,
  },

  // Itinerary
  itineraryContainer: {
    marginTop: 8,
  },
  itineraryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itineraryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itineraryContent: {
    flex: 1,
    paddingBottom: 12,
  },
  itineraryContentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itineraryDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  itineraryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  itinerarySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },

  // Add Expense Button
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addExpenseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 40,
  },

  // Empty State
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    textAlign: 'center',
  },
});
