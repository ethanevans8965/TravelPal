import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function TotalBudgetScreen() {
  const router = useRouter();
  const { tripName, country } = useLocalSearchParams();
  const [totalBudget, setTotalBudget] = useState('');

  const handleNext = () => {
    const budgetAmount = parseFloat(totalBudget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) return;

    router.push({
      pathname: '/trip/create/total-length/dates',
      params: {
        tripName,
        country,
        totalBudget: budgetAmount,
      },
    } as any);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      extraScrollHeight={Platform.select({ ios: 20, android: 0 })}
      enableOnAndroid={true}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Set Your Budget</Text>
        <Text style={styles.subtitle}>Enter your total budget for the trip</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Budget</Text>
            <TextInput
              style={styles.input}
              value={totalBudget}
              onChangeText={setTotalBudget}
              placeholder="e.g., 2000"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              autoFocus
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.nextButton,
          (parseFloat(totalBudget) <= 0 || isNaN(parseFloat(totalBudget))) && styles.nextButtonDisabled,
        ]}
        onPress={handleNext}
        disabled={parseFloat(totalBudget) <= 0 || isNaN(parseFloat(totalBudget))}
      >
        <Text style={styles.nextButtonText}>Continue</Text>
        <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
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
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F8F8',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
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