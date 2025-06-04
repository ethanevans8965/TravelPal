import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DashboardCard from './DashboardCard';

interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  prefix?: string;
  suffix?: string;
}

interface QuickStatsGridProps {
  stats: StatItem[];
}

function AnimatedCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayValue = useRef(0);
  const textRef = useRef<Text>(null);

  useEffect(() => {
    displayValue.current = 0;

    const animation = Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    });

    const listener = animatedValue.addListener(({ value: animValue }) => {
      displayValue.current = Math.floor(animValue);
      if (textRef.current) {
        textRef.current.setNativeProps({
          text: `${prefix}${displayValue.current.toLocaleString()}${suffix}`,
        });
      }
    });

    animation.start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, duration, prefix, suffix]);

  return (
    <Text ref={textRef} style={styles.statValue}>
      {prefix}0{suffix}
    </Text>
  );
}

export default function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  return (
    <DashboardCard style={styles.container}>
      <Text style={styles.title}>Quick Stats</Text>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color }]}>
              <FontAwesome name={stat.icon as any} size={20} color="#FFFFFF" />
            </View>
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              duration={1200 + index * 200} // Stagger animations
            />
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
