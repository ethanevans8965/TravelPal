import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from './context';
import { Stack } from 'expo-router';

export default function BudgetScreen() {
  const { trips } = useAppContext();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Budget Planning',
          headerStyle: {
            backgroundColor: '#057B8C',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      
      <Text style={styles.header}>Budget Planning</Text>
      {trips.length === 0 ? (
        <Text style={styles.emptyState}>
          Create a trip first to start budget planning.
        </Text>
      ) : (
        <Text style={styles.emptyState}>
          Select a trip to view or create its budget plan.
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