// app/(tabs)/index.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import TransactionList from '@/components/dashboard/TransactionList';
import CourierDashboardScreen from '@/screens/dashboard/CourierDashboardScreen';
import UserDashboardScreen from '@/screens/dashboard/UserDashboardScreen';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const userType = 'User'

  return <>
    <UserDashboardScreen />
  </>

}