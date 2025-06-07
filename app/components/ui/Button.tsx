import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      ...getPaddingForSize(),
    };

    if (fullWidth) {
      baseStyle.flex = 1;
    }

    return {
      ...baseStyle,
      ...getVariantStyle(),
      ...(disabled && styles.disabled),
      ...style,
    };
  };

  const getPaddingForSize = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 20 };
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#E5E5E5' };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#057B8C' };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: '#057B8C' };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      ...getFontSizeForSize(),
    };

    return {
      ...baseStyle,
      ...getTextColorForVariant(),
    };
  };

  const getFontSizeForSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  const getTextColorForVariant = (): TextStyle => {
    if (disabled) {
      return { color: '#999999' };
    }

    switch (variant) {
      case 'secondary':
        return { color: '#333333' };
      case 'outline':
      case 'ghost':
        return { color: '#057B8C' };
      default:
        return { color: '#FFFFFF' };
    }
  };

  const getIconColor = (): string => {
    if (disabled) return '#999999';

    switch (variant) {
      case 'secondary':
        return '#333333';
      case 'outline':
      case 'ghost':
        return '#057B8C';
      default:
        return '#FFFFFF';
    }
  };

  const renderIcon = () => {
    if (!icon) return null;

    const iconSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;
    const marginStyle = iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 };

    return (
      <FontAwesome name={icon as any} size={iconSize} color={getIconColor()} style={marginStyle} />
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {iconPosition === 'left' && renderIcon()}
      <Text style={getTextStyle()}>{title}</Text>
      {iconPosition === 'right' && renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
