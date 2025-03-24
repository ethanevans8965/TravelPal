import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

export default function JournalScreen() {
  const entries = [
    {
      id: 1,
      title: 'First Day in Paris',
      date: 'Mar 20, 2024',
      location: 'Paris, France',
      content: 'Arrived in Paris this morning. The city is beautiful as always. Visited the Eiffel Tower and had a lovely dinner at a local bistro.',
      mood: 'happy',
      color: '#FF6B6B',
    },
    {
      id: 2,
      title: 'Museum Day',
      date: 'Mar 19, 2024',
      location: 'Paris, France',
      content: 'Spent the day exploring the Louvre. The Mona Lisa was incredible in person. Later, enjoyed some authentic French pastries.',
      mood: 'excited',
      color: '#4A90E2',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Travel Journal</Text>
        <Text style={styles.headerSubtitle}>Your memories</Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <FontAwesome name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>New Entry</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        {entries.map((entry) => (
          <TouchableOpacity key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={[styles.moodIcon, { backgroundColor: `${entry.color}20` }]}>
                <FontAwesome 
                  name={entry.mood === 'happy' ? 'smile-o' : 'star'} 
                  size={20} 
                  color={entry.color} 
                />
              </View>
              <View style={styles.entryTitleContainer}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryLocation}>{entry.location}</Text>
              </View>
            </View>
            <Text style={styles.entryContent} numberOfLines={3}>
              {entry.content}
            </Text>
            <View style={styles.entryFooter}>
              <Text style={styles.entryDate}>{entry.date}</Text>
              <TouchableOpacity>
                <FontAwesome name="chevron-right" size={16} color="#666666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  addButton: {
    margin: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 20,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  entryTitleContainer: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  entryLocation: {
    fontSize: 14,
    color: '#666666',
  },
  entryContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    fontSize: 12,
    color: '#999999',
  },
}); 