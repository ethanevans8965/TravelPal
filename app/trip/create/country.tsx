import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import countriesData from '../../../assets/data/all_countries.json';

// Get unique list of countries
const countries = [...new Set(countriesData.map(item => item.Country))].sort();

export default function CountrySelectionScreen() {
  const router = useRouter();
  const { tripName } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const filteredCountries = useMemo(() => {
    return countries.filter(country =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleNext = () => {
    if (!selectedCountry) return;

    router.push({
      pathname: '/trip/create/trip-details',
      params: {
        tripName,
        country: selectedCountry,
      },
    } as any);
  };

  const renderCountryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        selectedCountry === item && styles.countryItemSelected,
      ]}
      onPress={() => setSelectedCountry(item)}
    >
      <Text style={[
        styles.countryText,
        selectedCountry === item && styles.countryTextSelected,
      ]}>
        {item}
      </Text>
      {selectedCountry === item && (
        <FontAwesome name="check" size={16} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Select Destination</Text>
        <Text style={styles.subtitle}>Choose the country you're visiting</Text>

        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search countries..."
            placeholderTextColor="#999999"
          />
        </View>

        <FlatList
          data={filteredCountries}
          renderItem={renderCountryItem}
          keyExtractor={item => item}
          style={styles.countryList}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedCountry && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedCountry}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333333',
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  countryItemSelected: {
    backgroundColor: '#057B8C',
  },
  countryText: {
    fontSize: 16,
    color: '#333333',
  },
  countryTextSelected: {
    color: '#FFFFFF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
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