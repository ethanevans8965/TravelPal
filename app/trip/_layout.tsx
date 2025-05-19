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
        name="create/trip-name" 
        options={{ 
          title: 'Name Your Trip',
        }} 
      />
      <Stack.Screen 
        name="create/country" 
        options={{ 
          title: 'Select Country',
        }} 
      />
      <Stack.Screen 
        name="create/trip-details" 
        options={{ 
          title: 'Trip Details',
        }} 
      />
      <Stack.Screen 
        name="create/total-budget" 
        options={{ 
          title: 'Set Your Budget',
        }} 
      />
      <Stack.Screen 
        name="create/dates" 
        options={{ 
          title: 'Trip Dates',
        }} 
      />
      <Stack.Screen 
        name="create/no-budget/dates" 
        options={{ 
          title: 'Trip Dates',
        }} 
      />
      <Stack.Screen 
        name="create/no-budget/review" 
        options={{ 
          title: 'Review Trip',
        }} 
      />
    </Stack>
  );
} 