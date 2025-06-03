import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
    <GestureHandlerRootView style={styles.gestureContainer}>
      <AppProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.content}>
            {/* This renders the current route */}
            <Slot />
          </View>

          <View style={styles.navContainer}>
            <NavigationBar showFAB={true} onNewTripPress={handleNewTripPress} />
          </View>
        </View>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 60, // Space for the navigation bar
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
