import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import ExpenseStoreTest from '../components/ExpenseStoreTest';

export default function ExpensesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Expenses',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#333333',
        }}
      />
      <ScrollView style={styles.content}>
        <ExpenseStoreTest />
      </ScrollView>
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
  },
});
