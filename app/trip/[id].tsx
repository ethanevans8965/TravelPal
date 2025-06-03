import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '../context';
import { useExpenseStore } from '../stores/expenseStore';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SwipeableExpenseCard from '../components/SwipeableExpenseCard';

type TripTab = 'overview' | 'expenses' | 'budget';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning':
      return '#007AFF';
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

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

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

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { trips, locations } = useAppContext();
  const { getExpensesByTripId, deleteExpense } = useExpenseStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TripTab>('overview');

  const trip = trips.find((t) => t.id === id);
  const location = locations.find((l) => l.id === trip?.locationId);
  const tripExpenses = trip ? getExpensesByTripId(trip.id) : [];

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  const destinationName =
    location?.country ||
    location?.name ||
    trip.destination?.country ||
    trip.destination?.name ||
    'Unknown destination';

  // Calculate budget statistics
  const calculateBudgetStats = () => {
    const totalSpent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budget = trip.totalBudget || 0;
    const remaining = budget - totalSpent;
    const percentageUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

    // Category spending breakdown
    const categorySpending: Record<string, number> = {};
    tripExpenses.forEach((expense) => {
      categorySpending[expense.category] =
        (categorySpending[expense.category] || 0) + expense.amount;
    });

    return {
      totalSpent,
      budget,
      remaining,
      percentageUsed,
      categorySpending,
    };
  };

  const budgetStats = calculateBudgetStats();

  const handleEditExpense = (expense: any) => {
    console.log('Edit expense:', expense);
    // TODO: Navigate to edit expense screen
  };

  const handleAddExpense = () => {
    router.push({
      pathname: '/expenses/add/expense-details',
      params: {
        tripId: trip.id,
        general: 'false',
      },
    });
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Trip Header */}
      <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.tripHeader}>
        <Text style={styles.tripName}>{trip.name}</Text>
        <Text style={styles.destination}>{destinationName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tripExpenses.length}</Text>
          <Text style={styles.statLabel}>Expenses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${budgetStats.totalSpent.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[
              styles.statValue,
              { color: budgetStats.remaining >= 0 ? '#34C759' : '#FF3B30' },
            ]}
          >
            ${Math.abs(budgetStats.remaining).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>{budgetStats.remaining >= 0 ? 'Remaining' : 'Over'}</Text>
        </View>
      </View>

      {/* Trip Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Details</Text>
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Text>
        </View>

        {trip.travelStyle && (
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>{trip.travelStyle} Travel</Text>
          </View>
        )}

        {trip.dailyBudget && (
          <View style={styles.detailRow}>
            <FontAwesome name="money" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>
              ${trip.dailyBudget}/day
              {trip.totalBudget && ` (Total: $${trip.totalBudget.toLocaleString()})`}
            </Text>
          </View>
        )}
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => setActiveTab('expenses')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {tripExpenses.slice(0, 3).map((expense, index) => (
          <SwipeableExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={handleEditExpense}
            onDelete={deleteExpense}
            getTripName={() => trip.name}
            formatDate={formatDate}
            getCategoryEmoji={getCategoryEmoji}
            isLast={index === 2}
          />
        ))}
        {tripExpenses.length === 0 && (
          <Text style={styles.emptyText}>No expenses recorded for this trip yet</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderExpensesTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.expensesHeader}>
        <Text style={styles.expensesTitle}>Trip Expenses</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {tripExpenses.length > 0 ? (
        <View style={styles.expensesList}>
          {tripExpenses.map((expense, index) => (
            <SwipeableExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleEditExpense}
              onDelete={deleteExpense}
              getTripName={() => trip.name}
              formatDate={formatDate}
              getCategoryEmoji={getCategoryEmoji}
              isLast={index === tripExpenses.length - 1}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <FontAwesome name="file-text-o" size={48} color="#C7C7CC" />
          <Text style={styles.emptyStateTitle}>No expenses yet</Text>
          <Text style={styles.emptyStateText}>Start tracking expenses for this trip</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <FontAwesome name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Add First Expense</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderBudgetTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Budget Overview */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.budgetOverview}>
        <Text style={styles.budgetTitle}>Budget Overview</Text>
        <Text style={styles.budgetAmount}>
          ${budgetStats.totalSpent.toLocaleString()} / ${budgetStats.budget.toLocaleString()}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(budgetStats.percentageUsed, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{budgetStats.percentageUsed.toFixed(1)}% used</Text>
        </View>
      </LinearGradient>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {Object.entries(budgetStats.categorySpending).length > 0 ? (
          Object.entries(budgetStats.categorySpending)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryAmount}>${amount.toLocaleString()}</Text>
              </View>
            ))
        ) : (
          <Text style={styles.emptyText}>No expenses recorded yet</Text>
        )}
      </View>

      {/* Budget Categories */}
      {Object.keys(trip.categories).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planned Budget Categories</Text>
          {Object.entries(trip.categories).map(([category, amount]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
                <Text style={styles.categoryName}>{category}</Text>
              </View>
              <Text style={styles.categoryAmount}>${amount}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'expenses':
        return renderExpensesTab();
      case 'budget':
        return renderBudgetTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            Expenses ({tripExpenses.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
          onPress={() => setActiveTab('budget')}
        >
          <Text style={[styles.tabText, activeTab === 'budget' && styles.activeTabText]}>
            Budget
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tripName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  destination: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryName: {
    fontSize: 16,
    color: '#1C1C1E',
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#057B8C',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 50,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    padding: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabContent: {
    flex: 1,
  },
  tripHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  expensesList: {
    padding: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  budgetOverview: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  budgetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
  },
});
