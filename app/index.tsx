import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import CurrencyConverter from './components/CurrencyConverter';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome to TravelPal</Text>

      {/* Currency Converter - prominently displayed */}
      <View style={styles.section}>
        <CurrencyConverter />
      </View>

      {/* Upcoming/Current Trip Snapshot */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Trip</Text>
        <View style={styles.tripSnapshot}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripDestination}>Paris, France</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
          <Text style={styles.tripDates}>Oct 26 - Nov 03, 2024</Text>
          <Text style={styles.tripDuration}>8 days remaining</Text>
        </View>
      </View>

      {/* Budget at a Glance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Overview</Text>
        <View style={styles.budgetOverview}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Trip Budget</Text>
            <Text style={styles.budgetAmount}>$1,250 / $2,000</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '62.5%' }]} />
            </View>
          </View>
          <Text style={styles.budgetStatus}>$750 remaining • 62% used</Text>
        </View>
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <View style={styles.expensesList}>
          <View style={styles.expenseItem}>
            <View style={styles.expenseIcon}>
              <Text style={styles.expenseIconText}>🍽️</Text>
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>Dinner at Le Bistro</Text>
              <Text style={styles.expenseDate}>Today, 7:30 PM</Text>
            </View>
            <Text style={styles.expenseAmount}>-$45.00</Text>
          </View>

          <View style={styles.expenseItem}>
            <View style={styles.expenseIcon}>
              <Text style={styles.expenseIconText}>🚇</Text>
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>Metro Pass</Text>
              <Text style={styles.expenseDate}>Today, 2:15 PM</Text>
            </View>
            <Text style={styles.expenseAmount}>-$12.50</Text>
          </View>

          <View style={[styles.expenseItem, styles.lastExpenseItem]}>
            <View style={styles.expenseIcon}>
              <Text style={styles.expenseIconText}>☕</Text>
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseName}>Coffee & Croissant</Text>
              <Text style={styles.expenseDate}>Yesterday, 9:00 AM</Text>
            </View>
            <Text style={styles.expenseAmount}>-$8.75</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <View style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>💰</Text>
            </View>
            <Text style={styles.actionText}>Add Expense</Text>
          </View>

          <View style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>✈️</Text>
            </View>
            <Text style={styles.actionText}>Plan New Trip</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#057B8C',
    marginBottom: 8,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tripSnapshot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDestination: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tripDates: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  tripDuration: {
    fontSize: 14,
    color: '#057B8C',
    fontWeight: '500',
  },
  budgetOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#057B8C',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#057B8C',
    borderRadius: 4,
  },
  budgetStatus: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  expensesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIconText: {
    fontSize: 18,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  lastExpenseItem: {
    borderBottomWidth: 0,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#057B8C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
});
