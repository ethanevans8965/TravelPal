import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from './context';
import CurrencyConverter from './components/CurrencyConverter';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const { trips, expenses } = useAppContext();
  const router = useRouter();

  // Get active trip for trip snapshot
  const activeTrip = trips.find((trip) => trip.status === 'active');

  // Calculate budget overview
  const calculateBudgetOverview = () => {
    if (!activeTrip) return { spent: 0, budget: 0, remaining: 0, percentage: 0 };
    const tripExpenses = expenses.filter((e) => e.tripId === activeTrip.id);
    const spent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budget = activeTrip.totalBudget || 0;
    const remaining = budget - spent;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    return { spent, budget, remaining, percentage };
  };

  // Get recent expenses (last 3)
  const getRecentExpenses = () => {
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Get emoji for expense category
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      food: '🍽️',
      transportation: '🚇',
      accommodation: '🏨',
      activities: '🎯',
      shopping: '🛍️',
      other: '💰',
    };
    return emojiMap[category] || '💰';
  };

  const budgetOverview = calculateBudgetOverview();
  const recentExpenses = getRecentExpenses();

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
    <View style={styles.rootBg}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Gradient Header */}
        <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.headerBg}>
          <View style={styles.headerContent}>
            <View style={styles.headerIconCircle}>
              <FontAwesome name="globe" size={32} color="#fff" />
            </View>
            <View>
              <Text style={styles.title}>Welcome back!</Text>
              <Text style={styles.subtitle}>Here's your travel overview</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Trip Snapshot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Trip</Text>
          {activeTrip ? (
            <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripName}>{activeTrip.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <FontAwesome name="map-marker" size={16} color="#fff" />
                    <Text style={styles.tripDestination}>
                      {activeTrip.destination?.name || 'Unknown destination'}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
              <View style={styles.tripDetails}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FontAwesome name="calendar" size={14} color="#fff" />
                  <Text style={styles.tripDates}>
                    {activeTrip.startDate} - {activeTrip.endDate}
                  </Text>
                </View>
                <View style={styles.tripProgressBarBg}>
                  <View style={[styles.tripProgressBarFill, { width: `${getTripProgress()}%` }]} />
                </View>
                <Text style={styles.tripDuration}>
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
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No active trips</Text>
              <Text style={styles.emptySubtext}>Create a trip to get started</Text>
            </View>
          )}
        </View>

        {/* Budget Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          {activeTrip ? (
            <LinearGradient colors={['#ffb347', '#ffcc33']} style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <FontAwesome name="money" size={22} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.budgetTitle}>
                  ${budgetOverview.spent.toLocaleString()} / $
                  {budgetOverview.budget.toLocaleString()}
                </Text>
              </View>
              <View style={styles.budgetProgressBarBg}>
                <View
                  style={[
                    styles.budgetProgressBarFill,
                    { width: `${Math.min(budgetOverview.percentage, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.budgetStatus}>
                <FontAwesome name="pie-chart" size={14} color="#fff" /> $
                {Math.abs(budgetOverview.remaining).toLocaleString()}{' '}
                {budgetOverview.remaining >= 0 ? 'remaining' : 'over budget'} •{' '}
                {budgetOverview.percentage.toFixed(0)}% used
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No budget data</Text>
              <Text style={styles.emptySubtext}>Create a trip with budget to track spending</Text>
            </View>
          )}
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {recentExpenses.length > 0 ? (
            <View style={styles.expensesCard}>
              {recentExpenses.map((expense, index) => (
                <View
                  key={expense.id}
                  style={[
                    styles.expenseItem,
                    index === recentExpenses.length - 1 && styles.lastExpenseItem,
                  ]}
                >
                  <View style={styles.expenseIcon}>
                    <Text style={styles.expenseIconText}>{getCategoryEmoji(expense.category)}</Text>
                  </View>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseName}>{expense.description}</Text>
                    <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addExpenseBtn}
                onPress={() => router.push('/expenses/add')}
              >
                <FontAwesome name="plus" size={16} color="#fff" />
                <Text style={styles.addExpenseBtnText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>Start tracking your travel expenses</Text>
              <TouchableOpacity
                style={styles.addExpenseBtn}
                onPress={() => router.push('/expenses/add')}
              >
                <FontAwesome name="plus" size={16} color="#fff" />
                <Text style={styles.addExpenseBtnText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#43cea2' }]}
              onPress={() => router.push('/expenses/add')}
            >
              <FontAwesome name="money" size={24} color="#fff" />
              <Text style={styles.actionText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ffb347' }]}
              onPress={() => router.push('/trip/create/trip-name')}
            >
              <FontAwesome name="plane" size={24} color="#fff" />
              <Text style={styles.actionText}>Plan New Trip</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency Converter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency Converter</Text>
          <View style={styles.converterCard}>
            <CurrencyConverter />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootBg: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerBg: {
    paddingTop: 56,
    paddingBottom: 36,
    paddingHorizontal: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 18,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  headerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#fff',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0f7fa',
    fontWeight: '500',
  },
  section: {
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  tripCard: {
    borderRadius: 18,
    padding: 20,
    shadowColor: '#43cea2',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 0,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  tripDestination: {
    fontSize: 14,
    color: '#e0f7fa',
    marginLeft: 2,
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripDetails: {
    marginTop: 8,
  },
  tripDates: {
    fontSize: 14,
    color: '#e0f7fa',
    marginBottom: 4,
    marginLeft: 2,
  },
  tripProgressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  tripProgressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  tripDuration: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 2,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  budgetCard: {
    borderRadius: 18,
    padding: 20,
    shadowColor: '#ffb347',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 0,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  budgetProgressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  budgetProgressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  budgetStatus: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 2,
  },
  expensesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 0,
    marginBottom: 0,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIconText: {
    fontSize: 20,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  lastExpenseItem: {
    borderBottomWidth: 0,
  },
  addExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#43cea2',
    borderRadius: 12,
    paddingVertical: 10,
    margin: 16,
    marginTop: 8,
    gap: 8,
    shadowColor: '#43cea2',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  addExpenseBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 0,
    gap: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  converterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
