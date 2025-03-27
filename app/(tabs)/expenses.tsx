import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesomeIconName } from '../types/icons';

export default function ExpensesScreen() {
  const transactions = [
    {
      id: 1,
      title: 'Flight to Paris',
      amount: -450.00,
      date: 'Mar 20, 2024',
      category: 'Transportation',
      icon: 'rocket' as FontAwesomeIconName,
      color: '#FF6B6B',
    },
    {
      id: 2,
      title: 'Hotel Booking',
      amount: -200.00,
      date: 'Mar 19, 2024',
      category: 'Accommodation',
      icon: 'home' as FontAwesomeIconName,
      color: '#4A90E2',
    },
    {
      id: 3,
      title: 'Restaurant Dinner',
      amount: -85.00,
      date: 'Mar 18, 2024',
      category: 'Food',
      icon: 'cutlery' as FontAwesomeIconName,
      color: '#4CAF50',
    },
    {
      id: 4,
      title: 'Museum Tickets',
      amount: -25.00,
      date: 'Mar 17, 2024',
      category: 'Activities',
      icon: 'map-marker' as FontAwesomeIconName,
      color: '#E91E63',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <Text style={styles.headerSubtitle}>March 2024</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryAmount}>$760.00</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[styles.summaryAmount, { color: '#4CAF50' }]}>$1,740.00</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((transaction) => (
          <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
            <View style={[styles.transactionIcon, { backgroundColor: `${transaction.color}20` }]}>
              <FontAwesome name={transaction.icon} size={20} color={transaction.color} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={[styles.amount, { color: transaction.amount < 0 ? '#FF6B6B' : '#4CAF50' }]}>
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666666',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
  },
});
