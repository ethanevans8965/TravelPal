import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Leg } from '../types';
import LegChip from './LegChip';

interface LegTimelineProps {
  legs: Leg[];
  selectedLegId?: string;
  onLegSelect?: (legId: string) => void;
  onAddLeg?: () => void;
  showsHorizontalScrollIndicator?: boolean;
}

export default function LegTimeline({
  legs,
  selectedLegId,
  onLegSelect,
  onAddLeg,
  showsHorizontalScrollIndicator = false,
}: LegTimelineProps) {
  const handleLegPress = (legId: string) => {
    if (onLegSelect) {
      onLegSelect(legId);
    }
  };

  // Sort legs by start date for chronological display
  const sortedLegs = [...legs].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {sortedLegs.map((leg, index) => (
          <LegChip
            key={leg.id}
            leg={leg}
            isSelected={selectedLegId === leg.id}
            onPress={onLegSelect ? () => handleLegPress(leg.id) : undefined}
          />
        ))}

        {/* Add Leg Button */}
        {onAddLeg && (
          <TouchableOpacity style={styles.addButton} onPress={onAddLeg} activeOpacity={0.7}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 28,
  },
});
