import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '../../context';
import { useExpenseStore } from '../../stores/expenseStore';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SwipeableExpenseCard from '../../components/SwipeableExpenseCard';

type TripTab = 'overview' | 'budget';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planning':
      return '#007AFF';
    case 'active':
      return '#34C759';
    case 'completed':
      return '#8E8E93';
    case 'cancelled':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getCategoryEmoji = (category: string) => {
  const emojiMap: Record<string, string> = {
    food: '🍽️',
    transport: '🚗',
    accommodation: '🏨',
    activities: '🎯',
    shopping: '🛍️',
    health: '💊',
    communication: '📱',
    entertainment: '🎭',
    other: '📋',
  };
  return emojiMap[category] || '💰';
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { trips, locations, deleteTrip } = useAppContext();
  const { getExpensesByTripId, deleteExpense } = useExpenseStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TripTab>('overview');
  const [expensesModalVisible, setExpensesModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const editMenuAnim = useRef(new Animated.Value(0)).current;
  const deleteMenuAnim = useRef(new Animated.Value(0)).current;
  const editScaleAnim = useRef(new Animated.Value(0.8)).current;
  const deleteScaleAnim = useRef(new Animated.Value(0.8)).current;

  const trip = trips.find((t) => t.id === id);
  const location = locations.find((l) => l.id === trip?.locationId);
  const tripExpenses = trip ? getExpensesByTripId(trip.id) : [];

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  const destinationName =
    location?.country ||
    location?.name ||
    trip.destination?.country ||
    trip.destination?.name ||
    'Unknown destination';

  // Calculate budget statistics
  const calculateBudgetStats = () => {
    const totalSpent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budget = trip.totalBudget || 0;
    const remaining = budget - totalSpent;
    const percentageUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

    // Category spending breakdown
    const categorySpending: Record<string, number> = {};
    tripExpenses.forEach((expense) => {
      categorySpending[expense.category] =
        (categorySpending[expense.category] || 0) + expense.amount;
    });

    return {
      totalSpent,
      budget,
      remaining,
      percentageUsed,
      categorySpending,
    };
  };

  const budgetStats = calculateBudgetStats();

  const handleEditExpense = (expense: any) => {
    console.log('Edit expense:', expense);
    // TODO: Navigate to edit expense screen
  };

  const handleAddExpense = () => {
    router.push({
      pathname: '/expenses/add/expense-details',
      params: {
        tripId: trip.id,
        general: 'false',
      },
    });
  };

  const handleViewAllExpenses = () => {
    setExpensesModalVisible(true);
  };

  const showMenu = () => {
    setMenuVisible(true);

    // Reset animations
    fadeAnim.setValue(0);
    editMenuAnim.setValue(-20);
    deleteMenuAnim.setValue(-20);
    editScaleAnim.setValue(0.8);
    deleteScaleAnim.setValue(0.8);

    // Start animations with staggered timing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(50),
        Animated.parallel([
          Animated.spring(editMenuAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(editScaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          Animated.spring(deleteMenuAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(deleteScaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  };

  const hideMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(editMenuAnim, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(deleteMenuAnim, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(editScaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(deleteScaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuVisible(false);
    });
  };

  const handleEditTrip = () => {
    hideMenu();
    setTimeout(() => {
      Alert.alert('Edit Trip', 'Edit trip functionality will be implemented soon!');
    }, 200);
  };

  const handleDeleteTrip = () => {
    hideMenu();

    setTimeout(() => {
      Alert.alert(
        'Delete Trip',
        `Are you sure you want to delete "${trip.name}"? This will also delete all associated expenses and cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              try {
                deleteTrip(trip.id);
                Alert.alert('Success', 'Trip deleted successfully!', [
                  {
                    text: 'OK',
                    onPress: () => router.push('/trips'),
                  },
                ]);
              } catch (error) {
                Alert.alert('Error', 'Failed to delete trip. Please try again.');
                console.error('Error deleting trip:', error);
              }
            },
          },
        ]
      );
    }, 200);
  };

  const renderExpensesModal = () => (
    <Modal
      visible={expensesModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setExpensesModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setExpensesModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Trip Expenses</Text>
          <TouchableOpacity style={styles.modalAddButton} onPress={handleAddExpense}>
            <FontAwesome name="plus" size={16} color="#0EA5E9" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {tripExpenses.length > 0 ? (
            <View style={styles.expensesList}>
              {tripExpenses.map((expense, index) => (
                <SwipeableExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={handleEditExpense}
                  onDelete={deleteExpense}
                  getTripName={() => trip.name}
                  formatDate={formatDate}
                  getCategoryEmoji={getCategoryEmoji}
                  isLast={index === tripExpenses.length - 1}
                />
              ))}
            </View>
          ) : (
            <View style={styles.modalEmptyState}>
              <FontAwesome name="file-text-o" size={48} color="#C7C7CC" />
              <Text style={styles.emptyStateTitle}>No expenses yet</Text>
              <Text style={styles.emptyStateText}>Start tracking expenses for this trip</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
                <FontAwesome name="plus" size={16} color="#fff" />
                <Text style={styles.addButtonText}>Add First Expense</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderActionMenu = () => (
    <Modal visible={menuVisible} transparent={true} animationType="none" onRequestClose={hideMenu}>
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={hideMenu}>
        <Animated.View
          style={[
            styles.menuBackdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        />

        <View style={styles.menuPositioner}>
          <Animated.View
            style={[
              styles.menuItem,
              {
                opacity: fadeAnim,
                transform: [{ translateY: editMenuAnim }, { scale: editScaleAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.menuItemButton} onPress={handleEditTrip}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuItemIcon, { backgroundColor: '#0EA5E9' }]}>
                  <FontAwesome name="edit" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemText}>Edit Trip</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.menuItem,
              {
                opacity: fadeAnim,
                transform: [{ translateY: deleteMenuAnim }, { scale: deleteScaleAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.menuItemButton} onPress={handleDeleteTrip}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuItemIcon, { backgroundColor: '#FF3B30' }]}>
                  <FontAwesome name="trash" size={16} color="#FFFFFF" />
                </View>
                <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Delete Trip</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Trip Header */}
      <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.tripHeader}>
        <View style={styles.tripHeaderContent}>
          <View style={styles.tripHeaderText}>
            <Text style={styles.tripName}>{trip.name}</Text>
            <Text style={styles.destination}>{destinationName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
              <Text style={styles.statusText}>{trip.status}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.menuButton} onPress={showMenu}>
            <FontAwesome name="ellipsis-v" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tripExpenses.length}</Text>
          <Text style={styles.statLabel}>Expenses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${budgetStats.totalSpent.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[
              styles.statValue,
              { color: budgetStats.remaining >= 0 ? '#34C759' : '#FF3B30' },
            ]}
          >
            ${Math.abs(budgetStats.remaining).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>{budgetStats.remaining >= 0 ? 'Remaining' : 'Over'}</Text>
        </View>
      </View>

      {/* Trip Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Details</Text>
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Text>
        </View>

        {trip.travelStyle && (
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>{trip.travelStyle} Travel</Text>
          </View>
        )}

        {trip.dailyBudget && (
          <View style={styles.detailRow}>
            <FontAwesome name="money" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>
              ${trip.dailyBudget}/day
              {trip.totalBudget && ` (Total: $${trip.totalBudget.toLocaleString()})`}
            </Text>
          </View>
        )}
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={handleViewAllExpenses}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {tripExpenses.slice(0, 3).map((expense, index) => (
          <SwipeableExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={handleEditExpense}
            onDelete={deleteExpense}
            getTripName={() => trip.name}
            formatDate={formatDate}
            getCategoryEmoji={getCategoryEmoji}
            isLast={index === 2}
          />
        ))}
        {tripExpenses.length === 0 && (
          <Text style={styles.emptyText}>No expenses recorded for this trip yet</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderBudgetTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Budget Overview */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.budgetOverview}>
        <Text style={styles.budgetTitle}>Budget Overview</Text>
        <Text style={styles.budgetAmount}>
          ${budgetStats.totalSpent.toLocaleString()} / ${budgetStats.budget.toLocaleString()}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(budgetStats.percentageUsed, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{budgetStats.percentageUsed.toFixed(1)}% used</Text>
        </View>
      </LinearGradient>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {Object.entries(budgetStats.categorySpending).length > 0 ? (
          Object.entries(budgetStats.categorySpending)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryAmount}>${amount.toLocaleString()}</Text>
              </View>
            ))
        ) : (
          <Text style={styles.emptyText}>No expenses recorded yet</Text>
        )}
      </View>

      {/* Budget Categories */}
      {Object.keys(trip.categories).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planned Budget Categories</Text>
          {Object.entries(trip.categories).map(([category, amount]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
                <Text style={styles.categoryName}>{category}</Text>
              </View>
              <Text style={styles.categoryAmount}>${amount}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'budget':
        return renderBudgetTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
          onPress={() => setActiveTab('budget')}
        >
          <Text style={[styles.tabText, activeTab === 'budget' && styles.activeTabText]}>
            Budget
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Expenses Modal */}
      {renderExpensesModal()}

      {/* Action Menu */}
      {renderActionMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Tab Navigation
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Tab Content
  tabContent: {
    flex: 1,
    padding: 16,
  },

  // Trip Header
  tripHeader: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tripHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripHeaderText: {
    flexDirection: 'column',
  },
  tripName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  destination: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Section
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '700',
  },

  // Detail Row
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
    flex: 1,
    fontWeight: '600',
  },

  // Empty Text
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 24,
    fontWeight: '500',
  },

  // Expenses Header
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Expenses List
  expensesList: {
    gap: 12,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    lineHeight: 24,
  },

  // Budget Overview
  budgetOverview: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  budgetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
  },

  // Category Info
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryName: {
    fontSize: 16,
    color: '#1E293B',
    textTransform: 'capitalize',
    fontWeight: '600',
    flex: 1,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0EA5E9',
  },

  // Error Text
  errorText: {
    fontSize: 18,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 50,
    fontWeight: '600',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 40,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },

  // Action Menu
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 160, // Position menu below the header
    paddingRight: 20,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuPositioner: {
    alignItems: 'flex-end',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  menuItemButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
