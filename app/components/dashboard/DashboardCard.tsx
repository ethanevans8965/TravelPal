import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DashboardCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  padding?: number;
}

export default function DashboardCard({
  children,
  style,
  gradient = false,
  padding = 20,
}: DashboardCardProps) {
  return <View style={[styles.card, { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
});
