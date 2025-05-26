import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Finances() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finances Screen Placeholder</Text>
      <Text style={styles.subtitle}>This will contain budgets, expenses, and reports</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#057B8C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
