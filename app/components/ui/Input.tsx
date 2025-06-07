import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  variant?: 'default' | 'outlined' | 'filled';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  variant = 'default',
  style,
  ...textInputProps
}) => {
  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: error ? '#FF6B6B' : '#E5E5E5',
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: '#F8F9FA',
          borderWidth: 1,
          borderColor: error ? '#FF6B6B' : 'transparent',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#F8F8F8',
          borderWidth: 1,
          borderColor: error ? '#FF6B6B' : '#E5E5E5',
        };
    }
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: 16,
      color: '#333333',
      paddingVertical: 4,
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <FontAwesome name={leftIcon as any} size={16} color="#666666" style={styles.leftIcon} />
        )}

        <TextInput
          style={[getInputStyle(), style]}
          placeholderTextColor="#999999"
          {...textInputProps}
        />

        {rightIcon && (
          <FontAwesome
            name={rightIcon as any}
            size={16}
            color="#666666"
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 4,
  },
  helpText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});

export default Input;
