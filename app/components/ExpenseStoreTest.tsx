import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useExpenseStore } from '../stores/expenseStore';

export default function ExpenseStoreTest() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Get store state and actions
  const expenses = useExpenseStore((state) => state.expenses);
  const addExpense = useExpenseStore((state) => state.addExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);

  const handleAddExpense = () => {
    if (!amount || !description || !category) return;

    addExpense({
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
      currency: 'USD',
      tripId: 'test-trip-1', // For testing purposes
    });

    // Clear inputs
    setAmount('');
    setDescription('');
    setCategory('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Store Test</Text>

      {/* Add Expense Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <Button title="Add Expense" onPress={handleAddExpense} />
      </View>

      {/* Display Expenses */}
      <View style={styles.expensesList}>
        <Text style={styles.subtitle}>Current Expenses:</Text>
        {expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseItem}>
            <Text>Amount: ${expense.amount}</Text>
            <Text>Description: {expense.description}</Text>
            <Text>Category: {expense.category}</Text>
            <Button title="Delete" onPress={() => deleteExpense(expense.id)} color="red" />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  form: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  expensesList: {
    marginTop: 20,
  },
  expenseItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    gap: 5,
  },
});
