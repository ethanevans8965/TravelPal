import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TotalBudgetScreen() {
  const router = useRouter();
  const { tripName, country } = useLocalSearchParams();
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleBudgetChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    setBudget(numericText);
    setError('');
  };

  const handleNext = () => {
    const budgetAmount = parseFloat(budget);

    if (!budget.trim()) {
      setError('Please enter your total budget');
      return;
    }

    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    if (budgetAmount < 50) {
      setError('Budget should be at least $50');
      return;
    }

    router.push({
      pathname: '/trip/create/travel-style',
      params: {
        tripName,
        country,
        totalBudget: budgetAmount.toString(),
      },
    } as any);
  };

  const formatDisplayBudget = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>What's your total budget?</Text>
          <Text style={styles.subtitle}>Enter the total amount you want to spend on this trip</Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              value={budget}
              onChangeText={handleBudgetChange}
              placeholder="0"
              placeholderTextColor="#C7C7CC"
              keyboardType="decimal-pad"
              autoFocus
              maxLength={10}
            />
          </View>

          {budget && !error && (
            <Text style={styles.formattedBudget}>${formatDisplayBudget(budget)}</Text>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <FontAwesome name="exclamation-circle" size={16} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !budget.trim() && styles.continueButtonDisabled]}
          onPress={handleNext}
          disabled={!budget.trim()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 40,
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
  inputSection: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    padding: 0,
  },
  formattedBudget: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 15,
    color: '#FF3B30',
    marginLeft: 6,
  },

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 16,
    padding: 18,
    marginTop: 40,
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
