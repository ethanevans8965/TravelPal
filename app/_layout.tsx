import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './context';
import { ThemeProvider, useAppTheme } from '../src/theme/ThemeContext'; // Adjusted path
import NavigationBar from './components/NavigationBar';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  // useAppTheme can only be called by children of ThemeProvider.
  // The styles are defined outside the component, so we can't use theme there directly.
  // We will apply the themed style inline or pass theme to a function that returns styles.
  // For this specific change, we can adjust the StyleSheet definition slightly or apply it inline if complex.
  // Let's try to adjust the StyleSheet by passing theme to it.
  // However, StyleSheet.create is typically called outside the component.
  // The simplest for this case is to create the styles object inside the component
  // or apply the specific themed value directly inline if it's just one property.

  const router = useRouter();

  const handleNewTripPress = () => {
    router.push('/trip/create/trip-name' as any);
  };

  // Always show the FAB and keep it active
  return (
    <AppProvider>
      <ThemeProvider>
        <ThemedRootView router={router} handleNewTripPress={handleNewTripPress} />
      </ThemeProvider>
    </AppProvider>
  );
}

// Helper component to access theme
const ThemedRootView = ({ router, handleNewTripPress }: { router: any, handleNewTripPress: () => void }) => {
  const theme = useAppTheme();
  const styles = getThemedStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" /> 
      {/* 'auto' should be fine with a light theme background. 
          If theme had isDark: theme.isDark ? 'light' : 'dark' */}
      <View style={styles.content}>
        {/* This renders the current route */}
        <Slot />
      </View>
      
      <View style={styles.navContainer}>
        <NavigationBar showFAB={true} onNewTripPress={handleNewTripPress} />
      </View>
    </View>
  );
};

const getThemedStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing.xxxl, // 64, to match NavigationBar.BAR_HEIGHT
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
