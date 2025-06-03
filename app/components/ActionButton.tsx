import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ActionButtonProps {
  icon: string;
  title: string;
  onPress: () => void;
  iconColor?: string;
  disabled?: boolean;
}

export default function ActionButton({
  icon,
  title,
  onPress,
  iconColor = '#43cea2',
  disabled = false,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, disabled && styles.actionButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.actionButtonContent}>
        <View style={[styles.actionIconContainer, { backgroundColor: `${iconColor}15` }]}>
          <FontAwesome name={icon as any} size={20} color={iconColor} />
        </View>
        <Text style={[styles.actionButtonText, disabled && styles.actionButtonTextDisabled]}>
          {title}
        </Text>
        <FontAwesome name="chevron-right" size={14} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1A2A36',
    fontWeight: '500',
  },
  actionButtonTextDisabled: {
    color: '#8E8E93',
  },
});
