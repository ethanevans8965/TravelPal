import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Expense } from '../../types';

interface CategoryPieChartProps {
  expenses: Expense[];
  title?: string;
  showLegend?: boolean;
}

export default function CategoryPieChart({
  expenses,
  title = 'Spending by Category',
  showLegend = true,
}: CategoryPieChartProps) {
  const screenWidth = Dimensions.get('window').width;

  // Category colors mapping
  const categoryColors: Record<string, string> = {
    food: '#FF6B6B',
    transportation: '#4ECDC4',
    accommodation: '#45B7D1',
    activities: '#96CEB4',
    shopping: '#FFEAA7',
    other: '#DDA0DD',
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

  // Process expenses data for pie chart
  const processCategoryData = () => {
    if (expenses.length === 0) {
      return {
        data: [],
        isEmpty: true,
      };
    }

    // Group expenses by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Convert to pie chart format
    const data = Object.entries(categoryTotals)
      .map(([category, amount], index) => ({
        name: category,
        amount: amount,
        color: categoryColors[category] || `hsl(${index * 60}, 70%, 60%)`,
        legendFontColor: '#1C1C1E',
        legendFontSize: 14,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      data,
      isEmpty: false,
    };
  };

  const chartData = processCategoryData();

  if (chartData.isEmpty) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No category data available</Text>
          <Text style={styles.emptySubtext}>Add expenses to see category breakdown</Text>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(5, 123, 140, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
    style: {
      borderRadius: 12,
    },
  };

  const totalAmount = chartData.data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData.data}
          width={screenWidth - 48}
          height={200}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          absolute={false}
        />
      </View>

      {showLegend && (
        <View style={styles.legendContainer}>
          {chartData.data.map((item, index) => {
            const percentage = ((item.amount / totalAmount) * 100).toFixed(1);
            return (
              <View key={index} style={styles.legendItem}>
                <View style={styles.legendRow}>
                  <View style={styles.legendLeft}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>
                      {getCategoryEmoji(item.name)} {item.name}
                    </Text>
                  </View>
                  <View style={styles.legendRight}>
                    <Text style={styles.legendAmount}>${item.amount.toLocaleString()}</Text>
                    <Text style={styles.legendPercentage}>{percentage}%</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
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
    marginBottom: 16,
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
  legendContainer: {
    marginTop: 8,
  },
  legendItem: {
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  legendPercentage: {
    fontSize: 12,
    color: '#8E8E93',
  },
});
