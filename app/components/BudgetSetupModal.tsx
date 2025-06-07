import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

interface BudgetSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onBudgetSet: (budgetData: BudgetData) => void;
  tripName: string;
}

interface BudgetData {
  method: 'no-budget' | 'simple-total' | 'detailed-plan';
  totalBudget?: number;
  dailyBudget?: number;
  categories?: Record<string, number>;
}

const budgetOptions = [
  {
    id: 'no-budget' as const,
    title: 'Track As I Go',
    description: 'No budget limits - just track expenses as they happen',
    icon: 'list-alt',
    color: '#6B7280',
    benefits: ['Simple expense tracking', 'No budget constraints', 'Perfect for spontaneous trips'],
  },
  {
    id: 'simple-total' as const,
    title: 'Simple Total Budget',
    description: 'Set one total amount and track against it',
    icon: 'dollar',
    color: '#10B981',
    benefits: ['Easy to set up', 'Clear spending limit', 'Automatic tracking'],
  },
  {
    id: 'detailed-plan' as const,
    title: 'Detailed Budget Plan',
    description: 'Full planning with daily budgets and category breakdown',
    icon: 'calculator',
    color: '#8B5CF6',
    benefits: ['Complete budget control', 'Category-wise tracking', 'Daily spending guidance'],
  },
];

export default function BudgetSetupModal({
  visible,
  onClose,
  onBudgetSet,
  tripName,
}: BudgetSetupModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<BudgetData['method'] | null>(null);
  const [totalBudget, setTotalBudget] = useState('');
  const [error, setError] = useState('');

  const handleMethodSelect = (method: BudgetData['method']) => {
    setSelectedMethod(method);
    setError('');
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      setError('Please select a budget method');
      return;
    }

    switch (selectedMethod) {
      case 'no-budget':
        onBudgetSet({ method: 'no-budget' });
        break;

      case 'simple-total':
        const budget = parseFloat(totalBudget);
        if (!totalBudget || isNaN(budget) || budget <= 0) {
          setError('Please enter a valid budget amount');
          return;
        }
        onBudgetSet({
          method: 'simple-total',
          totalBudget: budget,
        });
        break;

      case 'detailed-plan':
        // TODO: Navigate to detailed planning flow
        // For now, just close with a simple setup
        onBudgetSet({
          method: 'detailed-plan',
          totalBudget: parseFloat(totalBudget) || undefined,
        });
        break;
    }
  };

  const reset = () => {
    setSelectedMethod(null);
    setTotalBudget('');
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#666666" />
          </TouchableOpacity>
          <Text style={styles.title}>Set Up Budget</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>
            How would you like to manage your budget for "{tripName}"?
          </Text>

          <View style={styles.options}>
            {budgetOptions.map((option) => {
              const cardStyle = {
                ...styles.optionCard,
                ...(selectedMethod === option.id ? styles.selectedOption : {}),
              };

              return (
                <TouchableOpacity key={option.id} onPress={() => handleMethodSelect(option.id)}>
                  <Card
                    variant={selectedMethod === option.id ? 'elevated' : 'outlined'}
                    style={cardStyle}
                  >
                    <View style={styles.optionHeader}>
                      <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                        <FontAwesome name={option.icon as any} size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionTitle}>{option.title}</Text>
                        <Text style={styles.optionDescription}>{option.description}</Text>
                      </View>
                      {selectedMethod === option.id && (
                        <FontAwesome name="check-circle" size={24} color={option.color} />
                      )}
                    </View>

                    <View style={styles.benefits}>
                      {option.benefits.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <FontAwesome
                            name="check"
                            size={12}
                            color={option.color}
                            style={styles.benefitIcon}
                          />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Budget Input for Simple Total and Detailed Plan */}
          {(selectedMethod === 'simple-total' || selectedMethod === 'detailed-plan') && (
            <Card variant="outlined" style={styles.budgetInputCard}>
              <Input
                label="Total Budget"
                placeholder="Enter your total budget"
                value={totalBudget}
                onChangeText={setTotalBudget}
                keyboardType="numeric"
                leftIcon="dollar"
                error={error}
              />

              {selectedMethod === 'detailed-plan' && (
                <Text style={styles.detailedPlanNote}>
                  💡 You'll be able to set daily budgets and category breakdowns in the next step
                </Text>
              )}
            </Card>
          )}

          {error && selectedMethod === 'no-budget' && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Continue" onPress={handleContinue} disabled={!selectedMethod} fullWidth />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  options: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    marginBottom: 0,
  },
  selectedOption: {
    borderColor: '#057B8C',
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  benefits: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#666666',
  },
  budgetInputCard: {
    marginBottom: 24,
  },
  detailedPlanNote: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
});
