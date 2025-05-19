import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function SelectMethodScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'totalAndLength' | 'budgetOnly' | 'lengthOnly' | 'noBudget' | null>(null);

  const navigateToNextStep = () => {
    if (!selectedMethod) return;

    switch (selectedMethod) {
      case 'noBudget':
        router.push({
          pathname: '/trip/create/no-budget/name',
        } as any);
        break;
      // Other cases will be implemented later
      default:
        console.log('Selected method:', selectedMethod);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How would you like to plan your trip?</Text>
      <Text style={styles.subtitle}>Choose the method that works best for you</Text>

      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedMethod === 'totalAndLength' && styles.optionSelected,
          ]}
          onPress={() => setSelectedMethod('totalAndLength')}
        >
          <FontAwesome name="calculator" size={24} color={selectedMethod === 'totalAndLength' ? '#FFFFFF' : '#057B8C'} />
          <Text style={[styles.optionText, selectedMethod === 'totalAndLength' && styles.optionTextSelected]}>
            I know my total budget and trip length
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedMethod === 'budgetOnly' && styles.optionSelected,
          ]}
          onPress={() => setSelectedMethod('budgetOnly')}
        >
          <FontAwesome name="money" size={24} color={selectedMethod === 'budgetOnly' ? '#FFFFFF' : '#057B8C'} />
          <Text style={[styles.optionText, selectedMethod === 'budgetOnly' && styles.optionTextSelected]}>
            I know my total budget but not trip length
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedMethod === 'lengthOnly' && styles.optionSelected,
          ]}
          onPress={() => setSelectedMethod('lengthOnly')}
        >
          <FontAwesome name="calendar" size={24} color={selectedMethod === 'lengthOnly' ? '#FFFFFF' : '#057B8C'} />
          <Text style={[styles.optionText, selectedMethod === 'lengthOnly' && styles.optionTextSelected]}>
            I know my trip length but not budget
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedMethod === 'noBudget' && styles.optionSelected,
          ]}
          onPress={() => setSelectedMethod('noBudget')}
        >
          <FontAwesome name="plane" size={24} color={selectedMethod === 'noBudget' ? '#FFFFFF' : '#057B8C'} />
          <Text style={[styles.optionText, selectedMethod === 'noBudget' && styles.optionTextSelected]}>
            I don't want to set a budget
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedMethod && styles.nextButtonDisabled,
        ]}
        onPress={navigateToNextStep}
        disabled={!selectedMethod}
      >
        <Text style={styles.nextButtonText}>Continue</Text>
        <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    backgroundColor: '#057B8C',
    borderColor: '#057B8C',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
  optionTextSelected: {
    color: '#FFFFFF',
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