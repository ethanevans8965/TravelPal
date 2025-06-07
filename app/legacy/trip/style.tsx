import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type TravelStyle = 'Budget' | 'Mid-range' | 'Luxury';

const travelStyles: { id: TravelStyle; title: string; description: string; icon: string }[] = [
  {
    id: 'Budget',
    title: 'Budget',
    description: 'Affordable accommodations and activities',
    icon: 'money',
  },
  {
    id: 'Mid-range',
    title: 'Mid-range',
    description: 'Comfortable stays with some luxury experiences',
    icon: 'star',
  },
  {
    id: 'Luxury',
    title: 'Luxury',
    description: 'Premium accommodations and exclusive experiences',
    icon: 'diamond',
  },
];

export default function StyleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destination: string;
    country: string;
    startDate: string;
    endDate: string;
  }>();

  const [selectedStyle, setSelectedStyle] = useState<TravelStyle | null>(null);

  const handleNext = () => {
    if (!selectedStyle) return;

    router.push({
      pathname: '/trip/budget',
      params: {
        ...params,
        travelStyle: selectedStyle,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>What's your travel style?</Text>
      <Text style={styles.subtitle}>Choose your preferred level of comfort</Text>

      <View style={styles.options}>
        {travelStyles.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={[styles.option, selectedStyle === style.id && styles.optionSelected]}
            onPress={() => setSelectedStyle(style.id)}
          >
            <View style={styles.optionIcon}>
              <FontAwesome name={style.icon as any} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{style.title}</Text>
              <Text style={styles.optionDescription}>{style.description}</Text>
            </View>
            {selectedStyle === style.id && (
              <FontAwesome name="check-circle" size={24} color="#FF6B6B" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !selectedStyle && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!selectedStyle}
      >
        <Text style={styles.nextButtonText}>Next</Text>
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
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
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
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#FFB6B6',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
