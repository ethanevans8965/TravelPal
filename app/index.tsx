import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import CurrencyConverter from './components/CurrencyConverter';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome to TravelPal</Text>
      <CurrencyConverter />
      {/* Add more dashboard widgets here if desired */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#057B8C',
    marginBottom: 8,
  },
});
