import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getDefaultCategoryPercentages, CategoryPercentages } from '../utils/countryData';
import { FontAwesomeIconName } from '../types/icons';
import RecommendedSlider from '../components/RecommendedSlider';

// Define budget categories with icons
const BUDGET_CATEGORIES = [
  { id: 'accommodation', name: 'Accommodation', icon: 'bed' as FontAwesomeIconName },
  { id: 'food', name: 'Food & Drinks', icon: 'cutlery' as FontAwesomeIconName },
  { id: 'transportation', name: 'Transportation', icon: 'car' as FontAwesomeIconName },
  { id: 'activities', name: 'Activities', icon: 'ticket' as FontAwesomeIconName },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag' as FontAwesomeIconName },
  { id: 'other', name: 'Other', icon: 'ellipsis-h' as FontAwesomeIconName },
];

export default function CategoryAllocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destination: string;
    country: string;
    startDate: string;
    endDate: string;
    travelStyle: 'Budget' | 'Mid-range' | 'Luxury';
    numTravelers: string;
    dailyBudget: string;
    preTripExpenses: string;
    emergencyPercentage: string;
    totalBudget: string;
    tripDuration: string;
  }>();

  // Calculate the daily spending amount (total minus pre-trip expenses and emergency fund)
  const dailyBudget = parseFloat(params.dailyBudget || '0');
  const tripDuration = parseInt(params.tripDuration || '0');
  const numTravelers = parseInt(params.numTravelers || '1');
  const totalDailyBudget = dailyBudget * numTravelers * tripDuration;

  // Initialize categories with default percentages
  const [categories, setCategories] = useState<CategoryPercentages>({
    accommodation: 0,
    food: 0,
    transportation: 0,
    activities: 0,
    shopping: 0,
    other: 0
  });
  const [recommendedCategories, setRecommendedCategories] = useState<CategoryPercentages>({
    accommodation: 0,
    food: 0,
    transportation: 0,
    activities: 0,
    shopping: 0,
    other: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load default category percentages when component mounts
  useEffect(() => {
    if (params.country && params.travelStyle && !isLoaded) {
      try {
        const defaultPercentages = getDefaultCategoryPercentages(
          params.country,
          params.travelStyle
        );
        
        // Only set recommended values, keep current values at 0
        setRecommendedCategories(defaultPercentages);
      } catch (error) {
        console.error("Error loading default percentages:", error);
        // Fallback to default values if there's an error
        const fallbackValues = {
          accommodation: 40,
          food: 25,
          transportation: 15,
          activities: 15,
          shopping: 3,
          other: 2
        };
        setRecommendedCategories(fallbackValues);
      }
      setIsLoaded(true);
    }
  }, [params.country, params.travelStyle, isLoaded]);

  // Reset to recommended values
  const resetToRecommended = () => {
    setCategories({ ...recommendedCategories });
  };

  // Calculate total percentage allocated
  const totalPercentage = Object.values(categories).reduce((sum, value) => sum + value, 0);
  
  // Check if allocations are valid (total is 100%)
  const isFormValid = Math.abs(totalPercentage - 100) < 0.1; // Allow small rounding errors

  // Update a category's percentage without adjusting others
  const updateCategory = (categoryId: string, newValue: number) => {
    setCategories(prev => ({
      ...prev,
      [categoryId]: newValue
    }));
  };

  const navigateToNext = () => {
    if (!isFormValid) return;

    // Round percentages to integers for cleaner display
    const roundedCategories: CategoryPercentages = {
      accommodation: Math.round(categories.accommodation),
      food: Math.round(categories.food),
      transportation: Math.round(categories.transportation),
      activities: Math.round(categories.activities),
      shopping: Math.round(categories.shopping),
      other: Math.round(categories.other)
    };

    router.push({
      pathname: '/trip/review',
      params: {
        destination: params.destination,
        country: params.country,
        startDate: params.startDate,
        endDate: params.endDate,
        travelStyle: params.travelStyle,
        numTravelers: params.numTravelers,
        dailyBudget: params.dailyBudget,
        preTripExpenses: params.preTripExpenses,
        emergencyPercentage: params.emergencyPercentage,
        totalBudget: params.totalBudget,
        tripDuration: params.tripDuration,
        categories: JSON.stringify(roundedCategories),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Budget Allocation</Text>
      <Text style={styles.subtitle}>Adjust how you want to spend your budget</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Trip Budget Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Destination:</Text>
          <Text style={styles.infoValue}>{params.destination}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Country:</Text>
          <Text style={styles.infoValue}>{params.country}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Travel Style:</Text>
          <Text style={styles.infoValue}>{params.travelStyle}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Budget:</Text>
          <Text style={styles.infoValue}>${parseFloat(params.totalBudget || '0').toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Daily Spending:</Text>
          <Text style={styles.infoValue}>${dailyBudget.toFixed(2)} × {params.numTravelers} traveler(s)</Text>
        </View>
      </View>

      <View style={styles.recommendationHeader}>
        <View style={styles.recommendationTitleContainer}>
          <Text style={styles.recommendationTitle}>Recommended Budget Distribution for {params.destination}</Text>
          <View style={styles.recommendationActions}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetToRecommended}
            >
              <FontAwesome name="refresh" size={16} color="#FF6B6B" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoIconContainer}>
              <FontAwesome name="info-circle" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.recommendationSubtitle}>
          These percentages are based on typical spending patterns in {params.country} for {params.travelStyle.toLowerCase()} travelers
        </Text>
      </View>

      <View style={styles.totalAllocationContainer}>
        <Text style={styles.totalAllocationLabel}>Total Allocated</Text>
        <Text style={[
          styles.totalAllocationValue,
          !isFormValid && styles.invalidAllocation
        ]}>
          {totalPercentage.toFixed(1)}%
        </Text>
        {!isFormValid && (
          <Text style={styles.allocationWarning}>
            Your allocation should total 100%
          </Text>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        {BUDGET_CATEGORIES.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIconContainer}>
                <FontAwesome name={category.icon} size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.percentageContainer}>
                <Text style={styles.categoryPercentage}>
                  {categories[category.id]?.toFixed(1) || '0'}%
                </Text>
                <Text style={styles.recommendedPercentage}>
                  Recommended: {recommendedCategories[category.id]?.toFixed(1) || '0'}%
                </Text>
              </View>
            </View>
            
            <RecommendedSlider
              value={categories[category.id] || 0}
              recommendedValue={recommendedCategories[category.id] || 0}
              onValueChange={(value) => updateCategory(category.id, value)}
              style={styles.categorySlider}
            />
            
            <View style={styles.categoryValueContainer}>
              <Text style={styles.categoryValueLabel}>Daily budget:</Text>
              <View style={styles.valuePairContainer}>
                <Text style={styles.categoryValueAmount}>
                  ${((categories[category.id] || 0) / 100 * dailyBudget).toFixed(2)}
                </Text>
                <Text style={styles.recommendedValueAmount}>
                  Recommended: ${((recommendedCategories[category.id] || 0) / 100 * dailyBudget).toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.categoryValueContainer}>
              <Text style={styles.categoryValueLabel}>Total budget:</Text>
              <View style={styles.valuePairContainer}>
                <Text style={styles.categoryValueAmount}>
                  ${((categories[category.id] || 0) / 100 * totalDailyBudget).toFixed(2)}
                </Text>
                <Text style={styles.recommendedValueAmount}>
                  Recommended: ${((recommendedCategories[category.id] || 0) / 100 * totalDailyBudget).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={navigateToNext}
          disabled={!isFormValid}
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
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  recommendationHeader: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  recommendationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  recommendationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 4,
  },
  infoIconContainer: {
    padding: 4,
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  totalAllocationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  totalAllocationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  totalAllocationValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#28a745',
    marginBottom: 4,
  },
  invalidAllocation: {
    color: '#dc3545',
  },
  allocationWarning: {
    fontSize: 14,
    color: '#dc3545',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  percentageContainer: {
    alignItems: 'flex-end',
  },
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  recommendedPercentage: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  categorySlider: {
    width: '100%',
    height: 40,
    marginBottom: 8,
  },
  categoryValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryValueLabel: {
    fontSize: 14,
    color: '#666666',
  },
  valuePairContainer: {
    alignItems: 'flex-end',
  },
  categoryValueAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  recommendedValueAmount: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
}); 