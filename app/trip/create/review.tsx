import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type Category = {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  amount: number;
};

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categories: Category[] = params.categories ? JSON.parse(params.categories as string) : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCreateTrip = () => {
    // TODO: Save trip to database
    router.replace('/trips');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Review Your Trip</Text>
          <Text style={styles.subtitle}>Please review your trip details before creating</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{params.tripName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Country</Text>
            <Text style={styles.detailValue}>{params.country}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Dates</Text>
            <Text style={styles.detailValue}>
              {formatDate(params.startDate as string)} - {formatDate(params.endDate as string)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Budget</Text>
            <Text style={styles.detailValue}>
              ${parseFloat(params.totalBudget as string).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Allocation</Text>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <FontAwesome name={category.icon as any} size={20} color="#333333" />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <View style={styles.categoryAmounts}>
                <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                <Text style={styles.categoryValue}>${category.amount.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateTrip}>
        <Text style={styles.createButtonText}>Create Trip</Text>
        <FontAwesome name="check" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#333333',
  },
  categoryAmounts: {
    alignItems: 'flex-end',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#666666',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  createButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
