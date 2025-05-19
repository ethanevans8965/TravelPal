import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './context';
import NavigationBar from './components/NavigationBar';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  const handleNewTripPress = () => {
    router.push('/trip/' as any);
  };

  // Always show the FAB and keep it active
  return (
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
  );
}

const styles = StyleSheet.create({
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
