import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useExpenseStore } from '../../stores/expenseStore';
import { useUserStore } from '../../stores/userStore';
import { Expense } from '../../types';
import DashboardCard from './DashboardCard';

interface TrendDataPoint {
  day: number;
  amount: number;
  label: string;
}

interface CategoryTrend {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: string;
}

const { width: screenWidth } = Dimensions.get('window');
const GRAPH_WIDTH = screenWidth - 80; // Account for padding
const GRAPH_HEIGHT = 120;

export default function TrendGraphWidget() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  // Store access
  const expenses = useExpenseStore((state) => state.expenses);
  const { baseCurrency } = useUserStore();

  // Helper function to get expenses by date range
  const getExpensesByDateRange = (startDate: Date, endDate: Date): Expense[] => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  // Generate trend data for weekly view
  const getWeeklyTrendData = (): TrendDataPoint[] => {
    const data: TrendDataPoint[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === date.toDateString();
      });

      const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      data.push({
        day: date.getDate(),
        amount: totalAmount,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }

    return data;
  };

  // Generate trend data for monthly view
  const getMonthlyTrendData = (): TrendDataPoint[] => {
    const data: TrendDataPoint[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthExpenses = getExpensesByDateRange(date, nextMonth);
      const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      data.push({
        day: date.getMonth() + 1,
        amount: totalAmount,
        label: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }

    return data;
  };

  // Get category trends for current month
  const getCategoryTrends = (): CategoryTrend[] => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthExpenses = getExpensesByDateRange(currentMonth, currentMonthEnd);
    const lastMonthExpenses = getExpensesByDateRange(lastMonth, lastMonthEnd);

    const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Group by category
    const categoryData: Record<string, { current: number; last: number }> = {};

    currentMonthExpenses.forEach((expense) => {
      if (!categoryData[expense.category]) {
        categoryData[expense.category] = { current: 0, last: 0 };
      }
      categoryData[expense.category].current += expense.amount;
    });

    lastMonthExpenses.forEach((expense) => {
      if (!categoryData[expense.category]) {
        categoryData[expense.category] = { current: 0, last: 0 };
      }
      categoryData[expense.category].last += expense.amount;
    });

    // Convert to trend objects
    return Object.entries(categoryData)
      .map(([category, data]) => {
        const percentage = currentTotal > 0 ? (data.current / currentTotal) * 100 : 0;
        let trend: 'up' | 'down' | 'stable' = 'stable';

        if (data.last > 0) {
          const change = ((data.current - data.last) / data.last) * 100;
          if (Math.abs(change) > 5) {
            trend = change > 0 ? 'up' : 'down';
          }
        } else if (data.current > 0) {
          trend = 'up';
        }

        return {
          category,
          amount: data.current,
          percentage,
          trend,
          color: getCategoryColor(category),
          icon: getCategoryIcon(category),
        };
      })
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories
  };

  const getCategoryIcon = (category: string): string => {
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
  };

  const getCategoryColor = (category: string): string => {
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
  };

  // Render simple line chart
  const renderTrendChart = () => {
    const data = activeTab === 'weekly' ? getWeeklyTrendData() : getMonthlyTrendData();
    const maxAmount = Math.max(...data.map((d) => d.amount), 1);

    if (data.every((d) => d.amount === 0)) {
      return (
        <View style={[styles.chartContainer, styles.emptyChart]}>
          <FontAwesome name="line-chart" size={32} color="#D1D5DB" />
          <Text style={styles.emptyChartText}>No data available</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {/* Y-axis labels */}
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>${Math.round(maxAmount)}</Text>
            <Text style={styles.axisLabel}>${Math.round(maxAmount / 2)}</Text>
            <Text style={styles.axisLabel}>$0</Text>
          </View>

          {/* Chart area */}
          <View style={styles.chartArea}>
            {/* Grid lines */}
            <View style={styles.gridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            {/* Data points and lines */}
            <View style={styles.dataContainer}>
              {data.map((point, index) => {
                const height = maxAmount > 0 ? (point.amount / maxAmount) * (GRAPH_HEIGHT - 40) : 0;
                const left = (index / (data.length - 1)) * (GRAPH_WIDTH - 80);

                return (
                  <View key={index} style={styles.dataPointColumn}>
                    {/* Bar */}
                    <View style={styles.barContainer}>
                      <LinearGradient
                        colors={['#057B8C', '#0EA5E9']}
                        style={[styles.bar, { height: Math.max(height, 2) }]}
                      />
                    </View>

                    {/* Amount label */}
                    {point.amount > 0 && (
                      <Text style={styles.amountLabel}>${point.amount.toFixed(0)}</Text>
                    )}

                    {/* X-axis label */}
                    <Text style={styles.xAxisLabel}>{point.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const trendData = activeTab === 'weekly' ? getWeeklyTrendData() : getMonthlyTrendData();
  const categoryTrends = getCategoryTrends();
  const totalSpending = trendData.reduce((sum, point) => sum + point.amount, 0);

  return (
    <DashboardCard>
      <View style={styles.header}>
        <Text style={styles.title}>Spending Trends</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>
          {activeTab === 'weekly' ? 'This Week' : 'Last 7 Months'}
        </Text>
        <Text style={styles.summaryAmount}>
          ${totalSpending.toFixed(2)} {baseCurrency}
        </Text>
      </View>

      {/* Trend Chart */}
      {renderTrendChart()}

      {/* Category Breakdown */}
      {categoryTrends.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Top Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoryTrends.map((category, index) => (
              <View key={category.category} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <FontAwesome name={category.icon as any} size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryAmount}>${category.amount.toFixed(0)}</Text>
                <View style={styles.categoryTrendContainer}>
                  <FontAwesome
                    name={
                      category.trend === 'up'
                        ? 'arrow-up'
                        : category.trend === 'down'
                          ? 'arrow-down'
                          : 'minus'
                    }
                    size={10}
                    color={
                      category.trend === 'up'
                        ? '#EF4444'
                        : category.trend === 'down'
                          ? '#10B981'
                          : '#6B7280'
                    }
                  />
                  <Text
                    style={[
                      styles.categoryPercentage,
                      {
                        color:
                          category.trend === 'up'
                            ? '#EF4444'
                            : category.trend === 'down'
                              ? '#10B981'
                              : '#6B7280',
                      },
                    ]}
                  >
                    {category.percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#057B8C',
  },
  summary: {
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  chartContainer: {
    height: GRAPH_HEIGHT,
    marginBottom: 20,
  },
  emptyChart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  chart: {
    flexDirection: 'row',
    height: '100%',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingBottom: 20,
  },
  axisLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 20,
  },
  dataPointColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    justifyContent: 'flex-end',
    height: GRAPH_HEIGHT - 40,
    width: 20,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 2,
  },
  amountLabel: {
    fontSize: 8,
    color: '#057B8C',
    fontWeight: '600',
    marginTop: 4,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  categoriesSection: {
    marginTop: 8,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  categoryTrendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  categoryPercentage: {
    fontSize: 10,
    fontWeight: '500',
  },
});
