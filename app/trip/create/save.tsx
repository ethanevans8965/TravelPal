import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function SaveTripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleSaveTrip = () => {
    // TODO: Save trip to store
    console.log('Saving trip with params:', params);

    // Navigate back to trips list or dashboard
    router.push('/trips');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Save Your Trip</Text>
          <Text style={styles.subtitle}>Ready to save your trip details?</Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>
            Trip save functionality will be implemented here
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTrip}>
          <Text style={styles.saveButtonText}>Save Trip</Text>
          <FontAwesome name="check" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    lineHeight: 22,
  },
  placeholderCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 15,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 16,
    padding: 18,
    marginTop: 'auto',
    shadowColor: '#057B8C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
});
