import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type TripDetailOption = {
  id: 'totalBudget' | 'tripLength' | 'both' | 'noBudget';
  title: string;
  description: string;
  icon: string;
};

const tripDetailOptions: TripDetailOption[] = [
  {
    id: 'totalBudget',
    title: 'I know my total budget',
    description: 'Set your overall budget and optionally your trip length',
    icon: 'money',
  },
  {
    id: 'tripLength',
    title: 'I know my trip length',
    description: "Set your travel dates and we'll help plan your budget",
    icon: 'calendar',
  },
  {
    id: 'both',
    title: 'I know my total budget AND trip dates',
    description: 'Set both your budget and dates for precise planning',
    icon: 'calculator',
  },
  {
    id: 'noBudget',
    title: 'No budget planning needed',
    description: 'Just create a trip and track expenses as you go',
    icon: 'plane',
  },
];

export default function TripDetailsScreen() {
  const router = useRouter();
  const { tripName, country } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState<TripDetailOption['id'] | null>(null);

  const handleNext = () => {
    if (!selectedOption) return;

    let nextRoute = '';
    switch (selectedOption) {
      case 'totalBudget':
        nextRoute = '/trip/create/total-budget';
        break;
      case 'tripLength':
        nextRoute = '/trip/create/trip-dates';
        break;
      case 'both':
        nextRoute = '/trip/create/both/total-budget';
        break;
      case 'noBudget':
        nextRoute = '/trip/create/no-budget/dates';
        break;
    }

    router.push({
      pathname: nextRoute,
      params: {
        tripName,
        country,
      },
    } as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What do you know about your trip?</Text>
        <Text style={styles.subtitle}>Select what you'd like to plan for</Text>

        <View style={styles.options}>
          {tripDetailOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, selectedOption === option.id && styles.optionSelected]}
              onPress={() => setSelectedOption(option.id)}
            >
              <View style={styles.optionIcon}>
                <FontAwesome name={option.icon as any} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              {selectedOption === option.id && (
                <FontAwesome name="check-circle" size={24} color="#057B8C" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !selectedOption && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedOption}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
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
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  optionSelected: {
    borderColor: '#057B8C',
    backgroundColor: '#F0F9FA',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#057B8C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
