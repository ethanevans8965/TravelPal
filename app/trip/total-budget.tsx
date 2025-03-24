import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function TotalBudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destination: string;
    startDate: string;
    endDate: string;
    travelStyle: string;
  }>();
  
  const [totalBudget, setTotalBudget] = useState('');
  const [preTripExpenses, setPreTripExpenses] = useState('');
  const [emergencyFund, setEmergencyFund] = useState(15); // Default 15%

  const isFormValid = totalBudget && preTripExpenses;

  const navigateToNext = () => {
    if (!isFormValid) return;
    
    router.push({
      pathname: '/trip/category-allocation',
      params: {
        ...params,
        totalBudget,
        preTripExpenses,
        emergencyFund: emergencyFund.toString(),
        budgetMethod: 'total',
      }
    } as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Budget Details</Text>
      <Text style={styles.subtitle}>Let's set up your budget</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Total Trip Budget</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={totalBudget}
          onChangeText={setTotalBudget}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pre-trip Expenses</Text>
        <Text style={styles.helperText}>
          Expenses already paid (flights, accommodations, etc.)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={preTripExpenses}
          onChangeText={setPreTripExpenses}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Emergency Fund</Text>
        <Text style={styles.helperText}>
          Set aside a percentage of your budget for unexpected expenses
        </Text>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{emergencyFund}%</Text>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={25}
            step={1}
            value={emergencyFund}
            onValueChange={setEmergencyFund}
            minimumTrackTintColor="#FF6B6B"
            maximumTrackTintColor="#E5E5E5"
            thumbTintColor="#FF6B6B"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderMinLabel}>5%</Text>
            <Text style={styles.sliderMaxLabel}>25%</Text>
          </View>
        </View>
      </View>

      {totalBudget ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Budget Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Budget:</Text>
            <Text style={styles.summaryValue}>${parseFloat(totalBudget).toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pre-trip Expenses:</Text>
            <Text style={styles.summaryValue}>-${parseFloat(preTripExpenses || '0').toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Emergency Fund ({emergencyFund}%):</Text>
            <Text style={styles.summaryValue}>-${((parseFloat(totalBudget) - parseFloat(preTripExpenses || '0')) * (emergencyFund / 100)).toLocaleString()}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Available for Trip:</Text>
            <Text style={styles.summaryTotalValue}>
              ${(parseFloat(totalBudget) - parseFloat(preTripExpenses || '0') - ((parseFloat(totalBudget) - parseFloat(preTripExpenses || '0')) * (emergencyFund / 100))).toLocaleString()}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !isFormValid && styles.disabledButton]}
          onPress={navigateToNext}
          disabled={!isFormValid}
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
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sliderContainer: {
    marginTop: 16,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderMinLabel: {
    fontSize: 14,
    color: '#666666',
  },
  sliderMaxLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
}); 