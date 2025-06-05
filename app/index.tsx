import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from './context';
import { useExpenseStore } from './stores/expenseStore';
import { useTripStore } from './stores/tripStore';
import { useLocationStore } from './stores/locationStore';
import { useUserStore } from './stores/userStore';
import MonthlyOverviewWidget from './components/MonthlyOverviewWidget';
import QuickStatsGrid from './components/dashboard/QuickStatsGrid';
import RecentActivityCard from './components/dashboard/RecentActivityCard';
import QuickExpenseWidget from './components/dashboard/QuickExpenseWidget';
import BudgetProgressWidget from './components/dashboard/BudgetProgressWidget';
import SmartInsightsWidget from './components/dashboard/SmartInsightsWidget';
import TrendGraphWidget from './components/dashboard/TrendGraphWidget';
import FloatingActionMenu from './components/dashboard/FloatingActionMenu';
import CurrencyConverter from './components/CurrencyConverter';
import { PageTransition, StaggeredTransition } from './components/PageTransition';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard() {
  const { trips, expenses } = useAppContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Store access for performance-critical operations
  const allExpenses = useExpenseStore((state) => state.getAllExpenses)();
  const recentExpenses = useExpenseStore((state) => state.getRecentExpenses)(5);
  const generalExpenses = useExpenseStore((state) => state.getGeneralExpenses)();
  const activeTrips = useTripStore((state) => state.getCurrentTrips)();
  const upcomingTrips = useTripStore((state) => state.getUpcomingTrips)();
  const locations = useLocationStore((state) => state.locations);
  const { dailyBudget, baseCurrency } = useUserStore();

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate data refresh - in a real app, this would refresh from API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Calculate quick stats
  const quickStats = [
    {
      label: 'Total Trips',
      value: trips.length,
      icon: 'plane',
      color: '#057B8C',
    },
    {
      label: 'This Month',
      value: allExpenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        return expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
          ? sum + expense.amount
          : sum;
      }, 0),
      icon: 'money',
      color: '#10B981',
      prefix: '$',
    },
    {
      label: 'Locations',
      value: locations.length,
      icon: 'map-marker',
      color: '#8B5CF6',
    },
    {
      label: 'Budget Health',
      value: activeTrips.length > 0 ? 85 : 100, // Example calculation
      icon: 'heart',
      color: '#F59E0B',
      suffix: '%',
    },
  ];

  // Convert recent expenses to activity items
  const recentActivities = recentExpenses.map((expense) => ({
    id: expense.id,
    type: 'expense' as const,
    title: expense.description,
    subtitle: trips.find((t) => t.id === expense.tripId)?.name || 'General',
    amount: expense.amount,
    currency: expense.currency,
    timestamp: expense.date,
    icon: getCategoryIcon(expense.category),
    color: getCategoryColor(expense.category),
  }));

  // Get category icon
  function getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      food: 'cutlery',
      transport: 'car',
      accommodation: 'bed',
      activities: 'star',
      shopping: 'shopping-bag',
      health: 'plus-square',
      communication: 'phone',
      entertainment: 'film',
      other: 'question',
    };
    return iconMap[category] || 'money';
  }

  // Get category color
  function getCategoryColor(category: string): string {
    const colorMap: Record<string, string> = {
      food: '#F59E0B',
      transport: '#3B82F6',
      accommodation: '#8B5CF6',
      activities: '#10B981',
      shopping: '#EF4444',
      health: '#F97316',
      communication: '#6366F1',
      entertainment: '#EC4899',
      other: '#6B7280',
    };
    return colorMap[category] || '#6B7280';
  }

  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Format current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#057B8C"
            colors={['#057B8C']}
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        {/* Modern Header */}
        <PageTransition transitionType="slideUp" duration={600}>
          <LinearGradient
            colors={['#057B8C', '#0EA5E9']}
            style={[styles.header, { paddingTop: insets.top + 16 }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerMain}>
                <Text style={styles.headerGreeting}>{getGreeting()}!</Text>
                <Text style={styles.headerDate}>{getCurrentDate()}</Text>
              </View>
              <TouchableOpacity
                style={styles.headerAction}
                onPress={() => router.push('/expenses/add' as any)}
              >
                <FontAwesome name="plus" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </PageTransition>

        <View style={styles.contentContainer}>
          <StaggeredTransition staggerDelay={150} transitionType="slideUp">
            {/* Quick Stats Grid */}
            <QuickStatsGrid stats={quickStats} />

            {/* Smart Insights Widget */}
            <View style={styles.section}>
              <SmartInsightsWidget />
            </View>

            {/* Active Trip Card (if exists) */}
            {activeTrips.length > 0 && (
              <View style={styles.section}>
                <LinearGradient colors={['#0EA5E9', '#057B8C']} style={styles.activeTripCard}>
                  <View style={styles.activeTripHeader}>
                    <View style={styles.activeTripInfo}>
                      <Text style={styles.activeTripTitle}>Active Trip</Text>
                      <Text style={styles.activeTripName}>{activeTrips[0].name}</Text>
                    </View>
                    <View style={styles.activeTripBadge}>
                      <FontAwesome name="plane" size={20} color="#FFFFFF" />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.activeTripAction}
                    onPress={() => router.push(`/trip/${activeTrips[0].id}` as any)}
                  >
                    <Text style={styles.activeTripActionText}>View Details</Text>
                    <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}

            {/* Budget Progress Widget */}
            <View style={styles.section}>
              <BudgetProgressWidget />
            </View>

            {/* Monthly Overview Widget */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>This Month's Overview</Text>
              <MonthlyOverviewWidget allExpenses={allExpenses} generalExpenses={generalExpenses} />
            </View>

            {/* Trend Graph Widget */}
            <View style={styles.section}>
              <TrendGraphWidget />
            </View>

            {/* Quick Expense Entry */}
            <View style={styles.section}>
              <QuickExpenseWidget
                onExpenseAdded={() => {
                  // Optionally refresh data or show success
                  console.log('Expense added successfully');
                }}
              />
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <RecentActivityCard
                activities={recentActivities}
                onActivityPress={(activity) => {
                  // Navigate to expense details
                  console.log('Activity pressed:', activity);
                }}
                onViewAllPress={() => router.push('/finances' as any)}
              />
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={[styles.quickActionCard, { backgroundColor: '#057B8C' }]}
                  onPress={() => router.push('/expenses/add' as any)}
                >
                  <FontAwesome name="money" size={24} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Add Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionCard, { backgroundColor: '#10B981' }]}
                  onPress={() => router.push('/trip/create/trip-name' as any)}
                >
                  <FontAwesome name="plane" size={24} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>New Trip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionCard, { backgroundColor: '#8B5CF6' }]}
                  onPress={() => router.push('/trips' as any)}
                >
                  <FontAwesome name="list" size={24} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>View Trips</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionCard, { backgroundColor: '#F59E0B' }]}
                  onPress={() => router.push('/finances' as any)}
                >
                  <FontAwesome name="bar-chart" size={24} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Analytics</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Currency Converter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Currency Converter</Text>
              <View style={styles.currencyCard}>
                <CurrencyConverter />
              </View>
            </View>
          </StaggeredTransition>
        </View>
      </ScrollView>

      {/* Floating Action Menu */}
      <FloatingActionMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerMain: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerAction: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  activeTripCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  activeTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeTripInfo: {
    flex: 1,
  },
  activeTripTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  activeTripName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeTripBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTripAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  activeTripActionText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  currencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
