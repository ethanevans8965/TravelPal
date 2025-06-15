import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCountryNames } from '../../utils/countryData';
import { Trip } from '../../types';

interface DestinationModalProps {
  visible: boolean;
  trip: Trip;
  onClose: () => void;
  onSave: (destination: { name: string; country: string }) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Popular destinations with beautiful gradients
const POPULAR_DESTINATIONS = [
  { name: 'Paris, France', country: 'France', gradient: ['#ff9a9e', '#fecfef'] as const },
  { name: 'Tokyo, Japan', country: 'Japan', gradient: ['#667eea', '#764ba2'] as const },
  { name: 'New York, USA', country: 'United States', gradient: ['#f093fb', '#f5576c'] as const },
  { name: 'London, England', country: 'United Kingdom', gradient: ['#4facfe', '#00f2fe'] as const },
  { name: 'Rome, Italy', country: 'Italy', gradient: ['#43e97b', '#38f9d7'] as const },
  { name: 'Barcelona, Spain', country: 'Spain', gradient: ['#fa709a', '#fee140'] as const },
  {
    name: 'Amsterdam, Netherlands',
    country: 'Netherlands',
    gradient: ['#a8edea', '#fed6e3'] as const,
  },
  {
    name: 'Dubai, UAE',
    country: 'United Arab Emirates',
    gradient: ['#ffecd2', '#fcb69f'] as const,
  },
];

export default function DestinationModal({
  visible,
  trip,
  onClose,
  onSave,
}: DestinationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
    country: string;
  } | null>(
    trip.destination ? { name: trip.destination.name, country: trip.destination.country } : null
  );
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');

  const countries = getCountryNames();

  // Filter popular destinations and countries based on search
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_DESTINATIONS;

    const query = searchQuery.toLowerCase();
    return [
      ...POPULAR_DESTINATIONS.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query) || dest.country.toLowerCase().includes(query)
      ),
      ...countries
        .filter((country) => country.toLowerCase().includes(query))
        .map((country) => ({
          name: country,
          country,
          gradient: ['#667eea', '#764ba2'] as const,
        })),
    ].slice(0, 8); // Limit to 8 results for better UX
  }, [searchQuery, countries]);

  const handleSave = () => {
    if (selectedDestination) {
      onSave(selectedDestination);
      onClose();
    } else if (showCustomInput && customCity && customCountry) {
      onSave({ name: `${customCity}, ${customCountry}`, country: customCountry });
      onClose();
    }
  };

  const handleCustomDestination = () => {
    setShowCustomInput(true);
    setSelectedDestination(null);
  };

  const renderDestinationCard = ({ item }: { item: (typeof POPULAR_DESTINATIONS)[0] }) => (
    <TouchableOpacity
      style={[
        styles.destinationCard,
        selectedDestination?.name === item.name && styles.selectedCard,
      ]}
      onPress={() => {
        setSelectedDestination(item);
        setShowCustomInput(false);
      }}
    >
      <LinearGradient
        colors={item.gradient}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <FontAwesome name="map-marker" size={20} color="white" />
          <Text style={styles.destinationName}>{item.name}</Text>
        </View>
        {selectedDestination?.name === item.name && (
          <View style={styles.checkmark}>
            <FontAwesome name="check" size={16} color="white" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Destination</Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!selectedDestination && !(showCustomInput && customCity && customCountry)}
            >
              <Text
                style={[
                  styles.saveButton,
                  !selectedDestination &&
                    !(showCustomInput && customCity && customCountry) &&
                    styles.saveButtonDisabled,
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations or countries..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* Popular/Filtered Destinations */}
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Popular Destinations'}
          </Text>

          <FlatList
            data={filteredSuggestions}
            renderItem={renderDestinationCard}
            keyExtractor={(item) => item.name}
            numColumns={2}
            columnWrapperStyle={styles.row}
            style={styles.destinationsList}
            showsVerticalScrollIndicator={false}
          />

          {/* Custom Destination Input */}
          {!showCustomInput ? (
            <TouchableOpacity style={styles.customButton} onPress={handleCustomDestination}>
              <FontAwesome name="plus" size={16} color="#667eea" />
              <Text style={styles.customButtonText}>Add Custom Destination</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputTitle}>Custom Destination</Text>
              <TextInput
                style={styles.customInput}
                placeholder="City (e.g., Prague)"
                value={customCity}
                onChangeText={setCustomCity}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.customInput}
                placeholder="Country (e.g., Czech Republic)"
                value={customCountry}
                onChangeText={setCustomCountry}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.cancelCustomButton}
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomCity('');
                  setCustomCountry('');
                }}
              >
                <Text style={styles.cancelCustomText}>Cancel Custom Input</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  saveButtonDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  destinationsList: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  destinationCard: {
    width: (screenWidth - 56) / 2, // Account for padding and gap
    height: 120,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedCard: {
    transform: [{ scale: 0.95 }],
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#667eea',
    marginLeft: 8,
  },
  customInputContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  customInputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  customInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cancelCustomButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelCustomText: {
    fontSize: 14,
    color: '#666',
  },
});
