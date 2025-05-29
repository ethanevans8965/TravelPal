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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { getCachedExchangeRates } from '../utils/currency';

// Common currencies to show at the top
const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'KRW'];

// Currency names for better search experience
const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  KRW: 'South Korean Won',
  BRL: 'Brazilian Real',
  MXN: 'Mexican Peso',
  RUB: 'Russian Ruble',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NOK: 'Norwegian Krone',
  SEK: 'Swedish Krona',
  DKK: 'Danish Krone',
  PLN: 'Polish Zloty',
  CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint',
  RON: 'Romanian Leu',
  BGN: 'Bulgarian Lev',
  HRK: 'Croatian Kuna',
  TRY: 'Turkish Lira',
  ILS: 'Israeli Shekel',
  AED: 'UAE Dirham',
  SAR: 'Saudi Riyal',
  QAR: 'Qatari Riyal',
  KWD: 'Kuwaiti Dinar',
  BHD: 'Bahraini Dinar',
  OMR: 'Omani Rial',
  JOD: 'Jordanian Dinar',
  LBP: 'Lebanese Pound',
  EGP: 'Egyptian Pound',
  MAD: 'Moroccan Dirham',
  TND: 'Tunisian Dinar',
  DZD: 'Algerian Dinar',
  ZAR: 'South African Rand',
  NGN: 'Nigerian Naira',
  KES: 'Kenyan Shilling',
  GHS: 'Ghanaian Cedi',
  ETB: 'Ethiopian Birr',
  UGX: 'Ugandan Shilling',
  TZS: 'Tanzanian Shilling',
  RWF: 'Rwandan Franc',
  MWK: 'Malawian Kwacha',
  ZMW: 'Zambian Kwacha',
  BWP: 'Botswana Pula',
  MUR: 'Mauritian Rupee',
  SCR: 'Seychellois Rupee',
  THB: 'Thai Baht',
  VND: 'Vietnamese Dong',
  IDR: 'Indonesian Rupiah',
  MYR: 'Malaysian Ringgit',
  PHP: 'Philippine Peso',
  TWD: 'Taiwan Dollar',
  KHR: 'Cambodian Riel',
  LAK: 'Lao Kip',
  MMK: 'Myanmar Kyat',
  BDT: 'Bangladeshi Taka',
  PKR: 'Pakistani Rupee',
  LKR: 'Sri Lankan Rupee',
  NPR: 'Nepalese Rupee',
  BTN: 'Bhutanese Ngultrum',
  AFN: 'Afghan Afghani',
  IRR: 'Iranian Rial',
  IQD: 'Iraqi Dinar',
  SYP: 'Syrian Pound',
  YER: 'Yemeni Rial',
  UZS: 'Uzbekistani Som',
  KZT: 'Kazakhstani Tenge',
  KGS: 'Kyrgyzstani Som',
  TJS: 'Tajikistani Somoni',
  TMT: 'Turkmenistani Manat',
  AZN: 'Azerbaijani Manat',
  GEL: 'Georgian Lari',
  AMD: 'Armenian Dram',
  BYN: 'Belarusian Ruble',
  UAH: 'Ukrainian Hryvnia',
  MDL: 'Moldovan Leu',
  ALL: 'Albanian Lek',
  MKD: 'Macedonian Denar',
  RSD: 'Serbian Dinar',
  BAM: 'Bosnia-Herzegovina Convertible Mark',
  COP: 'Colombian Peso',
  PEN: 'Peruvian Sol',
  CLP: 'Chilean Peso',
  ARS: 'Argentine Peso',
  UYU: 'Uruguayan Peso',
  PYG: 'Paraguayan Guarani',
  BOB: 'Bolivian Boliviano',
  VES: 'Venezuelan Bolívar',
  GYD: 'Guyanese Dollar',
  SRD: 'Surinamese Dollar',
  TTD: 'Trinidad and Tobago Dollar',
  JMD: 'Jamaican Dollar',
  BBD: 'Barbadian Dollar',
  BSD: 'Bahamian Dollar',
  BZD: 'Belize Dollar',
  GTQ: 'Guatemalan Quetzal',
  HNL: 'Honduran Lempira',
  NIO: 'Nicaraguan Córdoba',
  CRC: 'Costa Rican Colón',
  PAB: 'Panamanian Balboa',
  DOP: 'Dominican Peso',
  HTG: 'Haitian Gourde',
  CUP: 'Cuban Peso',
  XCD: 'East Caribbean Dollar',
  AWG: 'Aruban Florin',
  ANG: 'Netherlands Antillean Guilder',
  SVC: 'Salvadoran Colón',
  NZD: 'New Zealand Dollar',
  FJD: 'Fijian Dollar',
  PGK: 'Papua New Guinean Kina',
  SBD: 'Solomon Islands Dollar',
  VUV: 'Vanuatu Vatu',
  WST: 'Samoan Tala',
  TOP: 'Tongan Paʻanga',
  XPF: 'CFP Franc',
  NCL: 'New Caledonian Franc',
};

