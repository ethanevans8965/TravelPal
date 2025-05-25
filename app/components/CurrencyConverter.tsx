import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getCachedExchangeRates } from '../utils/currency';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
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
          <TouchableOpacity style={styles.picker}>
            <Text style={styles.pickerText}>{fromCurrency}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>To</Text>
          <TouchableOpacity style={styles.picker}>
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
});
