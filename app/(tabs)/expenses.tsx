import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import ExpenseStoreTest from '../components/ExpenseStoreTest';
import { useAppTheme } from '../../src/theme/ThemeContext'; // Adjusted path

export default function ExpensesScreen() {
  const theme = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Expenses',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontFamily: theme.typography.primaryFont,
            fontWeight: theme.typography.fontWeights.bold, // Keep or make consistent
          },
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
    // backgroundColor is applied inline
  },
  content: {
    flex: 1,
  },
});
