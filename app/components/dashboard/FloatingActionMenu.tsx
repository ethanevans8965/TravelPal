import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTripStore } from '../../stores/tripStore';

interface ActionItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: string;
  params?: any;
}

interface FloatingActionMenuProps {
  style?: any;
}

export default function FloatingActionMenu({ style }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const activeTrips = useTripStore((state) => state.getCurrentTrips)();

  // Animation values
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Base actions available to all users
  const baseActions: ActionItem[] = [
    {
      id: 'add-expense',
      label: 'Add Expense',
      icon: 'money',
      color: '#057B8C',
      route: '/expenses/add',
    },
    {
      id: 'new-trip',
      label: 'Plan Trip',
      icon: 'plane',
      color: '#10B981',
      route: '/trip/create',
    },
    {
      id: 'add-location',
      label: 'Add Place',
      icon: 'map-marker',
      color: '#8B5CF6',
      route: '/trips', // Would be location add screen
    },
  ];

  // Add contextual actions if there are active trips
  const contextualActions: ActionItem[] =
    activeTrips.length > 0
      ? [
          {
            id: 'quick-note',
            label: 'Quick Note',
            icon: 'edit',
            color: '#F59E0B',
            route: '/trips', // Would be journal entry screen
          },
        ]
      : [];

  const actions = [...baseActions, ...contextualActions];

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);

    // Animate main button rotation
    Animated.timing(rotateValue, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Animate submenu scale
    Animated.timing(scaleValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animate backdrop
    Animated.timing(backdropOpacity, {
      toValue: toValue * 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleActionPress = (action: ActionItem) => {
    toggleMenu();
    setTimeout(() => {
      router.push(action.route as any);
    }, 150); // Small delay for smooth transition
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const scale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Backdrop */}
      {isOpen && (
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Action Items */}
      <Animated.View
        style={[
          styles.actionsContainer,
          {
            transform: [{ scale }],
          },
        ]}
      >
        {actions.map((action, index) => (
          <Animated.View
            key={action.id}
            style={[
              styles.actionItem,
              {
                transform: [
                  {
                    translateY: scaleValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -(60 * (index + 1))],
                    }),
                  },
                  { scale },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => handleActionPress(action)}
              activeOpacity={0.8}
            >
              <FontAwesome name={action.icon as any} size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Main Floating Button */}
      <TouchableOpacity style={styles.mainButton} onPress={toggleMenu} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.mainButtonInner,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <FontAwesome name="plus" size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: -height,
    left: -width,
    width: width * 2,
    height: height * 2,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  backdropTouchable: {
    flex: 1,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 3,
  },
  actionItem: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#057B8C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 4,
  },
  mainButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
