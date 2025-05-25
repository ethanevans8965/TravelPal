import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function TotalBudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    // Remove any non-numeric characters except decimal point
    const numericBudget = budget.replace(/[^0-9.]/g, '');

    if (!numericBudget) {
      setError('Please enter a valid budget amount');
      return;
    }

    const budgetAmount = parseFloat(numericBudget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    // Navigate to dates screen with the budget
    router.push({
      pathname: '/trip/dates',
      params: {
        ...params,
        totalBudget: budgetAmount.toString(),
      },
    });
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      extraScrollHeight={Platform.select({ ios: 100, android: 50 })}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Total Budget</Text>
          <Text style={styles.subtitle}>Enter the total amount you plan to spend on this trip</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={(text) => {
              setBudget(text);
              setError('');
            }}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    marginBottom: 24,
    marginTop: 0,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginTop: 0,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    height: '100%',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 0,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
