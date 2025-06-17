import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Leg } from '../types';

interface LegChipProps {
  leg: Leg;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function LegChip({ leg, isSelected = false, onPress }: LegChipProps) {
  // Get country flag emoji (simple implementation)
  const getCountryFlag = (countryName: string): string => {
    const flagMap: { [key: string]: string } = {
      France: '🇫🇷',
      Italy: '🇮🇹',
      Spain: '🇪🇸',
      Germany: '🇩🇪',
      'United Kingdom': '🇬🇧',
      Japan: '🇯🇵',
      'United States': '🇺🇸',
      Canada: '🇨🇦',
      Australia: '🇦🇺',
      Thailand: '🇹🇭',
      Greece: '🇬🇷',
      Portugal: '🇵🇹',
      Netherlands: '🇳🇱',
      Switzerland: '🇨🇭',
      Austria: '🇦🇹',
    };
    return flagMap[countryName] || '🌍';
  };

  // Format date range
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    };

    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${formatDate(start)} - ${end.getDate()}`;
    }

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const ChipContent = (
    <View style={[styles.chip, isSelected && styles.chipSelected]}>
      <Text style={styles.flag}>{getCountryFlag(leg.country)}</Text>
      <View style={styles.content}>
        <Text style={[styles.country, isSelected && styles.textSelected]}>{leg.country}</Text>
        <Text style={[styles.dates, isSelected && styles.textSelected]}>
          {formatDateRange(leg.startDate, leg.endDate)}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {ChipContent}
      </TouchableOpacity>
    );
  }

  return ChipContent;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  flag: {
    fontSize: 18,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  country: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dates: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  textSelected: {
    color: '#fff',
  },
});
