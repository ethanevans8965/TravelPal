import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#333333',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="select-method" 
        options={{ 
          title: 'Create New Trip',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="total-budget" 
        options={{ 
          title: 'Budget Details',
        }} 
      />
      <Stack.Screen 
        name="daily-budget" 
        options={{ 
          title: 'Budget Details',
        }} 
      />
      <Stack.Screen 
        name="category-allocation" 
        options={{ 
          title: 'Allocate Your Budget',
        }} 
      />
      <Stack.Screen 
        name="review" 
        options={{ 
          title: 'Review Trip Details',
        }} 
      />
    </Stack>
  );
} 