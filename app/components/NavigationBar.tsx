import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';

const NAV_ITEMS = [
  { name: 'Trips', icon: 'briefcase-outline', route: '/trips' },
  { name: 'Budget', icon: 'wallet-outline', route: '/budget' },
  // FAB will be in the center
  { name: 'Expenses', icon: 'receipt-outline', route: '/(tabs)/expenses' },
  { name: 'Reports', icon: 'bar-chart-outline', route: '/reports' },
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
  const theme = useAppTheme();
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

  // Split nav items for left and right of FAB
  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  // Calculate the vertical distance for the slide-up animation
  // The expanded menu's final bottom position is FAB_SIZE + 10 from the container bottom.
  // Its center is at (FAB_SIZE + 10) + (expanded menu height / 2) from container bottom.
  // Expanded menu height = (button height + margin) * num_buttons - last margin
  const buttonHeight = theme.spacing.xxl; // 48
  const buttonMargin = theme.spacing.sm + theme.spacing.xs; // 12
  const expandedMenuHeight = (buttonHeight + buttonMargin) * 3 - buttonMargin; // (48 + 12) * 3 - 12 = 168
  const expandedMenuCenterYAtRest = FAB_SIZE + (theme.spacing.sm + theme.spacing.xxs) + expandedMenuHeight / 2; // FAB_SIZE + 10 + 84

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
            accessibilityLabel="New Trip"
            onPress={() => {
              console.log('New Trip button pressed');
              toggleMenu(); // Close menu on press
              onNewTripPress?.(); // Call the new prop function
            }}
          >
            <Ionicons name="location-outline" size={theme.typography.fontSizes.xl} color={theme.colors.white} />
            <Text style={[styles.menuButtonText, { fontFamily: theme.typography.primaryFont }]}>New Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            accessibilityLabel="Log Expense"
            onPress={() => {
              toggleMenu(); // Close menu on press
              onLogExpensePress?.(); // Call the new prop function
            }}
          >
            <Ionicons name="cash-outline" size={theme.typography.fontSizes.xl} color={theme.colors.white} />
            <Text style={[styles.menuButtonText, { fontFamily: theme.typography.primaryFont }]}>Log Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            accessibilityLabel="New Memory"
            onPress={() => {
              toggleMenu(); // Close menu on press
              onNewMemoryPress?.(); // Call the new prop function
            }}
          >
            <Ionicons name="image-outline" size={theme.typography.fontSizes.xl} color={theme.colors.white} />
            <Text style={[styles.menuButtonText, { fontFamily: theme.typography.primaryFont }]}>New Memory</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.fabBar}>
        {/* Left icons */}
        {leftItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => router.push(item.route as any)}
            accessibilityLabel={item.name}
          >
            <Ionicons
              name={item.icon as any}
              size={theme.typography.fontSizes.xl} // Changed to theme value (24)
              color={pathname === item.route ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
        {/* Spacer for FAB */}
        <View style={styles.fabSpacer} />
        {/* Right icons */}
        {rightItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => router.push(item.route as any)}
            accessibilityLabel={item.name}
          >
            <Ionicons
              name={item.icon as any}
              size={theme.typography.fontSizes.xl} // Changed to theme value (24)
              color={pathname === item.route ? theme.colors.primary : theme.colors.textSecondary}
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
            <Ionicons name={fabIcon} size={theme.typography.fontSizes.xxl} color={theme.colors.white} />
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
    bottom: theme.spacing.lg, // 24
    alignItems: 'center',
    zIndex: 10,
  },
  fabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface, // Changed from #fff
    borderRadius: BAR_HEIGHT / 2, // Changed from 40 to be dynamic
    height: BAR_HEIGHT,
    minWidth: 320,
    paddingHorizontal: theme.spacing.lg, // 24
    shadowColor: theme.colors.black, // Changed from #000
    shadowOffset: { width: 0, height: theme.spacing.xs }, // 4
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
    left: '50%',
    marginLeft: -FAB_SIZE / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: theme.colors.primary, // Changed from #057B8C
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.black, // Changed from #000
    shadowOffset: { width: 0, height: theme.spacing.xs }, // 4
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 20,
  },
  expandedMenu: {
    position: 'absolute',
    bottom: FAB_SIZE + theme.spacing.sm + theme.spacing.xxs, // FAB_SIZE + 10 (8 + 2)
    alignItems: 'center',
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary, // Changed from #057B8C
    borderRadius: theme.spacing.lg, // 24
    height: theme.spacing.xxl, // 48
    width: 280, // Kept width for now, specific design choice
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm + theme.spacing.xs, // 12 (8 + 4)
    shadowColor: theme.colors.black, // Changed from #000
    shadowOffset: { width: 0, height: theme.spacing.xxs }, // 2
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButtonText: {
    color: theme.colors.white, // Changed from #fff
    fontSize: theme.typography.fontSizes.medium, // Changed from 18 to 16
    marginLeft: theme.spacing.sm, // Changed from 8
    // fontFamily is applied inline to the Text component
  },
});

export default NavigationBar;
