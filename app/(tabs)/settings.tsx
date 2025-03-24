import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const settings = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'user-circle',
      color: '#FF6B6B',
      action: () => {},
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell-o',
      color: '#4A90E2',
      action: () => setNotifications(!notifications),
      rightComponent: (
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notifications ? '#4A90E2' : '#f4f3f4'}
        />
      ),
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      icon: 'moon-o',
      color: '#4CAF50',
      action: () => setDarkMode(!darkMode),
      rightComponent: (
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#4CAF50' : '#f4f3f4'}
        />
      ),
    },
    {
      id: 'currency',
      title: 'Currency',
      icon: 'dollar',
      color: '#E91E63',
      action: () => {},
      rightComponent: (
        <View style={styles.currencySelector}>
          <Text style={styles.currencyText}>{currency}</Text>
          <FontAwesome name="chevron-right" size={16} color="#666666" />
        </View>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'lock',
      color: '#9C27B0',
      action: () => {},
      rightComponent: (
        <FontAwesome name="chevron-right" size={16} color="#666666" />
      ),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'question-circle',
      color: '#FF9800',
      action: () => {},
      rightComponent: (
        <FontAwesome name="chevron-right" size={16} color="#666666" />
      ),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'info-circle',
      color: '#607D8B',
      action: () => {},
      rightComponent: (
        <FontAwesome name="chevron-right" size={16} color="#666666" />
      ),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>App preferences</Text>
      </View>

      <View style={styles.section}>
        {settings.map((setting) => (
          <TouchableOpacity
            key={setting.id}
            style={styles.settingItem}
            onPress={setting.action}
          >
            <View style={[styles.settingIcon, { backgroundColor: `${setting.color}20` }]}>
              <FontAwesome name={setting.icon as any} size={20} color={setting.color} />
            </View>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            {setting.rightComponent}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <FontAwesome name="sign-out" size={20} color="#FF6B6B" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  logoutButton: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: 8,
  },
});
