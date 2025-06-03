import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface AmountInputProps {
  label: string;
  amount: string;
  currency: Currency;
  onAmountChange: (amount: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function AmountInput({
  label,
  amount,
  currency,
  onAmountChange,
  placeholder = '0.00',
  autoFocus = false,
}: AmountInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>{currency.symbol}</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={onAmountChange}
          placeholder={placeholder}
          placeholderTextColor="#C7C7CC"
          keyboardType="decimal-pad"
          autoFocus={autoFocus}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#43cea2',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#1A2A36',
  },
});
