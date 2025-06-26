import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Leg } from '../../types';
import { useTripStore } from '../../stores/tripStore';
import DarkCountryPicker from '../DarkCountryPicker';

const { width: screenWidth } = Dimensions.get('window');
const CALENDAR_WIDTH = screenWidth - 32; // Account for padding
const DAY_SIZE = (CALENDAR_WIDTH - 48) / 7; // 7 days with gaps

interface CalendarPlannerModalProps {
  visible: boolean;
  tripId: string;
  onClose: () => void;
}

type SelectionMode = 'viewing' | 'selecting_dates' | 'selecting_country';

export default function CalendarPlannerModal({
  visible,
  tripId,
  onClose,
}: CalendarPlannerModalProps) {
  const router = useRouter();
  const { getLegsByTrip, addLeg, updateLeg, deleteLeg } = useTripStore();
  const legs = getLegsByTrip(tripId);

  // Calendar state
  const [calendarMode, setCalendarMode] = useState<'view' | 'edit'>('view');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('viewing');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [editingLeg, setEditingLeg] = useState<Leg | null>(null);

  // Dynamic calendar state for infinite scrolling
  const [monthsData, setMonthsData] = useState(() => {
    const months = [];
    const today = new Date();
    const startMonth = new Date(today.getFullYear(), today.getMonth() - 6, 1);

    // Start with 13 months (6 before + current + 6 after)
    for (let i = 0; i < 13; i++) {
      const monthDate = new Date(startMonth);
      monthDate.setMonth(startMonth.getMonth() + i);
      months.push({
        id: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        date: monthDate,
        year: monthDate.getFullYear(),
        month: monthDate.getMonth(),
      });
    }
    return months;
  });

  // Current month is at index 6 (6 months back + current month = index 6)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(6);

  // Prevent excessive loading when scrolling
  const [isLoadingPastMonths, setIsLoadingPastMonths] = useState(false);

  // Load more future months when scrolling down
  const loadMoreFutureMonths = () => {
    setMonthsData((prevMonths) => {
      const lastMonth = prevMonths[prevMonths.length - 1];
      const newMonths = [];

      // Add 6 more months to the end
      for (let i = 1; i <= 6; i++) {
        const monthDate = new Date(lastMonth.date);
        monthDate.setMonth(lastMonth.date.getMonth() + i);
        newMonths.push({
          id: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
          date: monthDate,
          year: monthDate.getFullYear(),
          month: monthDate.getMonth(),
        });
      }

      return [...prevMonths, ...newMonths];
    });
  };

  // Load more past months when scrolling up
  const loadMorePastMonths = () => {
    if (isLoadingPastMonths) return;

    setIsLoadingPastMonths(true);

    setMonthsData((prevMonths) => {
      const firstMonth = prevMonths[0];
      const newMonths = [];

      // Add 6 more months to the beginning
      for (let i = 6; i >= 1; i--) {
        const monthDate = new Date(firstMonth.date);
        monthDate.setMonth(firstMonth.date.getMonth() - i);
        newMonths.push({
          id: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
          date: monthDate,
          year: monthDate.getFullYear(),
          month: monthDate.getMonth(),
        });
      }

      return [...newMonths, ...prevMonths];
    });

    // Update current month index since we added months at the beginning
    setCurrentMonthIndex((prevIndex) => prevIndex + 6);

    // Reset loading state after a brief delay
    setTimeout(() => setIsLoadingPastMonths(false), 1000);
  };

  // Get calendar days for a specific month
  const getCalendarDaysForMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Generate only the days that belong to this month
    const days = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  // Get country colors (match CalendarPreviewWidget)
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

  // Check if a leg spans a specific date
  const isLegOnDate = (leg: Leg, date: Date) => {
    if (!leg.startDate) return false;
    const legStart = new Date(leg.startDate);
    const legEnd = leg.endDate ? new Date(leg.endDate) : legStart;

    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(legStart.getFullYear(), legStart.getMonth(), legStart.getDate());
    const end = new Date(legEnd.getFullYear(), legEnd.getMonth(), legEnd.getDate());

    return checkDate >= start && checkDate <= end;
  };

  // Get legs for a specific date
  const getLegsForDate = (date: Date) => {
    return legs.filter((leg) => isLegOnDate(leg, date));
  };

  // Handle date selection
  const handleDatePress = (date: Date) => {
    // In view mode, navigate to day details screen
    if (calendarMode === 'view') {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      router.push(`/trip/${tripId}/day/${formattedDate}` as any);
      return;
    }

    // Edit mode interactions
    const legsOnDate = getLegsForDate(date);

    if (selectionMode === 'viewing') {
      if (legsOnDate.length > 0) {
        // Edit existing leg
        setEditingLeg(legsOnDate[0]);
        setSelectedCountry(legsOnDate[0].country);
        setSelectionMode('selecting_country');
      } else {
        // Start new leg selection
        setSelectedStartDate(date);
        setSelectedEndDate(null);
        setSelectionMode('selecting_dates');
      }
    } else if (selectionMode === 'selecting_dates') {
      if (!selectedStartDate) {
        setSelectedStartDate(date);
      } else if (selectedEndDate || date < selectedStartDate) {
        // Reset selection
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else {
        // Set end date and proceed to country selection
        setSelectedEndDate(date);
        setSelectionMode('selecting_country');
      }
    }
  };

  // Handle country selection
  const handleCountrySelected = (country: string) => {
    setSelectedCountry(country);
  };

  // Save new leg
  const saveNewLeg = () => {
    if (!selectedStartDate || !selectedCountry.trim()) return;

    const legData = {
      tripId,
      country: selectedCountry.trim(),
      startDate: selectedStartDate.toISOString().split('T')[0],
      endDate: selectedEndDate
        ? selectedEndDate.toISOString().split('T')[0]
        : selectedStartDate.toISOString().split('T')[0],
      budget: 0,
    };

    try {
      // Use bypass validation since calendar planner is more intentional
      addLeg(legData, true);
      resetSelection();
      Alert.alert('Success', 'Leg added successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add leg');
    }
  };

  // Update existing leg
  const updateExistingLeg = () => {
    if (!editingLeg || !selectedCountry.trim()) return;

    try {
      updateLeg({
        ...editingLeg,
        country: selectedCountry.trim(),
      });
      resetSelection();
      Alert.alert('Success', 'Leg updated successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update leg');
    }
  };

  // Delete leg
  const deleteExistingLeg = () => {
    if (!editingLeg) return;

    Alert.alert('Delete Leg', `Are you sure you want to delete the ${editingLeg.country} leg?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteLeg(editingLeg.id);
          resetSelection();
          Alert.alert('Success', 'Leg deleted successfully!');
        },
      },
    ]);
  };

  // Reset selection state
  const resetSelection = () => {
    setSelectionMode('viewing');
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectedCountry('');
    setEditingLeg(null);
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isDateSelected = (date: Date) => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate) return date.toDateString() === selectedStartDate.toDateString();
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  // Check if date is in selection range (for visual feedback)
  const isInSelectionRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  // Check if date is selection boundary
  const isSelectionBoundary = (date: Date) => {
    if (!selectedStartDate) return false;
    const isStart = selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
    const isEnd = selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
    return isStart || isEnd;
  };

  // Render day cell
  const renderDay = (date: Date, index: number) => {
    const legsOnDate = getLegsForDate(date);
    const isSelected = isDateSelected(date);
    const isInRange = isInSelectionRange(date);
    const isBoundary = isSelectionBoundary(date);
    const isCurrent = isCurrentMonth(date);
    const isCurrentDay = isToday(date);
    const hasLegs = legsOnDate.length > 0;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          // Remove mode-based styling from here since it's now on container
        ]}
        onPress={() => handleDatePress(date)}
        activeOpacity={calendarMode === 'edit' ? 0.7 : 1.0}
      >
        <Text
          style={[
            styles.dayText,
            (isSelected || isInRange) && styles.dayTextSelected,
            isCurrentDay && styles.dayTextToday,
            // Mode-based text styling
            calendarMode === 'edit' && styles.dayTextEditMode,
            calendarMode === 'view' && styles.dayTextViewMode,
          ]}
        >
          {date.getDate()}
        </Text>

        {/* Leg indicators */}
        <View style={styles.legIndicators}>
          {legsOnDate.slice(0, 3).map((leg, legIndex) => (
            <View
              key={`${leg.id}-${legIndex}`}
              style={[
                styles.legIndicator,
                { backgroundColor: getCountryColor(leg.country) },
                // Mode-based leg indicator styling
                calendarMode === 'edit' && styles.legIndicatorEditMode,
                calendarMode === 'view' && styles.legIndicatorViewMode,
              ]}
            />
          ))}
        </View>

        {/* Edit mode interaction hint */}
        {calendarMode === 'edit' && !hasLegs && (
          <View style={styles.editHint}>
            <FontAwesome name="plus" size={8} color="rgba(0,122,255,0.6)" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render month for FlatList
  const renderMonth = ({
    item,
  }: {
    item: { id: string; date: Date; year: number; month: number };
  }) => {
    const calendarDays = getCalendarDaysForMonth(item.date);
    const isCurrentMonth =
      item.date.getMonth() === new Date().getMonth() &&
      item.date.getFullYear() === new Date().getFullYear();

    // Group days into weeks - simplified and more reliable approach
    const weeks: (Date | null)[][] = [];
    const firstDay = new Date(item.date.getFullYear(), item.date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Start with empty week
    let currentWeek: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Add all days of the month
    calendarDays.forEach((date) => {
      currentWeek.push(date);

      // If week is complete (7 days), start a new week
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Complete the last week with empty cells if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push(null);
    }

    // Add the last week if it has any days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return (
      <View style={styles.monthContainer}>
        {/* Month header */}
        <View style={styles.monthHeader}>
          <Text style={[styles.monthTitle, isCurrentMonth && styles.currentMonthTitle]}>
            {item.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {isCurrentMonth && ' (Current)'}
          </Text>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendar}>
          {weeks.map((week: (Date | null)[], weekIndex: number) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((date: Date | null, dayIndex: number) => (
                <View
                  key={dayIndex}
                  style={[
                    styles.dayCellContainer,
                    // Apply mode-based styling to container for full coverage
                    date && calendarMode === 'edit' && styles.dayCellEditMode,
                    date &&
                      calendarMode === 'edit' &&
                      getLegsForDate(date).length > 0 &&
                      styles.dayCellEditModeWithLegs,
                    date && calendarMode === 'view' && styles.dayCellViewMode,
                    // Selection styling
                    date && isDateSelected(date) && styles.dayCellSelected,
                    date &&
                      isInSelectionRange(date) &&
                      !isSelectionBoundary(date) &&
                      styles.dayCellInRange,
                    date && isSelectionBoundary(date) && styles.dayCellBoundary,
                    date && isToday(date) && styles.dayCellToday,
                  ]}
                >
                  {date ? (
                    renderDay(date, weekIndex * 7 + dayIndex)
                  ) : (
                    <View style={styles.emptyDayCell} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton} activeOpacity={0.8}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Planner</Text>
          <View style={styles.headerActions}>
            {selectionMode !== 'viewing' && (
              <TouchableOpacity
                onPress={resetSelection}
                style={styles.resetButton}
                activeOpacity={0.8}
              >
                <FontAwesome name="refresh" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                const newMode = calendarMode === 'view' ? 'edit' : 'view';
                setCalendarMode(newMode);
                // Reset any active selections when switching to view mode
                if (newMode === 'view') {
                  resetSelection();
                }
              }}
              style={[
                styles.modeToggleButton,
                calendarMode === 'edit' && styles.modeToggleButtonActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.modeToggleText,
                  calendarMode === 'edit' && styles.modeToggleTextActive,
                ]}
              >
                {calendarMode === 'view' ? 'Edit' : 'Done'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode indicator */}
        <View
          style={[
            styles.modeIndicator,
            calendarMode === 'edit' && styles.modeIndicatorEdit,
            calendarMode === 'view' && styles.modeIndicatorView,
          ]}
        >
          {calendarMode === 'view' && (
            <Text style={[styles.modeText, styles.modeTextView]}>
              View mode - Tap "Edit" to modify your trip
            </Text>
          )}
          {calendarMode === 'edit' && selectionMode === 'viewing' && (
            <Text style={[styles.modeText, styles.modeTextEdit]}>
              Edit mode - Tap to edit legs or add new ones
            </Text>
          )}
          {calendarMode === 'edit' && selectionMode === 'selecting_dates' && (
            <Text style={[styles.modeText, styles.modeTextEdit]}>
              {selectedStartDate ? 'Tap end date' : 'Tap start date'}
            </Text>
          )}
          {calendarMode === 'edit' && selectionMode === 'selecting_country' && (
            <Text style={[styles.modeText, styles.modeTextEdit]}>
              {editingLeg ? 'Edit leg details' : 'Choose country for new leg'}
            </Text>
          )}
        </View>

        {/* Country selection - moved outside FlatList for better visibility */}
        {selectionMode === 'selecting_country' && (
          <View style={styles.countrySection}>
            <Text style={styles.sectionTitle}>
              {editingLeg ? 'Update Country' : 'Select Country'}
            </Text>
            <DarkCountryPicker
              selectedCountry={selectedCountry}
              onSelectCountry={handleCountrySelected}
            />

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={resetSelection}
              >
                <FontAwesome name="times" size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>

              {editingLeg ? (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={deleteExistingLeg}
                  >
                    <FontAwesome name="trash" size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={updateExistingLeg}
                    disabled={!selectedCountry.trim()}
                  >
                    <FontAwesome name="check" size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Update</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={saveNewLeg}
                  disabled={!selectedCountry.trim()}
                >
                  <FontAwesome name="plus" size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Add Leg</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={styles.content}>
          {/* Vertical Calendar with FlatList */}
          <FlatList
            data={monthsData}
            renderItem={renderMonth}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.calendarList}
            contentContainerStyle={styles.calendarContent}
            initialScrollIndex={currentMonthIndex}
            getItemLayout={(data, index) => ({
              length: 400, // Approximate height of each month
              offset: 400 * index,
              index,
            })}
            onEndReached={loadMoreFutureMonths}
            onEndReachedThreshold={0.5}
            onScroll={(event) => {
              const scrollY = event.nativeEvent.contentOffset.y;
              // Load past months when scrolling near the top
              if (scrollY < 800) {
                // Less than 2 months from top
                loadMorePastMonths();
              }
            }}
            scrollEventThrottle={400}
            ListFooterComponent={() => (
              <View>
                {/* Interactive Legend */}
                {selectionMode === 'viewing' && (
                  <View style={styles.legendSection}>
                    <Text style={styles.legendTitle}>How to use Trip Planner</Text>
                    <View style={styles.legendItems}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendIndicator, { backgroundColor: '#007AFF' }]} />
                        <Text style={styles.legendText}>Tap empty date to start planning</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendIndicator, { backgroundColor: '#00FF87' }]} />
                        <Text style={styles.legendText}>Today's date</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendIndicator, { backgroundColor: '#10B981' }]} />
                        <Text style={styles.legendText}>Tap existing leg to edit</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <FontAwesome name="chevron-left" size={12} color="#666666" />
                        <FontAwesome name="chevron-right" size={12} color="#666666" />
                        <Text style={styles.legendText}>Scroll to navigate between months</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
  },
  modeToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 60,
    alignItems: 'center',
  },
  modeToggleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modeToggleText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  modeIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#262626',
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
    minHeight: 50,
    justifyContent: 'center',
  },
  modeText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },

  // Month navigation
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 22,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  currentMonthTitle: {
    color: '#00FF87',
  },

  // Weekday headers
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textTransform: 'uppercase',
  },

  // Calendar
  calendar: {
    gap: 4,
    marginBottom: 24,
  },
  week: {
    flexDirection: 'row',
    gap: 4,
  },
  dayCell: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 4,
  },
  dayCellInactive: {
    backgroundColor: '#1C1C1C',
    borderColor: '#333333',
  },
  dayCellSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayCellToday: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  dayCellInRange: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  dayCellBoundary: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dayTextInactive: {
    color: '#666666',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayTextToday: {
    color: '#007AFF',
    fontWeight: '600',
  },

  // Leg indicators
  legIndicators: {
    width: '100%',
    gap: 1,
  },
  legIndicator: {
    height: 3,
    borderRadius: 1.5,
    width: '100%',
  },
  legIndicatorEditMode: {
    height: 4,
    borderRadius: 2,
    opacity: 0.9,
  },
  legIndicatorViewMode: {
    opacity: 0.7,
  },

  // Country selection
  countrySection: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#666666',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Interactive Legend
  legendSection: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: '#CCCCCC',
    fontSize: 12,
    flex: 1,
  },

  // Mode-based styling
  dayCellEditMode: {
    backgroundColor: 'rgba(0,122,255,0.05)',
    borderColor: 'rgba(0,122,255,0.2)',
    borderWidth: 1,
  },
  dayCellEditModeWithLegs: {
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderColor: 'rgba(0,122,255,0.3)',
    borderWidth: 1,
  },
  dayCellViewMode: {
    backgroundColor: '#171717',
    borderColor: '#262626',
  },
  dayTextEditMode: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayTextViewMode: {
    color: '#CCCCCC',
  },
  editHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,122,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeIndicatorEdit: {
    backgroundColor: '#007AFF',
  },
  modeIndicatorView: {
    backgroundColor: '#262626',
  },
  modeTextEdit: {
    color: '#FFFFFF',
  },
  modeTextView: {
    color: '#CCCCCC',
  },
  calendarList: {
    flex: 1,
  },
  calendarContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  monthContainer: {
    padding: 16,
  },
  dayCellContainer: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#171717',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#262626',
  },
  emptyDayCell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#171717',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#262626',
  },
});