const MODAL_HEIGHT = Math.round(Dimensions.get('window').height * 0.48);

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [converted, setConverted] = useState('');
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    console.log('Starting to fetch rates...');
    getCachedExchangeRates('USD')
      .then((fetchedRates) => {
        console.log('Fetched rates:', fetchedRates);
        setRates(fetchedRates);

        // Extract available currencies from the rates object
        const currencies = Object.keys(fetchedRates);
        // Add USD since it's the base currency and might not be in the rates object
        if (!currencies.includes('USD')) {
          currencies.unshift('USD');
        }

        // Sort currencies: popular ones first, then alphabetically
        const sortedCurrencies = [
          ...POPULAR_CURRENCIES.filter((curr) => currencies.includes(curr)),
          ...currencies.filter((curr) => !POPULAR_CURRENCIES.includes(curr)).sort(),
        ];

        setAvailableCurrencies(sortedCurrencies);
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

  const handleCurrencySelect = (currency: string, isFromCurrency: boolean) => {
    if (isFromCurrency) {
      setFromCurrency(currency);
      setShowFromPicker(false);
    } else {
      setToCurrency(currency);
      setShowToPicker(false);
    }
    setConverted(''); // Clear converted amount when currency changes
    setSearchQuery(''); // Clear search when currency is selected
  };

  const getFilteredCurrencies = () => {
    if (!searchQuery.trim()) {
      return availableCurrencies;
    }

    const query = searchQuery.toLowerCase();
    return availableCurrencies.filter((currency) => {
      const currencyCode = currency.toLowerCase();
      const currencyName = CURRENCY_NAMES[currency]?.toLowerCase() || '';

      return currencyCode.includes(query) || currencyName.includes(query);
    });
  };

  const renderCurrencyPicker = (isFromCurrency: boolean) => {
    const isVisible = isFromCurrency ? showFromPicker : showToPicker;
    const currentCurrency = isFromCurrency ? fromCurrency : toCurrency;
    const filteredCurrencies = getFilteredCurrencies();

    const handleModalClose = () => {
      if (isFromCurrency) {
        setShowFromPicker(false);
      } else {
        setShowToPicker(false);
      }
      setSearchQuery(''); // Clear search when modal closes
    };

    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.modalContent, { minHeight: MODAL_HEIGHT, maxHeight: MODAL_HEIGHT }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {isFromCurrency ? 'From' : 'To'} Currency
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search currencies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ScrollView style={styles.currencyList} contentContainerStyle={{ flexGrow: 1 }}>
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency}
                      style={[
                        styles.currencyItem,
                        currency === currentCurrency && styles.selectedCurrencyItem,
                      ]}
                      onPress={() => handleCurrencySelect(currency, isFromCurrency)}
                    >
                      <View style={styles.currencyInfo}>
                        <Text
                          style={[
                            styles.currencyItemText,
                            currency === currentCurrency && styles.selectedCurrencyText,
                          ]}
                        >
                          {currency}
                        </Text>
                        {CURRENCY_NAMES[currency] && (
                          <Text
                            style={[
                              styles.currencyNameText,
                              currency === currentCurrency && styles.selectedCurrencyNameText,
                            ]}
                          >
                            {CURRENCY_NAMES[currency]}
                          </Text>
                        )}
                      </View>
                      {POPULAR_CURRENCIES.includes(currency) && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularBadgeText}>Popular</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      No currencies found for "{searchQuery}"
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#057B8C" />
        <Text style={{ marginTop: 12 }}>Loading exchange rates...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Currency Converter</Text>
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>From</Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowFromPicker(true)}>
            <Text style={styles.pickerText}>{fromCurrency}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>To</Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowToPicker(true)}>
            <Text style={styles.pickerText}>{toCurrency}</Text>
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

      {/* Currency Picker Modals */}
      {renderCurrencyPicker(true)}
      {renderCurrencyPicker(false)}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#057B8C',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#F2F6F8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  swapButton: {
    marginHorizontal: 12,
    backgroundColor: '#057B8C',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#057B8C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  swapText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: '#F9FAFB',
  },
  convertButton: {
    backgroundColor: '#057B8C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 10,
    backgroundColor: '#F2F6F8',
    borderRadius: 8,
    padding: 12,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#057B8C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#057B8C',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  currencyList: {
    maxHeight: 400,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectedCurrencyItem: {
    backgroundColor: '#F2F6F8',
  },
  currencyItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedCurrencyText: {
    color: '#057B8C',
    fontWeight: '600',
  },
  popularBadge: {
    backgroundColor: '#057B8C',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyNameText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  selectedCurrencyNameText: {
    color: '#057B8C',
  },
});
