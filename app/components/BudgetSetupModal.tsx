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

const styleOptions = [
  {
    key: 'frugal' as TravelStyle,
    icon: 'wallet-outline',
    title: 'Frugal',
    description: 'Budget-conscious travel with hostels and local food',
  },
  {
    key: 'balanced' as TravelStyle,
    icon: 'business-outline',
    title: 'Balanced',
    description: 'Mix of comfort and value with mid-range options',
  },
  {
    key: 'luxury' as TravelStyle,
    icon: 'diamond-outline',
    title: 'Luxury',
    description: 'Premium experiences with top-tier accommodations',
  },
];

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: '$' },
  { code: 'CAD', symbol: '$' },
];

export const BudgetSetupModal: React.FC<BudgetSetupModalProps> = ({
  visible,
  onClose,
  tripId,
  onBudgetSet,
}) => {
  const { getTripById, getLegsByTrip, setBudget } = useTripStore();
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>('balanced');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [suggestedBudget, setSuggestedBudget] = useState<TripBudget | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trip = getTripById(tripId);
  const tripLegs = getLegsByTrip(tripId);

  useEffect(() => {
    if (visible && trip) {
      generateSuggestion();
    }
  }, [visible, selectedStyle, selectedCurrency, trip]);

  const generateSuggestion = async () => {
    if (!trip) return;

    setIsLoading(true);
    try {
      const suggestion = getSuggestedBudget(tripLegs, selectedStyle, selectedCurrency);
      setSuggestedBudget(suggestion);
    } catch (error) {
      console.error('Error generating budget suggestion:', error);
      Alert.alert('Error', 'Failed to generate budget suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!suggestedBudget) return;

    setIsLoading(true);
    try {
      setBudget(tripId, suggestedBudget);
      onBudgetSet?.(suggestedBudget);
      Alert.alert('Success', 'Budget has been set for your trip!');
      onClose();
    } catch (error) {
      console.error('Error setting budget:', error);
      Alert.alert('Error', 'Failed to set budget. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDestinationCount = () => {
    if (tripLegs.length > 0) {
      const uniqueCountries = new Set(tripLegs.map((leg) => leg.country));
      return uniqueCountries.size;
    }
    return trip?.destination ? 1 : 0;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Setup Budget</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Trip Info */}
          <View style={styles.tripInfoCard}>
            <Text style={styles.tripName}>{trip?.name || 'Trip'}</Text>
            <Text style={styles.tripDetails}>
              {getDestinationCount()} destination{getDestinationCount() !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Travel Style */}
          <Text style={styles.sectionTitle}>Travel Style</Text>
          <View style={styles.styleContainer}>
            {styleOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.styleCard, selectedStyle === option.key && styles.styleCardSelected]}
                onPress={() => setSelectedStyle(option.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={selectedStyle === option.key ? '#3B82F6' : 'rgba(255,255,255,0.6)'}
                />
                <Text
                  style={[
                    styles.styleTitle,
                    selectedStyle === option.key && styles.styleTitleSelected,
                  ]}
                >
                  {option.title}
                </Text>
                <Text style={styles.styleDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Currency */}
          <Text style={styles.sectionTitle}>Currency</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.currencyScroll}
          >
            <View style={styles.currencyContainer}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyCard,
                    selectedCurrency === currency.code && styles.currencyCardSelected,
                  ]}
                  onPress={() => setSelectedCurrency(currency.code)}
                  activeOpacity={0.7}
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
            </View>
          </ScrollView>

          {/* Suggested Budget */}
          {suggestedBudget && (
            <>
              <Text style={styles.sectionTitle}>Suggested Budget</Text>
              <View style={styles.budgetCard}>
                <Text style={styles.budgetTotal}>
                  {currencies.find((c) => c.code === selectedCurrency)?.symbol}
                  {suggestedBudget.total.toLocaleString()}
                </Text>
                <Text style={styles.budgetSubtitle}>Total Trip Budget</Text>

                <View style={styles.budgetBreakdown}>
                  <View style={styles.budgetRow}>
                    <Text style={styles.budgetLabel}>Per Day</Text>
                    <Text style={styles.budgetValue}>
                      {currencies.find((c) => c.code === selectedCurrency)?.symbol}
                      {suggestedBudget.perDay.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.separator} />

                  <View style={styles.budgetRow}>
                    <Text style={styles.budgetLabel}>Accommodation</Text>
                    <Text style={styles.budgetValue}>
                      {currencies.find((c) => c.code === selectedCurrency)?.symbol}
                      {suggestedBudget.categories.accommodation.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.budgetRow}>
                    <Text style={styles.budgetLabel}>Food</Text>
                    <Text style={styles.budgetValue}>
                      {currencies.find((c) => c.code === selectedCurrency)?.symbol}
                      {suggestedBudget.categories.food.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.budgetRow}>
                    <Text style={styles.budgetLabel}>Transport</Text>
                    <Text style={styles.budgetValue}>
                      {currencies.find((c) => c.code === selectedCurrency)?.symbol}
                      {suggestedBudget.categories.transport.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.budgetRow}>
                    <Text style={styles.budgetLabel}>Activities</Text>
                    <Text style={styles.budgetValue}>
                      {currencies.find((c) => c.code === selectedCurrency)?.symbol}
                      {suggestedBudget.categories.activities.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.budgetRow}>
                    <Text style={styles.budgetLabel}>Misc</Text>
                    <Text style={styles.budgetValue}>
                      {currencies.find((c) => c.code === selectedCurrency)?.symbol}
                      {suggestedBudget.categories.misc.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.disclaimerText}>
                Based on your destinations and travel style. You can customize this later.
              </Text>
            </>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.acceptButton, isLoading && styles.acceptButtonDisabled]}
            onPress={handleAccept}
            disabled={isLoading || !suggestedBudget}
            activeOpacity={0.7}
          >
            <Text style={styles.acceptButtonText}>
              {isLoading ? 'Setting...' : 'Accept Budget'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(38,38,38,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Trip Info
  tripInfoCard: {
    backgroundColor: 'rgba(38,38,38,0.7)',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  tripDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  // Style Selection
  styleContainer: {
    marginBottom: 24,
  },
  styleCard: {
    backgroundColor: 'rgba(38,38,38,0.7)',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  styleCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  styleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  styleTitleSelected: {
    color: '#3B82F6',
  },
  styleDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },

  // Currency Selection
  currencyScroll: {
    marginBottom: 24,
  },
  currencyContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  currencyCard: {
    backgroundColor: 'rgba(38,38,38,0.7)',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    padding: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  currencyCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  currencySymbolSelected: {
    color: '#3B82F6',
  },
  currencyCode: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  currencyCodeSelected: {
    color: '#3B82F6',
  },

  // Budget Display
  budgetCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  budgetTotal: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  budgetSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  budgetBreakdown: {
    gap: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },

  // Disclaimer
  disclaimerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },

  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'rgba(38,38,38,0.7)',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    opacity: 0.5,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
