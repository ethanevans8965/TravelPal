import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { getDefaultCategoryPercentages, calculateDailyBudget } from '../../../utils/countryData';

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

export default function CategoriesScreen() {
  const router = useRouter();
  const { tripName, country, totalBudget, travelStyle } = useLocalSearchParams();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [error, setError] = useState('');

  const budget = parseFloat(totalBudget as string) || 0;

  useEffect(() => {
    // Get recommended daily budget based on country and travel style
    const recommendedDailyBudget = calculateDailyBudget(
      country as string,
      travelStyle as 'Budget' | 'Mid-range' | 'Luxury'
    );

    // Get recommended percentages to calculate daily values for each category
    const recommendedPercentages = getDefaultCategoryPercentages(
      country as string,
      travelStyle as 'Budget' | 'Mid-range' | 'Luxury'
    );

    // Initialize categories with recommended daily values
    const initialCategories: CategoryData[] = Object.entries(categoryConfig).map(([id, config]) => {
      const percentage = recommendedPercentages[id as keyof typeof recommendedPercentages] || 0;
      const recommendedValue = Math.round((recommendedDailyBudget * percentage) / 100);

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

  const updateCategoryValue = (categoryId: keyof typeof categoryConfig, newValue: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, dailyValue: Math.round(newValue) } : cat
      )
    );
    setError('');
  };

  const getUserDailyTotal = () => {
    return categories.reduce((sum, cat) => sum + cat.dailyValue, 0);
  };

  const getRecommendedDailyTotal = () => {
    return categories.reduce((sum, cat) => sum + cat.recommendedValue, 0);
  };

  const getMaxTripLength = () => {
    const userDailyTotal = getUserDailyTotal();
    return userDailyTotal > 0 ? Math.floor(budget / userDailyTotal) : 0;
  };

  const isAboveRecommended = () => {
    return getUserDailyTotal() > getRecommendedDailyTotal();
  };

  const handleContinue = () => {
    const userDailyTotal = getUserDailyTotal();

    if (userDailyTotal <= 0) {
      setError('Please allocate at least some budget to continue');
      return;
    }

    // Convert categories to the format expected by the next screen
    const categoryValues = categories.reduce(
      (acc, cat) => {
        acc[cat.id] = cat.dailyValue;
        return acc;
      },
      {} as Record<string, number>
    );

    router.push({
      pathname: '/trip/create/total-budget/review',
      params: {
        tripName,
        country,
        totalBudget,
        travelStyle,
        categories: JSON.stringify(categoryValues),
        userDailyTotal: userDailyTotal.toString(),
        recommendedDailyTotal: getRecommendedDailyTotal().toString(),
        maxTripLength: getMaxTripLength().toString(),
      },
    } as any);
  };

  const userDailyTotal = getUserDailyTotal();
  const recommendedDailyTotal = getRecommendedDailyTotal();
  const isValid = userDailyTotal > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Allocate your daily budget</Text>
          <Text style={styles.subtitle}>
            Adjust how much you want to spend per day in each category
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recommended daily budget:</Text>
            <Text style={styles.summaryValue}>${recommendedDailyTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Your daily budget:</Text>
            <Text
              style={[
                styles.summaryValue,
                isAboveRecommended() ? styles.aboveRecommended : styles.withinRecommended,
              ]}
            >
              ${userDailyTotal}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Max trip length:</Text>
            <Text style={styles.summaryValue}>{getMaxTripLength()} days</Text>
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
                    Recommended: ${category.recommendedValue}
                  </Text>
                </View>
                <Text style={styles.categoryValue}>${category.dailyValue}</Text>
              </View>

              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={Math.max(category.recommendedValue * 2, 100)}
                  step={5}
                  value={category.dailyValue}
                  onValueChange={(value) => updateCategoryValue(category.id, value)}
                  minimumTrackTintColor={category.color}
                  maximumTrackTintColor="#E5E5E5"
                  thumbTintColor={category.color}
                />
              </View>
            </View>
          ))}
        </View>

        {isAboveRecommended() && (
          <View style={styles.warningContainer}>
            <FontAwesome name="info-circle" size={16} color="#FF9500" />
            <Text style={styles.warningText}>
              Your daily budget is above the recommended amount for {travelStyle} travel in{' '}
              {country}
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
  withinRecommended: {
    color: '#34C759',
  },
  aboveRecommended: {
    color: '#FF9500',
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
