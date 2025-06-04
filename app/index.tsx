import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from './context';
import { useExpenseStore } from './stores/expenseStore';
import CurrencyConverter from './components/CurrencyConverter';
import MonthlyOverviewWidget from './components/MonthlyOverviewWidget';
import { PageTransition, StaggeredTransition, WidgetSkeleton } from './components/PageTransition';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const { trips } = useAppContext();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Get expenses from Zustand store
  const { getAllExpenses, getRecentExpenses, getExpensesByTripId, getGeneralExpenses } =
    useExpenseStore();

  const allExpenses = getAllExpenses();
  const recentExpenses = getRecentExpenses(5); // Get 5 recent expenses
  const generalExpenses = getGeneralExpenses();

  // Get active trip for trip snapshot
  const activeTrip = trips.find((trip) => trip.status === 'active');

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate data refresh - in a real app, this would refresh from API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // You could call refreshExpenses() here if it exists
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Calculate enhanced budget overview
  const calculateBudgetOverview = () => {
    if (!activeTrip) return { spent: 0, budget: 0, remaining: 0, percentage: 0 };
    const tripExpenses = getExpensesByTripId(activeTrip.id);
    const spent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budget = activeTrip.totalBudget || 0;
    const remaining = budget - spent;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    return { spent, budget, remaining, percentage };
  };

  // Get trip name for expense
  const getTripName = (tripId?: string) => {
    if (!tripId) return 'General';
    const trip = trips.find((t) => t.id === tripId);
    return trip ? trip.name : 'Unknown Trip';
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get emoji for expense category
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      food: '🍽️',
      transport: '🚗',
      accommodation: '🏨',
      activities: '🎯',
      shopping: '🛍️',
      health: '💊',
      communication: '📱',
      entertainment: '🎭',
      other: '📋',
    };
    return emojiMap[category] || '💰';
  };

  const budgetOverview = calculateBudgetOverview();

  // Trip progress bar calculation
  const getTripProgress = () => {
    if (!activeTrip) return 0;
    const start = new Date(activeTrip.startDate || '');
    const end = new Date(activeTrip.endDate || '');
    const now = new Date();
    if (now < start) return 0;
    if (now > end) return 100;
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
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
            tintColor="#0EA5E9"
            colors={['#0EA5E9']}
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        {/* Modern Header */}
        <PageTransition transitionType="slideUp" duration={600}>
          <LinearGradient colors={['#1E293B', '#0EA5E9']} style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIconContainer}>
                <FontAwesome name="globe" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Welcome back!</Text>
                <Text style={styles.headerSubtitle}>Here's your travel overview</Text>
              </View>
            </View>
          </LinearGradient>
        </PageTransition>

        <View style={styles.contentContainer}>
          <StaggeredTransition staggerDelay={150} transitionType="slideUp">
            {/* Current Trip Card */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Trip</Text>
              {activeTrip ? (
                <View style={styles.modernCard}>
                  <LinearGradient colors={['#0EA5E9', '#1E293B']} style={styles.tripCardGradient}>
                    <View style={styles.tripHeader}>
                      <View style={styles.tripInfo}>
                        <Text style={styles.tripName}>{activeTrip.name}</Text>
                        <View style={styles.tripLocationRow}>
                          <FontAwesome name="map-marker" size={14} color="#FFFFFF" />
                          <Text style={styles.tripDestination}>
                            {activeTrip.destination?.name || 'Unknown destination'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Active</Text>
                      </View>
                    </View>
                    <View style={styles.tripProgress}>
                      <View style={styles.tripProgressBar}>
                        <View
                          style={[styles.tripProgressFill, { width: `${getTripProgress()}%` }]}
                        />
                      </View>
                      <Text style={styles.tripProgressText}>
                        {(() => {
                          const endDate = new Date(activeTrip.endDate || '');
                          const now = new Date();
                          const diffTime = endDate.getTime() - now.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return diffDays > 0 ? `${diffDays} days remaining` : 'Trip completed';
                        })()}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View style={styles.modernCard}>
                  <View style={styles.emptyState}>
                    <FontAwesome name="plane" size={32} color="#64748B" style={styles.emptyIcon} />
                    <Text style={styles.emptyTitle}>No active trips</Text>
                    <Text style={styles.emptySubtitle}>Create a trip to get started</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Budget Overview Card */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Budget Overview</Text>
              {activeTrip ? (
                <View style={styles.modernCard}>
                  <View style={styles.budgetHeader}>
                    <View style={styles.budgetIconContainer}>
                      <FontAwesome name="money" size={20} color="#0EA5E9" />
                    </View>
                    <View style={styles.budgetInfo}>
                      <Text style={styles.budgetAmount}>
                        ${budgetOverview.spent.toLocaleString()}
                      </Text>
                      <Text style={styles.budgetTotal}>
                        of ${budgetOverview.budget.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.budgetPercentage}>
                      <Text style={styles.budgetPercentageText}>
                        {budgetOverview.percentage.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.budgetProgressContainer}>
                    <View style={styles.budgetProgressBar}>
                      <View
                        style={[
                          styles.budgetProgressFill,
                          { width: `${Math.min(budgetOverview.percentage, 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.budgetRemainingText}>
                      ${Math.abs(budgetOverview.remaining).toLocaleString()}{' '}
                      {budgetOverview.remaining >= 0 ? 'remaining' : 'over budget'}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.modernCard}>
                  <View style={styles.emptyState}>
                    <FontAwesome
                      name="pie-chart"
                      size={32}
                      color="#64748B"
                      style={styles.emptyIcon}
                    />
                    <Text style={styles.emptyTitle}>No budget data</Text>
                    <Text style={styles.emptySubtitle}>
                      Create a trip with budget to track spending
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Monthly Overview Widget */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>This Month's Overview</Text>
              <MonthlyOverviewWidget allExpenses={allExpenses} generalExpenses={generalExpenses} />
            </View>

            {/* Recent Expenses Card */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Expenses</Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => router.push('/finances')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <FontAwesome name="chevron-right" size={12} color="#0EA5E9" />
                </TouchableOpacity>
              </View>
              {recentExpenses.length > 0 ? (
                <View style={styles.modernCard}>
                  {recentExpenses.map((expense, index) => (
                    <View
                      key={expense.id}
                      style={[
                        styles.expenseItem,
                        index === recentExpenses.length - 1 && styles.lastExpenseItem,
                      ]}
                    >
                      <View style={styles.expenseIconContainer}>
                        <Text style={styles.expenseIcon}>{getCategoryEmoji(expense.category)}</Text>
                      </View>
                      <View style={styles.expenseDetails}>
                        <Text style={styles.expenseDescription}>{expense.description}</Text>
                        <View style={styles.expenseMetadata}>
                          <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                          <Text style={styles.expenseTrip}>• {getTripName(expense.tripId)}</Text>
                        </View>
                      </View>
                      <View style={styles.expenseAmountContainer}>
                        <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
                        <Text style={styles.expenseCurrency}>{expense.currency}</Text>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.addExpenseButton}
                    onPress={() => router.push('/expenses/add')}
                  >
                    <FontAwesome name="plus" size={16} color="#FFFFFF" />
                    <Text style={styles.addExpenseButtonText}>Add Expense</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.modernCard}>
                  <View style={styles.emptyState}>
                    <FontAwesome
                      name="file-text-o"
                      size={32}
                      color="#64748B"
                      style={styles.emptyIcon}
                    />
                    <Text style={styles.emptyTitle}>No expenses yet</Text>
                    <Text style={styles.emptySubtitle}>Start tracking your travel expenses</Text>
                    <TouchableOpacity
                      style={styles.addExpenseButton}
                      onPress={() => router.push('/expenses/add')}
                    >
                      <FontAwesome name="plus" size={16} color="#FFFFFF" />
                      <Text style={styles.addExpenseButtonText}>Add First Expense</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Quick Actions Card */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                  style={[styles.quickActionCard, { backgroundColor: '#0EA5E9' }]}
                  onPress={() => router.push('/expenses/add')}
                >
                  <View style={styles.quickActionIconContainer}>
                    <FontAwesome name="money" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.quickActionText}>Add Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickActionCard, { backgroundColor: '#10B981' }]}
                  onPress={() => router.push('/trip/create/trip-name')}
                >
                  <View style={styles.quickActionIconContainer}>
                    <FontAwesome name="plane" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.quickActionText}>Plan New Trip</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Currency Converter Card */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Currency Converter</Text>
              <View style={styles.modernCard}>
                <CurrencyConverter />
              </View>
            </View>
          </StaggeredTransition>
        </View>
      </ScrollView>
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
  // Header Styles
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Content Container
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  // Section Styles
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  // Modern Card System
  modernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  // Trip Card Styles
  tripCardGradient: {
    padding: 20,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tripLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripDestination: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripProgress: {
    marginTop: 8,
  },
  tripProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  tripProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  tripProgressText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Budget Card Styles
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  budgetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  budgetTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  budgetPercentage: {
    alignItems: 'flex-end',
  },
  budgetPercentageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  budgetProgressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 8,
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 4,
  },
  budgetRemainingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
  // Expense Item Styles
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastExpenseItem: {
    borderBottomWidth: 0,
  },
  expenseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  expenseIcon: {
    fontSize: 18,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  expenseMetadata: {
    flexDirection: 'row',
  },
  expenseDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  expenseTrip: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 2,
  },
  expenseCurrency: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  // Add Expense Button
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    margin: 20,
    marginTop: 12,
    borderRadius: 12,
    gap: 8,
  },
  addExpenseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionIconContainer: {
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Empty States
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
});
