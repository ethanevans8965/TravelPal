import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCachedExchangeRates } from '../utils/currency';
import { useAppTheme } from '../../src/theme/ThemeContext';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'NZD', 'INR']; // Expanded for better testing

export default function CurrencyConverter() {
  const theme = useAppTheme();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'from' | 'to' | null>(null);
  const [searchText, setSearchText] = useState('');
  const [amount, setAmount] = useState('');
  const [converted, setConverted] = useState('');
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    console.log('Starting to fetch rates...');
    getCachedExchangeRates('USD')
      .then((fetchedRates) => {
        console.log('Fetched rates:', fetchedRates);
        setRates(fetchedRates);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error fetching rates:', err);
        setError('Failed to load exchange rates.');
        setLoading(false);
      });
  }, []);

  const isAmountValid = amount.trim() !== '' && !isNaN(Number(amount));

  const handleConvert = () => {
    console.log('Convert pressed');
    console.log('Rates object:', rates);
    console.log('From currency:', fromCurrency, 'To currency:', toCurrency);
    if (!rates) return;
    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      setConverted('');
      return;
    }
    try {
      if (fromCurrency === toCurrency) {
        setConverted(amount);
        return;
      }
      console.log('Rate for', fromCurrency, ':', rates[fromCurrency]);
      console.log('Rate for', toCurrency, ':', rates[toCurrency]);
      if (!rates[fromCurrency] || !rates[toCurrency]) throw new Error('Currency not supported');
      let result = 0;
      if (fromCurrency === 'USD') {
        result = amt * rates[toCurrency];
        console.log('USD to', toCurrency, ':', amt, '*', rates[toCurrency], '=', result);
      } else if (toCurrency === 'USD') {
        result = amt / rates[fromCurrency];
        console.log(fromCurrency, 'to USD:', amt, '/', rates[fromCurrency], '=', result);
      } else {
        result = (amt / rates[fromCurrency]) * rates[toCurrency];
        console.log(
          fromCurrency,
          'to',
          toCurrency,
          ':',
          amt,
          '/',
          rates[fromCurrency],
          '*',
          rates[toCurrency],
          '=',
          result
        );
      }
      console.log('Final result:', result);
      setConverted(result.toFixed(2));
    } catch (e: any) {
      console.log('Conversion error:', e.message);
      Alert.alert('Error', e.message || 'Conversion error');
      setConverted('');
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConverted('');
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: theme.spacing.sm + theme.spacing.xs, color: theme.colors.text, fontFamily: theme.typography.primaryFont }}>Loading exchange rates...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={{ color: theme.colors.error, fontWeight: theme.typography.fontWeights.bold, fontFamily: theme.typography.primaryFont }}>{error}</Text>
      </View>
    );
  }

  const openModal = (type: 'from' | 'to') => {
    setSelectingFor(type);
    setModalVisible(true);
    setSearchText('');
  };

  const handleSelectCurrency = (currency: string) => {
    if (selectingFor === 'from') {
      setFromCurrency(currency);
    } else if (selectingFor === 'to') {
      setToCurrency(currency);
    }
    setConverted('');
    setModalVisible(false);
  };

  const filteredCurrencies = searchText.length > 0
    ? CURRENCIES.filter(c => c.toLowerCase().includes(searchText.toLowerCase()))
    : CURRENCIES;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Currency Converter</Text>
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>From</Text>
          <TouchableOpacity style={styles.picker} onPress={() => openModal('from')}>
            <Text style={styles.pickerText}>{fromCurrency}</Text>
            <Ionicons name="chevron-down-outline" size={theme.typography.fontSizes.medium} color={theme.colors.textSecondary} style={styles.pickerIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>To</Text>
          <TouchableOpacity style={styles.picker} onPress={() => openModal('to')}>
            <Text style={styles.pickerText}>{toCurrency}</Text>
            <Ionicons name="chevron-down-outline" size={theme.typography.fontSizes.medium} color={theme.colors.textSecondary} style={styles.pickerIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.convertButton, !isAmountValid && { opacity: 0.5 }]}
        onPress={handleConvert}
        disabled={!isAmountValid}
      >
        <Text style={styles.convertButtonText}>Convert</Text>
      </TouchableOpacity>
      {converted !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {amount} {fromCurrency} = {converted} {toCurrency}
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={theme.typography.fontSizes.xl} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={theme.typography.fontSizes.large} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search currency..."
                placeholderTextColor={theme.colors.textTertiary}
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="characters"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle-outline" size={theme.typography.fontSizes.large} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = (selectingFor === 'from' && item === fromCurrency) || (selectingFor === 'to' && item === toCurrency);
                return (
                  <TouchableOpacity
                    style={[styles.currencyItem, isSelected && styles.selectedCurrencyItem]}
                    onPress={() => handleSelectCurrency(item)}
                  >
                    <Text style={[styles.currencyName, isSelected && styles.selectedCurrencyName]}>{item}</Text>
                    {isSelected && <Ionicons name="checkmark-outline" size={theme.typography.fontSizes.large} color={theme.colors.primary} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borders.radiusLarge,
    padding: theme.spacing.large,
    marginVertical: theme.spacing.large,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: theme.spacing.xxs }, // 2
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: theme.typography.fontWeights.bold,
    fontFamily: theme.typography.primaryFont,
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  pickerContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: theme.typography.fontSizes.small,
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  picker: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radiusMedium,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minWidth: 100, // Increased minWidth to accommodate icon
    alignItems: 'center',
    flexDirection: 'row', // For text and icon
    justifyContent: 'space-between', // For text and icon
  },
  pickerIcon: {
    marginLeft: theme.spacing.xs,
  },
  pickerText: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: theme.typography.fontWeights.semibold,
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  swapButton: {
    marginHorizontal: theme.spacing.sm + theme.spacing.xs, // 12
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.radiusLarge * 1.25, // 20
    width: 40, // Keep size for now
    height: 40, // Keep size for now
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: theme.spacing.xxs }, // 2
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  swapText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.large + 2, // 22
    fontWeight: theme.typography.fontWeights.bold,
    fontFamily: theme.typography.primaryFont, // Or secondary if numbers
  },
  input: {
    width: '100%',
    borderWidth: theme.borders.borderWidthSmall,
    borderColor: theme.colors.border,
    borderRadius: theme.borders.radiusMedium,
    padding: theme.spacing.sm + theme.spacing.xs, // 12
    fontSize: theme.typography.fontSizes.medium,
    fontFamily: theme.typography.secondaryFont, // Changed for numerical input
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
  },
  convertButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borders.radiusMedium,
    paddingVertical: theme.spacing.sm + theme.spacing.xs, // 12
    paddingHorizontal: theme.spacing.xl, // 32
    marginBottom: theme.spacing.sm + theme.spacing.xs, // 12
  },
  convertButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: theme.typography.fontWeights.semibold,
    fontFamily: theme.typography.primaryFont,
  },
  resultBox: {
    marginTop: theme.spacing.sm, // 10 -> 8, close enough
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radiusMedium,
    padding: theme.spacing.sm + theme.spacing.xs, // 12
  },
  resultText: {
    fontSize: theme.typography.fontSizes.medium,
    fontWeight: theme.typography.fontWeights.semibold,
    fontFamily: theme.typography.secondaryFont, // Changed for numerical output
    color: theme.colors.primary,
  },
  // Modal Styles (adapted from CountryPicker)
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.black + '80', 
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borders.radiusLarge,
    borderTopRightRadius: theme.borders.radiusLarge,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xl, 
    maxHeight: '70%', // Adjusted height
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: theme.typography.fontWeights.semibold,
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borders.radiusMedium,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.medium,
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: theme.borders.borderWidthSmall,
    borderBottomColor: theme.colors.separator,
  },
  selectedCurrencyItem: {
    backgroundColor: theme.colors.primary + '1A', // Primary color with low opacity
  },
  currencyName: {
    fontSize: theme.typography.fontSizes.medium,
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  selectedCurrencyName: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
});
