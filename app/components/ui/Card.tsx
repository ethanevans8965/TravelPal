import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  status?: 'empty' | 'partial' | 'complete';
  style?: ViewStyle;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  iconColor = '#057B8C',
  onPress,
  variant = 'default',
  status,
  style,
  headerAction,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E5E5E5',
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#F8F9FA',
        };
    }
  };

  const getStatusIndicatorStyle = () => {
    if (!status) return null;

    const colors = {
      empty: '#E5E5E5',
      partial: '#FF9500',
      complete: '#34C759',
    };

    return {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors[status],
      marginRight: 12,
    };
  };

  const renderHeader = () => {
    if (!title && !icon && !headerAction) return null;

    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {status && <View style={getStatusIndicatorStyle()} />}
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
              <FontAwesome name={icon as any} size={16} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {headerAction && <View style={styles.headerRight}>{headerAction}</View>}
      </View>
    );
  };

  const CardContent = () => (
    <View style={[getCardStyle(), style]}>
      {renderHeader()}
      {children && <View style={title ? styles.content : undefined}>{children}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    marginLeft: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    marginTop: 8,
  },
});

export default Card;
