import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';
import { calculateDurationInDays } from '../../utils/dateUtils';

export default function BudgetPlanningDatesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState('');

  // Get parameters from the Budget Planning flow
  const { tripName, country, totalBudget, travelStyle, dailyBudget, categories } = params;
  const totalBudgetAmount = totalBudget ? parseFloat(totalBudget as string) : null;
  const dailyBudgetAmount = parseFloat(dailyBudget as string) || 0;

  // Calculate current trip length and costs when dates change
  const currentTripLength =
    selectedStartDate && selectedEndDate
      ? calculateDurationInDays(selectedStartDate, selectedEndDate)
      : 0;

  const currentTotalCost = currentTripLength * dailyBudgetAmount;
  const maxTripLength = totalBudgetAmount
    ? Math.floor(totalBudgetAmount / dailyBudgetAmount)
    : null;
  const isWithinBudget = !maxTripLength || currentTripLength <= maxTripLength;
  const exceedsBy = maxTripLength ? currentTripLength - maxTripLength : 0;

  const handleDateChange = (date: Date, type: 'START_DATE' | 'END_DATE') => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(undefined); // Reset end date when start date changes
    }
  };

  // Generate custom date styles to show visual indicators for budget constraints
  const getCustomDatesStyles = () => {
    if (!selectedStartDate || !maxTripLength) return [];

    const customStyles = [];
    const startDate = new Date(selectedStartDate);

    // Show underlines for a reasonable range of dates (up to max trip length * 2 or 90 days)
    const maxDays = Math.max(maxTripLength * 2, 90);

    for (let i = 1; i <= maxDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const tripLengthToThisDate = i + 1; // Trip length if user selects this as end date
      const isOverBudget = tripLengthToThisDate > maxTripLength;

      customStyles.push({
        date: currentDate,
        style: {
          backgroundColor: 'transparent',
        },
        textStyle: {
          color: isOverBudget ? '#FF9500' : '#1C1C1E',
          fontWeight: isOverBudget ? ('bold' as const) : ('normal' as const),
        },
        containerStyle: {
          borderBottomWidth: 2,
          borderBottomColor: isOverBudget ? '#FF9500' : '#057B8C',
          position: 'relative' as const,
        },
      });
    }

    return customStyles;
  };

  useEffect(() => {
    // Validate dates when they change
    if (selectedStartDate && selectedEndDate) {
      if (selectedEndDate < selectedStartDate) {
        setError('End date must be after start date');
        return;
      }

      if (maxTripLength && currentTripLength > maxTripLength) {
        setError(
          `Trip is ${exceedsBy} day${exceedsBy > 1 ? 's' : ''} longer than your budget allows`
        );
        return;
      }

      setError('');
    }
  }, [selectedStartDate, selectedEndDate, maxTripLength, currentTripLength, exceedsBy]);

  const handleContinue = () => {
    if (!selectedStartDate || !selectedEndDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (error) {
      return;
    }

    // Navigate to review screen
    router.push({
      pathname: '/trip/create/budget-planning-review',
      params: {
        ...params,
        startDate: selectedStartDate.toISOString(),
        endDate: selectedEndDate.toISOString(),
        tripLength: currentTripLength.toString(),
        totalTripCost: currentTotalCost.toString(),
      },
    } as any);
  };

  const getBudgetFeedback = () => {
    if (!selectedStartDate || !selectedEndDate) return null;

    if (totalBudgetAmount) {
      const remainingBudget = totalBudgetAmount - currentTotalCost;

      if (isWithinBudget) {
        return (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <FontAwesome name="check-circle" size={20} color="#34C759" />
              <Text style={styles.feedbackTitle}>Perfect! Your trip fits your budget</Text>
            </View>
            <View style={styles.feedbackRow}>
              <Text style={styles.feedbackLabel}>Trip length:</Text>
              <Text style={styles.feedbackValue}>{currentTripLength} days</Text>
            </View>
            <View style={styles.feedbackRow}>
              <Text style={styles.feedbackLabel}>Daily budget:</Text>
              <Text style={styles.feedbackValue}>${dailyBudgetAmount}</Text>
            </View>
            <View style={styles.feedbackRow}>
              <Text style={styles.feedbackLabel}>Total cost:</Text>
              <Text style={styles.feedbackValue}>${currentTotalCost.toLocaleString()}</Text>
            </View>
            {remainingBudget > 0 && (
              <View style={styles.feedbackRow}>
                <Text style={styles.feedbackLabel}>Remaining budget:</Text>
                <Text style={[styles.feedbackValue, styles.positiveValue]}>
                  ${remainingBudget.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        );
      } else {
        return (
          <View style={[styles.feedbackCard, styles.warningCard]}>
            <View style={styles.feedbackHeader}>
              <FontAwesome name="exclamation-triangle" size={20} color="#FF9500" />
              <Text style={styles.feedbackTitle}>Trip exceeds your budget</Text>
            </View>
            <View style={styles.feedbackRow}>
              <Text style={styles.feedbackLabel}>Max affordable length:</Text>
              <Text style={styles.feedbackValue}>{maxTripLength} days</Text>
            </View>
            <View style={styles.feedbackRow}>
              <Text style={styles.feedbackLabel}>Your selected length:</Text>
              <Text style={[styles.feedbackValue, styles.warningValue]}>
                {currentTripLength} days
              </Text>
            </View>
            <Text style={styles.suggestionText}>
              Consider shortening your trip or adjusting your daily budget.
            </Text>
          </View>
        );
      }
    } else {
      // No total budget constraint - just show trip info
      return (
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <FontAwesome name="calendar" size={20} color="#057B8C" />
            <Text style={styles.feedbackTitle}>Trip Summary</Text>
          </View>
          <View style={styles.feedbackRow}>
            <Text style={styles.feedbackLabel}>Trip length:</Text>
            <Text style={styles.feedbackValue}>{currentTripLength} days</Text>
          </View>
          <View style={styles.feedbackRow}>
            <Text style={styles.feedbackLabel}>Daily budget:</Text>
            <Text style={styles.feedbackValue}>${dailyBudgetAmount}</Text>
          </View>
          <View style={styles.feedbackRow}>
            <Text style={styles.feedbackLabel}>Total estimated cost:</Text>
            <Text style={styles.feedbackValue}>${currentTotalCost.toLocaleString()}</Text>
          </View>
        </View>
      );
    }
  };

  const getSubtitle = () => {
    if (maxTripLength) {
      return `With your budget, you can afford up to ${maxTripLength} days`;
    }
    return 'Choose your travel dates';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Your Travel Dates</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.calendarContainer}>
          <CalendarPicker
            allowRangeSelection={true}
            onDateChange={handleDateChange}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            todayBackgroundColor="#f0f0f0"
            selectedDayColor="#057B8C"
            selectedDayTextColor="#FFFFFF"
            selectedRangeStyle={{ backgroundColor: '#057B8C' }}
            selectedRangeStartStyle={{ borderTopLeftRadius: 999, borderBottomLeftRadius: 999 }}
            selectedRangeEndStyle={{ borderTopRightRadius: 999, borderBottomRightRadius: 999 }}
            dayShape="circle"
            minDate={new Date()}
            customDatesStyles={getCustomDatesStyles()}
          />

          {/* Day number indicators */}
          {selectedStartDate && maxTripLength && (
            <View style={styles.dayNumberOverlay}>
              <Text style={styles.dayNumberHint}>
                💡 Colored underlines show trip days (orange = over budget)
              </Text>
            </View>
          )}
        </View>

        {getBudgetFeedback()}

        {error && (
          <View style={styles.errorContainer}>
            <FontAwesome name="exclamation-circle" size={16} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedStartDate || !selectedEndDate || error) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedStartDate || !selectedEndDate || !!error}
        >
          <Text style={styles.continueButtonText}>Continue to Review</Text>
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
  calendarContainer: {
    marginBottom: 24,
  },
  feedbackCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  warningCard: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FF9500',
    borderWidth: 1,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  feedbackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  feedbackValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  positiveValue: {
    color: '#34C759',
  },
  warningValue: {
    color: '#FF9500',
  },
  suggestionText: {
    fontSize: 14,
    color: '#856404',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8D7DA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#721C24',
    marginLeft: 8,
    flex: 1,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#057B8C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
  dayNumberOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  dayNumberHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
