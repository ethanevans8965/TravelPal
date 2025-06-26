import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { TripBudget } from '../types';
import { useTripStore } from '../stores/tripStore';
import { getSuggestedBudget, convertBudgetStyle } from '../utils/budgetSuggestions';

const { width, height } = Dimensions.get('window');

interface BudgetSetupModalProps {
  visible: boolean;
  onClose: () => void;
  tripId: string;
  onBudgetSet?: (budget: TripBudget) => void;
}

type TravelStyle = 'frugal' | 'balanced' | 'luxury';
type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD';

const currencies: { code: Currency; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

const travelStyles: { key: TravelStyle; label: string; description: string; icon: string }[] = [
  {
    key: 'frugal',
    label: 'Frugal',
    description: 'Budget-conscious travel with hostels and local food',
    icon: 'wallet-outline',
  },
  {
    key: 'balanced',
    label: 'Balanced',
    description: 'Mix of comfort and value with mid-range options',
    icon: 'scale-outline',
  },
  {
    key: 'luxury',
    label: 'Luxury',
    description: 'Premium experiences with top-tier accommodations',
    icon: 'diamond-outline',
  },
];

export const BudgetSetupModal: React.FC<BudgetSetupModalProps> = ({
  visible,
  onClose,
  tripId,
  onBudgetSet,
}) => {
  const { getTripById, getLegsByTrip, setBudget, generateBudgetSuggestion } = useTripStore();

  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>('balanced');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [suggestedBudget, setSuggestedBudget] = useState<TripBudget | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate budget suggestion when modal opens or style/currency changes
  useEffect(() => {
    if (visible && tripId) {
      const suggestion = generateBudgetSuggestion(tripId, selectedStyle, selectedCurrency);
      setSuggestedBudget(suggestion);
    }
  }, [visible, tripId, selectedStyle, selectedCurrency, generateBudgetSuggestion]);

  const handleStyleChange = (style: TravelStyle) => {
    setSelectedStyle(style);

    // Convert existing budget to new style if available
    if (suggestedBudget) {
      const convertedBudget = convertBudgetStyle(suggestedBudget, style);
      setSuggestedBudget({ ...convertedBudget, currency: selectedCurrency });
    }
  };

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);

    // Update currency in existing budget
    if (suggestedBudget) {
      setSuggestedBudget({ ...suggestedBudget, currency });
    }
  };

  const handleAcceptBudget = async () => {
    if (!suggestedBudget) {
      Alert.alert('Error', 'No budget suggestion available');
      return;
    }

    setIsLoading(true);
    try {
      // Save budget to trip
      setBudget(tripId, suggestedBudget);

      // Notify parent component
      onBudgetSet?.(suggestedBudget);

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error setting budget:', error);
      Alert.alert('Error', 'Failed to set budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const formatCurrency = (amount: number, currencyCode: Currency) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    const symbol = currency?.symbol || '$';

    if (currencyCode === 'JPY') {
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  const trip = getTripById(tripId);
  const legs = getLegsByTrip(tripId);

  if (!trip) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <BlurView intensity={100} style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.gradient}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Setup Budget</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Trip Info */}
            <View style={styles.tripInfoCard}>
              <Text style={styles.tripName}>{trip.name}</Text>
              <Text style={styles.tripDetails}>
                {legs.length > 0
                  ? `${legs.length} destination${legs.length > 1 ? 's' : ''}`
                  : 'New trip'}
              </Text>
            </View>

            {/* Travel Style Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Travel Style</Text>
              <View style={styles.styleContainer}>
                {travelStyles.map((style) => (
                  <TouchableOpacity
                    key={style.key}
                    style={[
                      styles.styleCard,
                      selectedStyle === style.key && styles.styleCardSelected,
                    ]}
                    onPress={() => handleStyleChange(style.key)}
                  >
                    <View style={styles.styleIcon}>
                      <Ionicons
                        name={style.icon as any}
                        size={24}
                        color={selectedStyle === style.key ? '#007AFF' : '#CCCCCC'}
                      />
                    </View>
                    <Text
                      style={[
                        styles.styleLabel,
                        selectedStyle === style.key && styles.styleLabelSelected,
                      ]}
                    >
                      {style.label}
                    </Text>
                    <Text style={styles.styleDescription}>{style.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Currency Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Currency</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.currencyScroll}
              >
                {currencies.map((currency) => (
                  <TouchableOpacity
                    key={currency.code}
                    style={[
                      styles.currencyCard,
                      selectedCurrency === currency.code && styles.currencyCardSelected,
                    ]}
                    onPress={() => handleCurrencyChange(currency.code)}
                  >
                    <Text
                      style={[
                        styles.currencySymbol,
                        selectedCurrency === currency.code && styles.currencySymbolSelected,
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                    <Text
                      style={[
                        styles.currencyCode,
                        selectedCurrency === currency.code && styles.currencyCodeSelected,
                      ]}
                    >
                      {currency.code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Budget Preview */}
            {suggestedBudget && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Suggested Budget</Text>
                <LinearGradient colors={['#007AFF', '#5856D6']} style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetTotal}>
                      {formatCurrency(suggestedBudget.total, selectedCurrency)}
                    </Text>
                    <Text style={styles.budgetSubtitle}>Total Trip Budget</Text>
                  </View>

                  <View style={styles.budgetBreakdown}>
                    <View style={styles.budgetRow}>
                      <Text style={styles.budgetLabel}>Per Day</Text>
                      <Text style={styles.budgetValue}>
                        {formatCurrency(suggestedBudget.perDay, selectedCurrency)}
                      </Text>
                    </View>

                    <View style={styles.budgetCategories}>
                      {Object.entries(suggestedBudget.categories).map(([category, amount]) => (
                        <View key={category} style={styles.categoryRow}>
                          <Text style={styles.categoryLabel}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </Text>
                          <Text style={styles.categoryAmount}>
                            {formatCurrency(amount, selectedCurrency)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </LinearGradient>

                <Text style={styles.budgetNote}>
                  Based on {legs.length > 0 ? 'your destinations and' : ''} travel style. You can
                  customize this later.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.acceptButton, isLoading && styles.acceptButtonDisabled]}
              onPress={handleAcceptBudget}
              disabled={isLoading || !suggestedBudget}
            >
              <LinearGradient colors={['#007AFF', '#5856D6']} style={styles.acceptButtonGradient}>
                <Text style={styles.acceptButtonText}>
                  {isLoading ? 'Setting up...' : 'Accept Budget'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tripInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tripDetails: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  styleContainer: {
    gap: 12,
  },
  styleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  styleCardSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  styleIcon: {
    marginBottom: 8,
  },
  styleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  styleLabelSelected: {
    color: '#007AFF',
  },
  styleDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  currencyScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  currencyCard: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currencyCardSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 4,
  },
  currencySymbolSelected: {
    color: '#007AFF',
  },
  currencyCode: {
    fontSize: 12,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  currencyCodeSelected: {
    color: '#007AFF',
  },
  budgetCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  budgetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetTotal: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  budgetSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  budgetBreakdown: {
    gap: 16,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  budgetLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  budgetValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  budgetCategories: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  budgetNote: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  acceptButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
