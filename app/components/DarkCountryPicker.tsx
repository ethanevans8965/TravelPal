import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getCountryNames } from '../utils/countryData';

interface DarkCountryPickerProps {
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}

const DarkCountryPicker: React.FC<DarkCountryPickerProps> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const countries = getCountryNames();

  const filteredCountries =
    searchText.length > 0
      ? countries.filter((country) => country.toLowerCase().includes(searchText.toLowerCase()))
      : countries;

  const handleOverlayPress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerText}>{selectedCountry || 'Select a country'}</Text>
        <FontAwesome name="chevron-down" size={14} color="#CCCCCC" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleOverlayPress}
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
      >
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select a Country</Text>
                  <TouchableOpacity onPress={handleOverlayPress}>
                    <FontAwesome name="times" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                  <FontAwesome name="search" size={16} color="#CCCCCC" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search countries..."
                    placeholderTextColor="#666"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCapitalize="none"
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                      <FontAwesome name="times-circle" size={16} color="#CCCCCC" />
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
                        selectedCountry === item && styles.selectedCountryItem,
                      ]}
                      onPress={() => {
                        onSelectCountry(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.countryName,
                          selectedCountry === item && styles.selectedCountryName,
                        ]}
                      >
                        {item}
                      </Text>
                      {selectedCountry === item && (
                        <FontAwesome name="check" size={16} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  pickerText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#171717',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  selectedCountryItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  countryName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  selectedCountryName: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default DarkCountryPicker;
