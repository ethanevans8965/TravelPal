import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Leg } from '../../types';
import { useTripStore } from '../../stores/tripStore';

interface CalendarPreviewWidgetProps {
  tripId: string;
  onLegEdit?: (leg: Leg) => void;
  onOpenPlanner?: () => void;
}

export default function CalendarPreviewWidget({
  tripId,
  onLegEdit,
  onOpenPlanner,
}: CalendarPreviewWidgetProps) {
  const { getLegsByTrip } = useTripStore();
  const legs = getLegsByTrip(tripId);

  // Get current date and calculate two-week range
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

  const endDate = new Date(startOfWeek);
  endDate.setDate(startOfWeek.getDate() + 13); // Two weeks

  // Generate calendar grid (14 days, 2 rows of 7)
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  }, [startOfWeek]);

  // Get legs that fall within the two-week period
  const visibleLegs = useMemo(() => {
    return legs.filter((leg) => {
      if (!leg.startDate) return false;
      const legStart = new Date(leg.startDate);
      const legEnd = leg.endDate ? new Date(leg.endDate) : legStart;

      // Check if leg overlaps with our two-week window
      return legStart <= endDate && legEnd >= startOfWeek;
    });
  }, [legs, startOfWeek, endDate]);

  // Helper function to check if a leg spans a specific date
  const isLegOnDate = (leg: Leg, date: Date) => {
    if (!leg.startDate) return false;
    const legStart = new Date(leg.startDate);
    const legEnd = leg.endDate ? new Date(leg.endDate) : legStart;

    const dateStr = date.toDateString();
    const currentDate = new Date(date);

    return currentDate >= legStart && currentDate <= legEnd;
  };

  // Get country colors for legs (simple hash-based colors)
  const getCountryColor = (country: string) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // orange
      '#EF4444', // red
      '#8B5CF6', // purple
      '#F97316', // orange-600
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];
    let hash = 0;
    for (let i = 0; i < country.length; i++) {
      hash = country.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Format date for display
  const formatDay = (date: Date) => {
    return date.getDate().toString();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDayPress = (date: Date) => {
    // Find legs on this date
    const legsOnDate = visibleLegs.filter((leg) => isLegOnDate(leg, date));

    if (legsOnDate.length > 0 && onLegEdit) {
      // Edit first leg on this date
      onLegEdit(legsOnDate[0]);
    } else if (onOpenPlanner) {
      // Open planner for new leg
      onOpenPlanner();
    }
  };

  const renderDay = (date: Date, index: number) => {
    const legsOnDate = visibleLegs.filter((leg) => isLegOnDate(leg, date));
    const isCurrentDay = isToday(date);

    return (
      <TouchableOpacity
        key={index}
        style={[styles.dayContainer, isCurrentDay && styles.dayContainerToday]}
        onPress={() => handleDayPress(date)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dayNumber, isCurrentDay && styles.dayNumberToday]}>
          {formatDay(date)}
        </Text>

        {/* Month label for first day of month */}
        {date.getDate() === 1 && <Text style={styles.monthLabel}>{formatMonth(date)}</Text>}

        {/* Leg indicators */}
        <View style={styles.legIndicators}>
          {legsOnDate.slice(0, 2).map((leg, legIndex) => (
            <View
              key={`${leg.id}-${legIndex}`}
              style={[styles.legBar, { backgroundColor: getCountryColor(leg.country) }]}
            />
          ))}
          {legsOnDate.length > 2 && (
            <View style={[styles.legBar, styles.legBarMore]}>
              <Text style={styles.legBarMoreText}>+{legsOnDate.length - 2}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Empty state
  if (visibleLegs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Trip Calendar</Text>
        </View>

        <View style={styles.emptyState}>
          <FontAwesome name="calendar-o" size={32} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyStateText}>Add your first leg</Text>
          <Text style={styles.emptyStateSubtext}>Plan your trip dates and destinations</Text>

          <TouchableOpacity style={styles.addButton} onPress={onOpenPlanner} activeOpacity={0.8}>
            <FontAwesome name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Plan Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip Calendar</Text>
        <TouchableOpacity style={styles.seeMoreButton} onPress={onOpenPlanner} activeOpacity={0.7}>
          <Text style={styles.seeMoreText}>See More</Text>
          <FontAwesome name="chevron-right" size={12} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        {/* Week 1 */}
        <View style={styles.week}>
          {calendarDays.slice(0, 7).map((date, index) => renderDay(date, index))}
        </View>

        {/* Week 2 */}
        <View style={styles.week}>
          {calendarDays.slice(7, 14).map((date, index) => renderDay(date, index + 7))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(38,38,38,0.7)',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },

  // Calendar Grid
  calendar: {
    gap: 8,
  },
  week: {
    flexDirection: 'row',
    gap: 4,
  },
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#171717',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#262626',
    minHeight: 48,
  },
  dayContainerToday: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dayNumberToday: {
    color: '#007AFF',
    fontWeight: '600',
  },
  monthLabel: {
    fontSize: 8,
    color: '#666666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  // Leg Indicators
  legIndicators: {
    width: '100%',
    gap: 1,
  },
  legBar: {
    height: 3,
    borderRadius: 1.5,
    width: '100%',
  },
  legBarMore: {
    backgroundColor: '#666666',
    height: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legBarMoreText: {
    fontSize: 6,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
