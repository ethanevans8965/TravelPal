import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useExpenseStore } from '../../stores/expenseStore';
import { useTripStore } from '../../stores/tripStore';
import { useUserStore } from '../../stores/userStore';
import { Expense } from '../../types';
import DashboardCard from './DashboardCard';

interface Insight {
  id: string;
  type: 'trend' | 'alert' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  icon: string;
  color: string;
  priority: number; // 1-5, 5 being highest
  actionText?: string;
  onAction?: () => void;
}

interface TrendData {
  category: string;
  currentMonth: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

export default function SmartInsightsWidget() {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Store access
  const expenses = useExpenseStore((state) => state.expenses);
  const trips = useTripStore((state) => state.trips);
  const { baseCurrency } = useUserStore();

  // Helper function to get expenses by date range
  const getExpensesByDateRange = (startDate: Date, endDate: Date): Expense[] => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  // Generate intelligent insights
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get expense data
    const currentMonthExpenses = getExpensesByDateRange(currentMonth, currentMonthEnd);
    const lastMonthExpenses = getExpensesByDateRange(lastMonth, lastMonthEnd);

    // Calculate trends by category
    const categoryTrends = calculateCategoryTrends(currentMonthExpenses, lastMonthExpenses);

    // 1. Spending Trend Insights
    const totalCurrentMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (totalLastMonth > 0) {
      const monthlyChange = ((totalCurrentMonth - totalLastMonth) / totalLastMonth) * 100;

      if (Math.abs(monthlyChange) > 10) {
        insights.push({
          id: 'monthly-trend',
          type: monthlyChange > 0 ? 'alert' : 'achievement',
          title: monthlyChange > 0 ? 'Spending Up' : 'Spending Down',
          description: `${Math.abs(monthlyChange).toFixed(0)}% ${monthlyChange > 0 ? 'increase' : 'decrease'} from last month`,
          icon: monthlyChange > 0 ? 'arrow-up' : 'arrow-down',
          color: monthlyChange > 0 ? '#EF4444' : '#10B981',
          priority: monthlyChange > 20 ? 5 : 3,
        });
      }
    }

    // 2. Daily Budget Insights (simplified)
    const dailyBudgetInsight = useUserStore((state) => state.dailyBudget);
    if (dailyBudgetInsight > 0 && currentMonthExpenses.length > 0) {
      const avgDailySpending = totalCurrentMonth / now.getDate();
      const budgetRatio = avgDailySpending / dailyBudgetInsight;

      if (budgetRatio > 1.2) {
        insights.push({
          id: 'daily-budget-alert',
          type: 'alert',
          title: 'Daily Budget Exceeded',
          description: `Spending $${avgDailySpending.toFixed(0)}/day vs $${dailyBudgetInsight} budget`,
          icon: 'exclamation-triangle',
          color: '#EF4444',
          priority: 4,
        });
      }
    }

    // 3. Category Insights
    categoryTrends.forEach((trend) => {
      if (Math.abs(trend.percentage) > 25) {
        insights.push({
          id: `category-trend-${trend.category}`,
          type: 'trend',
          title: `${trend.category} Trend`,
          description: `${Math.abs(trend.percentage).toFixed(0)}% ${trend.trend === 'up' ? 'increase' : 'decrease'} this month`,
          icon: trend.trend === 'up' ? 'arrow-up' : 'arrow-down',
          color: trend.trend === 'up' ? '#F59E0B' : '#10B981',
          priority: 3,
        });
      }
    });

    // 4. Travel Insights
    const activeTrips = trips.filter((trip) => {
      if (!trip.startDate || !trip.endDate) return false;
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      return now >= start && now <= end;
    });

    if (activeTrips.length > 0) {
      const tripExpenses = currentMonthExpenses.filter((e) =>
        activeTrips.some((trip) => trip.id === e.tripId)
      );
      const tripSpending = tripExpenses.reduce((sum, e) => sum + e.amount, 0);

      if (tripSpending > 0) {
        insights.push({
          id: 'travel-spending',
          type: 'trend',
          title: 'Travel Spending',
          description: `$${tripSpending.toFixed(0)} spent on current trips`,
          icon: 'plane',
          color: '#3B82F6',
          priority: 2,
        });
      }
    }

    // 5. Smart Recommendations
    if (currentMonthExpenses.length > 5) {
      const avgDailySpending = totalCurrentMonth / now.getDate();
      const projectedMonthly = avgDailySpending * 30;

      insights.push({
        id: 'spending-projection',
        type: 'recommendation',
        title: 'Monthly Projection',
        description: `On track to spend $${projectedMonthly.toFixed(0)} this month`,
        icon: 'lightbulb-o',
        color: '#8B5CF6',
        priority: 2,
      });
    }

    // 6. Achievement Insights
    const streakDays = calculateExpenseStreak();
    if (streakDays >= 7) {
      insights.push({
        id: 'tracking-streak',
        type: 'achievement',
        title: 'Tracking Streak!',
        description: `${streakDays} days of expense tracking`,
        icon: 'fire',
        color: '#F97316',
        priority: 1,
      });
    }

    // Sort by priority and return top insights
    return insights.sort((a, b) => b.priority - a.priority).slice(0, 5);
  };

