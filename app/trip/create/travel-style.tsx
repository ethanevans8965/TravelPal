import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type TravelStyleOption = {
  id: 'Budget' | 'Mid-range' | 'Luxury';
  title: string;
  description: string;
  examples: string[];
  icon: string;
  color: string;
};

const travelStyleOptions: TravelStyleOption[] = [
  {
    id: 'Budget',
    title: 'Budget',
    description: 'Maximize your experiences while minimizing costs',
    examples: [
      'Hostels & budget hotels',
      'Local street food',
      'Public transportation',
      'Free activities',
    ],
    icon: 'piggy-bank',
    color: '#34C759',
  },
  {
    id: 'Mid-range',
    title: 'Mid-range',
    description: 'Balance comfort and value for a great experience',
    examples: [
      '3-star hotels & Airbnb',
      'Mix of local & tourist restaurants',
      'Taxis & ride-sharing',
      'Paid attractions',
    ],
    icon: 'balance-scale',
    color: '#FF9500',
  },
  {
    id: 'Luxury',
    title: 'Luxury',
    description: 'Premium comfort and exclusive experiences',
    examples: [
      '4-5 star hotels & resorts',
      'Fine dining restaurants',
      'Private transfers',
      'Premium experiences',
    ],
    icon: 'gem',
    color: '#AF52DE',
  },
];

export default function TravelStyleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedStyle, setSelectedStyle] = useState<TravelStyleOption['id'] | null>(null);

  const handleNext = () => {
    if (!selectedStyle) return;

    // Determine next route based on the budget method
    let nextRoute = '';

    if (params.totalBudget) {
      // Total budget flow
      nextRoute = '/trip/create/total-budget/categories';
    } else if (params.startDate && params.endDate) {
      // Trip dates flow
      nextRoute = '/trip/create/trip-dates/budget-estimate';
    } else if (params.totalBudget && params.startDate && params.endDate) {
      // Both budget and dates flow
      nextRoute = '/trip/create/both/categories';
    } else {
      // Default fallback
      nextRoute = '/trip/create/total-budget/categories';
    }

    router.push({
      pathname: nextRoute,
      params: {
        ...params,
        travelStyle: selectedStyle,
      },
    } as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>What's your travel style?</Text>
          <Text style={styles.subtitle}>
            This helps us recommend the best budget allocation for your trip
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {travelStyleOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedStyle === option.id && styles.optionCardSelected,
                selectedStyle === option.id && { borderColor: option.color },
              ]}
              onPress={() => setSelectedStyle(option.id)}
            >
              <View style={styles.optionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                  <FontAwesome name={option.icon as any} size={20} color="#FFFFFF" />
                </View>
                <View style={styles.optionTitleContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                {selectedStyle === option.id && (
                  <FontAwesome name="check-circle" size={24} color={option.color} />
                )}
              </View>

              <View style={styles.examplesContainer}>
                {option.examples.map((example, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <View style={[styles.exampleDot, { backgroundColor: option.color }]} />
                    <Text style={styles.exampleText}>{example}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !selectedStyle && styles.continueButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedStyle}
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
    marginBottom: 32,
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
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
  },
  optionCardSelected: {
    backgroundColor: '#F8F9FA',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTitleContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 20,
  },
  examplesContainer: {
    gap: 8,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exampleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  exampleText: {
    fontSize: 15,
    color: '#6D6D70',
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
