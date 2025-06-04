import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useExpenseStore } from '../../stores/expenseStore';
import { useTripStore } from '../../stores/tripStore';
import { useUserStore } from '../../stores/userStore';
import DashboardCard from './DashboardCard';

interface QuickSuggestion {
  id: string;
  category: string;
  description: string;
  amount: number;
  icon: string;
  color: string;
  confidence: number; // 0-1 for suggestion relevance
}

interface QuickExpenseWidgetProps {
  onExpenseAdded?: () => void;
}

export default function QuickExpenseWidget({ onExpenseAdded }: QuickExpenseWidgetProps) {
  const router = useRouter();
  const [selectedSuggestion, setSelectedSuggestion] = useState<QuickSuggestion | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store access
  const addExpense = useExpenseStore((state) => state.addExpense);
  const recentExpenses = useExpenseStore((state) => state.getRecentExpenses)(10);
  const activeTrips = useTripStore((state) => state.getCurrentTrips)();
  const { baseCurrency } = useUserStore();

  // Helper functions for category icons and colors
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

  // Generate smart suggestions based on context
  const generateSuggestions = (): QuickSuggestion[] => {
    const currentHour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());

    // Base suggestions based on time of day
    const timeBased: QuickSuggestion[] = [];

    if (currentHour >= 6 && currentHour <= 11) {
      // Morning suggestions
      timeBased.push({
        id: 'morning-coffee',
        category: 'food',
        description: 'Coffee',
        amount: 5,
        icon: 'coffee',
        color: '#8B4513',
        confidence: 0.8,
      });
      timeBased.push({
        id: 'morning-transport',
        category: 'transport',
        description: 'Morning commute',
        amount: 15,
        icon: 'car',
        color: '#3B82F6',
        confidence: 0.7,
      });
    } else if (currentHour >= 12 && currentHour <= 14) {
      // Lunch suggestions
      timeBased.push({
        id: 'lunch',
        category: 'food',
        description: 'Lunch',
        amount: 25,
        icon: 'cutlery',
        color: '#F59E0B',
        confidence: 0.9,
      });
    } else if (currentHour >= 17 && currentHour <= 22) {
      // Evening suggestions
      timeBased.push({
        id: 'dinner',
        category: 'food',
        description: 'Dinner',
        amount: 35,
        icon: 'cutlery',
        color: '#F59E0B',
        confidence: 0.8,
      });
      if (isWeekend) {
        timeBased.push({
          id: 'entertainment',
          category: 'entertainment',
          description: 'Entertainment',
          amount: 50,
          icon: 'film',
          color: '#EC4899',
          confidence: 0.6,
        });
      }
    }

    // Pattern-based suggestions from recent expenses
    const categoryFrequency: Record<string, { count: number; avgAmount: number }> = {};
    recentExpenses.forEach((expense) => {
      if (!categoryFrequency[expense.category]) {
        categoryFrequency[expense.category] = { count: 0, avgAmount: 0 };
      }
      categoryFrequency[expense.category].count++;
      categoryFrequency[expense.category].avgAmount += expense.amount;
    });

    const patternBased: QuickSuggestion[] = Object.entries(categoryFrequency)
      .filter(([_, data]) => data.count >= 2) // Only suggest if used at least twice
      .map(([category, data]) => ({
        id: `pattern-${category}`,
        category,
        description: `Usual ${category}`,
        amount: Math.round(data.avgAmount / data.count),
        icon: getCategoryIcon(category),
        color: getCategoryColor(category),
        confidence: Math.min(data.count / 5, 0.7), // Max confidence 0.7 for patterns
      }));

    // Travel context suggestions
    const travelBased: QuickSuggestion[] =
      activeTrips.length > 0
        ? [
            {
              id: 'accommodation',
              category: 'accommodation',
              description: 'Hotel/Lodging',
              amount: 150,
              icon: 'bed',
              color: '#8B5CF6',
              confidence: 0.6,
            },
            {
              id: 'activities',
              category: 'activities',
              description: 'Tourist activity',
              amount: 40,
              icon: 'star',
              color: '#10B981',
              confidence: 0.7,
            },
          ]
        : [];

    // Combine and sort by confidence
    const allSuggestions = [...timeBased, ...patternBased, ...travelBased];
    return allSuggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 4); // Show top 4 suggestions
  };

  const suggestions = generateSuggestions();

  const handleSuggestionPress = (suggestion: QuickSuggestion) => {
    setSelectedSuggestion(suggestion);
    setCustomAmount(suggestion.amount.toString());
  };

  const handleQuickAdd = async () => {
    if (!selectedSuggestion) return;

    const amount = parseFloat(customAmount) || selectedSuggestion.amount;
    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const expenseData = {
        amount,
        category: selectedSuggestion.category,
        description: selectedSuggestion.description,
        date: new Date().toISOString(),
        currency: baseCurrency,
        tripId: activeTrips.length > 0 ? activeTrips[0].id : undefined,
      };

      addExpense(expenseData);

      // Reset state
      setSelectedSuggestion(null);
      setCustomAmount('');

      // Success feedback
      Alert.alert('Success', 'Expense added successfully!');
      onExpenseAdded?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailedEntry = () => {
    router.push('/expenses/add' as any);
  };

  if (suggestions.length === 0) {
    return (
      <DashboardCard>
        <View style={styles.header}>
          <Text style={styles.title}>Quick Add Expense</Text>
        </View>
        <View style={styles.emptyState}>
          <FontAwesome name="clock-o" size={24} color="#8E8E93" />
          <Text style={styles.emptyText}>Add a few expenses to see smart suggestions here</Text>
          <TouchableOpacity style={styles.detailedButton} onPress={handleDetailedEntry}>
            <Text style={styles.detailedButtonText}>Add Detailed Expense</Text>
          </TouchableOpacity>
        </View>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Add Expense</Text>
        <TouchableOpacity onPress={handleDetailedEntry}>
          <Text style={styles.detailedLink}>Detailed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsScroll}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[
              styles.suggestionCard,
              selectedSuggestion?.id === suggestion.id && styles.selectedCard,
            ]}
            onPress={() => handleSuggestionPress(suggestion)}
            activeOpacity={0.7}
          >
            <View style={[styles.suggestionIcon, { backgroundColor: suggestion.color }]}>
              <FontAwesome name={suggestion.icon as any} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
            <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
            <Text style={styles.suggestionAmount}>${suggestion.amount}</Text>
            <View style={[styles.confidenceBar, { width: `${suggestion.confidence * 100}%` }]} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedSuggestion && (
        <View style={styles.selectedExpense}>
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountField}
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
            <Text style={styles.currency}>{baseCurrency}</Text>
          </View>

          <View style={styles.expenseDetails}>
            <Text style={styles.expenseCategory}>{selectedSuggestion.category}</Text>
            <Text style={styles.expenseDescription}>{selectedSuggestion.description}</Text>
          </View>

          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
            onPress={handleQuickAdd}
            disabled={isSubmitting}
          >
            <FontAwesome name={isSubmitting ? 'spinner' : 'check'} size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>{isSubmitting ? 'Adding...' : 'Add Expense'}</Text>
          </TouchableOpacity>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  detailedLink: {
    fontSize: 14,
    color: '#057B8C',
    fontWeight: '500',
  },
  suggestionsScroll: {
    marginBottom: 16,
  },
  suggestionCard: {
    width: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  selectedCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#057B8C',
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  suggestionCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  suggestionDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 4,
  },
  suggestionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#057B8C',
  },
  confidenceBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: '#057B8C',
  },
  selectedExpense: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 16,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 4,
  },
  amountField: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    minWidth: 100,
  },
  currency: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
    marginLeft: 8,
  },
  expenseDetails: {
    alignItems: 'center',
    marginBottom: 16,
  },
  expenseCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginVertical: 12,
  },
  detailedButton: {
    backgroundColor: '#057B8C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  detailedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
