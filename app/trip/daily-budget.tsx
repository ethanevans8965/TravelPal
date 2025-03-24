import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { calculateDailyBudget, getDefaultCategoryPercentages } from '../utils/countryData';

export default function DailyBudgetScreen() {
  const router = useRouter();
  const { destination, country, startDate, endDate, travelStyle } = useLocalSearchParams<{
    destination: string;
    country: string;
    startDate: string;
    endDate: string;
    travelStyle: 'Budget' | 'Mid-range' | 'Luxury';
  }>();

  const [numTravelers, setNumTravelers] = useState('1');
  const [preTripExpenses, setPreTripExpenses] = useState('0');
  const [emergencyPercentage, setEmergencyPercentage] = useState('10');

  // Calculate trip duration
  const start = new Date(startDate as string);
  const end = new Date(endDate as string);
  const tripDurationMs = end.getTime() - start.getTime();
  const tripDuration = Math.ceil(tripDurationMs / (1000 * 60 * 60 * 24));

  // Calculate estimated daily budget
  const [estimatedDailyBudget, setEstimatedDailyBudget] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    if (country && travelStyle) {
      const dailyBudget = calculateDailyBudget(country, travelStyle as 'Budget' | 'Mid-range' | 'Luxury');
      setEstimatedDailyBudget(dailyBudget);
      
      // Calculate total budget
      const numTravelersValue = parseInt(numTravelers) || 1;
      const preTripExpensesValue = parseFloat(preTripExpenses) || 0;
      const emergencyPercentageValue = parseFloat(emergencyPercentage) || 10;
      
      const dailyExpenses = dailyBudget * tripDuration * numTravelersValue;
      const emergencyFund = dailyExpenses * (emergencyPercentageValue / 100);
      const total = dailyExpenses + preTripExpensesValue + emergencyFund;
      
      setTotalBudget(total);
    }
  }, [country, travelStyle, numTravelers, preTripExpenses, emergencyPercentage, tripDuration]);

  const isFormValid = numTravelers && parseInt(numTravelers) > 0;

  const navigateToNext = () => {
    if (!isFormValid) return;

    router.push({
      pathname: '/trip/category-allocation',
      params: {
        destination,
        country,
        startDate,
        endDate,
        travelStyle,
        numTravelers,
        dailyBudget: estimatedDailyBudget.toString(),
        preTripExpenses,
        emergencyPercentage,
        totalBudget: totalBudget.toString(),
        tripDuration: tripDuration.toString(),
      },
    } as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Daily Budget</Text>
      <Text style={styles.subtitle}>Set your daily spending budget</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>City/Location:</Text>
          <Text style={styles.infoValue}>{destination}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Country:</Text>
          <Text style={styles.infoValue}>{country}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Trip Duration:</Text>
          <Text style={styles.infoValue}>{tripDuration} days</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Travel Style:</Text>
          <Text style={styles.infoValue}>{travelStyle}</Text>
        </View>
      </View>

      <View style={styles.budgetEstimateCard}>
        <Text style={styles.budgetEstimateTitle}>Estimated Daily Budget</Text>
        <Text style={styles.budgetEstimateAmount}>${estimatedDailyBudget.toFixed(2)}</Text>
        <Text style={styles.budgetEstimateDescription}>
          This is our estimate for a {travelStyle?.toLowerCase()} traveler in {country}
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Travelers</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2"
          value={numTravelers}
          onChangeText={setNumTravelers}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pre-Trip Expenses ($)</Text>
        <Text style={styles.sublabel}>Flights, visas, insurance, etc.</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1200"
          value={preTripExpenses}
          onChangeText={setPreTripExpenses}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Emergency Fund (%)</Text>
        <Text style={styles.sublabel}>Recommended: 10-15%</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 10"
          value={emergencyPercentage}
          onChangeText={setEmergencyPercentage}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Trip Budget Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Daily Expenses:</Text>
          <Text style={styles.summaryValue}>
            ${(estimatedDailyBudget * parseInt(numTravelers || '1')).toFixed(2)} × {tripDuration} days
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pre-Trip Expenses:</Text>
          <Text style={styles.summaryValue}>${parseFloat(preTripExpenses || '0').toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Emergency Fund:</Text>
          <Text style={styles.summaryValue}>
            ${((estimatedDailyBudget * tripDuration * parseInt(numTravelers || '1')) * (parseFloat(emergencyPercentage || '10') / 100)).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Budget:</Text>
          <Text style={styles.totalValue}>${totalBudget.toFixed(2)}</Text>
        </View>
      </View>

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
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  budgetEstimateCard: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  budgetEstimateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  budgetEstimateAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  budgetEstimateDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  sublabel: {
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
    color: '#333333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
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