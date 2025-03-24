import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../context';

export default function ReviewScreen() {
  const router = useRouter();
  const { addTrip } = useAppContext();
  const params = useLocalSearchParams<{
    destination: string;
    country: string;
    startDate: string;
    endDate: string;
    travelStyle: string;
    numTravelers: string;
    dailyBudget: string;
    preTripExpenses: string;
    emergencyPercentage: string;
    totalBudget: string;
    tripDuration: string;
    categories: string;
  }>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateTripDuration = () => {
    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include end day
    }
    return parseInt(params.tripDuration || '0');
  };

  const calculateTotalBudget = () => {
    if (params.totalBudget) {
      return parseFloat(params.totalBudget);
    }
    return 0;
  };

  const getCategories = () => {
    try {
      return JSON.parse(params.categories || '{}');
    } catch (e) {
      return {};
    }
  };

  const totalBudget = calculateTotalBudget();
  const categories = getCategories();
  const tripDuration = calculateTripDuration();
  const numTravelers = parseInt(params.numTravelers || '1');
  const dailyBudget = parseFloat(params.dailyBudget || '0');
  const preTripExpenses = parseFloat(params.preTripExpenses || '0');
  const emergencyPercentage = parseFloat(params.emergencyPercentage || '10');
  const emergencyFund = (dailyBudget * tripDuration * numTravelers) * (emergencyPercentage / 100);
  const dailySpending = dailyBudget * numTravelers;

  const handleConfirm = () => {
    setIsLoading(true);

    const newTrip = {
      destination: params.destination,
      country: params.country,
      startDate: params.startDate,
      endDate: params.endDate,
      travelStyle: params.travelStyle as 'Budget' | 'Mid-range' | 'Luxury',
      totalBudget: totalBudget,
      dailyBudget: dailyBudget,
      emergencyFundPercentage: emergencyPercentage,
      pretrip: preTripExpenses,
      categories: categories,
      numTravelers: numTravelers,
    };

    addTrip(newTrip);

    setTimeout(() => {
      setIsLoading(false);
      setSavedSuccessfully(true);
      router.push('/(tabs)/' as any);
    }, 500);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trip Review</Text>
      <Text style={styles.subtitle}>Review your trip details before saving</Text>

      {savedSuccessfully && (
        <View style={styles.successMessage}>
          <FontAwesome name="check-circle" size={24} color="#28a745" />
          <Text style={styles.successText}>Trip saved successfully!</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trip Details</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>City/Location:</Text>
          <Text style={styles.infoValue}>{params.destination}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Country:</Text>
          <Text style={styles.infoValue}>{params.country}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dates:</Text>
          <Text style={styles.infoValue}>
            {formatDate(params.startDate as string)} - {formatDate(params.endDate as string)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>{tripDuration} days</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Travelers:</Text>
          <Text style={styles.infoValue}>{numTravelers}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Travel Style:</Text>
          <Text style={styles.infoValue}>{params.travelStyle}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget Summary</Text>
        
        <View style={styles.budgetRow}>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Daily Budget</Text>
            <Text style={styles.budgetValue}>${dailySpending.toFixed(2)}</Text>
            <Text style={styles.budgetSubtext}>per day for {numTravelers} traveler(s)</Text>
          </View>
          
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Total Trip Budget</Text>
            <Text style={styles.budgetValue}>${totalBudget.toFixed(2)}</Text>
            <Text style={styles.budgetSubtext}>for {tripDuration} days</Text>
          </View>
        </View>
        
        <View style={styles.budgetDetails}>
          <View style={styles.budgetDetailRow}>
            <Text style={styles.budgetDetailLabel}>Daily Expenses:</Text>
            <Text style={styles.budgetDetailValue}>
              ${dailySpending.toFixed(2)} × {tripDuration} days
            </Text>
          </View>
          
          <View style={styles.budgetDetailRow}>
            <Text style={styles.budgetDetailLabel}>Pre-Trip Expenses:</Text>
            <Text style={styles.budgetDetailValue}>${preTripExpenses.toFixed(2)}</Text>
          </View>
          
          <View style={styles.budgetDetailRow}>
            <Text style={styles.budgetDetailLabel}>Emergency Fund ({emergencyPercentage}%):</Text>
            <Text style={styles.budgetDetailValue}>${emergencyFund.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget Allocation</Text>
        
        <View style={styles.categoryContainer}>
          {Object.entries(categories).map(([id, percentage]) => {
            const catPercentage = percentage as number;
            const categoryName = {
              'accommodation': 'Accommodation',
              'food': 'Food & Drinks',
              'transportation': 'Transportation',
              'activities': 'Activities',
              'shopping': 'Shopping',
              'other': 'Other'
            }[id] || id;
            
            const categoryIcon = {
              'accommodation': 'bed',
              'food': 'cutlery',
              'transportation': 'car',
              'activities': 'ticket',
              'shopping': 'shopping-bag',
              'other': 'ellipsis-h'
            }[id] || 'circle';
            
            const amount = (dailyBudget * numTravelers * tripDuration * (catPercentage / 100));
            
            return (
              <View key={id} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryIconContainer}>
                    <FontAwesome name={categoryIcon as any} size={14} color="#FFFFFF" />
                  </View>
                  <Text style={styles.categoryName}>{categoryName}</Text>
                  <Text style={styles.categoryPercentage}>{catPercentage}%</Text>
                </View>
                
                <View style={styles.categoryBarContainer}>
                  <View 
                    style={[
                      styles.categoryBar,
                      { width: `${catPercentage}%` }
                    ]}
                  />
                </View>
                
                <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {!savedSuccessfully && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.confirmButtonText}>Saving Trip...</Text>
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Save Trip</Text>
                <FontAwesome name="check" size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        )}
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
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  successText: {
    color: '#155724',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    maxWidth: '60%',
    textAlign: 'right',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  budgetSubtext: {
    fontSize: 12,
    color: '#999999',
  },
  budgetDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  budgetDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetDetailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  budgetDetailValue: {
    fontSize: 14,
    color: '#333333',
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 8,
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
  categoryContainer: {
    marginTop: 8,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryBar: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  confirmButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 12,
    padding: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 12,
    padding: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
}); 