import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { formatDateISO } from '../../utils/dateUtils';

// Stores
import { useExpenseStore } from '../../stores/expenseStore';
import { useAppContext } from '../../context';

// Reusable components
import ScreenHeader from '../../components/ScreenHeader';
import SelectorField from '../../components/SelectorField';
import ActionButton from '../../components/ActionButton';
import AmountInput from '../../components/AmountInput';
import TripBadge from '../../components/TripBadge';
import DateSelector from '../../components/DateSelector';

const categories = [
  { key: 'food', label: 'Food & Dining', icon: '🍽️' },
  { key: 'transport', label: 'Transportation', icon: '🚗' },
  { key: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { key: 'activities', label: 'Activities & Tours', icon: '🎯' },
  { key: 'shopping', label: 'Shopping', icon: '🛍️' },
  { key: 'health', label: 'Health & Medical', icon: '💊' },
  { key: 'communication', label: 'Communication', icon: '📱' },
  { key: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { key: 'other', label: 'Other', icon: '📋' },
];

const currencies = [
  { key: 'USD', code: 'USD', symbol: '$', name: 'US Dollar', label: 'US Dollar' },
  { key: 'EUR', code: 'EUR', symbol: '€', name: 'Euro', label: 'Euro' },
  { key: 'GBP', code: 'GBP', symbol: '£', name: 'British Pound', label: 'British Pound' },
  { key: 'JPY', code: 'JPY', symbol: '¥', name: 'Japanese Yen', label: 'Japanese Yen' },
  { key: 'CAD', code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', label: 'Canadian Dollar' },
  { key: 'AUD', code: 'AUD', symbol: 'A$', name: 'Australian Dollar', label: 'Australian Dollar' },
];

export default function ExpenseDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tripId = params.tripId as string;
  const isGeneral = params.general === 'true';

  // Zustand store
  const addExpense = useExpenseStore((state) => state.addExpense);

  // Context for trip data
  const { trips } = useAppContext();

  // Form state
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(currencies[0]);
  const [category, setCategory] = useState<(typeof categories)[0] | null>(null);
  const [date, setDate] = useState(formatDateISO(new Date()));
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Comprehensive validation
    const validationErrors: string[] = [];

    // Amount validation
    if (!amount.trim()) {
      validationErrors.push('Please enter an amount for this expense.');
    } else {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        validationErrors.push('Please enter a valid number for the amount.');
      } else if (parsedAmount <= 0) {
        validationErrors.push('Amount must be greater than zero.');
      } else if (parsedAmount > 999999) {
        validationErrors.push('Please enter a reasonable amount (less than 1,000,000).');
      }
    }

    // Category validation
    if (!category) {
      validationErrors.push('Please select a category for this expense.');
    }

    // Trip validation
    if (!isGeneral && tripId) {
      const trip = trips.find((t) => t.id === tripId);
      if (!trip) {
        validationErrors.push(
          'The selected trip no longer exists. Please select a different trip or record as a general expense.'
        );
      }
    }

    // Date validation
    const expenseDate = new Date(date);
    const today = new Date();
    const maxPastDate = new Date();
    maxPastDate.setFullYear(today.getFullYear() - 5);

    if (expenseDate > today) {
      validationErrors.push('Expense date cannot be in the future.');
    } else if (expenseDate < maxPastDate) {
      validationErrors.push('Expense date cannot be more than 5 years ago.');
    }

    // Description validation
    if (description.length > 500) {
      validationErrors.push('Description must be less than 500 characters.');
    }

    // Tags validation
    const processedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (processedTags.length > 10) {
      validationErrors.push('Please use no more than 10 tags.');
    }

    const invalidTag = processedTags.find((tag) => tag.length > 50);
    if (invalidTag) {
      validationErrors.push(
        `Tag "${invalidTag}" is too long. Tags must be less than 50 characters.`
      );
    }

    // Show all validation errors if any exist
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', validationErrors.join('\n\n'), [{ text: 'OK' }]);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare expense data
      const expenseData = {
        amount: parseFloat(amount),
        currency: currency.code,
        category: category?.key || 'other',
        date,
        description: description.trim(),
        tags: processedTags,
        tripId: isGeneral ? undefined : tripId,
      };

      // Save to store
      const savedExpense = addExpense(expenseData);

      // Navigate to success screen with expense data
      const tripName = !isGeneral && tripId ? trips.find((t) => t.id === tripId)?.name : '';

      router.push({
        pathname: '/expenses/add/success',
        params: {
          amount: amount,
          currency: currency.code,
          category: category?.key || 'other',
          description: description.trim(),
          tripName: tripName || '',
          isGeneral: isGeneral.toString(),
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to save expense. Please check your connection and try again.';

      router.push({
        pathname: '/expenses/add/error',
        params: {
          errorMessage,
          amount: amount,
          category: category?.key || '',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencySelect = (selectedCurrency: any) => {
    setCurrency(selectedCurrency);
    setShowCurrencyPicker(false);
  };

  const handleCategorySelect = (selectedCategory: any) => {
    setCategory(selectedCategory);
    setShowCategoryPicker(false);
  };

  const handlePhotoPress = () => {
    // TODO: Implement photo capture
    console.log('Photo/Receipt pressed');
  };

  const handleLocationPress = () => {
    // TODO: Implement location picker
    console.log('Location pressed');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Expense" onClose={() => router.back()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Trip Context */}
        {!isGeneral && tripId && <TripBadge />}

        {/* Amount Field */}
        <AmountInput
          label="Amount"
          amount={amount}
          currency={currency}
          onAmountChange={setAmount}
          autoFocus
        />

        {/* Currency Selector */}
        <SelectorField
          label="Currency"
          value={currency}
          placeholder="Select currency"
          options={currencies}
          isOpen={showCurrencyPicker}
          onToggle={() => setShowCurrencyPicker(!showCurrencyPicker)}
          onSelect={handleCurrencySelect}
          renderValue={(curr) => `${curr.symbol} ${curr.code} - ${curr.name}`}
          renderOption={(curr) => `${curr.symbol} ${curr.code} - ${curr.name}`}
        />

        {/* Category Selector */}
        <SelectorField
          label="Category"
          value={category}
          placeholder="Select category"
          options={categories}
          isOpen={showCategoryPicker}
          onToggle={() => setShowCategoryPicker(!showCategoryPicker)}
          onSelect={handleCategorySelect}
          renderValue={(cat) => `${cat.icon} ${cat.label}`}
          renderOption={(cat) => `${cat.icon} ${cat.label}`}
        />

        {/* Date Field */}
        <DateSelector label="Date" value={date} onChange={setDate} />

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you spend on?"
            placeholderTextColor="#C7C7CC"
            multiline
          />
        </View>

        {/* Action Buttons */}
        <ActionButton icon="camera" title="Add Photo/Receipt" onPress={handlePhotoPress} />

        <ActionButton icon="map-marker" title="Add Location" onPress={handleLocationPress} />

        {/* Tags Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Tags</Text>
          <TextInput
            style={styles.textInput}
            value={tags}
            onChangeText={setTags}
            placeholder="Enter tags separated by commas"
            placeholderTextColor="#C7C7CC"
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.saveButtonGradient}>
            <Text style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save Expense'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A2A36',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minHeight: 50,
  },
  bottomSpacer: {
    height: 100,
  },
  saveButtonContainer: {
    padding: 20,
    backgroundColor: 'rgba(246,248,251,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});
