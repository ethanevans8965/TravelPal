import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TripLengthScreen() {
  const router = useRouter();
  const { tripName, country, totalBudget } = useLocalSearchParams();
  const [tripLength, setTripLength] = useState('');

  const handleNext = () => {
    const lengthInDays = parseInt(tripLength, 10);
    if (isNaN(lengthInDays) || lengthInDays <= 0) return;

    router.push({
      pathname: '/trip/create/total-length/allocate-categories',
      params: {
        tripName,
        country,
        totalBudget,
        tripLength: lengthInDays,
      },
    } as any);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Trip Length</Text>
        <Text style={styles.subtitle}>How many days will your trip be?</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Days</Text>
            <TextInput
              style={styles.input}
              value={tripLength}
              onChangeText={setTripLength}
              placeholder="e.g., 7, 14"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[
              styles.nextButton,
              (parseInt(tripLength, 10) <= 0 || isNaN(parseInt(tripLength, 10))) && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={parseInt(tripLength, 10) <= 0 || isNaN(parseInt(tripLength, 10))}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F8F8',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 12,
    padding: 16,
    marginTop: 'auto',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 