import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Trip, Expense } from '../../types';

interface ReportSummaryProps {
  trips: Trip[];
  expenses: Expense[];
  timePeriod?: 'week' | 'month' | 'year' | 'all';
}

export default function ReportSummary({ trips, expenses, timePeriod = 'all' }: ReportSummaryProps) {
  // Filter expenses based on time period
  const getFilteredExpenses = () => {
    if (timePeriod === 'all') return expenses;

    const now = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const daysDiff = Math.floor((now.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (timePeriod) {
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        case 'year':
          return daysDiff <= 365;
        default:
          return true;
      }
    });
  };

  const filteredExpenses = getFilteredExpenses();

  // Calculate key metrics
  const calculateMetrics = () => {
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0);
    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageExpense = filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;

    // Calculate category breakdown
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

    // Calculate budget performance
    const budgetUsagePercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const isOverBudget = totalSpent > totalBudget;
    const budgetRemaining = totalBudget - totalSpent;

    // Calculate trip statistics
    const activeTrips = trips.filter((trip) => trip.status === 'active').length;
    const plannedTrips = trips.filter((trip) => trip.status === 'planning').length;

    return {
      totalBudget,
      totalSpent,
      averageExpense,
      topCategory: topCategory ? { category: topCategory[0], amount: topCategory[1] } : null,
      budgetUsagePercentage,
      isOverBudget,
      budgetRemaining,
      activeTrips,
      plannedTrips,
      expenseCount: filteredExpenses.length,
    };
  };

  const metrics = calculateMetrics();

  const formatTimePeriod = () => {
    switch (timePeriod) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'All Time';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Summary</Text>
        <Text style={styles.subtitle}>{formatTimePeriod()}</Text>
      </View>

      {/* Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        {/* Total Spent */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <FontAwesome name="credit-card" size={20} color="#FF6B6B" />
            <Text style={styles.metricLabel}>Total Spent</Text>
          </View>
          <Text style={styles.metricValue}>${metrics.totalSpent.toLocaleString()}</Text>
          <Text style={styles.metricSubtext}>
            {metrics.expenseCount} expense{metrics.expenseCount !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Budget Status */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <FontAwesome
              name={metrics.isOverBudget ? 'exclamation-triangle' : 'check-circle'}
              size={20}
              color={metrics.isOverBudget ? '#FF3B30' : '#34C759'}
            />
            <Text style={styles.metricLabel}>Budget Status</Text>
          </View>
          <Text
            style={[styles.metricValue, { color: metrics.isOverBudget ? '#FF3B30' : '#34C759' }]}
          >
            {metrics.budgetUsagePercentage.toFixed(0)}%
          </Text>
          <Text style={styles.metricSubtext}>
            {metrics.isOverBudget ? 'Over budget' : 'Within budget'}
          </Text>
        </View>

        {/* Average Expense */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <FontAwesome name="calculator" size={20} color="#4ECDC4" />
            <Text style={styles.metricLabel}>Average Expense</Text>
          </View>
          <Text style={styles.metricValue}>${metrics.averageExpense.toFixed(0)}</Text>
          <Text style={styles.metricSubtext}>Per transaction</Text>
        </View>

        {/* Top Category */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <FontAwesome name="pie-chart" size={20} color="#96CEB4" />
            <Text style={styles.metricLabel}>Top Category</Text>
          </View>
          <Text style={styles.metricValue}>
            {metrics.topCategory ? metrics.topCategory.category : 'N/A'}
          </Text>
          <Text style={styles.metricSubtext}>
            {metrics.topCategory ? `$${metrics.topCategory.amount.toLocaleString()}` : 'No data'}
          </Text>
        </View>
      </View>

      {/* Budget Overview */}
      {metrics.totalBudget > 0 && (
        <View style={styles.budgetOverview}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <Text style={styles.budgetValue}>${metrics.totalBudget.toLocaleString()}</Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>
                {metrics.isOverBudget ? 'Over Budget' : 'Remaining'}
              </Text>
              <Text
                style={[
                  styles.budgetValue,
                  { color: metrics.isOverBudget ? '#FF3B30' : '#34C759' },
                ]}
              >
                ${Math.abs(metrics.budgetRemaining).toLocaleString()}
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
                    width: `${Math.min(metrics.budgetUsagePercentage, 100)}%`,
                    backgroundColor:
                      metrics.budgetUsagePercentage > 90
                        ? '#FF3B30'
                        : metrics.budgetUsagePercentage > 75
                          ? '#FF9500'
                          : '#057B8C',
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {/* Trip Summary */}
      <View style={styles.tripSummary}>
        <Text style={styles.sectionTitle}>Trip Summary</Text>
        <View style={styles.tripRow}>
          <View style={styles.tripItem}>
            <Text style={styles.tripCount}>{metrics.activeTrips}</Text>
            <Text style={styles.tripLabel}>Active Trip{metrics.activeTrips !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.tripItem}>
            <Text style={styles.tripCount}>{metrics.plannedTrips}</Text>
            <Text style={styles.tripLabel}>
              Planned Trip{metrics.plannedTrips !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.tripItem}>
            <Text style={styles.tripCount}>{trips.length}</Text>
            <Text style={styles.tripLabel}>Total Trip{trips.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 6,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  metricSubtext: {
    fontSize: 11,
    color: '#8E8E93',
  },
  budgetOverview: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  tripSummary: {
    marginBottom: 8,
  },
  tripRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tripItem: {
    alignItems: 'center',
  },
  tripCount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#057B8C',
    marginBottom: 4,
  },
  tripLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
