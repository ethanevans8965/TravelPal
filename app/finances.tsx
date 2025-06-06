import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useAppContext } from './context';
import { useExpenseStore } from './stores/expenseStore';
import { FontAwesome } from '@expo/vector-icons';
import SpendingTrendChart from './components/charts/SpendingTrendChart';
import CategoryPieChart from './components/charts/CategoryPieChart';
import BudgetPerformanceChart from './components/charts/BudgetPerformanceChart';
import ReportSummary from './components/reports/ReportSummary';
import SwipeableExpenseCard from './components/SwipeableExpenseCard';
import { useRouter } from 'expo-router';
import { Expense } from './types';
import { LinearGradient } from 'expo-linear-gradient';

type FinanceTab = 'budgets' | 'expenses' | 'reports';
type SortOption = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';
type TimePeriod = 'week' | 'month' | 'year' | 'all';
type QuickFilterPreset =
  | 'today'
  | 'thisWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'last30Days'
  | 'last90Days'
  | 'thisYear'
  | 'custom';

export default function Finances() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('budgets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [reportTimePeriod, setReportTimePeriod] = useState<TimePeriod>('month');
  const [expensesPerPage] = useState(20); // Show 20 expenses per page
  const [currentPage, setCurrentPage] = useState(1);

  // Advanced filtering states
  const [quickFilterPreset, setQuickFilterPreset] = useState<QuickFilterPreset>('thisMonth');
  const [dateRangeStart, setDateRangeStart] = useState<string>('');
  const [dateRangeEnd, setDateRangeEnd] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const { trips, expenses } = useAppContext();
  const { deleteExpense } = useExpenseStore();
  const router = useRouter();

  // Get unique categories from expenses
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(expenses.map((e) => e.category))];
    return uniqueCategories.sort();
  }, [expenses]);

  // Quick filter date calculations
  const getQuickFilterDateRange = (preset: QuickFilterPreset) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (preset) {
      case 'today':
        return {
          start: startOfDay.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      case 'thisWeek':
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        return {
          start: startOfWeek.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return {
          start: startOfMonth.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      case 'lastMonth':
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          start: startOfLastMonth.toISOString().split('T')[0],
          end: endOfLastMonth.toISOString().split('T')[0],
        };
      case 'last30Days':
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return {
          start: thirtyDaysAgo.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      case 'last90Days':
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(now.getDate() - 90);
        return {
          start: ninetyDaysAgo.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      case 'thisYear':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return {
          start: startOfYear.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
        };
      default:
        return { start: '', end: '' };
    }
  };

  // Apply quick filter preset
  useEffect(() => {
    if (quickFilterPreset !== 'custom') {
      const { start, end } = getQuickFilterDateRange(quickFilterPreset);
      setDateRangeStart(start);
      setDateRangeEnd(end);
    }
  }, [quickFilterPreset]);

  // Filter and sort expenses with advanced filtering
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    // Filter by search query (enhanced to include tags and descriptions)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query) ||
          (expense.tags && expense.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Filter by date range
    if (dateRangeStart && dateRangeEnd) {
      filtered = filtered.filter((expense) => {
        const expenseDate = expense.date.split('T')[0];
        return expenseDate >= dateRangeStart && expenseDate <= dateRangeEnd;
      });
    }

    // Filter by amount range
    if (minAmount) {
      const min = parseFloat(minAmount);
      if (!isNaN(min)) {
        filtered = filtered.filter((expense) => expense.amount >= min);
      }
    }
    if (maxAmount) {
      const max = parseFloat(maxAmount);
      if (!isNaN(max)) {
        filtered = filtered.filter((expense) => expense.amount <= max);
      }
    }

    // Filter by categories (multi-select or single)
    if (multiSelectMode && selectedCategories.length > 0) {
      filtered = filtered.filter((expense) => selectedCategories.includes(expense.category));
    } else if (!multiSelectMode && selectedCategory !== 'all') {
      filtered = filtered.filter((expense) => expense.category === selectedCategory);
    }

    // Filter by trips (multi-select or single)
    if (multiSelectMode && selectedTrips.length > 0) {
      filtered = filtered.filter((expense) =>
        expense.tripId ? selectedTrips.includes(expense.tripId) : selectedTrips.includes('general')
      );
    } else if (!multiSelectMode && selectedTrip !== 'all') {
      if (selectedTrip === 'general') {
        filtered = filtered.filter((expense) => !expense.tripId);
      } else {
        filtered = filtered.filter((expense) => expense.tripId === selectedTrip);
      }
    }

    // Sort expenses
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [
    expenses,
    searchQuery,
    dateRangeStart,
    dateRangeEnd,
    minAmount,
    maxAmount,
    selectedCategory,
    selectedTrip,
    selectedCategories,
    selectedTrips,
    multiSelectMode,
    sortBy,
    sortOrder,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTrip('all');
    setSelectedCategories([]);
    setSelectedTrips([]);
    setMinAmount('');
    setMaxAmount('');
    setQuickFilterPreset('thisMonth');
    setMultiSelectMode(false);
  };

  // Toggle category in multi-select mode
  const toggleCategory = (category: string) => {
    if (multiSelectMode) {
      setSelectedCategories((prev) =>
        prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
      );
    } else {
      setSelectedCategory(category);
    }
  };

  // Toggle trip in multi-select mode
  const toggleTrip = (tripId: string) => {
    if (multiSelectMode) {
      setSelectedTrips((prev) =>
        prev.includes(tripId) ? prev.filter((t) => t !== tripId) : [...prev, tripId]
      );
    } else {
      setSelectedTrip(tripId);
    }
  };

  // Paginated expenses for display
  const paginatedExpenses = useMemo(() => {
    return filteredExpenses.slice(0, currentPage * expensesPerPage);
  }, [filteredExpenses, currentPage, expensesPerPage]);

  const hasMoreExpenses = filteredExpenses.length > paginatedExpenses.length;

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Reset pagination when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [searchQuery, selectedCategory, selectedTrip, sortBy, sortOrder]);

  // Calculate expense statistics
  const expenseStats = useMemo(() => {
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageAmount = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
    const categoryTotals: Record<string, number> = {};

    filteredExpenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

    return {
      totalAmount,
      averageAmount,
      count: filteredExpenses.length,
      topCategory: topCategory ? { category: topCategory[0], amount: topCategory[1] } : null,
    };
  }, [filteredExpenses]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get emoji for expense category
  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      food: '🍽️',
      transportation: '🚇',
      accommodation: '🏨',
      activities: '🎯',
      shopping: '🛍️',
      other: '💰',
    };
    return emojiMap[category] || '💰';
  };

  // Get trip name by ID
  const getTripName = (tripId?: string) => {
    if (!tripId) return 'General Expense';
    const trip = trips.find((t) => t.id === tripId);
    return trip ? trip.name : 'Unknown Trip';
  };

  // Calculate budget statistics
  const calculateBudgetStats = () => {
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0);
    const totalDailyBudget = trips.reduce((sum, trip) => sum + (trip.dailyBudget || 0), 0);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalBudget,
      totalDailyBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      percentageUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    };
  };

  // Calculate trip-specific budget vs spending
  const getTripBudgetData = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return null;

    const tripExpenses = expenses.filter((e) => e.tripId === tripId);
    const totalSpent = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budget = trip.totalBudget || 0;

    // Calculate category spending
    const categorySpending: Record<string, number> = {};
    tripExpenses.forEach((expense) => {
      categorySpending[expense.category] =
        (categorySpending[expense.category] || 0) + expense.amount;
    });

    return {
      trip,
      totalSpent,
      budget,
      remaining: budget - totalSpent,
      percentageUsed: budget > 0 ? (totalSpent / budget) * 100 : 0,
      categorySpending,
    };
  };

  // Handle edit expense
  const handleEditExpense = (expense: Expense) => {
    // TODO: Navigate to edit expense screen
    // For now, we'll show an alert
    console.log('Edit expense:', expense);
    // router.push(`/expenses/edit/${expense.id}`);
  };

  const renderExpensesTab = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.contentTitle}>All Expenses</Text>
        <Text style={styles.contentSubtitle}>
          View and manage all your expenses across all trips
        </Text>

        {/* Expense Statistics */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${expenseStats.totalAmount.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{expenseStats.count}</Text>
              <Text style={styles.statLabel}>Expenses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${expenseStats.averageAmount.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
          </View>
          {expenseStats.topCategory && (
            <View style={styles.topCategoryRow}>
              <Text style={styles.topCategoryText}>
                Top category: {expenseStats.topCategory.category} ($
                {expenseStats.topCategory.amount.toLocaleString()})
              </Text>
            </View>
          )}
        </View>

        {/* Quick Filter Presets */}
        <View style={styles.quickFiltersContainer}>
          <View style={styles.quickFiltersHeader}>
            <Text style={styles.filterLabel}>Quick Filters</Text>
            <View style={styles.quickFiltersActions}>
              <TouchableOpacity
                style={[styles.filterToggle, multiSelectMode && styles.activeFilterToggle]}
                onPress={() => setMultiSelectMode(!multiSelectMode)}
              >
                <FontAwesome
                  name="check-square-o"
                  size={14}
                  color={multiSelectMode ? '#057B8C' : '#8E8E93'}
                />
                <Text
                  style={[
                    styles.filterToggleText,
                    multiSelectMode && styles.activeFilterToggleText,
                  ]}
                >
                  Multi-select
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                <FontAwesome name="refresh" size={14} color="#FF3B30" />
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickFiltersScroll}
          >
            {(
              [
                { key: 'today', label: 'Today' },
                { key: 'thisWeek', label: 'This Week' },
                { key: 'thisMonth', label: 'This Month' },
                { key: 'lastMonth', label: 'Last Month' },
                { key: 'last30Days', label: 'Last 30 Days' },
                { key: 'last90Days', label: 'Last 90 Days' },
                { key: 'thisYear', label: 'This Year' },
              ] as Array<{ key: QuickFilterPreset; label: string }>
            ).map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.quickFilterChip,
                  quickFilterPreset === key && styles.activeQuickFilterChip,
                ]}
                onPress={() => setQuickFilterPreset(key)}
              >
                <Text
                  style={[
                    styles.quickFilterChipText,
                    quickFilterPreset === key && styles.activeQuickFilterChipText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersContainer}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses, categories, or tags..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <FontAwesome name="times-circle" size={16} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>

          {/* Advanced Filters Toggle */}
          <TouchableOpacity
            style={styles.advancedFiltersToggle}
            onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <FontAwesome name="sliders" size={16} color="#057B8C" />
            <Text style={styles.advancedFiltersToggleText}>Advanced Filters</Text>
            <FontAwesome
              name={showAdvancedFilters ? 'chevron-up' : 'chevron-down'}
              size={12}
              color="#057B8C"
            />
          </TouchableOpacity>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <View style={styles.advancedFiltersPanel}>
              {/* Date Range */}
              <View style={styles.advancedFilterGroup}>
                <Text style={styles.advancedFilterLabel}>Date Range</Text>
                <View style={styles.dateRangeContainer}>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.dateInputLabel}>From</Text>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="YYYY-MM-DD"
                      value={dateRangeStart}
                      onChangeText={(text) => {
                        setDateRangeStart(text);
                        setQuickFilterPreset('custom');
                      }}
                      placeholderTextColor="#8E8E93"
                    />
                  </View>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.dateInputLabel}>To</Text>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="YYYY-MM-DD"
                      value={dateRangeEnd}
                      onChangeText={(text) => {
                        setDateRangeEnd(text);
                        setQuickFilterPreset('custom');
                      }}
                      placeholderTextColor="#8E8E93"
                    />
                  </View>
                </View>
              </View>

              {/* Amount Range */}
              <View style={styles.advancedFilterGroup}>
                <Text style={styles.advancedFilterLabel}>Amount Range</Text>
                <View style={styles.amountRangeContainer}>
                  <View style={styles.amountInputGroup}>
                    <Text style={styles.amountInputLabel}>Min ($)</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0"
                      value={minAmount}
                      onChangeText={setMinAmount}
                      keyboardType="numeric"
                      placeholderTextColor="#8E8E93"
                    />
                  </View>
                  <View style={styles.amountInputGroup}>
                    <Text style={styles.amountInputLabel}>Max ($)</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="∞"
                      value={maxAmount}
                      onChangeText={setMaxAmount}
                      keyboardType="numeric"
                      placeholderTextColor="#8E8E93"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Filter Row */}
          <View style={styles.filterRow}>
            {/* Category Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>
                Category{' '}
                {multiSelectMode &&
                  selectedCategories.length > 0 &&
                  `(${selectedCategories.length})`}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
              >
                {!multiSelectMode && (
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      selectedCategory === 'all' && styles.activeFilterChip,
                    ]}
                    onPress={() => toggleCategory('all')}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === 'all' && styles.activeFilterChipText,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                )}
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      (multiSelectMode
                        ? selectedCategories.includes(category)
                        : selectedCategory === category) && styles.activeFilterChip,
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        (multiSelectMode
                          ? selectedCategories.includes(category)
                          : selectedCategory === category) && styles.activeFilterChipText,
                      ]}
                    >
                      {getCategoryEmoji(category)} {category}
                      {multiSelectMode && selectedCategories.includes(category) && (
                        <FontAwesome
                          name="check"
                          size={12}
                          color="#057B8C"
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Trip Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>
                Trip {multiSelectMode && selectedTrips.length > 0 && `(${selectedTrips.length})`}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
              >
                {!multiSelectMode && (
                  <TouchableOpacity
                    style={[styles.filterChip, selectedTrip === 'all' && styles.activeFilterChip]}
                    onPress={() => toggleTrip('all')}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedTrip === 'all' && styles.activeFilterChipText,
                      ]}
                    >
                      All Trips
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    (multiSelectMode
                      ? selectedTrips.includes('general')
                      : selectedTrip === 'general') && styles.activeFilterChip,
                  ]}
                  onPress={() => toggleTrip('general')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      (multiSelectMode
                        ? selectedTrips.includes('general')
                        : selectedTrip === 'general') && styles.activeFilterChipText,
                    ]}
                  >
                    💼 General
                    {multiSelectMode && selectedTrips.includes('general') && (
                      <FontAwesome
                        name="check"
                        size={12}
                        color="#057B8C"
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </Text>
                </TouchableOpacity>
                {trips.map((trip) => (
                  <TouchableOpacity
                    key={trip.id}
                    style={[
                      styles.filterChip,
                      (multiSelectMode
                        ? selectedTrips.includes(trip.id)
                        : selectedTrip === trip.id) && styles.activeFilterChip,
                    ]}
                    onPress={() => toggleTrip(trip.id)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        (multiSelectMode
                          ? selectedTrips.includes(trip.id)
                          : selectedTrip === trip.id) && styles.activeFilterChipText,
                      ]}
                    >
                      {trip.name}
                      {multiSelectMode && selectedTrips.includes(trip.id) && (
                        <FontAwesome
                          name="check"
                          size={12}
                          color="#057B8C"
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.sortContainer}>
            <Text style={styles.filterLabel}>Sort by</Text>
            <View style={styles.sortButtons}>
              {(['date', 'amount', 'category'] as SortOption[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.sortButton, sortBy === option && styles.activeSortButton]}
                  onPress={() => {
                    if (sortBy === option) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy(option);
                      setSortOrder('desc');
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortBy === option && styles.activeSortButtonText,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                  {sortBy === option && (
                    <FontAwesome
                      name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                      size={12}
                      color="#057B8C"
                      style={styles.sortIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Active Filters Summary */}
        {(searchQuery ||
          selectedCategories.length > 0 ||
          selectedTrips.length > 0 ||
          minAmount ||
          maxAmount ||
          quickFilterPreset !== 'thisMonth') && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.activeFiltersScroll}
            >
              {searchQuery && (
                <View style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>Search: "{searchQuery}"</Text>
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <FontAwesome name="times" size={12} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              )}
              {quickFilterPreset !== 'thisMonth' && (
                <View style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    {quickFilterPreset === 'custom'
                      ? 'Custom Date'
                      : quickFilterPreset.replace(/([A-Z])/g, ' $1')}
                  </Text>
                  <TouchableOpacity onPress={() => setQuickFilterPreset('thisMonth')}>
                    <FontAwesome name="times" size={12} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedCategories.map((category) => (
                <View key={category} style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    {getCategoryEmoji(category)} {category}
                  </Text>
                  <TouchableOpacity onPress={() => toggleCategory(category)}>
                    <FontAwesome name="times" size={12} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedTrips.map((tripId) => (
                <View key={tripId} style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    {tripId === 'general' ? '💼 General' : getTripName(tripId)}
                  </Text>
                  <TouchableOpacity onPress={() => toggleTrip(tripId)}>
                    <FontAwesome name="times" size={12} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              ))}
              {(minAmount || maxAmount) && (
                <View style={styles.activeFilterTag}>
                  <Text style={styles.activeFilterText}>
                    ${minAmount || '0'} - ${maxAmount || '∞'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setMinAmount('');
                      setMaxAmount('');
                    }}
                  >
                    <FontAwesome name="times" size={12} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Expenses List */}
        {paginatedExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="file-text" size={48} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ||
              selectedCategory !== 'all' ||
              selectedTrip !== 'all' ||
              selectedCategories.length > 0 ||
              selectedTrips.length > 0 ||
              minAmount ||
              maxAmount
                ? 'No matching expenses'
                : 'No expenses yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ||
              selectedCategory !== 'all' ||
              selectedTrip !== 'all' ||
              selectedCategories.length > 0 ||
              selectedTrips.length > 0 ||
              minAmount ||
              maxAmount
                ? 'Try adjusting your filters or search terms'
                : 'Start tracking your travel expenses'}
            </Text>
          </View>
        ) : (
          <View style={styles.expensesList}>
            {paginatedExpenses.map((expense, index) => (
              <SwipeableExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={() => deleteExpense(expense.id)}
                onEdit={() => handleEditExpense(expense)}
                getTripName={getTripName}
                formatDate={formatDate}
                getCategoryEmoji={getCategoryEmoji}
                isLast={index === paginatedExpenses.length - 1}
              />
            ))}
          </View>
        )}

        {hasMoreExpenses && (
          <TouchableOpacity onPress={handleLoadMore} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreButtonText}>
              Load More ({filteredExpenses.length - paginatedExpenses.length} remaining)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderBudgetsTab = () => {
    const stats = calculateBudgetStats();
    const activeTrips = trips.filter(
      (trip) => trip.status === 'active' || trip.status === 'planning'
    );

    return (
      <View style={styles.tabContent}>
        <Text style={styles.contentTitle}>Budget Overview</Text>
        <Text style={styles.contentSubtitle}>Track your budget performance across all trips</Text>

        {/* Overall Budget Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Total Budget Summary</Text>
            <FontAwesome
              name={stats.percentageUsed > 100 ? 'exclamation-triangle' : 'check-circle'}
              size={20}
              color={stats.percentageUsed > 100 ? '#FF3B30' : '#34C759'}
            />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${stats.totalBudget.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Budget</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FF3B30' }]}>
                ${stats.totalSpent.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[styles.statValue, { color: stats.remaining >= 0 ? '#34C759' : '#FF3B30' }]}
              >
                ${Math.abs(stats.remaining).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>
                {stats.remaining >= 0 ? 'Remaining' : 'Over Budget'}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(stats.percentageUsed, 100)}%`,
                    backgroundColor:
                      stats.percentageUsed > 90
                        ? '#FF3B30'
                        : stats.percentageUsed > 75
                          ? '#FF9500'
                          : '#057B8C',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{stats.percentageUsed.toFixed(1)}% used</Text>
          </View>
        </View>

        {/* Trip Budget Cards */}
        <Text style={styles.sectionTitle}>Trip Budgets</Text>

        {activeTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="suitcase" size={48} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No Active Trips</Text>
            <Text style={styles.emptyStateText}>Create a trip to start budget planning</Text>
          </View>
        ) : (
          activeTrips.map((trip) => {
            const budgetData = getTripBudgetData(trip.id);
            if (!budgetData) return null;

            return (
              <View key={trip.id} style={styles.tripBudgetCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripName}>{trip.name}</Text>
                    <Text style={styles.tripDestination}>
                      {trip.destination?.name || 'Unknown destination'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: trip.status === 'active' ? '#34C759' : '#FF9500' },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {trip.status === 'active' ? 'Active' : 'Planning'}
                    </Text>
                  </View>
                </View>

                <View style={styles.budgetStats}>
                  <View style={styles.budgetStatItem}>
                    <Text style={styles.budgetAmount}>
                      ${budgetData.totalSpent.toLocaleString()}
                    </Text>
                    <Text style={styles.budgetLabel}>Spent</Text>
                  </View>
                  <View style={styles.budgetStatItem}>
                    <Text style={styles.budgetAmount}>${budgetData.budget.toLocaleString()}</Text>
                    <Text style={styles.budgetLabel}>Budget</Text>
                  </View>
                  <View style={styles.budgetStatItem}>
                    <Text
                      style={[
                        styles.budgetAmount,
                        { color: budgetData.remaining >= 0 ? '#34C759' : '#FF3B30' },
                      ]}
                    >
                      ${Math.abs(budgetData.remaining).toLocaleString()}
                    </Text>
                    <Text style={styles.budgetLabel}>
                      {budgetData.remaining >= 0 ? 'Left' : 'Over'}
                    </Text>
                  </View>
                </View>

                {/* Trip Progress Bar */}
                <View style={styles.tripProgressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(budgetData.percentageUsed, 100)}%`,
                          backgroundColor:
                            budgetData.percentageUsed > 90
                              ? '#FF3B30'
                              : budgetData.percentageUsed > 75
                                ? '#FF9500'
                                : '#057B8C',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.tripProgressText}>
                    {budgetData.percentageUsed.toFixed(1)}% used
                  </Text>
                </View>

                {/* Category Breakdown */}
                {Object.keys(budgetData.categorySpending).length > 0 && (
                  <View style={styles.categoryBreakdown}>
                    <Text style={styles.categoryTitle}>Top Spending Categories</Text>
                    {Object.entries(budgetData.categorySpending)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([category, amount]) => (
                        <View key={category} style={styles.categoryItem}>
                          <Text style={styles.categoryName}>{category}</Text>
                          <Text style={styles.categoryAmount}>${amount.toLocaleString()}</Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    );
  };

  const renderReportsTab = () => {
    // Filter expenses based on selected time period
    const getFilteredExpensesForReports = () => {
      if (reportTimePeriod === 'all') return expenses;

      const now = new Date();
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const daysDiff = Math.floor(
          (now.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (reportTimePeriod) {
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          case 'year':
            return daysDiff <= 365;
          default:
            return true;
        }
      });
    };

    const filteredReportExpenses = getFilteredExpensesForReports();

    return (
      <View style={styles.tabContent}>
        <Text style={styles.contentTitle}>Financial Reports</Text>
        <Text style={styles.contentSubtitle}>
          Analyze your spending patterns and budget performance
        </Text>

        {/* Time Period Selector */}
        <View style={styles.timePeriodContainer}>
          <Text style={styles.filterLabel}>Time Period</Text>
          <View style={styles.timePeriodButtons}>
            {(['week', 'month', 'year', 'all'] as TimePeriod[]).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.timePeriodButton,
                  reportTimePeriod === period && styles.activeTimePeriodButton,
                ]}
                onPress={() => setReportTimePeriod(period)}
              >
                <Text
                  style={[
                    styles.timePeriodButtonText,
                    reportTimePeriod === period && styles.activeTimePeriodButtonText,
                  ]}
                >
                  {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Report Summary */}
        <ReportSummary
          trips={trips}
          expenses={filteredReportExpenses}
          timePeriod={reportTimePeriod}
        />

        {/* Charts Section */}
        {filteredReportExpenses.length > 0 ? (
          <>
            {/* Spending Trend Chart */}
            <SpendingTrendChart
              expenses={filteredReportExpenses}
              timePeriod={reportTimePeriod === 'all' ? 'month' : reportTimePeriod}
              title={`Spending Trend - ${reportTimePeriod === 'all' ? 'Monthly View' : reportTimePeriod.charAt(0).toUpperCase() + reportTimePeriod.slice(1)}`}
            />

            {/* Category Distribution */}
            <CategoryPieChart
              expenses={filteredReportExpenses}
              title="Spending by Category"
              showLegend={true}
            />

            {/* Budget Performance */}
            <BudgetPerformanceChart
              trips={trips}
              expenses={filteredReportExpenses}
              title="Budget vs Actual Spending"
              showByCategory={false}
            />

            {/* Category Budget Performance */}
            <BudgetPerformanceChart
              trips={trips}
              expenses={filteredReportExpenses}
              title="Budget Performance by Category"
              showByCategory={true}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="bar-chart" size={48} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No data for selected period</Text>
            <Text style={styles.emptyStateText}>
              Try selecting a different time period or add some expenses
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'budgets':
        return renderBudgetsTab();

      case 'expenses':
        return renderExpensesTab();

      case 'reports':
        return renderReportsTab();

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Finances</Text>
        <Text style={styles.subtitle}>Manage budgets, expenses, and reports</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'budgets' && styles.activeTab]}
          onPress={() => setActiveTab('budgets')}
        >
          <Text style={[styles.tabText, activeTab === 'budgets' && styles.activeTabText]}>
            Budgets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
            All Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
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
    paddingHorizontal: 16,
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
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    fontWeight: '500',
  },

  // Stats Card
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topCategoryRow: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  topCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },

  // Quick Filters
  quickFiltersContainer: {
    marginBottom: 24,
  },
  quickFiltersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  quickFiltersActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeFilterToggle: {
    backgroundColor: '#0EA5E9',
  },
  filterToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeFilterToggleText: {
    color: '#FFFFFF',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  quickFiltersScroll: {
    paddingHorizontal: 4,
  },
  quickFilterChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
  activeQuickFilterChip: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  quickFilterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  activeQuickFilterChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Filters Container
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },

  // Advanced Filters
  advancedFiltersToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  advancedFiltersToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  advancedFiltersPanel: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  advancedFilterGroup: {
    marginBottom: 20,
  },
  advancedFilterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputGroup: {
    flex: 1,
  },
  dateInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontWeight: '500',
  },
  amountRangeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInputGroup: {
    flex: 1,
  },
  amountInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontWeight: '500',
  },

  // Filter Row
  filterRow: {
    gap: 20,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingVertical: 4,
  },
  filterChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterChip: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },

  // Sort Options
  sortContainer: {
    marginTop: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  activeSortButton: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  sortIcon: {
    marginLeft: 2,
  },

  // Active Filters
  activeFiltersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  activeFiltersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  activeFiltersScroll: {
    paddingVertical: 4,
  },
  activeFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    gap: 8,
  },
  activeFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
  },

  // Expenses List
  expensesList: {
    gap: 12,
  },

  // Load More Button
  loadMoreButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  loadMoreButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
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
    lineHeight: 24,
    fontWeight: '500',
  },

  // Budget Tab Styles
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  tripBudgetCard: {
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
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  budgetStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  budgetLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tripProgressContainer: {
    marginBottom: 16,
  },
  tripProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  categoryBreakdown: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0EA5E9',
  },

  // Reports Tab Styles
  timePeriodContainer: {
    marginBottom: 24,
  },
  timePeriodButtons: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  timePeriodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTimePeriodButton: {
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timePeriodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTimePeriodButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Placeholder
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginVertical: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
