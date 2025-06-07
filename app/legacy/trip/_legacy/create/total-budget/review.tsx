import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

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

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse the categories JSON to get individual category values
  const categories = params.categories ? JSON.parse(params.categories as string) : {};

  const handleContinue = () => {
    // Navigate to date selection with all current parameters
    router.push({
      pathname: '/trip/create/dates',
      params: {
        ...params,
        budgetMethod: 'total-budget',
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Review your trip</Text>
          <Text style={styles.subtitle}>Check your details before selecting dates</Text>
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
            <Text style={styles.overviewLabel}>Total Budget</Text>
            <Text style={styles.overviewValue}>
              ${parseFloat((params.totalBudget as string) || '0').toLocaleString()}
            </Text>
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

        {/* Budget Summary */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Budget Summary</Text>
          <View style={styles.budgetSummaryRow}>
            <Text style={styles.budgetLabel}>Total Budget</Text>
            <Text style={styles.budgetValue}>
              ${parseFloat((params.totalBudget as string) || '0').toLocaleString()}
            </Text>
          </View>
          <View style={styles.budgetSummaryRow}>
            <Text style={styles.budgetLabel}>Daily Budget</Text>
            <Text style={styles.budgetValue}>
              ${parseFloat((params.userDailyTotal as string) || '0').toLocaleString()}
            </Text>
          </View>
          <View style={[styles.budgetSummaryRow, styles.maxLengthRow]}>
            <Text style={styles.budgetLabel}>Maximum Trip Length</Text>
            <Text style={styles.maxLengthValue}>{params.maxTripLength || '0'} days</Text>
          </View>
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

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Select Dates</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
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
  placeholderCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  placeholderText: {
    fontSize: 15,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 16,
    padding: 18,
    marginTop: 32,
    shadowColor: '#057B8C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  overviewLabel: {
    fontSize: 16,
    color: '#8E8E93',
    flex: 1,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'right',
  },
  travelStyleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  travelStyleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  travelStyleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  budgetSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  budgetLabel: {
    fontSize: 16,
    color: '#8E8E93',
    flex: 1,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'right',
  },
  maxLengthRow: {
    borderBottomWidth: 0,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  maxLengthValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#057B8C',
    textAlign: 'right',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  lastCategoryItem: {
    borderBottomWidth: 0,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'right',
  },
});
