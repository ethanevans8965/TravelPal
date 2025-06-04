import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  description: string;
  tripId?: string;
}

interface MonthlyOverviewWidgetProps {
  allExpenses: Expense[];
  generalExpenses: Expense[];
}

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

export default function MonthlyOverviewWidget({
  allExpenses,
  generalExpenses,
}: MonthlyOverviewWidgetProps) {
  // Calculate monthly expense totals
  const calculateMonthlyTotals = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const lastMonth = new Date(currentYear, currentMonth - 1);
    const lastMonthExpenses = allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === lastMonth.getMonth() &&
        expenseDate.getFullYear() === lastMonth.getFullYear()
      );
    });

    const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate daily average for this month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    const dailyAverage = thisMonthTotal / Math.max(currentDay, 1);

    // Calculate projected total for the month
    const projectedMonthTotal = dailyAverage * daysInMonth;

    // Calculate top categories this month
    const categoryTotals = thisMonthExpenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return {
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      count: thisMonthExpenses.length,
      change: lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0,
      dailyAverage,
      projectedTotal: projectedMonthTotal,
      topCategories: sortedCategories,
      daysRemaining: daysInMonth - currentDay,
    };
  };

  const monthlyTotals = calculateMonthlyTotals();

  return (
    <View style={styles.container}>
      {/* Main Amount and Progress */}
      <View style={styles.mainHeader}>
        <View style={styles.iconContainer}>
          <FontAwesome name="calendar" size={20} color="#0EA5E9" />
        </View>
        <View style={styles.mainInfo}>
          <Text style={styles.mainAmount}>${monthlyTotals.thisMonth.toLocaleString()}</Text>
          <Text style={styles.mainLabel}>Spent this month</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((monthlyTotals.thisMonth / Math.max(monthlyTotals.projectedTotal, monthlyTotals.thisMonth)) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              ${monthlyTotals.projectedTotal.toLocaleString()} projected
            </Text>
          </View>
        </View>
        <View style={styles.trendContainer}>
          <View
            style={[
              styles.trendBadge,
              { backgroundColor: monthlyTotals.change >= 0 ? '#FEF2F2' : '#F0FDF4' },
            ]}
          >
            <FontAwesome
              name={monthlyTotals.change >= 0 ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={monthlyTotals.change >= 0 ? '#EF4444' : '#10B981'}
            />
            <Text
              style={[
                styles.trendText,
                { color: monthlyTotals.change >= 0 ? '#EF4444' : '#10B981' },
              ]}
            >
              {Math.abs(monthlyTotals.change).toFixed(0)}%
            </Text>
          </View>
          <Text style={styles.trendLabel}>vs last month</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{monthlyTotals.count}</Text>
          <Text style={styles.statLabel}>Expenses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${monthlyTotals.dailyAverage.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Daily Avg</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{monthlyTotals.daysRemaining}</Text>
          <Text style={styles.statLabel}>Days Left</Text>
        </View>
      </View>

      {/* Top Categories */}
      {monthlyTotals.topCategories.length > 0 && (
        <View style={styles.topCategories}>
          <Text style={styles.topCategoriesTitle}>Top Spending Categories</Text>
          <View style={styles.topCategoriesGrid}>
            {monthlyTotals.topCategories.map(([category, amount], index) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  <Text style={styles.categoryAmount}>${amount.toFixed(0)}</Text>
                </View>
                <View style={styles.categoryPercentage}>
                  <Text style={styles.categoryPercentageText}>
                    {((amount / monthlyTotals.thisMonth) * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  // Main Header Styles
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mainInfo: {
    flex: 1,
  },
  mainAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  mainLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  trendContainer: {
    alignItems: 'flex-end',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
  },
  // Top Categories Styles
  topCategories: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 4,
    paddingTop: 16,
  },
  topCategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  topCategoriesGrid: {
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  categoryPercentage: {
    alignItems: 'flex-end',
  },
  categoryPercentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0EA5E9',
  },
});
