// src/screens/dashboard/DashboardScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/use-responsiveness';
import HexagonalGrid from '../../components/dashboard/HexagonalGrid';
import TransactionList from '../../components/dashboard/TransactionList';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { scale, isTablet } = useResponsive();

  const transactions = [
    {
      id: '1',
      status: 'Drop off',
      address: '21b, Karimu Kotun Street, Victoria Island',
      timeToLocation: '20 mins to delivery location',
    },
    {
      id: '2',
      status: 'Drop off',
      address: '21b, Karimu Kotun Street, Victoria Island',
      timeToLocation: '20 mins to delivery location',
    },
    {
      id: '3',
      status: 'Drop off',
      address: '21b, Karimu Kotun Street, Victoria Island',
      timeToLocation: '20 mins to delivery location',
    },
  ];

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'light-content'}
        backgroundColor={theme.colors.background}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={[styles.header, { paddingHorizontal: scale(20) }]}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://via.placeholder.com/60' }}
              style={[styles.avatar, { width: scale(60), height: scale(60) }]}
            />
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, { color: theme.colors.text }]}>
                Hi Adam!
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                How can we help you today?
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.messageButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('Messages')}
          >
            <Text style={styles.messageIcon}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Hexagonal Grid */}
        <HexagonalGrid navigation={navigation} />

        {/* Recent Transactions */}
        <View style={[styles.transactionsContainer, { paddingHorizontal: scale(20) }]}>
          <TransactionList transactions={transactions} navigation={navigation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    borderRadius: 30,
    marginRight: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  messageIcon: {
    fontSize: 24,
  },
  transactionsContainer: {
    marginTop: 20,
  },
});

export default DashboardScreen;