  const calculateCategoryTrends = (current: any[], last: any[]): TrendData[] => {
    const categories = new Set([...current.map((e) => e.category), ...last.map((e) => e.category)]);

    return Array.from(categories).map((category) => {
      const currentAmount = current
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);

      const lastAmount = last
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);

      let trend: 'up' | 'down' | 'stable' = 'stable';
      let percentage = 0;

      if (lastAmount > 0) {
        percentage = ((currentAmount - lastAmount) / lastAmount) * 100;
        if (Math.abs(percentage) > 5) {
          trend = percentage > 0 ? 'up' : 'down';
        }
      } else if (currentAmount > 0) {
        trend = 'up';
        percentage = 100;
      }

      return {
        category,
        currentMonth: currentAmount,
        lastMonth: lastAmount,
        trend,
        percentage,
      };
    });
  };

  const calculateExpenseStreak = (): number => {
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      const hasExpense = expenses.some((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === checkDate.toDateString();
      });

      if (hasExpense) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const insights = generateInsights();

  // Auto-rotate insights
  useEffect(() => {
    if (insights.length <= 1) return;

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [insights.length]);

  if (insights.length === 0) {
    return (
      <DashboardCard>
        <View style={styles.emptyState}>
          <FontAwesome name="lightbulb-o" size={24} color="#8E8E93" />
          <Text style={styles.emptyText}>Add more expenses to see smart insights</Text>
        </View>
      </DashboardCard>
    );
  }

  const currentInsight = insights[currentInsightIndex];

  return (
    <DashboardCard>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Insights</Text>
        {insights.length > 1 && (
          <View style={styles.indicators}>
            {insights.map((_, index) => (
              <View
                key={index}
                style={[styles.indicator, index === currentInsightIndex && styles.activeIndicator]}
              />
            ))}
          </View>
        )}
      </View>

      <Animated.View style={[styles.insightContainer, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[`${currentInsight.color}20`, `${currentInsight.color}05`]}
          style={styles.insightCard}
        >
          <View style={styles.insightHeader}>
            <View style={[styles.insightIcon, { backgroundColor: currentInsight.color }]}>
              <FontAwesome name={currentInsight.icon as any} size={18} color="#FFFFFF" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>{currentInsight.title}</Text>
              <Text style={styles.insightDescription}>{currentInsight.description}</Text>
            </View>
            <View style={[styles.priorityBadge, getPriorityStyle(currentInsight.priority)]}>
              <Text style={styles.priorityText}>{getPriorityLabel(currentInsight.priority)}</Text>
            </View>
          </View>

          {currentInsight.actionText && currentInsight.onAction && (
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: currentInsight.color }]}
              onPress={currentInsight.onAction}
            >
              <Text style={[styles.actionText, { color: currentInsight.color }]}>
                {currentInsight.actionText}
              </Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </Animated.View>

      {insights.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickInsights}>
          {insights.slice(1, 4).map((insight, index) => (
            <TouchableOpacity
              key={insight.id}
              style={styles.quickInsightCard}
              onPress={() => setCurrentInsightIndex(index + 1)}
            >
              <View style={[styles.quickIcon, { backgroundColor: insight.color }]}>
                <FontAwesome name={insight.icon as any} size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.quickTitle} numberOfLines={1}>
                {insight.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </DashboardCard>
  );
}

const getPriorityStyle = (priority: number) => {
  if (priority >= 4) return { backgroundColor: '#EF4444' };
  if (priority >= 3) return { backgroundColor: '#F59E0B' };
  return { backgroundColor: '#10B981' };
};

const getPriorityLabel = (priority: number): string => {
  if (priority >= 4) return 'HIGH';
  if (priority >= 3) return 'MED';
  return 'LOW';
};

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
  indicators: {
    flexDirection: 'row',
    gap: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  activeIndicator: {
    backgroundColor: '#057B8C',
  },
  insightContainer: {
    marginBottom: 12,
  },
  insightCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickInsights: {
    marginTop: 8,
  },
  quickInsightCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  quickIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickTitle: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
});
