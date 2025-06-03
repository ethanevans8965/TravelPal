import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Expense } from '../types';

interface SwipeableExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  getTripName: (tripId?: string) => string;
  formatDate: (date: string) => string;
  getCategoryEmoji: (category: string) => string;
  isLast?: boolean;
}

export default function SwipeableExpenseCard({
  expense,
  onEdit,
  onDelete,
  getTripName,
  formatDate,
  getCategoryEmoji,
  isLast = false,
}: SwipeableExpenseCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const onGestureEvent = Animated.event([{ nativeEvent: { translationX: translateX } }], {
    useNativeDriver: false,
  });

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      lastOffset.current += translationX;

      if (Math.abs(lastOffset.current) > 60) {
        // Show actions
        Animated.timing(translateX, {
          toValue: lastOffset.current > 0 ? 120 : -120,
          duration: 200,
          useNativeDriver: false,
        }).start();
        lastOffset.current = lastOffset.current > 0 ? 120 : -120;
      } else {
        // Reset to center
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
        lastOffset.current = 0;
      }
    }
  };

  const handleEdit = () => {
    // Reset position first
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    lastOffset.current = 0;

    onEdit(expense);
  };

  const handleDelete = () => {
    Alert.alert('Delete Expense', `Are you sure you want to delete "${expense.description}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Reset position first
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
          lastOffset.current = 0;

          onDelete(expense.id);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, isLast && styles.lastCard]}>
      {/* Action Buttons - Left Side (Edit) */}
      <View style={[styles.actionsContainer, styles.leftActions]}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <FontAwesome name="edit" size={20} color="#fff" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons - Right Side (Delete) */}
      <View style={[styles.actionsContainer, styles.rightActions]}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <FontAwesome name="trash" size={20} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Main Card Content */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.expenseCard,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.expenseHeader}>
            <View style={styles.expenseIcon}>
              <Text style={styles.expenseIconText}>{getCategoryEmoji(expense.category)}</Text>
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseName}>{expense.description}</Text>
              <Text style={styles.expenseCategory}>{expense.category}</Text>
            </View>
            <View style={styles.expenseAmountContainer}>
              <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
              <Text style={styles.expenseCurrency}>{expense.currency}</Text>
            </View>
          </View>

          <View style={styles.expenseFooter}>
            <Text style={styles.expenseTrip}>{getTripName(expense.tripId)}</Text>
            <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
          </View>

          {/* Tags if available */}
          {expense.tags && expense.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {expense.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {expense.tags.length > 3 && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>+{expense.tags.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 12,
  },
  lastCard: {
    marginBottom: 0,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  leftActions: {
    left: 0,
    backgroundColor: '#43cea2',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  rightActions: {
    right: 0,
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 20,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  expenseCurrency: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  expenseTrip: {
    fontSize: 14,
    color: '#8E8E93',
  },
  expenseDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
