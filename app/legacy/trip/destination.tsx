import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function DestinationScreen() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');

  const handleNext = () => {
    if (!destination || !country) return;

    router.push({
      pathname: '/trip/dates',
      params: {
        destination,
        country,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Where are you going?</Text>
      <Text style={styles.subtitle}>Let's start with your destination</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City/Location</Text>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g., Paris, Tokyo, New York"
            placeholderTextColor="#999999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="e.g., France, Japan, USA"
            placeholderTextColor="#999999"
          />
        </View>

        <TouchableOpacity
          style={[styles.nextButton, (!destination || !country) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!destination || !country}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  nextButtonDisabled: {
    backgroundColor: '#FFB6B6',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
