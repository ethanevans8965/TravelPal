import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppContext } from './context';
import { Stack } from 'expo-router';

export default function TripsScreen() {
  const { trips } = useAppContext();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'My Trips',
          headerStyle: {
            backgroundColor: '#057B8C',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      
      <Text style={styles.header}>My Trips</Text>
      {trips.length === 0 ? (
        <Text style={styles.emptyState}>
          No trips yet. Use the + button to add a new trip.
        </Text>
      ) : (
        <Text>You have {trips.length} trips.</Text>
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