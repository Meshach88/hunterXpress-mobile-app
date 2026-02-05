// app/(tabs)/index.js - Courier Dashboard
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/use-responsiveness';

export default function CourierDashboardScreen() {
  const router = useRouter();
  const { user, userType } = useAuth();
  const { theme } = useTheme();
  const { scale, spacing, fontSize, isTablet } = useResponsive();

  const [isOnline, setIsOnline] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    incomingCount: 3,
    activeDelivery: {
      id: '4819',
      status: 'In Progress',
    },
    earnings: 32.50,
    timeOnline: {
      hours: 1,
      minutes: 45,
    },
    address: '21b, Karimu Kotun Street, Victoria Island',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch courier data on mount
  useEffect(() => {
    fetchCourierData();
  }, []);

  const fetchCourierData = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`https://your-api.com/api/courier/dashboard/${user?.id}`);
      const data = await response.json();

      if (response.ok) {
        setDashboardData(data);
        setIsOnline(data.isOnline || false);
      }
    } catch (error) {
      console.error('Error fetching courier data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOnlineStatus = async (value) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsOnline(value);

    try {
      // Update online status on backend
      const response = await fetch(`https://your-api.com/api/courier/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courierId: user?.id,
          isOnline: value,
        }),
      });

      if (!response.ok) {
        // Revert if API call fails
        setIsOnline(!value);
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (error) {
      setIsOnline(!value);
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleNotifications = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Notifications clicked')
    // router.push('/notifications');
  };

  const handleIncomingOrders = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('incoming orders clicked')
    // router.push('/incoming-orders');
  };

  const handleActiveDelivery = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('Active delivery clicked')
    // router.push(`/delivery/${dashboardData.activeDelivery.id}`);
  };

  const handleEarnings = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log('earnings clicked')
    // router.push('/earnings');
  };

  const formatTime = (hours, minutes) => {
    return `${hours}hr ${minutes}mins`;
  };

  if (isLoading && !dashboardData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.lg }]}
      >
        {/* Header */}
        <View style={[styles.header, { marginTop: spacing.md }]}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?img=33' }}
              style={[styles.avatar, { width: scale(60), height: scale(60) }]}
            />
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, { fontSize: fontSize.xl }]}>
                Hi {user?.name?.split(' ')[0] || 'Courier'}!
              </Text>
              <Text style={[styles.subtitle, { fontSize: fontSize.sm }]}>
                Ready to deliver?
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.notificationButton, { width: scale(48), height: scale(48) }]}
            onPress={handleNotifications}
          >
            <Ionicons name="notifications" size={24} color="#000" />
            {/* Notification Badge */}
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Online Status */}
        <View style={[styles.onlineContainer, { marginTop: spacing.lg }]}>
          <View style={styles.onlineToggle}>
            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: '#929292', true: '#74BF22' }}
              thumbColor="#fff"
              ios_backgroundColor="#D1D1D1"
              style={Platform.OS === 'ios' ? { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] } : {}}
            />
            <Text style={[styles.onlineText, { fontSize: fontSize.xl }]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
          <Text style={[styles.onlineSubtext, { fontSize: fontSize.xs, marginTop: spacing.xs }]}>
            {isOnline ? "You're active and ready to receive delivery requests." : "You’re offline and not ready to receive delivery requests."}
          </Text>
        </View>

        {/* Address */}
        <Text style={[styles.address, { fontSize: fontSize.sm, marginTop: spacing.md }]}>
          {dashboardData.address}
        </Text>

        {/* Dashboard Cards */}
        <View style={{ marginTop: spacing.lg }}>
          {/* Incoming Orders */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.incomingCard,
              {
                height: scale(120),
                marginBottom: spacing.md,
              }
            ]}
            onPress={handleIncomingOrders}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { fontSize: isTablet ? fontSize.xxxl : fontSize.xxl }]}>
                Incoming
              </Text>
              <Text style={[styles.cardSubtitle, { fontSize: isTablet ? fontSize.xxxl : fontSize.xxl }]}>
                ({dashboardData.incomingCount})
              </Text>
            </View>
            <View style={[styles.cardIconContainer, { width: scale(80), height: scale(120) }]}>
              <View style={styles.cardIconCircle}>
                {/* <Ionicons name="cube-outline" size={scale(40)} color="#fff" /> */}
                <Image 
                source={require('@/assets/images/truck-green-outline.png')}
                resizeMode='contain'
                style = {{width: scale(40)}}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Active Delivery */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.activeCard,
              {
                height: scale(120),
                marginBottom: spacing.md,
              }
            ]}
            onPress={handleActiveDelivery}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { fontSize: isTablet ? fontSize.xxxl : fontSize.xxl }]}>
                Actives
              </Text>
              <Text style={[styles.cardDescription, { fontSize: fontSize.lg, marginTop: spacing.xs }]}>
                Delivery #{dashboardData.activeDelivery.id}:
              </Text>
              <Text style={[styles.cardDescription, { fontSize: fontSize.lg }]}>
                {dashboardData.activeDelivery.status}
              </Text>
            </View>
            <View style={[styles.cardIconContainer, { width: scale(80), height: scale(120) }]}>
              <View style={styles.cardIconCircle}>
                {/* <Ionicons name="bicycle-outline" size={scale(40)} color="#FF8C00" /> */}
                <Image source={require('@/assets/images/truck-orange.png')}
                resizeMode='contain'
                style={{width: scale(40)}}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Earnings */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.earningsCard,
              {
                height: scale(120),
                marginBottom: spacing.md,
              }
            ]}
            onPress={handleEarnings}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { fontSize: isTablet ? fontSize.xxxl : fontSize.xxl }]}>
                Earnings
              </Text>
              <Text style={[styles.earningsAmount, { fontSize: isTablet ? fontSize.xxl : fontSize.xl, marginTop: spacing.xs }]}>
                ${dashboardData.earnings.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.cardIconContainer, { width: scale(80), height: scale(120) }]}>
              <View style={styles.cardIconCircle}>
                <Ionicons name="cash-outline" size={scale(40)} color="#000" />
                {/* <Image source={require('@/assets/images/earnings.png')}
                resizeMode='contain'
                style={{width: scale(40)}}
                /> */}
              </View>
            </View>
          </TouchableOpacity>

          {/* Time Online */}
          <View
            style={[
              styles.card,
              styles.timeCard,
              {
                height: scale(120),
                marginBottom: spacing.xl,
              }
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, styles.timeTitle, { fontSize: isTablet ? fontSize.xxxl : fontSize.xxl }]}>
                Time Online
              </Text>
              <Text style={[styles.timeAmount, { fontSize: fontSize.xl, marginTop: spacing.xs }]}>
                {formatTime(dashboardData.timeOnline.hours, dashboardData.timeOnline.minutes)}
              </Text>
            </View>
            <View style={[styles.cardIconContainer, { width: scale(80), height: scale(120) }]}>
              <View style={styles.cardIconCircle}>
                <Ionicons name="time-outline" size={scale(40)} color="#00" />
                {/* <Image source={require('@/assets/images/time.png')}
                resizeMode='contain'
                style = {{width: scale(40)}}
                /> */}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#000',
    fontFamily: 'Sora-Bold',
  },
  subtitle: {
    color: '#666',
    fontFamily: 'Sora-Regular',
    marginTop: 2,
  },
  notificationButton: {
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  onlineContainer: {
    alignItems: 'center',
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  onlineText: {
    color: '#000',
    fontFamily: 'Sora-SemiBold',
  },
  onlineSubtext: {
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Sora-Regular',
  },
  address: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Sora-Regular',
  },
  card: {
    borderTopRightRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontFamily: 'Sora-Bold',
  },
  cardSubtitle: {
    color: '#fff',
    fontFamily: 'Sora-Regular',
    marginTop: 4,
  },
  cardDescription: {
    color: '#fff',
    fontFamily: 'Sora-Regular',
  },
  earningsAmount: {
    color: '#fff',
    fontFamily: 'Sora-Regular',
  },
  timeAmount: {
    color: '#000',
    fontFamily: 'Sora-Regular',
  },
  timeTitle: {
    color: '#000',
  },
  cardIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginRight: 25,
  },
  cardIconCircle: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: '70%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  incomingCard: {
    backgroundColor: '#74BF22',
  },
  activeCard: {
    backgroundColor: '#F17500',
  },
  earningsCard: {
    backgroundColor: '#000',
  },
  timeCard: {
    backgroundColor: '#C0C0C0',
  },
});