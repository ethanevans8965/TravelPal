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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
  const { getLegsByTrip, addLeg, updateLeg, deleteLeg } = useTripStore();
  const legs = getLegsByTrip(tripId);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarMode, setCalendarMode] = useState<'view' | 'edit'>('view');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('viewing');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [editingLeg, setEditingLeg] = useState<Leg | null>(null);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and how many days to show from previous month
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    // Generate 6 weeks (42 days) to ensure full calendar
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  }, [currentMonth]);

  // Get country colors (reuse from CalendarPreviewWidget)
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

  // Handle month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  // Handle date selection
  const handleDatePress = (date: Date) => {
    // Only allow editing interactions when in edit mode
    if (calendarMode === 'view') {
      return; // No interactions allowed in view mode
    }

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
    return date.getMonth() === currentMonth.getMonth();
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

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          !isCurrent && styles.dayCellInactive,
          isSelected && styles.dayCellSelected,
          isInRange && !isBoundary && styles.dayCellInRange,
          isBoundary && styles.dayCellBoundary,
          isCurrentDay && styles.dayCellToday,
        ]}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            !isCurrent && styles.dayTextInactive,
            (isSelected || isInRange) && styles.dayTextSelected,
            isCurrentDay && styles.dayTextToday,
          ]}
        >
          {date.getDate()}
        </Text>

        {/* Leg indicators */}
        <View style={styles.legIndicators}>
          {legsOnDate.slice(0, 3).map((leg, legIndex) => (
            <View
              key={`${leg.id}-${legIndex}`}
              style={[styles.legIndicator, { backgroundColor: getCountryColor(leg.country) }]}
            />
          ))}
        </View>
      </TouchableOpacity>
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
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <FontAwesome name="times" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Planner</Text>
          <View style={styles.headerActions}>
            {selectionMode !== 'viewing' && (
              <TouchableOpacity onPress={resetSelection} style={styles.resetButton}>
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
        <View style={styles.modeIndicator}>
          {calendarMode === 'view' && (
            <Text style={styles.modeText}>View mode - Tap "Edit" to modify your trip</Text>
          )}
          {calendarMode === 'edit' && selectionMode === 'viewing' && (
            <Text style={styles.modeText}>Edit mode - Tap to edit legs or add new ones</Text>
          )}
          {calendarMode === 'edit' && selectionMode === 'selecting_dates' && (
            <Text style={styles.modeText}>
              {selectedStartDate ? 'Tap end date' : 'Tap start date'}
            </Text>
          )}
          {calendarMode === 'edit' && selectionMode === 'selecting_country' && (
            <Text style={styles.modeText}>
              {editingLeg ? 'Edit leg details' : 'Choose country for new leg'}
            </Text>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Month navigation */}
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
              <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
              <FontAwesome name="chevron-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
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
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <View key={weekIndex} style={styles.week}>
                {calendarDays
                  .slice(weekIndex * 7, (weekIndex + 1) * 7)
                  .map((date, dayIndex) => renderDay(date, weekIndex * 7 + dayIndex))}
              </View>
            ))}
          </View>

          {/* Country selection */}
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
                  <Text style={styles.legendText}>Navigate between months</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
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
  },
  modeText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    aspectRatio: 1,
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#404040',
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
    borderColor: '#00FF87',
    borderWidth: 2,
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
    color: '#00FF87',
    fontWeight: '600',
  },

  // Leg indicators
  legIndicators: {
    width: '100%',
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'center',
  },
  legIndicator: {
    width: 8,
    height: 3,
    borderRadius: 1.5,
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
});
