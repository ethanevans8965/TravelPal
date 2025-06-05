import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './context';
import NavigationBar from './components/NavigationBar';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  const handleNewTripPress = () => {
    router.push('/trip/create/trip-name' as any);
  };

  // Always show the FAB and keep it active
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <AppProvider>
          <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <StatusBar style="auto" backgroundColor="#ffffff" />
            <View style={styles.content}>
              {/* This renders the current route */}
              <Slot />
            </View>

            <View style={styles.navContainer}>
              <NavigationBar showFAB={false} onNewTripPress={handleNewTripPress} />
            </View>
          </SafeAreaView>
        </AppProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 60, // Space for the navigation bar
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
  },
});
