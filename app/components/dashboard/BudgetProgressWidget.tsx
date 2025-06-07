import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTripStore } from '../../stores/tripStore';
import { useExpenseStore } from '../../stores/expenseStore';
import DashboardCard from './DashboardCard';
import { useRouter } from 'expo-router';

interface CategoryBudget {
  category: string;
  budgeted: number;
  spent: number;
  percentage: number;
  color: string;
  icon: string;
}

interface BudgetProgressWidgetProps {
  showCategories?: boolean;
}

export default function BudgetProgressWidget({ showCategories = true }: BudgetProgressWidgetProps) {
  const router = useRouter();
  const activeTrips = useTripStore((state) => state.getCurrentTrips)();
  const getExpensesByTripId = useExpenseStore((state) => state.getExpensesByTripId);

  // Calculate budget progress for active trips
  const calculateBudgetProgress = () => {
    if (activeTrips.length === 0) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        overallPercentage: 0,
        categories: [],
        isOverBudget: false,
        daysRemaining: 0,
        dailyBurnRate: 0,
      };
    }

    const activeTrip = activeTrips[0]; // Focus on first active trip
    const tripExpenses = getExpensesByTripId(activeTrip.id);
    const totalSpent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = activeTrip.totalBudget || 0;
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Calculate days remaining
    const now = new Date();
    const endDate = activeTrip.endDate ? new Date(activeTrip.endDate) : now;
    const daysRemaining = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    // Calculate daily burn rate
    const startDate = activeTrip.startDate ? new Date(activeTrip.startDate) : now;
    const totalDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const daysElapsed = Math.max(1, totalDays - daysRemaining);
    const dailyBurnRate = totalSpent / daysElapsed;

    // Category breakdown
    const categoryData: Record<string, { spent: number; budgeted: number }> = {};

    // Initialize with trip categories
    Object.entries(activeTrip.categories || {}).forEach(([category, budgeted]) => {
      categoryData[category] = { spent: 0, budgeted: budgeted as number };
    });

    // Add actual spending
    tripExpenses.forEach((expense) => {
      if (categoryData[expense.category]) {
        categoryData[expense.category].spent += expense.amount;
      } else {
        categoryData[expense.category] = { spent: expense.amount, budgeted: 0 };
      }
    });

    const categories: CategoryBudget[] = Object.entries(categoryData)
      .map(([category, data]) => ({
        category,
        budgeted: data.budgeted,
        spent: data.spent,
        percentage: data.budgeted > 0 ? (data.spent / data.budgeted) * 100 : 0,
        color: getCategoryColor(category),
        icon: getCategoryIcon(category),
      }))
      .filter((cat) => cat.budgeted > 0 || cat.spent > 0)
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalBudget,
      totalSpent,
      overallPercentage,
      categories,
      isOverBudget: overallPercentage > 100,
      daysRemaining,
      dailyBurnRate,
      tripName: activeTrip.name,
    };
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

  const budgetData = calculateBudgetProgress();

  if (activeTrips.length === 0) {
    return (
      <DashboardCard>
        <View style={styles.header}>
          <Text style={styles.title}>Budget Progress</Text>
        </View>
        <View style={styles.emptyState}>
          <FontAwesome name="pie-chart" size={32} color="#8E8E93" />
          <Text style={styles.emptyTitle}>No active trip budget</Text>
          <Text style={styles.emptySubtitle}>
            Create a trip with budget to track your spending progress
          </Text>
          <TouchableOpacity
            style={styles.createTripButton}
            onPress={() => router.push('/trip/create' as any)}
          >
            <Text style={styles.createTripButtonText}>Create Trip</Text>
          </TouchableOpacity>
        </View>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Progress</Text>
        <TouchableOpacity onPress={() => router.push('/finances' as any)}>
          <Text style={styles.detailsLink}>Details</Text>
        </TouchableOpacity>
      </View>

      {/* Overall Progress Circle */}
      <View style={styles.overallProgress}>
        <View style={styles.circularProgress}>
          <View style={styles.progressCircle}>
            <View
              style={[
                styles.progressFill,
                {
                  borderColor: budgetData.isOverBudget ? '#EF4444' : '#057B8C',
                  borderRightColor: budgetData.isOverBudget ? '#EF4444' : '#E5E5E7',
                  transform: [
                    {
                      rotate: `${Math.min(budgetData.overallPercentage * 3.6, 360)}deg`,
                    },
                  ],
                },
              ]}
            />
            <View style={styles.progressInner}>
              <Text
                style={[
                  styles.progressPercentage,
                  budgetData.isOverBudget && styles.overBudgetText,
                ]}
              >
                {Math.round(budgetData.overallPercentage)}%
              </Text>
              <Text style={styles.progressLabel}>spent</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressInfo}>
          <Text style={styles.tripName}>{budgetData.tripName}</Text>
          <View style={styles.budgetAmounts}>
            <Text style={styles.spentAmount}>${budgetData.totalSpent.toLocaleString()}</Text>
            <Text style={styles.budgetTotal}>of ${budgetData.totalBudget.toLocaleString()}</Text>
          </View>

          <View style={styles.budgetMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{budgetData.daysRemaining}</Text>
              <Text style={styles.metricLabel}>days left</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>${Math.round(budgetData.dailyBurnRate)}</Text>
              <Text style={styles.metricLabel}>daily rate</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category Progress Bars */}
      {showCategories && budgetData.categories.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Category Breakdown</Text>
          {budgetData.categories.slice(0, 4).map((category) => (
            <View key={category.category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <FontAwesome name={category.icon as any} size={12} color="#FFFFFF" />
                  </View>
                  <Text style={styles.categoryName}>{category.category}</Text>
                </View>
                <View style={styles.categoryAmounts}>
                  <Text style={styles.categorySpent}>${category.spent.toFixed(0)}</Text>
                  <Text style={styles.categoryBudgeted}>/ ${category.budgeted.toFixed(0)}</Text>
                </View>
              </View>

              <View style={styles.categoryProgressBar}>
                <View
                  style={[
                    styles.categoryProgressFill,
                    {
                      width: `${Math.min(category.percentage, 100)}%`,
                      backgroundColor: category.percentage > 100 ? '#EF4444' : category.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  detailsLink: {
    fontSize: 14,
    color: '#057B8C',
    fontWeight: '500',
  },
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  circularProgress: {
    marginRight: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  progressFill: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    position: 'absolute',
  },
  progressInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 8,
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  overBudgetText: {
    color: '#EF4444',
  },
  progressLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
  progressInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  budgetAmounts: {
    marginBottom: 12,
  },
  spentAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  budgetTotal: {
    fontSize: 14,
    color: '#8E8E93',
  },
  budgetMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#057B8C',
  },
  metricLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  categoriesSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 16,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    textTransform: 'capitalize',
  },
  categoryAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  categorySpent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  categoryBudgeted: {
    fontSize: 12,
    color: '#8E8E93',
  },
  categoryProgressBar: {
    height: 4,
    backgroundColor: '#E5E5E7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  createTripButton: {
    backgroundColor: '#057B8C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createTripButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
