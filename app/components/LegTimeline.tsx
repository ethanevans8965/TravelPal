import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Leg } from '../types';
import LegChip from './LegChip';

interface LegTimelineProps {
  legs: Leg[];
  selectedLegId?: string;
  onLegSelect?: (legId: string) => void;
  showsHorizontalScrollIndicator?: boolean;
}

export default function LegTimeline({
  legs,
  selectedLegId,
  onLegSelect,
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
  },
});
