import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ExpenseErrorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract error data from params
  const errorMessage = (params.errorMessage as string) || 'An unexpected error occurred';
  const expenseData = params.expenseData as string; // JSON stringified expense data for retry

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Scale in the error icon
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      // Fade in content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleRetry = () => {
    // Go back to expense details with the same data
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleContactSupport = () => {
    // TODO: Implement support contact (email, in-app feedback, etc.)
    console.log('Contact support pressed');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FF6B6B', '#E53E3E']} style={styles.gradient}>
        {/* Error Animation */}
        <View style={styles.errorSection}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.errorIcon}>
              <FontAwesome name="exclamation-triangle" size={48} color="#fff" />
            </View>
          </Animated.View>

          <Animated.Text
            style={[
              styles.errorTitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            Save Failed
          </Animated.Text>

          <Animated.Text
            style={[
              styles.errorSubtitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            We couldn't save your expense
          </Animated.Text>
        </View>

        {/* Error Details Card */}
        <Animated.View
          style={[
            styles.errorCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.errorHeader}>
            <FontAwesome name="info-circle" size={20} color="#E53E3E" />
            <Text style={styles.errorHeaderText}>What happened?</Text>
          </View>

          <Text style={styles.errorMessage}>{errorMessage}</Text>

          <View style={styles.troubleshootingSection}>
            <Text style={styles.troubleshootingTitle}>Try these steps:</Text>
            <View style={styles.troubleshootingList}>
              <View style={styles.troubleshootingItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.troubleshootingText}>Check your internet connection</Text>
              </View>
              <View style={styles.troubleshootingItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.troubleshootingText}>
                  Ensure all required fields are filled
                </Text>
              </View>
              <View style={styles.troubleshootingItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.troubleshootingText}>Try again in a few moments</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.actionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.primaryButton} onPress={handleRetry}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
            <FontAwesome name="refresh" size={16} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleContactSupport}>
            <Text style={styles.secondaryButtonText}>Contact Support</Text>
            <FontAwesome name="life-ring" size={16} color="#E53E3E" style={styles.buttonIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton} onPress={handleGoHome}>
            <Text style={styles.tertiaryButtonText}>Go Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    justifyContent: 'space-between',
  },
  errorSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  errorIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  errorTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A36',
    marginLeft: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#1A2A36',
    lineHeight: 22,
    marginBottom: 20,
  },
  troubleshootingSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  troubleshootingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A36',
    marginBottom: 12,
  },
  troubleshootingList: {
    gap: 8,
  },
  troubleshootingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
    marginTop: 2,
  },
  troubleshootingText: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    lineHeight: 20,
  },
  actionSection: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#E53E3E',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  tertiaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
