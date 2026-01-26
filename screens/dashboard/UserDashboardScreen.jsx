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
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/use-responsiveness';
import HexagonalGrid from '@/components/dashboard/HexagonalGrid';
import TransactionList from '@/components/dashboard/TransactionList';
import LogisticsCard from '@/components/dashboard/LogisticCard';


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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <ImageBackground source={require('@/assets/images/dashboard-bg.png')}
          style={styles.background}
        >
          <View style={styles.overlay} />

          <View style={styles.content}>
            {/* Header Section */}
            <View style={[styles.header, { paddingHorizontal: scale(20) }]}>
              <View style={styles.headerLeft}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
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

            {/* Hexagonal Grid */}
            <ImageBackground
              source={require('@/assets/images/send_box.png')}
              style={styles.cardContainer}
              resizeMode='stretch'
            >
              <View style={styles.cardContent}>
                <Text style={styles.title}>SEND</Text>
              </View>
            </ImageBackground>
            {/* <HexagonalGrid router={router} /> */}

            {/* <LogisticsCard
              title="Package #12345"
              subtitle="From Lagos to Abuja - Delivery in 2 days"
              bgColor="#4ade80"
            /> */}

            {/* Recent Transactions */}
            <View style={[styles.transactionsContainer, { paddingHorizontal: scale(20) }]}>
              <TransactionList transactions={transactions} router={router} />
            </View>
          </View>
        </ImageBackground>
      </ScrollView >
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
  cardContainer: {
    marginVertical: 20,
    alignSelf: "center",
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
    alignSelf: "center",
    backgroundColor: "black",
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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingTop: 50
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
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
    marginTop: 10,
  },
});