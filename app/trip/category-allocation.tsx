import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { getDefaultCategoryPercentages, CategoryPercentages } from '../utils/countryData';

// Define budget categories with icons
const BUDGET_CATEGORIES = [
  { id: 'accommodation', name: 'Accommodation', icon: 'bed' },
  { id: 'food', name: 'Food & Drinks', icon: 'cutlery' },
  { id: 'transportation', name: 'Transportation', icon: 'car' },
  { id: 'activities', name: 'Activities', icon: 'ticket' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag' },
  { id: 'other', name: 'Other', icon: 'ellipsis-h' },
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
  const [isLoaded, setIsLoaded] = useState(false);

  // Load default category percentages when component mounts
  useEffect(() => {
    if (params.country && params.travelStyle && !isLoaded) {
      try {
        const defaultPercentages = getDefaultCategoryPercentages(
          params.country,
          params.travelStyle
        );
        
        setCategories(defaultPercentages);
      } catch (error) {
        console.error("Error loading default percentages:", error);
        // Fallback to default values if there's an error
        setCategories({
          accommodation: 40,
          food: 25,
          transportation: 15,
          activities: 15,
          shopping: 3,
          other: 2
        });
      }
      setIsLoaded(true);
    }
  }, [params.country, params.travelStyle, isLoaded]);

  // Calculate total percentage allocated
  const totalPercentage = Object.values(categories).reduce((sum, value) => sum + value, 0);
  
  // Check if allocations are valid (total is 100%)
  const isFormValid = Math.abs(totalPercentage - 100) < 0.1; // Allow small rounding errors

  // Update a category's percentage and adjust others proportionally
  const updateCategory = (categoryId: string, newValue: number) => {
    const oldValue = categories[categoryId] || 0;
    const difference = newValue - oldValue;
    
    // Calculate how much we need to adjust other categories
    const remainingCategories = Object.keys(categories).filter(id => id !== categoryId);
    const totalRemainingPercentage = remainingCategories.reduce((sum, id) => sum + categories[id], 0);
    
    // Avoid division by zero
    if (totalRemainingPercentage === 0 && difference !== 0) {
      // If all other categories are 0, distribute evenly
      const newCategories = { ...categories };
      newCategories[categoryId] = newValue;
      const remainingPercentage = 100 - newValue;
      const evenShare = remainingPercentage / remainingCategories.length;
      remainingCategories.forEach(id => {
        newCategories[id] = evenShare;
      });
      setCategories(newCategories);
      return;
    }
    
    // Calculate adjustment ratio
    const adjustmentRatio = (totalRemainingPercentage - difference) / totalRemainingPercentage;
    
    // Create new categories object with adjustments
    const newCategories = { ...categories };
    newCategories[categoryId] = newValue;
    
    // Adjust other categories proportionally
    remainingCategories.forEach(id => {
      // Ensure we don't go below 0
      newCategories[id] = Math.max(0, categories[id] * adjustmentRatio);
    });
    
    // Handle rounding errors by adjusting the largest category
    const totalNewPercentage = Object.values(newCategories).reduce((sum, value) => sum + value, 0);
    if (Math.abs(totalNewPercentage - 100) > 0.1) {
      const adjustment = 100 - totalNewPercentage;
      const largestCategoryId = remainingCategories.reduce(
        (maxId, id) => newCategories[id] > newCategories[maxId] ? id : maxId,
        remainingCategories[0]
      );
      newCategories[largestCategoryId] += adjustment;
    }
    
    setCategories(newCategories);
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
        ...params,
        categories: JSON.stringify(roundedCategories),
      },
    } as any);
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
                <FontAwesome name={category.icon as any} size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryPercentage}>
                {categories[category.id]?.toFixed(1) || '0'}%
              </Text>
            </View>
            
            <Slider
              style={styles.categorySlider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={categories[category.id] || 0}
              onValueChange={(value) => updateCategory(category.id, value)}
              minimumTrackTintColor="#FF6B6B"
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor="#FF6B6B"
            />
            
            <View style={styles.categoryValueContainer}>
              <Text style={styles.categoryValueLabel}>Daily budget:</Text>
              <Text style={styles.categoryValueAmount}>
                ${((categories[category.id] || 0) / 100 * dailyBudget).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.categoryValueContainer}>
              <Text style={styles.categoryValueLabel}>Total budget:</Text>
              <Text style={styles.categoryValueAmount}>
                ${((categories[category.id] || 0) / 100 * totalDailyBudget).toFixed(2)}
              </Text>
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
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
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
  categoryValueAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
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