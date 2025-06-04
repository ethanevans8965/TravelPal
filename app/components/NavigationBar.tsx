import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const NAV_ITEMS = [
  { name: 'Home', icon: 'home', activeIcon: 'home', route: '/', color: '#0EA5E9' },
  { name: 'Trips', icon: 'plane', activeIcon: 'plane', route: '/trips', color: '#10B981' },
  {
    name: 'Finances',
    icon: 'bar-chart',
    activeIcon: 'bar-chart',
    route: '/finances',
    color: '#F59E0B',
  },
];

interface NavigationBarProps {
  showFAB?: boolean;
  fabAction?: () => void;
  fabIcon?: string;
  onNewTripPress?: () => void;
  onLogExpensePress?: () => void;
  onNewMemoryPress?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  showFAB = false,
  fabAction,
  fabIcon = 'plus',
  onNewTripPress,
  onLogExpensePress,
  onNewMemoryPress,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  // Haptic feedback
  const triggerHaptic = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // Update active index based on current route
  useEffect(() => {
    const currentIndex = NAV_ITEMS.findIndex((item) => item.route === pathname);
    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
      Animated.spring(indicatorAnim, {
        toValue: currentIndex,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [pathname, activeIndex]);

  const toggleMenu = () => {
    triggerHaptic();

    if (isMenuOpen) {
      // Close animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start(() => setIsMenuOpen(false));
    } else {
      // Open animation
      setIsMenuOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 400,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNavPress = (item: (typeof NAV_ITEMS)[0], index: number) => {
    triggerHaptic();

    if (pathname !== item.route) {
      setActiveIndex(index);
      router.push(item.route as any);
    }
  };

  const handleMenuAction = (action: () => void) => {
    triggerHaptic();
    toggleMenu();
    setTimeout(() => action(), 100);
  };

  // Animation interpolations
  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const slideUpDistance = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const indicatorTranslateX = indicatorAnim.interpolate({
    inputRange: [0, NAV_ITEMS.length - 1],
    outputRange: [0, ((screenWidth - 80) / NAV_ITEMS.length) * (NAV_ITEMS.length - 1)],
  });

  return (
    <View style={styles.navigationContainer}>
      {/* Menu Backdrop */}
      {isMenuOpen && <Animated.View style={[styles.menuBackdrop, { opacity: fadeAnim }]} />}

      {/* Floating Action Menu */}
      {isMenuOpen && (
        <Animated.View
          style={[
            styles.floatingMenu,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpDistance }, { scale: fadeAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: '#0EA5E9' }]}
            onPress={() => handleMenuAction(() => router.push('/expenses/add'))}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0EA5E9', '#1E293B']}
              style={styles.menuItemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome name="credit-card" size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Add Expense</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: '#10B981' }]}
            onPress={() => handleMenuAction(() => onNewTripPress?.())}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10B981', '#1E293B']}
              style={styles.menuItemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome name="plane" size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>New Trip</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: '#F59E0B' }]}
            onPress={() => handleMenuAction(() => {})}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F59E0B', '#1E293B']}
              style={styles.menuItemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome name="money" size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Budget Item</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Main Navigation Bar */}
      <Animated.View style={[styles.navigationBar, { transform: [{ scale: scaleAnim }] }]}>
        {/* Active Indicator */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              transform: [{ translateX: indicatorTranslateX }],
              backgroundColor: NAV_ITEMS[activeIndex]?.color || '#0EA5E9',
            },
          ]}
        />

        {/* Navigation Items */}
        <View style={styles.navItemsContainer}>
          {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.route;

            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => handleNavPress(item, index)}
                activeOpacity={0.7}
              >
                <View style={[styles.navItemContent, isActive && styles.navItemActive]}>
                  <FontAwesome
                    name={isActive ? (item.activeIcon as any) : (item.icon as any)}
                    size={isActive ? 24 : 22}
                    color={isActive ? '#FFFFFF' : '#64748B'}
                  />
                  <Text style={[styles.navItemLabel, isActive && styles.navItemLabelActive]}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Floating Action Button */}
        {showFAB && (
          <TouchableOpacity style={styles.fab} onPress={toggleMenu} activeOpacity={0.8}>
            <LinearGradient
              colors={['#0EA5E9', '#1E293B']}
              style={styles.fabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: rotateInterpolation }],
                }}
              >
                <FontAwesome name={fabIcon as any} size={24} color="#FFFFFF" />
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  menuBackdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  floatingMenu: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    zIndex: 2,
  },
  menuItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    minWidth: 160,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  navigationBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 64,
    width: screenWidth - 40,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    zIndex: 3,
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: (screenWidth - 80) / NAV_ITEMS.length,
    height: 48,
    borderRadius: 20,
    zIndex: 1,
  },
  navItemsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  navItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    // Additional styling for active state if needed
  },
  navItemLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  navItemLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    top: -20,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 4,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NavigationBar;
