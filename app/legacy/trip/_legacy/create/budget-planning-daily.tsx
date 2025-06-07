import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { getDefaultCategoryPercentages, calculateDailyBudget } from '../../../../utils/countryData';

type CategoryData = {
  id: keyof typeof categoryConfig;
  name: string;
  icon: string;
  color: string;
  dailyValue: number;
  recommendedValue: number;
};

const categoryConfig = {
  accommodation: { name: 'Accommodation', icon: 'bed', color: '#FF6B6B' },
  food: { name: 'Food & Dining', icon: 'cutlery', color: '#4ECDC4' },
  transportation: { name: 'Transportation', icon: 'car', color: '#45B7D1' },
  activities: { name: 'Activities', icon: 'ticket', color: '#96CEB4' },
  shopping: { name: 'Shopping', icon: 'shopping-bag', color: '#FFEAA7' },
  other: { name: 'Other', icon: 'ellipsis-h', color: '#DDA0DD' },
};

export default function BudgetPlanningDailyScreen() {
  const router = useRouter();
  const { tripName, country, totalBudget, travelStyle } = useLocalSearchParams();
  const [suggestedDailyBudget, setSuggestedDailyBudget] = useState(0);
  const [userDailyBudget, setUserDailyBudget] = useState('');
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [error, setError] = useState('');

  const totalBudgetAmount = totalBudget ? parseFloat(totalBudget as string) : null;
  const confirmedDailyBudget = parseFloat(userDailyBudget) || suggestedDailyBudget;

  useEffect(() => {
    // Calculate suggested daily budget based on country and travel style
    const suggested = calculateDailyBudget(
      country as string,
      travelStyle as 'Budget' | 'Mid-range' | 'Luxury'
    );
    setSuggestedDailyBudget(suggested);
    setUserDailyBudget(suggested.toString());

    // Get recommended percentages for allocation
    const recommendedPercentages = getDefaultCategoryPercentages(
      country as string,
      travelStyle as 'Budget' | 'Mid-range' | 'Luxury'
    );

    // Initialize categories with values based on suggested daily budget
    const initialCategories: CategoryData[] = Object.entries(categoryConfig).map(([id, config]) => {
      const percentage = recommendedPercentages[id as keyof typeof recommendedPercentages] || 0;
      const recommendedValue = Math.round((suggested * percentage) / 100);

      return {
        id: id as keyof typeof categoryConfig,
        name: config.name,
        icon: config.icon,
        color: config.color,
        dailyValue: recommendedValue,
        recommendedValue: recommendedValue,
      };
    });

    setCategories(initialCategories);
  }, [country, travelStyle]);

  // Update categories when user changes daily budget
  useEffect(() => {
    if (confirmedDailyBudget > 0 && categories.length > 0) {
      const recommendedPercentages = getDefaultCategoryPercentages(
        country as string,
        travelStyle as 'Budget' | 'Mid-range' | 'Luxury'
      );

      const updatedCategories = categories.map((cat) => {
        const percentage = recommendedPercentages[cat.id] || 0;
        const newValue = Math.round((confirmedDailyBudget * percentage) / 100);
        return {
          ...cat,
          dailyValue: newValue,
          recommendedValue: newValue,
        };
      });

      setCategories(updatedCategories);
    }
  }, [confirmedDailyBudget]);

  const updateCategoryValue = (categoryId: string, value: number) => {
    const newCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        // Ensure value is within reasonable bounds
        const validatedValue = Math.max(0, Math.min(value, confirmedDailyBudget * 2));
        return { ...cat, dailyValue: validatedValue };
      }
      return cat;
    });

    setCategories(newCategories);
    setError(''); // Clear any previous errors
  };

  const getAllocatedTotal = () => {
    return categories.reduce((sum, cat) => sum + cat.dailyValue, 0);
  };

  const getMaxTripLength = () => {
    if (!totalBudgetAmount || confirmedDailyBudget <= 0) return null;
    return Math.floor(totalBudgetAmount / confirmedDailyBudget);
  };

  const handleContinue = () => {
    // Validate total allocation
    if (allocatedTotal > confirmedDailyBudget) {
      setError(
        `Your allocated amount ($${allocatedTotal}) exceeds your daily budget ($${confirmedDailyBudget})`
      );
      return;
    }

    // Validate minimum allocation
    const unallocatedAmount = confirmedDailyBudget - allocatedTotal;
    if (unallocatedAmount > 0) {
      setError(`You still have $${unallocatedAmount} left to allocate in your daily budget`);
      return;
    }

    // Validate category allocations
    const emptyCategories = categories.filter((cat) => cat.dailyValue === 0);
    if (emptyCategories.length > 0) {
      setError(
        `Please allocate some budget to: ${emptyCategories.map((cat) => cat.name).join(', ')}`
      );
      return;
    }

    // Prepare category data for the next screen
    const categoryData = categories.reduce(
      (acc, category) => {
        acc[category.id] = category.dailyValue;
        return acc;
      },
      {} as Record<string, number>
    );

    // Navigate to review screen
    router.push({
      pathname: '/trip/create/budget-planning-review',
      params: {
        tripName,
        country,
        totalBudget: totalBudgetAmount?.toString() || undefined,
        travelStyle,
        dailyBudget: confirmedDailyBudget.toString(),
        categories: JSON.stringify(categoryData),
      },
    } as any);
  };

  const maxTripLength = getMaxTripLength();
  const allocatedTotal = getAllocatedTotal();
  const isValid = confirmedDailyBudget > 0 && allocatedTotal > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Set your daily budget</Text>
          <Text style={styles.subtitle}>
            Based on your travel style and destination, we suggest a daily budget
          </Text>
        </View>

        {/* Daily Budget Input Section */}
        <View style={styles.budgetInputCard}>
          <Text style={styles.budgetInputLabel}>Daily Budget</Text>
          <Text style={styles.suggestedText}>
            Suggested for {travelStyle} travel in {country}: ${suggestedDailyBudget}
          </Text>
          <View style={styles.budgetInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.budgetInput}
              value={userDailyBudget}
              onChangeText={setUserDailyBudget}
              placeholder="0"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
          </View>

          {totalBudgetAmount && maxTripLength && (
            <View style={styles.maxLengthInfo}>
              <FontAwesome name="info-circle" size={14} color="#057B8C" />
              <Text style={styles.maxLengthText}>
                With your total budget of ${totalBudgetAmount}, this allows for a maximum trip
                length of {maxTripLength} days
              </Text>
            </View>
          )}
        </View>

        {/* Allocation Section */}
        <View style={styles.allocationHeader}>
          <Text style={styles.allocationTitle}>Allocate your daily budget</Text>
          <Text style={styles.allocationSubtitle}>
            Adjust how much you want to spend per day in each category
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily budget:</Text>
            <Text style={styles.summaryValue}>${confirmedDailyBudget}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Allocated:</Text>
            <Text
              style={[
                styles.summaryValue,
                allocatedTotal > confirmedDailyBudget ? styles.overBudget : styles.withinBudget,
              ]}
            >
              ${allocatedTotal}
            </Text>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <FontAwesome name={category.icon as any} size={16} color="#FFFFFF" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryRecommended}>
                    Suggested: ${category.recommendedValue}
                  </Text>
                </View>
                <Text style={styles.categoryValue}>${category.dailyValue}</Text>
              </View>

              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={Math.max(confirmedDailyBudget, 100)}
                  step={5}
                  value={category.dailyValue}
                  onValueChange={(value) => updateCategoryValue(category.id.toString(), value)}
                  minimumTrackTintColor={category.color}
                  maximumTrackTintColor="#E5E5E5"
                  thumbTintColor={category.color}
                />
              </View>
            </View>
          ))}
        </View>

        {allocatedTotal > confirmedDailyBudget && (
          <View style={styles.warningContainer}>
            <FontAwesome name="exclamation-triangle" size={16} color="#FF9500" />
            <Text style={styles.warningText}>
              Your allocated amount (${allocatedTotal}) exceeds your daily budget ($
              {confirmedDailyBudget})
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <FontAwesome name="exclamation-circle" size={16} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    lineHeight: 22,
  },
  budgetInputCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  budgetInputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  suggestedText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    paddingLeft: 16,
  },
  budgetInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    color: '#333333',
  },
  maxLengthInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F4F8',
    borderRadius: 8,
    padding: 12,
  },
  maxLengthText: {
    fontSize: 14,
    color: '#057B8C',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  allocationHeader: {
    marginBottom: 16,
  },
  allocationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  allocationSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  summaryCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  withinBudget: {
    color: '#34C759',
  },
  overBudget: {
    color: '#FF3B30',
  },
  categoriesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  categoryRecommended: {
    fontSize: 13,
    color: '#8E8E93',
  },
  categoryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 15,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8D7DA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#721C24',
    marginLeft: 8,
    flex: 1,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#057B8C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
});
