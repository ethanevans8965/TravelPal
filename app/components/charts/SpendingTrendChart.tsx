import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Expense } from '../../types';

interface SpendingTrendChartProps {
  expenses: Expense[];
  timePeriod: 'week' | 'month' | 'year';
  title?: string;
}

export default function SpendingTrendChart({
  expenses,
  timePeriod,
  title = 'Spending Trend',
}: SpendingTrendChartProps) {
  const screenWidth = Dimensions.get('window').width;

  // Process expenses data based on time period
  const processExpenseData = () => {
    const now = new Date();
    const sortedExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        const daysDiff = Math.floor(
          (now.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24)
        );

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
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sortedExpenses.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
        isEmpty: true,
      };
    }

    // Group expenses by time period
    const groupedData: Record<string, number> = {};

    sortedExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      let key: string;

      switch (timePeriod) {
        case 'week':
          key = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        case 'year':
          key = date.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          key = date.toLocaleDateString();
      }

      groupedData[key] = (groupedData[key] || 0) + expense.amount;
    });

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);

    return {
      labels: labels.length > 6 ? labels.slice(-6) : labels,
      datasets: [
        {
          data: data.length > 6 ? data.slice(-6) : data,
          color: (opacity = 1) => `rgba(5, 123, 140, ${opacity})`,
          strokeWidth: 3,
        },
      ],
      isEmpty: false,
    };
  };

  const chartData = processExpenseData();

  if (chartData.isEmpty) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No spending data available</Text>
          <Text style={styles.emptySubtext}>Start tracking expenses to see trends</Text>
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
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#057B8C',
      fill: '#FFFFFF',
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
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 48}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          formatYLabel={(value) => `$${Math.round(parseFloat(value))}`}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
        />
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
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 12,
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
