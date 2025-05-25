// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
// import { FontAwesome } from '@expo/vector-icons'; // FontAwesome import removed as it's unused
import { Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext'; // Adjusted path

export default function TabLayout() {
  const theme = useAppTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={() => null} // Assuming custom navigation bar is used instead
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: theme.typography.fontWeights.bold, // Standardized to bold
            fontFamily: theme.typography.primaryFont,
          },
        }}
      >
        <Tabs.Screen
          name="expenses" // This screen's options will override the global ones if set in expenses.tsx
          options={{
            title: 'Expenses',
          }}
        />
      </Tabs>
    </View>
  );
}
