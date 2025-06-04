import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Expense } from '../../types';
import DashboardCard from './DashboardCard';

interface ActivityItem {
  id: string;
  type: 'expense' | 'trip';
  title: string;
  subtitle: string;
  amount?: number;
  currency?: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  onActivityPress?: (activity: ActivityItem) => void;
  onViewAllPress?: () => void;
}

export default function RecentActivityCard({
  activities,
  onActivityPress,
  onViewAllPress,
}: RecentActivityCardProps) {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (activities.length === 0) {
    return (
      <DashboardCard>
        <View style={styles.header}>
          <Text style={styles.title}>Recent Activity</Text>
        </View>
        <View style={styles.emptyState}>
          <FontAwesome name="clock-o" size={32} color="#8E8E93" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No recent activity</Text>
          <Text style={styles.emptySubtitle}>Your expenses and trip updates will appear here</Text>
        </View>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        {onViewAllPress && (
          <TouchableOpacity onPress={onViewAllPress} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <FontAwesome name="chevron-right" size={12} color="#057B8C" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.activityList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {activities.slice(0, 5).map((activity, index) => (
          <TouchableOpacity
            key={activity.id}
            style={[
              styles.activityItem,
              index === activities.length - 1 && styles.lastActivityItem,
            ]}
            onPress={() => onActivityPress?.(activity)}
            activeOpacity={0.7}
          >
            <View style={styles.timelineContainer}>
              <View style={[styles.iconContainer, { backgroundColor: activity.color }]}>
                <FontAwesome name={activity.icon as any} size={16} color="#FFFFFF" />
              </View>
              {index < activities.slice(0, 5).length - 1 && <View style={styles.timelineLine} />}
            </View>

            <View style={styles.activityContent}>
              <View style={styles.activityMain}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
              </View>

              <View style={styles.activityMeta}>
                {activity.amount && (
                  <Text style={styles.activityAmount}>
                    -${activity.amount.toFixed(2)} {activity.currency}
                  </Text>
                )}
                <Text style={styles.activityTime}>{formatTimestamp(activity.timestamp)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </DashboardCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#057B8C',
    fontWeight: '500',
  },
  activityList: {
    maxHeight: 300,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  lastActivityItem: {
    marginBottom: 0,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E5E7',
    marginTop: 8,
  },
  activityContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityMain: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
