import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import CurrencyConverter from './components/CurrencyConverter';
import { useAppTheme } from '../src/theme/ThemeContext'; // Adjusted path

export default function Index() {
  const theme = useAppTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.gray[50] }]}>
      <Text style={[styles.header, { color: theme.colors.primary, fontFamily: theme.typography.primaryFont }]}>Welcome to TravelPal</Text>
      <CurrencyConverter />
      {/* Add more dashboard widgets here if desired */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: theme.spacing.lg, // 24
    // backgroundColor is applied inline
  },
  header: {
    fontSize: theme.typography.fontSizes.xxl, // 28
    fontWeight: theme.typography.fontWeights.bold,
    marginTop: theme.spacing.lg, // 24
    // color & fontFamily are applied inline
    marginBottom: theme.spacing.sm, // 8
  },
});
