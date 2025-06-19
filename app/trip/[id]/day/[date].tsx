import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTripStore } from '../../../stores/tripStore';
import { useAppContext } from '../../../context';

const { width: screenWidth } = Dimensions.get('window');

export default function DayDetailsScreen() {
  const { id: tripId, date } = useLocalSearchParams<{ id: string; date: string }>();
  const router = useRouter();
  const { trips, getTripExpenses } = useAppContext();
  const { getLegsByTrip } = useTripStore();

  // Parse the date parameter (YYYY-MM-DD format)
  const dateObj = new Date(date + 'T00:00:00');
  const isValidDate = !isNaN(dateObj.getTime());

  // Get trip and related data
  const trip = trips.find((t) => t.id === tripId);
  const legs = trip ? getLegsByTrip(trip.id) : [];
  const expenses = trip ? getTripExpenses(trip.id) : [];

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!isValidDate) return 'Invalid Date';

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return dateObj.toLocaleDateString('en-US', options);
  };

  // Calculate relative date
  const getRelativeDate = (dateString: string) => {
    if (!isValidDate) return '';

    const today = new Date();
    const targetDate = new Date(dateString + 'T00:00:00');
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `${diffDays} days from now`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const handleBackPress = () => {
    router.back();
  };

  // Check if a leg spans this specific date
  const isLegOnDate = (leg: any, date: Date) => {
    if (!leg.startDate) return false;
    const legStart = new Date(leg.startDate);
    const legEnd = leg.endDate ? new Date(leg.endDate) : legStart;

    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(legStart.getFullYear(), legStart.getMonth(), legStart.getDate());
    const end = new Date(legEnd.getFullYear(), legEnd.getMonth(), legEnd.getDate());

    return checkDate >= start && checkDate <= end;
  };

  // Get legs and expenses for this specific date
  const legsForDate = legs.filter((leg) => isLegOnDate(leg, dateObj));
  const expensesForDate = expenses.filter((expense) => {
    if (!expense.date) return false;
    const expenseDate = new Date(expense.date);
    return expenseDate.toDateString() === dateObj.toDateString();
  });

  // Get country colors (consistent with calendar)
  const getCountryColor = (country: string) => {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#F97316',
      '#06B6D4',
      '#84CC16',
      '#EC4899',
      '#6366F1',
    ];
    let hash = 0;
    for (let i = 0; i < country.length; i++) {
      hash = country.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (!isValidDate) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid date format</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.dateInfo}>
            <Text style={styles.dateTitle}>{formatDate(date)}</Text>
            <Text style={styles.relativeDateText}>{getRelativeDate(date)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Travel Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Plans</Text>

          {legsForDate.length > 0 ? (
            <View style={styles.card}>
              {legsForDate.map((leg, index) => (
                <View
                  key={leg.id}
                  style={[styles.legItem, index < legsForDate.length - 1 && styles.legItemBorder]}
                >
                  <View
                    style={[
                      styles.countryIndicator,
                      { backgroundColor: getCountryColor(leg.country) },
                    ]}
                  />
                  <View style={styles.legDetails}>
                    <Text style={styles.countryName}>{leg.country}</Text>
                    <Text style={styles.legDates}>
                      {new Date(leg.startDate).toLocaleDateString()} -{' '}
                      {new Date(leg.endDate || leg.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.emptyState}>
                <FontAwesome name="compass" size={32} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyStateText}>No travel plans for this day</Text>
                <Text style={styles.emptyStateSubtext}>
                  Add a leg to your trip to see destination details
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Expenses</Text>

          {expensesForDate.length > 0 ? (
            <View style={styles.card}>
              {expensesForDate.map((expense, index) => (
                <View
                  key={expense.id}
                  style={[
                    styles.expenseItem,
                    index < expensesForDate.length - 1 && styles.expenseItemBorder,
                  ]}
                >
                  <View style={styles.expenseIcon}>
                    <FontAwesome name="dollar" size={16} color="#007AFF" />
                  </View>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseTitle}>{expense.description || 'Expense'}</Text>
                    <Text style={styles.expenseCategory}>{expense.category}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.expenseTotal}>
                <Text style={styles.expenseTotalLabel}>Total for this day:</Text>
                <Text style={styles.expenseTotalAmount}>
                  ${expensesForDate.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.emptyState}>
                <FontAwesome name="money" size={32} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyStateText}>No expenses recorded</Text>
                <Text style={styles.emptyStateSubtext}>Track your spending for this day</Text>
              </View>
            </View>
          )}
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos & Memories</Text>
          <View style={styles.card}>
            <View style={styles.emptyState}>
              <FontAwesome name="image" size={32} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyStateText}>Photo gallery coming soon</Text>
              <Text style={styles.emptyStateSubtext}>
                Capture and organize your travel memories
              </Text>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes & Journal</Text>
          <View style={styles.card}>
            <View style={styles.emptyState}>
              <FontAwesome name="book" size={32} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyStateText}>Personal notes coming soon</Text>
              <Text style={styles.emptyStateSubtext}>Document your thoughts and experiences</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateInfo: {
    flex: 1,
    marginLeft: 16,
  },
  dateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  relativeDateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#171717',
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Sections (matching dashboard pattern)
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.3,
  },

  // Cards (matching dashboard pattern)
  card: {
    backgroundColor: 'rgba(38,38,38,0.7)',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    padding: 16,
  },

  // Travel Plans Styles
  legItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  legItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  countryIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  legDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  legDates: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },

  // Expense Styles
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  expenseItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  expenseIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'capitalize',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  expenseTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  expenseTotalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  expenseTotalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // Empty States (matching dashboard pattern)
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    textAlign: 'center',
  },

  // Spacing
  bottomSpacing: {
    height: 40,
  },

  // Error State
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 100,
  },
});
