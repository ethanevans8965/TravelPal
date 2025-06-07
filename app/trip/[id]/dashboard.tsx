import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '../../context';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/ui/Button';

type ModuleStatus = 'empty' | 'partial' | 'complete';

interface DashboardModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: [string, string];
  status: ModuleStatus;
  description: string;
  onPress: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function TripDashboardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { trips, updateTrip } = useAppContext();

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={48} color="#FFFFFF" />
          <Text style={styles.errorTitle}>Trip Not Found</Text>
          <Text style={styles.errorText}>The trip you're looking for doesn't exist.</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="secondary" />
        </View>
      </LinearGradient>
    );
  }

  // Calculate status for each module
  const getDestinationStatus = (): ModuleStatus => {
    if (trip!.destination?.name) return 'complete';
    return 'empty';
  };

  const getDatesStatus = (): ModuleStatus => {
    if (trip!.startDate && trip!.endDate) return 'complete';
    if (trip!.startDate || trip!.endDate) return 'partial';
    return 'empty';
  };

  const getBudgetStatus = (): ModuleStatus => {
    if (trip!.budgetMethod === 'no-budget') return 'empty';
    if (trip!.totalBudget || trip!.dailyBudget) return 'complete';
    return 'empty';
  };

  const getItineraryStatus = (): ModuleStatus => {
    return 'empty';
  };

  function getDatesDescription(): string {
    if (trip!.startDate && trip!.endDate) {
      const start = new Date(trip!.startDate);
      const end = new Date(trip!.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} day adventure`;
    }
    if (trip!.startDate) {
      return `Departure set`;
    }
    if (trip!.endDate) {
      return `Return set`;
    }
    return 'When are you traveling?';
  }

  function getBudgetDescription(): string {
    if (trip!.budgetMethod === 'no-budget') {
      return 'Track as you go';
    }
    if (trip!.totalBudget) {
      return `$${trip!.totalBudget.toLocaleString()} budget`;
    }
    if (trip!.dailyBudget) {
      return `$${trip!.dailyBudget.toLocaleString()}/day`;
    }
    return 'How much to spend?';
  }

  // Calculate overall progress
  const getOverallProgress = () => {
    const statuses = [
      getDestinationStatus(),
      getDatesStatus(),
      getBudgetStatus(),
      getItineraryStatus(),
    ];

    const completed = statuses.filter((status) => status === 'complete').length;
    const partial = statuses.filter((status) => status === 'partial').length;

    return {
      completed,
      partial,
      total: statuses.length,
      percentage: Math.round(((completed * 1 + partial * 0.5) / statuses.length) * 100),
    };
  };

  // Module configurations with travel-themed gradients
  const modules: DashboardModule[] = [
    {
      id: 'destination',
      title: 'Destinations',
      subtitle: 'Where to?',
      icon: 'map-marker',
      gradient: ['#ff6b6b', '#ee5a52'],
      status: getDestinationStatus(),
      description: trip!.destination?.name || 'Choose your destination',
      onPress: () => {
        Alert.alert('Coming Soon', 'Destination editing will be available soon!');
      },
    },
    {
      id: 'dates',
      title: 'Travel Dates',
      subtitle: 'When?',
      icon: 'calendar',
      gradient: ['#4ecdc4', '#44a08d'],
      status: getDatesStatus(),
      description: getDatesDescription(),
      onPress: () => {
        Alert.alert('Coming Soon', 'Date editing will be available soon!');
      },
    },
    {
      id: 'budget',
      title: 'Budget',
      subtitle: 'How much?',
      icon: 'dollar',
      gradient: ['#45b7d1', '#96c93d'],
      status: getBudgetStatus(),
      description: getBudgetDescription(),
      onPress: () => {
        Alert.alert('Coming Soon', 'Budget editing will be available soon!');
      },
    },
    {
      id: 'itinerary',
      title: 'Itinerary',
      subtitle: 'What to do?',
      icon: 'list',
      gradient: ['#a8edea', '#fed6e3'],
      status: getItineraryStatus(),
      description: 'Plan your adventures',
      onPress: () => {
        Alert.alert('Coming Soon', 'Itinerary planning will be available soon!');
      },
    },
  ];

  const progress = getOverallProgress();

  const getStatusIcon = (status: ModuleStatus) => {
    switch (status) {
      case 'complete':
        return { name: 'check-circle', color: '#4CAF50' };
      case 'partial':
        return { name: 'clock-o', color: '#FF9500' };
      default:
        return { name: 'circle-o', color: '#E0E0E0' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Hero Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.heroSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroContent}>
          <View style={styles.headerTop}>
            <View style={styles.tripInfo}>
              <Text style={styles.tripName}>{trip!.name}</Text>
              <Text style={styles.tripSubtitle}>
                {trip!.destination?.name || 'Destination awaits'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                Alert.alert('Trip Options', 'Trip settings will be available soon!');
              }}
            >
              <FontAwesome name="ellipsis-h" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressRing}>
              <View style={styles.progressRingInner}>
                <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
                <Text style={styles.progressLabel}>Ready</Text>
              </View>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {progress.completed} of {progress.total} sections completed
              </Text>
              <Text style={styles.progressSubtext}>
                {progress.percentage === 100 ? "You're all set!" : "Let's keep planning!"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Planning Modules */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>Plan Your Trip</Text>
          <View style={styles.modulesContainer}>
            {modules.map((module, index) => {
              const statusIcon = getStatusIcon(module.status);

              return (
                <TouchableOpacity
                  key={module.id}
                  style={styles.moduleCard}
                  onPress={module.onPress}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={module.gradient}
                    style={styles.moduleGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.moduleHeader}>
                      <View style={styles.moduleIconContainer}>
                        <FontAwesome name={module.icon as any} size={24} color="#FFFFFF" />
                      </View>
                      <View style={styles.moduleStatus}>
                        <FontAwesome
                          name={statusIcon.name as any}
                          size={16}
                          color={statusIcon.color}
                        />
                      </View>
                    </View>

                    <View style={styles.moduleContent}>
                      <Text style={styles.moduleTitle}>{module.title}</Text>
                      <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                      <Text style={styles.moduleDescription}>{module.description}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push(`/expenses/add/expense-details?tripId=${trip!.id}`)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#ff7b7b', '#ff6b6b']} style={styles.quickActionGradient}>
                <FontAwesome name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Add Expense</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Coming Soon', 'Journal entry will be available soon!')}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.quickActionGradient}>
                <FontAwesome name="edit" size={20} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Add Note</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  heroSection: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  heroContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tripSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressRingInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '800',
    color: '#667eea',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#667eea',
    marginTop: 1,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  progressSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  modulesSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  modulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: (screenWidth - 52) / 2, // Account for padding and gap
    height: 160,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  moduleGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleContent: {
    marginTop: 8,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  moduleSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    lineHeight: 14,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (screenWidth - 52) / 2,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
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
  bottomSpacing: {
    height: 40,
  },
});
