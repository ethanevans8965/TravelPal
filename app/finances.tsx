import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from './context';

type FinanceTab = 'budgets' | 'expenses' | 'reports';

export default function Finances() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('budgets');
  const { trips } = useAppContext();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'budgets':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.contentTitle}>Budget Planning</Text>
            <Text style={styles.contentSubtitle}>
              Manage your overall budgets and trip-specific budget plans
            </Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Budget management features coming soon</Text>
            </View>
          </View>
        );

      case 'expenses':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.contentTitle}>All Expenses</Text>
            <Text style={styles.contentSubtitle}>
              View and manage all your expenses across all trips
            </Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Global expense list coming soon</Text>
            </View>
          </View>
        );

      case 'reports':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.contentTitle}>Financial Reports</Text>
            <Text style={styles.contentSubtitle}>
              Analyze your spending patterns and budget performance
            </Text>
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Reports and analytics coming soon</Text>
            </View>
          </View>
        );

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
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#057B8C',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#057B8C',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 24,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    lineHeight: 22,
  },
  placeholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
