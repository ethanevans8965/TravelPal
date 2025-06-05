import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../../context';
import * as Crypto from 'expo-crypto';

const getTravelStyleColor = (travelStyle: string) => {
  switch (travelStyle?.toLowerCase()) {
    case 'budget':
      return { backgroundColor: '#34C759' };
    case 'mid-range':
      return { backgroundColor: '#FF9500' };
    case 'luxury':
      return { backgroundColor: '#AF52DE' };
    default:
      return { backgroundColor: '#8E8E93' };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BudgetPlanningReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addTrip, addLocation } = useAppContext();

  // Parse the categories JSON to get individual category values
  const categories = params.categories ? JSON.parse(params.categories as string) : {};

  const totalBudgetAmount = params.totalBudget ? parseFloat(params.totalBudget as string) : null;
  const dailyBudgetAmount = parseFloat(params.dailyBudget as string) || 0;
  const tripLength = parseInt(params.tripLength as string) || 0;
  const totalTripCost = parseFloat(params.totalTripCost as string) || 0;

  const handleSaveTrip = () => {
    try {
      // Validate required fields
      if (!params.tripName || !params.country) {
        Alert.alert('Missing Information', 'Please provide both trip name and destination.');
        return;
      }

      if (!params.startDate || !params.endDate) {
        Alert.alert('Missing Dates', 'Please select both start and end dates for your trip.');
        return;
      }

      // Create location first
      const locationData = {
        name: params.country as string,
        country: params.country as string,
        timezone: 'UTC', // Default timezone
      };
      addLocation(locationData);

      // For now, we'll use a placeholder locationId and store country in trip
      // This is a temporary solution until we improve the location system
      const tripData = {
        name: params.tripName as string,
        locationId: 'temp-location-id', // Temporary placeholder
        destination: {
          id: 'temp-location-id',
          name: params.country as string,
          country: params.country as string,
          timezone: 'UTC',
        },
        startDate: params.startDate as string,
        endDate: params.endDate as string,
        budgetMethod: 'total-budget' as const,
        travelStyle: params.travelStyle as 'Budget' | 'Mid-range' | 'Luxury',
        totalBudget: totalBudgetAmount || undefined,
        dailyBudget: dailyBudgetAmount,
        emergencyFundPercentage: 10, // Default 10%
        categories: categories,
        status: 'planning' as const,
      };

      // Save trip
      addTrip(tripData);

      // Show success message
      Alert.alert('Success', 'Your trip has been created successfully!', [
        {
          text: 'OK',
          onPress: () => router.push('/trips'),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create trip';
      Alert.alert('Error', errorMessage, [
        {
          text: 'Try Again',
          style: 'default',
        },
        {
          text: 'Go Back',
          onPress: () => router.back(),
          style: 'cancel',
        },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Review Your Trip</Text>
          <Text style={styles.subtitle}>Everything looks good? Let's save your trip!</Text>
        </View>

        {/* Trip Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Trip Overview</Text>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Trip Name</Text>
            <Text style={styles.overviewValue}>{params.tripName || 'Untitled Trip'}</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Destination</Text>
            <Text style={styles.overviewValue}>{params.country || 'Unknown'}</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Travel Style</Text>
            <View style={styles.travelStyleContainer}>
              <Text style={styles.overviewValue}>{params.travelStyle || 'Not selected'}</Text>
              <View
                style={[styles.travelStyleBadge, getTravelStyleColor(params.travelStyle as string)]}
              >
                <Text style={styles.travelStyleBadgeText}>{params.travelStyle}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trip Dates */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Travel Dates</Text>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Start Date</Text>
            <Text style={styles.overviewValue}>
              {params.startDate ? formatDate(params.startDate as string) : 'Not selected'}
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>End Date</Text>
            <Text style={styles.overviewValue}>
              {params.endDate ? formatDate(params.endDate as string) : 'Not selected'}
            </Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Trip Length</Text>
            <Text style={styles.overviewValue}>{tripLength} days</Text>
          </View>
        </View>

        {/* Budget Summary */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Budget Summary</Text>
          {totalBudgetAmount && (
            <View style={styles.budgetSummaryRow}>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <Text style={styles.budgetValue}>${totalBudgetAmount.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.budgetSummaryRow}>
            <Text style={styles.budgetLabel}>Daily Budget</Text>
            <Text style={styles.budgetValue}>${dailyBudgetAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.budgetSummaryRow}>
            <Text style={styles.budgetLabel}>Total Trip Cost</Text>
            <Text style={styles.budgetValue}>${totalTripCost.toLocaleString()}</Text>
          </View>
          {totalBudgetAmount && (
            <View style={[styles.budgetSummaryRow, styles.remainingBudgetRow]}>
              <Text style={styles.budgetLabel}>Remaining Budget</Text>
              <Text
                style={[
                  styles.budgetValue,
                  totalBudgetAmount - totalTripCost >= 0
                    ? styles.positiveValue
                    : styles.negativeValue,
                ]}
              >
                ${(totalBudgetAmount - totalTripCost).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Category Breakdown */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Daily Budget Breakdown</Text>
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>🏨 Accommodation</Text>
              <Text style={styles.categoryValue}>
                ${(categories.accommodation || 0).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>🍽️ Food & Dining</Text>
              <Text style={styles.categoryValue}>${(categories.food || 0).toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>🚗 Transportation</Text>
              <Text style={styles.categoryValue}>
                ${(categories.transportation || 0).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>🎯 Activities</Text>
              <Text style={styles.categoryValue}>
                ${(categories.activities || 0).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>🛍️ Shopping</Text>
              <Text style={styles.categoryValue}>
                ${(categories.shopping || 0).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={[styles.categoryItem, styles.lastCategoryItem]}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>💰 Other Expenses</Text>
              <Text style={styles.categoryValue}>${(categories.other || 0).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTrip}>
          <Text style={styles.saveButtonText}>Save Trip</Text>
          <FontAwesome name="check" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 32,
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
  overviewCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  overviewValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'right',
  },
  travelStyleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  travelStyleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  travelStyleBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  budgetSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  budgetValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  remainingBudgetRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
    marginTop: 8,
  },
  positiveValue: {
    color: '#34C759',
  },
  negativeValue: {
    color: '#FF3B30',
  },
  categoryItem: {
    marginBottom: 12,
  },
  lastCategoryItem: {
    marginBottom: 0,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 15,
    color: '#1C1C1E',
  },
  categoryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
});
