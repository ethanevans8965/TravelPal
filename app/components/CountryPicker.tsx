import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Changed from FontAwesome
import { getCountryNames } from '../utils/countryData';
import { useAppTheme } from '../../src/theme/ThemeContext';

interface CountryPickerProps {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}

const CountryPicker: React.FC<CountryPickerProps> = ({ selectedCountry, onSelectCountry }) => {
  const theme = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const countries = getCountryNames();

  const filteredCountries = searchText.length > 0
    ? countries.filter(country => country.toLowerCase().includes(searchText.toLowerCase()))
    : countries;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {selectedCountry || 'Select a country'}
        </Text>
        <Ionicons name="chevron-down-outline" size={theme.typography.fontSizes.medium} color={theme.colors.textSecondary} /> 
        {/* Size small (12) might be too small for chevron, medium (16) is better. Original FA was 14. */}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Country</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-outline" size={theme.typography.fontSizes.xl} color={theme.colors.text} /> 
                {/* xl is 24, large is 20. Ionicons 'close' is thinner. */}
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={theme.typography.fontSizes.medium} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                placeholderTextColor={theme.colors.textTertiary}
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle-outline" size={theme.typography.fontSizes.medium} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    selectedCountry === item && styles.selectedCountryItem
                  ]}
                  onPress={() => {
                    onSelectCountry(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.countryName,
                      selectedCountry === item && styles.selectedCountryName
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedCountry === item && (
                    <Ionicons name="checkmark-outline" size={theme.typography.fontSizes.large} color={theme.colors.secondary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm + theme.spacing.xs, // 12
    padding: theme.spacing.md, // 16
    borderWidth: theme.borders.borderWidthSmall,
    borderColor: theme.colors.border,
  },
  pickerText: {
    fontSize: theme.typography.fontSizes.medium, // 16
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.black + '80', // 'rgba(0, 0, 0, 0.5)'
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.spacing.large + theme.spacing.xs, // 20
    borderTopRightRadius: theme.spacing.large + theme.spacing.xs, // 20
    paddingHorizontal: theme.spacing.large, // 20
    paddingBottom: theme.spacing.xl, // 30 -> 32 (close enough)
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.large, // 20
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes.large, // 20
    fontWeight: theme.typography.fontWeights.semibold, // 600
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface, // Or gray[100]
    borderRadius: theme.borders.radiusMedium, // 10 -> 8 (close enough)
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs, // 12
    marginBottom: theme.spacing.md, // 16
  },
  searchIcon: {
    marginRight: theme.spacing.sm, // 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm + theme.spacing.xs, // 12
    fontSize: theme.typography.fontSizes.medium, // 16
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md, // 16
    borderBottomWidth: theme.borders.borderWidthSmall,
    borderBottomColor: theme.colors.border, // F0F0F0 -> border color
  },
  selectedCountryItem: {
    backgroundColor: theme.colors.secondary + '33', // F27A5E33 approx 20% opacity
  },
  countryName: {
    fontSize: theme.typography.fontSizes.medium, // 16
    fontFamily: theme.typography.primaryFont,
    color: theme.colors.text,
  },
  selectedCountryName: {
    color: theme.colors.secondary,
    fontWeight: theme.typography.fontWeights.medium, // 500
    fontFamily: theme.typography.primaryFont,
  },
});

export default CountryPicker; 