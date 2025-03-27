import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppContext } from '../context';
import { formatDate } from '../utils/dateUtils';

export default function BudgetScreen() {
  const router = useRouter();
  const { trips } = useAppContext();

  // Sample data for placeholder trips if no trips exist yet
  const placeholderTrips = [
    {
      id: '1',
      destination: 'Paris, France',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
      totalBudget: 2500,
      travelStyle: 'Mid-range',
      emergencyFundPercentage: 15,
      categories: []
    },
    {
      id: '2',
      destination: 'Tokyo, Japan',
      startDate: '2024-08-10',
      endDate: '2024-08-20',
      totalBudget: 4000,
      travelStyle: 'Luxury',
      emergencyFundPercentage: 10,
      categories: []
    }
  ];

  // Use trips from context if available, otherwise use placeholder data
  const displayTrips = trips.length > 0 ? trips : placeholderTrips;

  const navigateToAddTrip = () => {
    router.push('/trip/select-method' as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Travel Budget</Text>
        <Text style={styles.headerSubtitle}>Plan your adventures</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Trips</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={navigateToAddTrip}
          >
            <FontAwesome name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Trip</Text>
          </TouchableOpacity>
        </View>

        {displayTrips.map((trip) => (
          <TouchableOpacity key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripDestination}>{trip.destination}</Text>
              <Text style={styles.tripStyle}>{trip.travelStyle}</Text>
            </View>
            <View style={styles.tripDates}>
              <FontAwesome name="calendar" size={14} color="#666666" />
              <Text style={styles.tripDateText}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Text>
            </View>
            <View style={styles.tripBudget}>
              <Text style={styles.tripBudgetLabel}>Total Budget:</Text>
              <Text style={styles.tripBudgetAmount}>${trip.totalBudget?.toLocaleString() || '0'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Categories</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: '#FFE5E5' }]}>
              <FontAwesome name="plane" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.categoryTitle}>Flights</Text>
            <Text style={styles.categoryAmount}>$800</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: '#E5F6FF' }]}>
              <FontAwesome name="hotel" size={24} color="#4A90E2" />
            </View>
            <Text style={styles.categoryTitle}>Accommodation</Text>
            <Text style={styles.categoryAmount}>$1,200</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: '#E5FFE5' }]}>
              <FontAwesome name="cutlery" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.categoryTitle}>Food</Text>
            <Text style={styles.categoryAmount}>$300</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: '#FFE5F6' }]}>
              <FontAwesome name="map-marker" size={24} color="#E91E63" />
            </View>
            <Text style={styles.categoryTitle}>Activities</Text>
            <Text style={styles.categoryAmount}>$200</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  tripStyle: {
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tripDates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDateText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  tripBudget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tripBudgetLabel: {
    fontSize: 14,
    color: '#666666',
  },
  tripBudgetAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
});
