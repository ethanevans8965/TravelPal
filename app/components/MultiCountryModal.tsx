import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getCountryNames } from '../utils/countryData';

interface MultiCountryModalProps {
  visible: boolean;
  selected: string[];
  onClose: () => void;
  onSave: (countries: string[]) => void;
}

export default function MultiCountryModal({
  visible,
  selected,
  onClose,
  onSave,
}: MultiCountryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(selected);

  // Reset selection when modal is reopened with different data
  useEffect(() => {
    setSelectedCountries(selected);
    setSearchQuery('');
  }, [selected, visible]);

  const allCountries = useMemo(() => getCountryNames(), []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return allCountries;
    const q = searchQuery.toLowerCase();
    return allCountries.filter((c) => c.toLowerCase().includes(q));
  }, [searchQuery, allCountries]);

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const renderItem = ({ item }: { item: string }) => {
    const checked = selectedCountries.includes(item);
    return (
      <TouchableOpacity style={styles.countryRow} onPress={() => toggleCountry(item)}>
        <Text style={styles.countryText}>{item}</Text>
        {checked && <FontAwesome name="check" size={16} color="#007AFF" />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="times" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Countries</Text>
          <TouchableOpacity
            onPress={() => {
              onSave(selectedCountries);
              onClose();
            }}
            disabled={selectedCountries.length === 0}
          >
            <Text style={[styles.saveText, selectedCountries.length === 0 && styles.saveDisabled]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Search */}
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={16} color="#666" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search country..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  saveDisabled: {
    color: 'rgba(0,0,0,0.3)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F2F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  countryText: {
    fontSize: 16,
    color: '#333',
  },
});
