import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const options = [
  {
    key: 'trip',
    icon: 'suitcase',
    iconBg: ['#43cea2', '#185a9d'] as [string, string],
    title: 'Link to a Trip',
    description:
      'Associate this expense with one of your planned or ongoing trips for detailed tracking.',
  },
  {
    key: 'general',
    icon: 'file-text-o',
    iconBg: ['#ffb347', '#ffcc33'] as [string, string],
    title: 'General Expense',
    description:
      'Log this expense without linking it to any specific trip (e.g., daily personal spending).',
  },
];

export default function ExpenseAssociationChoiceScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [buttonAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  // Animate the Next button when enabled
  React.useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: selected ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const handleNext = () => {
    if (selected === 'trip') {
      router.push('/expenses/add/trip-selection');
    } else if (selected === 'general') {
      router.push('/expenses/add/expense-details?general=true');
    }
  };

  return (
    <View style={styles.root}>
      {/* Gradient Header */}
      <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.headerBg}>
        <Text style={styles.headerTitle}>Add New Expense</Text>
        <Text style={styles.headerSubtitle}>How would you like to record this expense?</Text>
      </LinearGradient>

      {/* Option Cards */}
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selected === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.85}
              onPress={() => setSelected(option.key)}
            >
              <LinearGradient
                colors={option.iconBg}
                style={styles.iconCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FontAwesome name={option.icon as any} size={30} color="#fff" />
              </LinearGradient>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardDescription}>{option.description}</Text>
              </View>
              {isSelected && (
                <View style={styles.checkCircle}>
                  <FontAwesome name="check" size={18} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sticky Next Button */}
      <Animated.View
        style={[
          styles.nextButtonContainer,
          {
            opacity: buttonAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
            transform: [
              {
                scale: buttonAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.04] }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.nextButtonWrapper}
          disabled={!selected}
          onPress={handleNext}
        >
          <LinearGradient
            colors={['#43cea2', '#185a9d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },
  headerBg: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#e0f7fa',
    fontWeight: '500',
  },
  optionsContainer: {
    marginTop: 36,
    paddingHorizontal: 20,
    gap: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 0,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#43cea2',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#43cea2',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2A36',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 15,
    color: '#4B5C6B',
    fontWeight: '400',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#43cea2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 18,
    top: '50%',
    marginTop: -14,
    shadowColor: '#43cea2',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  nextButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: 'rgba(246,248,251,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  nextButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#43cea2',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.5,
  },
});
