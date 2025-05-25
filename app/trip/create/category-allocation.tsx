import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type Category = {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  amount: number;
};

const defaultCategories: Category[] = [
  { id: 'accommodation', name: 'Accommodation', icon: 'bed', percentage: 30, amount: 0 },
  { id: 'transportation', name: 'Transportation', icon: 'plane', percentage: 20, amount: 0 },
  { id: 'food', name: 'Food & Dining', icon: 'cutlery', percentage: 20, amount: 0 },
  { id: 'activities', name: 'Activities', icon: 'ticket', percentage: 15, amount: 0 },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', percentage: 10, amount: 0 },
  { id: 'other', name: 'Other', icon: 'ellipsis-h', percentage: 5, amount: 0 },
];

export default function CategoryAllocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [totalBudget, setTotalBudget] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.totalBudget) {
      const budget = parseFloat(params.totalBudget as string);
      setTotalBudget(budget);
      updateCategoryAmounts(budget);
    }
  }, [params.totalBudget]);

  const updateCategoryAmounts = (budget: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        amount: Math.round((budget * category.percentage) / 100),
      }))
    );
  };

  const handlePercentageChange = (categoryId: string, newPercentage: string) => {
    const percentage = parseFloat(newPercentage) || 0;
    if (percentage < 0 || percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category) => {
        if (category.id === categoryId) {
          return { ...category, percentage, amount: Math.round((totalBudget * percentage) / 100) };
        }
        return category;
      });

      // Calculate total percentage
      const totalPercentage = updatedCategories.reduce((sum, cat) => sum + cat.percentage, 0);
      if (totalPercentage !== 100) {
        setError('Total percentage must equal 100%');
      } else {
        setError('');
      }

      return updatedCategories;
    });
  };

  const handleContinue = () => {
    if (error) return;

    // Navigate to review screen
    router.push({
      pathname: '/trip/review',
      params: {
        ...params,
        categories: JSON.stringify(categories),
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Allocate Your Budget</Text>
          <Text style={styles.subtitle}>
            Adjust the percentages to match your spending preferences
          </Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <FontAwesome name={category.icon as any} size={20} color="#333333" />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>${category.amount.toLocaleString()}</Text>
              </View>

              <View style={styles.percentageContainer}>
                <TextInput
                  style={styles.percentageInput}
                  value={category.percentage.toString()}
                  onChangeText={(text) => handlePercentageChange(category.id, text)}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.percentageSymbol}>%</Text>
              </View>
            </View>
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, error ? styles.continueButtonDisabled : null]}
        onPress={handleContinue}
        disabled={!!error}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
        <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryItem: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 8,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    color: '#333333',
  },
  percentageSymbol: {
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
