import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const NAV_ITEMS = [
  { name: 'Trips', icon: 'briefcase-outline', route: '/trips' },
  { name: 'Budget', icon: 'wallet-outline', route: '/budget' },
  // FAB will be in the center
  { name: 'Expenses', icon: 'receipt-outline', route: '/expenses' },
  { name: 'Reports', icon: 'bar-chart-outline', route: '/reports' },
];

const NavigationBar = ({
  showFAB = false,
  fabAction,
  fabIcon = 'add',
}: {
  showFAB?: boolean;
  fabAction?: () => void;
  fabIcon?: keyof typeof Ionicons.glyphMap;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Split nav items for left and right of FAB
  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  return (
    <View style={styles.fabBarContainer}>
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
              size={26}
              color={pathname === item.route ? '#057B8C' : '#222'}
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
              size={26}
              color={pathname === item.route ? '#057B8C' : '#222'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Centered FAB */}
      {showFAB && (
        <TouchableOpacity
          style={styles.fab}
          onPress={fabAction}
          accessibilityLabel="Add new item"
        >
          <Ionicons name={fabIcon} size={28} color="#fff" />
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
    left: '50%',
    marginLeft: -FAB_SIZE / 2,
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
});

export default NavigationBar; 