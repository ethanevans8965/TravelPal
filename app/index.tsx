import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from './context';

export default function Index() {
  const { trips, expenses } = useAppContext();

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Here's your travel overview</Text>
      </View>

      {/* Trip Snapshot */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Trip</Text>
        {activeTrip ? (
          <View style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View style={styles.tripInfo}>
                <Text style={styles.tripName}>{activeTrip.name}</Text>
                <Text style={styles.tripDestination}>
                  {activeTrip.destination?.name || 'Unknown destination'}
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            <View style={styles.tripDetails}>
              <Text style={styles.tripDates}>
                {activeTrip.startDate} - {activeTrip.endDate}
              </Text>
              <Text style={styles.tripDuration}>
                {/* Calculate days remaining */}
                {(() => {
                  const endDate = new Date(activeTrip.endDate || '');
                  const now = new Date();
                  const diffTime = endDate.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? `${diffDays} days remaining` : 'Trip completed';
                })()}
              </Text>
            </View>
          </View>
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
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetTitle}>
                ${budgetOverview.spent.toLocaleString()} / ${budgetOverview.budget.toLocaleString()}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(budgetOverview.percentage, 100)}%`,
                    backgroundColor:
                      budgetOverview.percentage > 90
                        ? '#FF3B30'
                        : budgetOverview.percentage > 75
                          ? '#FF9500'
                          : '#057B8C',
                  },
                ]}
              />
            </View>
            <Text style={styles.budgetStatus}>
              ${Math.abs(budgetOverview.remaining).toLocaleString()}{' '}
              {budgetOverview.remaining >= 0 ? 'remaining' : 'over budget'} •{' '}
              {budgetOverview.percentage.toFixed(0)}% used
            </Text>
          </View>
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
          <View style={styles.expensesList}>
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
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>Start tracking your travel expenses</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>💰</Text>
            </View>
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>✈️</Text>
            </View>
            <Text style={styles.actionText}>Plan New Trip</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Currency Converter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency Converter</Text>
        <View style={styles.converterCard}>
          <Text style={styles.converterText}>Currency conversion feature coming soon</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    width: '100%',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  tripDestination: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
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
    color: '#8E8E93',
    marginBottom: 4,
  },
  tripDuration: {
    fontSize: 14,
    color: '#057B8C',
    fontWeight: '500',
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#057B8C',
    borderRadius: 4,
  },
  budgetStatus: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  expensesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 18,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#057B8C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
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
  converterText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
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
  },
});
