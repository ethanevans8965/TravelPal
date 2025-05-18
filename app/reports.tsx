import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from './context';
import { Stack } from 'expo-router';

export default function ReportsScreen() {
  const { trips, expenses } = useAppContext();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Reports & Analysis',
          headerStyle: {
            backgroundColor: '#057B8C',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      
      <Text style={styles.header}>Reports & Analysis</Text>
      {trips.length === 0 ? (
        <Text style={styles.emptyState}>
          Create a trip first to access reports.
        </Text>
      ) : expenses.length === 0 ? (
        <Text style={styles.emptyState}>
          Add expenses to generate reports and analysis.
        </Text>
      ) : (
        <Text style={styles.emptyState}>
          Reports and visualizations will appear here.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#057B8C',
  },
  emptyState: {
    textAlign: 'center',
    marginTop: 100,
    color: '#ABABAB',
    fontSize: 16,
  },
}); 