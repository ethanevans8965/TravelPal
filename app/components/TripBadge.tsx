import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface TripBadgeProps {
  tripName?: string;
  variant?: 'linked' | 'info';
  colors?: [string, string];
}

export default function TripBadge({
  tripName,
  variant = 'linked',
  colors = ['#43cea2', '#185a9d'],
}: TripBadgeProps) {
  const displayText =
    variant === 'linked'
      ? tripName
        ? `Linked to ${tripName}`
        : 'Linked to Trip'
      : tripName || 'Trip';

  return (
    <View style={styles.container}>
      <LinearGradient colors={colors} style={styles.badge}>
        <FontAwesome name="suitcase" size={16} color="#fff" />
        <Text style={styles.badgeText}>{displayText}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
