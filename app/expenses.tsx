import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from './context';
import { Stack } from 'expo-router';

export default function ExpensesScreen() {
  const { expenses, trips } = useAppContext();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Expense Tracking',
          headerStyle: {
            backgroundColor: '#057B8C',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      
      <Text style={styles.header}>Expense Tracking</Text>
      {trips.length === 0 ? (
        <Text style={styles.emptyState}>
          Create a trip first to start tracking expenses.
        </Text>
      ) : expenses.length === 0 ? (
        <Text style={styles.emptyState}>
          No expenses yet. Use the + button to add an expense.
        </Text>
      ) : (
        <Text>You have {expenses.length} expenses recorded.</Text>
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