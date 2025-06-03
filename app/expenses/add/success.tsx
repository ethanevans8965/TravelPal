import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ExpenseSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract expense data from params
  const amount = params.amount as string;
  const currency = params.currency as string;
  const category = params.category as string;
  const description = params.description as string;
  const tripName = params.tripName as string;
  const isGeneral = params.isGeneral === 'true';

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Scale in the checkmark
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      // Fade in content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      food: '🍽️',
      transport: '🚗',
      accommodation: '🏨',
      activities: '🎯',
      shopping: '🛍️',
      health: '💊',
      communication: '📱',
      entertainment: '🎭',
      other: '📋',
    };
    return emojiMap[category] || '💰';
  };

  const getCategoryLabel = (category: string) => {
    const labelMap: Record<string, string> = {
      food: 'Food & Dining',
      transport: 'Transportation',
      accommodation: 'Accommodation',
      activities: 'Activities & Tours',
      shopping: 'Shopping',
      health: 'Health & Medical',
      communication: 'Communication',
      entertainment: 'Entertainment',
      other: 'Other',
    };
    return labelMap[category] || category;
  };

  const handleViewAllExpenses = () => {
    router.push('/finances');
  };

  const handleAddAnother = () => {
    router.push('/expenses/add');
  };

  const handleDone = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.gradient}>
        {/* Success Animation */}
        <View style={styles.successSection}>
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.checkmark}>
              <FontAwesome name="check" size={48} color="#fff" />
            </View>
          </Animated.View>

          <Animated.Text
            style={[
              styles.successTitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            Expense Added!
          </Animated.Text>

          <Animated.Text
            style={[
              styles.successSubtitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            Your expense has been successfully recorded
          </Animated.Text>
        </View>

        {/* Expense Summary Card */}
        <Animated.View
          style={[
            styles.summaryCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.amountSection}>
            <Text style={styles.currencySymbol}>
              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
            </Text>
            <Text style={styles.amountText}>{parseFloat(amount).toFixed(2)}</Text>
            <Text style={styles.currencyCode}>{currency}</Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
                <Text style={styles.categoryText}>{getCategoryLabel(category)}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="file-text-o" size={16} color="#8E8E93" style={styles.detailIcon} />
              <Text style={styles.detailText}>{description}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome
                name={isGeneral ? 'credit-card' : 'suitcase'}
                size={16}
                color="#8E8E93"
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{isGeneral ? 'General Expense' : tripName}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.actionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddAnother}>
            <Text style={styles.primaryButtonText}>Add Another Expense</Text>
            <FontAwesome name="plus" size={16} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewAllExpenses}>
            <Text style={styles.secondaryButtonText}>View All Expenses</Text>
            <FontAwesome name="list" size={16} color="#185a9d" style={styles.buttonIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton} onPress={handleDone}>
            <Text style={styles.tertiaryButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    justifyContent: 'space-between',
  },
  successSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
  checkmark: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#185a9d',
    marginRight: 4,
  },
  amountText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A2A36',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
    marginLeft: 8,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  detailsSection: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
  },
  detailIcon: {
    marginRight: 12,
    width: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#1A2A36',
    flex: 1,
  },
  actionSection: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#185a9d',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  tertiaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
