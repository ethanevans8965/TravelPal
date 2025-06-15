import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Trip } from '../types';
import { useRouter } from 'expo-router';

interface SwipeableTripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  destinationName: string;
  tripLength: number | null;
  dateBasedStatus: string;
  getStatusColor: (status: string) => string;
  getStatusDisplayText: (status: string) => string;
  getTravelStyleColor: (style: string) => any;
  formatDate: (date?: string) => string;
  isLast?: boolean;
}

export default function SwipeableTripCard({
  trip,
  onEdit,
  onDelete,
  destinationName,
  tripLength,
  dateBasedStatus,
  getStatusColor,
  getStatusDisplayText,
  getTravelStyleColor,
  formatDate,
  isLast = false,
}: SwipeableTripCardProps) {
  const router = useRouter();
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

    onEdit(trip);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${trip.name}"? This will also delete all associated expenses and cannot be undone.`,
      [
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

            onDelete(trip.id);
          },
        },
      ]
    );
  };

  const handleTripPress = () => {
    // Only navigate if the card isn't swiped
    if (lastOffset.current === 0) {
      router.push(`/trip/${trip.id}/dashboard` as any);
    } else {
      // Reset position if swiped
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      lastOffset.current = 0;
    }
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
            styles.tripCard,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <TouchableOpacity onPress={handleTripPress} style={styles.cardContent}>
            <View style={styles.tripHeader}>
              <View style={styles.tripTitleContainer}>
                <Text style={styles.tripName}>{trip.name}</Text>
                <Text style={styles.tripDestination}>{destinationName}</Text>
              </View>
              <View
                style={[styles.statusBadge, { backgroundColor: getStatusColor(dateBasedStatus) }]}
              >
                <Text style={styles.statusText}>{getStatusDisplayText(dateBasedStatus)}</Text>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.detailRow}>
                <FontAwesome name="calendar" size={14} color="#8E8E93" />
                <Text style={styles.detailText}>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  {tripLength && ` (${tripLength} days)`}
                </Text>
              </View>

              {trip.travelStyle && (
                <View style={styles.detailRow}>
                  <FontAwesome
                    name="star"
                    size={14}
                    color={getTravelStyleColor(trip.travelStyle)}
                  />
                  <Text style={styles.detailText}>{trip.travelStyle} Travel</Text>
                </View>
              )}

              {trip.dailyBudget && (
                <View style={styles.detailRow}>
                  <FontAwesome name="money" size={14} color="#8E8E93" />
                  <Text style={styles.detailText}>
                    ${trip.dailyBudget}/day
                    {trip.totalBudget && ` (Total: $${trip.totalBudget.toLocaleString()})`}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.tripFooter}>
              <View style={styles.categoryIndicators}>
                {Object.entries(trip.categories)
                  .slice(0, 3)
                  .map(([category, amount]) => (
                    <View key={category} style={styles.categoryDot}>
                      <Text style={styles.categoryAmount}>${amount}</Text>
                      <Text style={styles.categoryName}>{category}</Text>
                    </View>
                  ))}
                {Object.keys(trip.categories).length > 3 && (
                  <Text style={styles.moreCategories}>
                    +{Object.keys(trip.categories).length - 3} more
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
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
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  rightActions: {
    right: 0,
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
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
  tripCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
  },
  cardContent: {
    padding: 20,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  tripName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 15,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tripDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#1C1C1E',
    marginLeft: 8,
    flex: 1,
  },
  tripFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
  },
  categoryIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryDot: {
    marginRight: 16,
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  categoryName: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  moreCategories: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});
