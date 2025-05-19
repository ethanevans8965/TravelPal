import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { CategoryPercentages } from '../utils/countryData';

const categories = [
  { id: 'accommodation', name: 'Accommodation', icon: 'bed' },
  { id: 'food', name: 'Food & Drinks', icon: 'cutlery' },
  { id: 'transportation', name: 'Transportation', icon: 'car' },
  { id: 'activities', name: 'Activities', icon: 'ticket' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag' },
  { id: 'other', name: 'Other', icon: 'ellipsis-h' },
];

const defaultPercentages: CategoryPercentages = {
  accommodation: 30,
  food: 25,
  transportation: 15,
  activities: 15,
  shopping: 10,
  other: 5,
};

export default function CategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destination: string;
    country: string;
    startDate: string;
    endDate: string;
    travelStyle: string;
    numTravelers: string;
    dailyBudget: string;
    preTripExpenses: string;
    emergencyPercentage: string;
    totalBudget: string;
    tripDuration: string;
  }>();

  const [percentages, setPercentages] = useState<CategoryPercentages>(defaultPercentages);

  const handleNext = () => {
    router.push({
      pathname: '/trip/review',
      params: {
        ...params,
        categories: JSON.stringify(percentages),
      },
    });
  };

  const adjustPercentage = (categoryId: string, adjustment: number) => {
    setPercentages((prev) => {
      const newPercentages = { ...prev };
      const currentValue = newPercentages[categoryId as keyof CategoryPercentages];
      const newValue = Math.max(0, Math.min(100, currentValue + adjustment));
      newPercentages[categoryId as keyof CategoryPercentages] = newValue;
      return newPercentages;
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Budget Categories</Text>
      <Text style={styles.subtitle}>Allocate your budget across different categories</Text>

      <View style={styles.categories}>
        {categories.map((category) => (
          <View key={category.id} style={styles.category}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                <FontAwesome name={category.icon as any} size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>

            <View style={styles.percentageControls}>
              <TouchableOpacity
                style={styles.percentageButton}
                onPress={() => adjustPercentage(category.id, -5)}
              >
                <FontAwesome name="minus" size={16} color="#666666" />
              </TouchableOpacity>

              <Text style={styles.percentage}>
                {percentages[category.id as keyof CategoryPercentages]}%
              </Text>

              <TouchableOpacity
                style={styles.percentageButton}
                onPress={() => adjustPercentage(category.id, 5)}
              >
                <FontAwesome name="plus" size={16} color="#666666" />
              </TouchableOpacity>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${percentages[category.id as keyof CategoryPercentages]}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Review Trip</Text>
        <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  categories: {
    gap: 24,
  },
  category: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  percentageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  percentageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 16,
    minWidth: 48,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 