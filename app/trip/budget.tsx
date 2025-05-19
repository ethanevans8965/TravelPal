import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function BudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destination: string;
    country: string;
    startDate: string;
    endDate: string;
    travelStyle: string;
  }>();

  const [numTravelers, setNumTravelers] = useState('1');
  const [dailyBudget, setDailyBudget] = useState('');
  const [preTripExpenses, setPreTripExpenses] = useState('0');
  const [emergencyPercentage, setEmergencyPercentage] = useState('10');

  const calculateTripDuration = () => {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const tripDuration = calculateTripDuration();
  const totalBudget = dailyBudget ? parseFloat(dailyBudget) * tripDuration * parseInt(numTravelers) : 0;
  const emergencyFund = totalBudget * (parseFloat(emergencyPercentage) / 100);
  const grandTotal = totalBudget + parseFloat(preTripExpenses) + emergencyFund;

  const handleNext = () => {
    if (!dailyBudget || !numTravelers) return;

    router.push({
      pathname: '/trip/categories',
      params: {
        ...params,
        numTravelers,
        dailyBudget,
        preTripExpenses,
        emergencyPercentage,
        totalBudget: totalBudget.toString(),
        tripDuration: tripDuration.toString(),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Set Your Budget</Text>
      <Text style={styles.subtitle}>Plan your expenses for the trip</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Travelers</Text>
          <TextInput
            style={styles.input}
            value={numTravelers}
            onChangeText={setNumTravelers}
            keyboardType="number-pad"
            placeholder="1"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Budget (per person)</Text>
          <TextInput
            style={styles.input}
            value={dailyBudget}
            onChangeText={setDailyBudget}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pre-trip Expenses</Text>
          <TextInput
            style={styles.input}
            value={preTripExpenses}
            onChangeText={setPreTripExpenses}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Emergency Fund Percentage</Text>
          <TextInput
            style={styles.input}
            value={emergencyPercentage}
            onChangeText={setEmergencyPercentage}
            keyboardType="decimal-pad"
            placeholder="10"
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Trip Duration:</Text>
            <Text style={styles.summaryValue}>{tripDuration} days</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Budget:</Text>
            <Text style={styles.summaryValue}>${totalBudget.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Emergency Fund:</Text>
            <Text style={styles.summaryValue}>${emergencyFund.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total:</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            (!dailyBudget || !numTravelers) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!dailyBudget || !numTravelers}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
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