import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Trip, Expense } from '../../types';

interface BudgetPerformanceChartProps {
  trips: Trip[];
  expenses: Expense[];
  title?: string;
  showByCategory?: boolean;
}

export default function BudgetPerformanceChart({
  trips,
  expenses,
  title = 'Budget vs Actual',
  showByCategory = false,
}: BudgetPerformanceChartProps) {
  const screenWidth = Dimensions.get('window').width;

  // Process data for budget vs actual comparison
  const processPerformanceData = () => {
    if (trips.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          { data: [0], color: () => '#E5E5E5' },
          { data: [0], color: () => '#E5E5E5' },
        ],
        isEmpty: true,
      };
    }

    if (showByCategory) {
      // Show budget vs actual by category across all trips
      const categoryData: Record<string, { budget: number; actual: number }> = {};

      trips.forEach((trip) => {
        if (trip.categories) {
          Object.entries(trip.categories).forEach(([category, budget]) => {
            if (!categoryData[category]) {
              categoryData[category] = { budget: 0, actual: 0 };
            }
            categoryData[category].budget += budget;
          });
        }
      });

      expenses.forEach((expense) => {
        if (categoryData[expense.category]) {
          categoryData[expense.category].actual += expense.amount;
        }
      });

      const categories = Object.keys(categoryData).slice(0, 5); // Limit to 5 categories
      const budgetData = categories.map((cat) => categoryData[cat].budget);
      const actualData = categories.map((cat) => categoryData[cat].actual);

      return {
        labels: categories.map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1)),
        datasets: [
          {
            data: budgetData,
            color: () => '#057B8C',
          },
          {
            data: actualData,
            color: () => '#FF6B6B',
          },
        ],
        isEmpty: false,
      };
    } else {
      // Show budget vs actual by trip
      const activeTrips = trips
        .filter((trip) => trip.status === 'active' || trip.status === 'planning')
        .slice(0, 4); // Limit to 4 trips for readability

      const labels = activeTrips.map((trip) =>
        trip.name.length > 8 ? trip.name.substring(0, 8) + '...' : trip.name
      );

      const budgetData = activeTrips.map((trip) => trip.totalBudget || 0);
      const actualData = activeTrips.map((trip) => {
        const tripExpenses = expenses.filter((e) => e.tripId === trip.id);
        return tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      });

      return {
        labels,
        datasets: [
          {
            data: budgetData,
            color: () => '#057B8C',
          },
          {
            data: actualData,
            color: () => '#FF6B6B',
          },
        ],
        isEmpty: false,
      };
    }
  };

  const chartData = processPerformanceData();

  if (chartData.isEmpty) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No budget data available</Text>
          <Text style={styles.emptySubtext}>Create trips with budgets to see performance</Text>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(5, 123, 140, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E5E5',
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#057B8C' }]} />
          <Text style={styles.legendText}>Budget</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>Actual</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={screenWidth - 48}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisLabel="$"
          yAxisSuffix=""
          fromZero={true}
        />
      </View>

      {/* Performance Summary */}
      <View style={styles.summaryContainer}>
        {chartData.datasets[0].data.map((budget, index) => {
          const actual = chartData.datasets[1].data[index];
          const performance = budget > 0 ? (actual / budget) * 100 : 0;
          const isOverBudget = actual > budget;

          return (
            <View key={index} style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{chartData.labels[index]}</Text>
              <Text
                style={[styles.summaryPerformance, { color: isOverBudget ? '#FF3B30' : '#34C759' }]}
              >
                {performance.toFixed(0)}% {isOverBudget ? 'over' : 'used'}
              </Text>
            </View>
          );
        })}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    marginBottom: 8,
    minWidth: '45%',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  summaryPerformance: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
