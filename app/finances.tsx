import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from './context';
import { FontAwesome } from '@expo/vector-icons';

type FinanceTab = 'budgets' | 'expenses' | 'reports';

export default function Finances() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('budgets');
  const { trips, expenses } = useAppContext();

  // Calculate budget statistics
  const calculateBudgetStats = () => {
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0);
    const totalDailyBudget = trips.reduce((sum, trip) => sum + (trip.dailyBudget || 0), 0);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalBudget,
      totalDailyBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      percentageUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    };
  };

  // Calculate trip-specific budget vs spending
  const getTripBudgetData = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return null;

    const tripExpenses = expenses.filter((e) => e.tripId === tripId);
    const totalSpent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budget = trip.totalBudget || 0;

    // Calculate category spending
    const categorySpending: Record<string, number> = {};
    tripExpenses.forEach((expense) => {
      categorySpending[expense.category] =
        (categorySpending[expense.category] || 0) + expense.amount;
    });

    return {
      trip,
      totalSpent,
      budget,
      remaining: budget - totalSpent,
      percentageUsed: budget > 0 ? (totalSpent / budget) * 100 : 0,
      categorySpending,
    };
  };

  const renderBudgetsTab = () => {
    const stats = calculateBudgetStats();
    const activeTrips = trips.filter(
      (trip) => trip.status === 'active' || trip.status === 'planning'
    );

    return (
      <View style={styles.tabContent}>
        <Text style={styles.contentTitle}>Budget Overview</Text>
        <Text style={styles.contentSubtitle}>Track your budget performance across all trips</Text>

        {/* Overall Budget Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Total Budget Summary</Text>
            <FontAwesome
              name={stats.percentageUsed > 100 ? 'exclamation-triangle' : 'check-circle'}
              size={20}
              color={stats.percentageUsed > 100 ? '#FF3B30' : '#34C759'}
            />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${stats.totalBudget.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Budget</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FF3B30' }]}>
                ${stats.totalSpent.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[styles.statValue, { color: stats.remaining >= 0 ? '#34C759' : '#FF3B30' }]}
              >
                ${Math.abs(stats.remaining).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>
                {stats.remaining >= 0 ? 'Remaining' : 'Over Budget'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(stats.percentageUsed, 100)}%`,
                    backgroundColor:
                      stats.percentageUsed > 90
                        ? '#FF3B30'
                        : stats.percentageUsed > 75
                          ? '#FF9500'
                          : '#057B8C',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{stats.percentageUsed.toFixed(1)}% used</Text>
          </View>
        </View>

        {/* Trip Budget Cards */}
        <Text style={styles.sectionTitle}>Trip Budgets</Text>

        {activeTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="suitcase" size={48} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No Active Trips</Text>
            <Text style={styles.emptyStateText}>Create a trip to start budget planning</Text>
          </View>
        ) : (
          activeTrips.map((trip) => {
            const budgetData = getTripBudgetData(trip.id);
            if (!budgetData) return null;

            return (
              <View key={trip.id} style={styles.tripBudgetCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripName}>{trip.name}</Text>
                    <Text style={styles.tripDestination}>
                      {trip.destination?.name || 'Unknown destination'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: trip.status === 'active' ? '#34C759' : '#FF9500' },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {trip.status === 'active' ? 'Active' : 'Planning'}
                    </Text>
                  </View>
                </View>

                <View style={styles.budgetStats}>
                  <View style={styles.budgetStatItem}>
                    <Text style={styles.budgetAmount}>
                      ${budgetData.totalSpent.toLocaleString()}
                    </Text>
                    <Text style={styles.budgetLabel}>Spent</Text>
                  </View>
                  <View style={styles.budgetStatItem}>
                    <Text style={styles.budgetAmount}>${budgetData.budget.toLocaleString()}</Text>
                    <Text style={styles.budgetLabel}>Budget</Text>
                  </View>
                  <View style={styles.budgetStatItem}>
                    <Text
                      style={[
                        styles.budgetAmount,
                        { color: budgetData.remaining >= 0 ? '#34C759' : '#FF3B30' },
                      ]}
                    >
                      ${Math.abs(budgetData.remaining).toLocaleString()}
                    </Text>
                    <Text style={styles.budgetLabel}>
                      {budgetData.remaining >= 0 ? 'Left' : 'Over'}
                    </Text>
                  </View>
                </View>

                {/* Trip Progress Bar */}
                <View style={styles.tripProgressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(budgetData.percentageUsed, 100)}%`,
                          backgroundColor:
                            budgetData.percentageUsed > 90
                              ? '#FF3B30'
                              : budgetData.percentageUsed > 75
                                ? '#FF9500'
                                : '#057B8C',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.tripProgressText}>
                    {budgetData.percentageUsed.toFixed(1)}% used
                  </Text>
                </View>

                {/* Category Breakdown */}
                {Object.keys(budgetData.categorySpending).length > 0 && (
                  <View style={styles.categoryBreakdown}>
                    <Text style={styles.categoryTitle}>Top Spending Categories</Text>
                    {Object.entries(budgetData.categorySpending)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([category, amount]) => (
                        <View key={category} style={styles.categoryItem}>
                          <Text style={styles.categoryName}>{category}</Text>
                          <Text style={styles.categoryAmount}>${amount.toLocaleString()}</Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'budgets':
        return renderBudgetsTab();

      case 'expenses':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.contentTitle}>All Expenses</Text>
            <Text style={styles.contentSubtitle}>
              View and manage all your expenses across all trips
            </Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Global expense list coming soon</Text>
            </View>
          </View>
        );

      case 'reports':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.contentTitle}>Financial Reports</Text>
            <Text style={styles.contentSubtitle}>
              Analyze your spending patterns and budget performance
            </Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Reports and analytics coming soon</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Finances</Text>
        <Text style={styles.subtitle}>Manage budgets, expenses, and reports</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'budgets' && styles.activeTab]}
          onPress={() => setActiveTab('budgets')}
        >
          <Text style={[styles.tabText, activeTab === 'budgets' && styles.activeTabText]}>
            Budgets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            All Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#057B8C',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#057B8C',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 24,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    lineHeight: 22,
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
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
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
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
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  tripBudgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    padding: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetStatItem: {
    alignItems: 'center',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tripProgressContainer: {
    marginBottom: 16,
  },
  tripProgressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  categoryBreakdown: {
    marginTop: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
