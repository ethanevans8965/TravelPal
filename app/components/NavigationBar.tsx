import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const NAV_ITEMS = [
  { name: 'Home', icon: 'home-outline', route: '/' },
  { name: 'Trips', icon: 'briefcase-outline', route: '/trips' },
  { name: 'Finances', icon: 'bar-chart-outline', route: '/finances' },
];

const NavigationBar = ({
  showFAB = false,
  fabAction,
  fabIcon = 'add',
  onNewTripPress,
  onLogExpensePress,
  onNewMemoryPress,
}: {
  showFAB?: boolean;
  fabAction?: () => void;
  fabIcon?: keyof typeof Ionicons.glyphMap;
  onNewTripPress?: () => void;
  onLogExpensePress?: () => void;
  onNewMemoryPress?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 is the initial position (hidden/at FAB)
  const fadeAnim = useRef(new Animated.Value(0)).current; // 0 is fully transparent
  const rotateAnim = useRef(new Animated.Value(0)).current; // 0 degrees rotation

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Close animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0, // Rotate back to 0 degrees
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => setIsMenuOpen(false));
    } else {
      // Open animation
      setIsMenuOpen(true);
      // Need to delay animation slightly to allow setIsMenuOpen to render the view
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1, // 1 represents the final position
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1, // 1 is fully opaque
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1, // Rotate to 45 degrees (represented by 1)
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, 50);
    }
  };

  // All nav items in a row since we have 3 items
  const allItems = NAV_ITEMS;

  // Calculate the vertical distance for the slide-up animation
  // The expanded menu's final bottom position is FAB_SIZE + 10 from the container bottom.
  // Its center is at (FAB_SIZE + 10) + (expanded menu height / 2) from container bottom.
  // Expanded menu height = (button height + margin) * num_buttons - last margin
  const expandedMenuHeight = (48 + 12) * 3 - 12; // 168
  const expandedMenuCenterYAtRest = FAB_SIZE + 10 + expandedMenuHeight / 2; // FAB_SIZE + 10 + 84

  // The FAB's center is at BAR_HEIGHT / 2 + FAB_SIZE / 2 from the container bottom.
  const fabCenterY = BAR_HEIGHT / 2 + FAB_SIZE / 2;

  // The required translateY at the start (slideAnim = 0) is the difference between the FAB center and the expanded menu center at rest.
  const initialTranslateY = fabCenterY - expandedMenuCenterYAtRest;

  // Interpolate rotation for the FAB icon
  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'], // Rotate from 0 to 45 degrees
  });

  return (
    <View style={styles.fabBarContainer}>
      {/* Expanded Menu Buttons */}
      {isMenuOpen && (
        <Animated.View
          style={[
            styles.expandedMenu,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [initialTranslateY, 0], // Animate from calculated position to final position (0 translation)
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.menuButton}
            accessibilityLabel="Add Expense"
            onPress={() => {
              toggleMenu(); // Close menu on press
              router.push('/expenses/add'); // Navigate to add expense screen
            }}
          >
            <Ionicons name="cash-outline" size={24} color="#fff" />
            <Text style={styles.menuButtonText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            accessibilityLabel="Add Trip"
            onPress={() => {
              console.log('Add Trip button pressed');
              toggleMenu(); // Close menu on press
              onNewTripPress?.(); // Call the existing trip function - same as before
            }}
          >
            <Ionicons name="location-outline" size={24} color="#fff" />
            <Text style={styles.menuButtonText}>Add Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            accessibilityLabel="Add Budget Item"
            onPress={() => {
              toggleMenu(); // Close menu on press
              // TODO: Add budget item functionality will be implemented later
            }}
          >
            <Ionicons name="wallet-outline" size={24} color="#fff" />
            <Text style={styles.menuButtonText}>Add Budget Item</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.fabBar}>
        {/* All navigation items */}
        {allItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => router.push(item.route as any)}
            accessibilityLabel={item.name}
          >
            <Ionicons
              name={item.icon as any}
              size={26}
              color={pathname === item.route ? '#057B8C' : '#222'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Centered FAB */}
      {showFAB && (
        <TouchableOpacity style={styles.fab} onPress={toggleMenu} accessibilityLabel="Add new item">
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolation }],
            }}
          >
            <Ionicons name={fabIcon} size={28} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const BAR_HEIGHT = 64;
const FAB_SIZE = 64;

const styles = StyleSheet.create({
  fabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  fabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    height: BAR_HEIGHT,
    minWidth: 320,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_HEIGHT,
  },
  fabSpacer: {
    width: FAB_SIZE * 0.7, // Space for the FAB
  },
  fab: {
    position: 'absolute',
    top: -FAB_SIZE / 2 + BAR_HEIGHT / 2,
    right: 16, // Position FAB to the right side instead of center
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#057B8C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 20,
  },
  expandedMenu: {
    position: 'absolute',
    bottom: FAB_SIZE + 10, // This is the FINAL bottom position
    alignItems: 'center',
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: '#057B8C',
    borderRadius: 24, // Half of height for pill shape
    height: 48,
    width: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12, // Space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
});

export default NavigationBar;
