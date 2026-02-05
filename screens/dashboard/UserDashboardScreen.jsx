import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/use-responsiveness';
import TransactionList from '@/components/dashboard/TransactionList';
import LogisticsCards from '@/components/dashboard/LogisticsCards';


export default function DashboardScreen() {
  const router = useRouter();
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

  const handleMessagePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/explore');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ImageBackground source={require('@/assets/images/dashboard-bg.png')}
        style={styles.background}
      >
        <View style={styles.overlay} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >

          <View style={styles.content}>
            {/* Header Section */}
            <View style={[styles.header, { paddingHorizontal: scale(20) }]}>
              <View style={styles.headerLeft}>
                {/* <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                  style={[styles.avatar, { width: scale(60), height: scale(60) }]}
                /> */}
                <Ionicons name="person" size={scale(40)} color={theme.colors.primary} style={styles.avatar} />
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
                onPress={handleMessagePress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            <LogisticsCards router={router} />

            {/* Recent Transactions */}
            <View style={[styles.transactionsContainer, { paddingHorizontal: scale(20) }]}>
              <TransactionList transactions={transactions} router={router} />
            </View>
          </View>
        </ScrollView >
      </ImageBackground>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 30
  },
  cardsContainer: {
    position: 'relative'

  },
  sendCard: {
    position: 'absolute',
    zIndex: 10,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 100
  },
  receiveCard: {
    position: 'absolute',
    top: 100,
    right: 35,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 100
  },
  statCard: {
    position: 'absolute',
    transform: [{ scaleY: -1 }],
    top: 30,
    right: 110,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 100
  },
  trackCard: {
    position: 'absolute',
    top: 190,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 100
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 60
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  content: {
    flex: 1,
    position: 'relative'
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: 180,
    marginBottom: -35,
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
    fontFamily: 'Sora-Bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Sora-Medium',
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
  transactionsContainer: {
    marginTop: 20,
  },
});