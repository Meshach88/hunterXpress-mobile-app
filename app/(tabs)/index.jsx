import React from 'react';
import CourierDashboardScreen from '@/screens/dashboard/CourierDashboardScreen';
import UserDashboardScreen from '@/screens/dashboard/UserDashboardScreen';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const { userType } = useAuth()
  return <>
    {userType == 'customer' ?
      <UserDashboardScreen />
      :
      <CourierDashboardScreen />
    }
  </>
}