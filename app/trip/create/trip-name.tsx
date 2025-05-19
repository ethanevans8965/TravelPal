import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TripNameScreen() {
  const router = useRouter();
  const [tripName, setTripName] = useState('');

  const handleNext = () => {
    if (!tripName.trim()) return;

    router.push({
      pathname: '/trip/create/country',
      params: {
        tripName: tripName.trim(),
      },
    } as any);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Name Your Trip</Text>
        <Text style={styles.subtitle}>Give your adventure a memorable name</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trip Name</Text>
            <TextInput
              style={styles.input}
              value={tripName}
              onChangeText={setTripName}
              placeholder="e.g., Summer in Paris, Japan Adventure"
              placeholderTextColor="#999999"
              autoFocus
              maxLength={50}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.nextButton,
              !tripName.trim() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!tripName.trim()}
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