import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function SelectMethodScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'total' | 'daily' | null>(null);

  const navigateToBasicInfo = () => {
    if (selectedMethod) {
      // Store method in URL params
      router.push({
        pathname: '/trip/basic-info',
        params: { method: selectedMethod }
      } as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How would you like to budget?</Text>
      <Text style={styles.subtitle}>Select the method that works best for you</Text>

      <TouchableOpacity 
        style={[
          styles.methodCard, 
          selectedMethod === 'total' && styles.selectedCard
        ]}
        onPress={() => setSelectedMethod('total')}
      >
        <View style={styles.methodIcon}>
          <FontAwesome name="money" size={24} color="#FF6B6B" />
        </View>
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>I know my total budget</Text>
          <Text style={styles.methodDescription}>
            Best if you have a fixed amount to spend on your trip
          </Text>
        </View>
        {selectedMethod === 'total' && (
          <FontAwesome name="check-circle" size={24} color="#FF6B6B" />
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.methodCard, 
          selectedMethod === 'daily' && styles.selectedCard
        ]}
        onPress={() => setSelectedMethod('daily')}
      >
        <View style={styles.methodIcon}>
          <FontAwesome name="calendar" size={24} color="#4A90E2" />
        </View>
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>I know my travel duration</Text>
          <Text style={styles.methodDescription}>
            Best if you want to plan based on your preferred trip length
          </Text>
        </View>
        {selectedMethod === 'daily' && (
          <FontAwesome name="check-circle" size={24} color="#4A90E2" />
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedMethod && styles.disabledButton
          ]}
          onPress={navigateToBasicInfo}
          disabled={!selectedMethod}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666666',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
}); 