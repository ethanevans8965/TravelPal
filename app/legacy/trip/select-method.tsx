import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function SelectMethodScreen() {
  const router = useRouter();

  const handleNewTrip = () => {
    router.push('/trip/create/trip-name' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Trip</Text>
      <Text style={styles.subtitle}>Let's start planning your adventure</Text>

      <TouchableOpacity style={styles.newTripButton} onPress={handleNewTrip}>
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
        <Text style={styles.newTripButtonText}>New Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  newTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#057B8C',
    borderRadius: 12,
    padding: 16,
    marginTop: 'auto',
  },
  newTripButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
