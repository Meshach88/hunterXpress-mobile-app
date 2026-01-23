import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/use-responsiveness';

export default function DeliveryHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { scale, spacing, fontSize, isTablet } = useResponsive();

  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  const fetchDeliveryHistory = async () => {
    try {
      setIsLoading(true);
      
      // Replace with your actual API endpoint
      const response = await fetch(`https://your-api.com/api/deliveries/history/${user?.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setDeliveries(data.deliveries || getMockDeliveries());
      } else {
        setDeliveries(getMockDeliveries());
      }
    } catch (error) {
      console.error('Error fetching delivery history:', error);
      setDeliveries(getMockDeliveries());
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchDeliveryHistory();
    setIsRefreshing(false);
  };

  const getMockDeliveries = () => [
    {
      id: 'ORDB1234',
      recipient: 'Paul Pogba',
      status: 'in_progress',
      dropOffLocation: '21b, Karimu Kotun Street, Victoria Island',
      estimatedTime: '20 mins to delivery location',
      date: null,
    },
    {
      id: 'ORDB1234',
      recipient: 'Paul Pogba',
      status: 'completed',
      dropOffLocation: 'Maryland bustop, Anthony Ikeja',
      date: '12 January 2020, 2:43pm',
    },
    {
      id: 'ORDB1234',
      recipient: 'Paul Pogba',
      status: 'completed',
      dropOffLocation: 'Maryland bustop, Anthony Ikeja',
      date: '12 January 2020, 2:43pm',
    },
    {
      id: 'ORDB1234',
      recipient: 'Paul Pogba',
      status: 'completed',
      dropOffLocation: 'Maryland bustop, Anthony Ikeja',
      date: '12 January 2020, 2:43pm',
    },
  ];

  const handleDeliveryPress = (delivery) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/delivery/${delivery.id}`);
  };

  const handleFilterPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFilterVisible(!filterVisible);
    // Implement filter modal/bottom sheet
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return '#FFF5E6';
      case 'completed':
        return '#E8F5E9';
      case 'cancelled':
        return '#FFEBEE';
      default:
        return '#F5F5F5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'in_progress':
        return '#FF8C00';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_progress':
        return 'In progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]} edges={['top']}>
        <ActivityIndicator size="large" color="#8BC34A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={[styles.title, { fontSize: isTablet ? fontSize.xxxl * 1.2 : fontSize.xxl }]}>
          Delivery History
        </Text>

        <TouchableOpacity
          style={[styles.filterButton, { width: scale(48), height: scale(48) }]}
          onPress={handleFilterPress}
        >
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Delivery List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.lg }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#8BC34A"
            colors={['#8BC34A']}
          />
        }
      >
        {deliveries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={scale(80)} color="#CCC" />
            <Text style={[styles.emptyText, { fontSize: fontSize.lg, marginTop: spacing.lg }]}>
              No delivery history
            </Text>
            <Text style={[styles.emptySubtext, { fontSize: fontSize.sm, marginTop: spacing.sm }]}>
              Your completed deliveries will appear here
            </Text>
          </View>
        ) : (
          deliveries.map((delivery, index) => (
            <TouchableOpacity
              key={`${delivery.id}-${index}`}
              style={[
                styles.deliveryCard,
                { 
                  marginTop: index === 0 ? spacing.lg : spacing.md,
                  marginBottom: index === deliveries.length - 1 ? spacing.xl : 0,
                }
              ]}
              onPress={() => handleDeliveryPress(delivery)}
              activeOpacity={0.7}
            >
              {/* Order ID and Status */}
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.orderId, { fontSize: fontSize.lg }]}>
                    {delivery.id}
                  </Text>
                  <Text style={[styles.recipient, { fontSize: fontSize.sm, marginTop: spacing.xs }]}>
                    Receipient: {delivery.recipient}
                  </Text>
                </View>

                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(delivery.status) }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { 
                      fontSize: fontSize.xs,
                      color: getStatusTextColor(delivery.status)
                    }
                  ]}>
                    {getStatusText(delivery.status)}
                  </Text>
                </View>
              </View>

              {/* Delivery Details */}
              <View style={[styles.deliveryDetails, { marginTop: spacing.md }]}>
                <View style={styles.iconRow}>
                  <Ionicons name="bicycle-outline" size={24} color="#666" />
                  <View style={styles.detailsContent}>
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={16} color="#4CAF50" />
                      <Text style={[styles.locationLabel, { fontSize: fontSize.xs }]}>
                        Drop off
                      </Text>
                    </View>
                    <Text style={[styles.locationText, { fontSize: fontSize.md, marginTop: spacing.xs }]}>
                      {delivery.dropOffLocation}
                    </Text>
                    {delivery.status === 'in_progress' && delivery.estimatedTime && (
                      <Text style={[styles.timeText, { fontSize: fontSize.sm, marginTop: spacing.xs }]}>
                        {delivery.estimatedTime}
                      </Text>
                    )}
                    {delivery.status === 'completed' && delivery.date && (
                      <Text style={[styles.dateText, { fontSize: fontSize.sm, marginTop: spacing.xs }]}>
                        {delivery.date}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Separator */}
              {index < deliveries.length - 1 && (
                <View style={[styles.separator, { marginTop: spacing.md }]} />
              )}
            </TouchableOpacity>
          ))
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginLeft: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  filterButton: {
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontWeight: '600',
    color: '#666',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  emptySubtext: {
    color: '#999',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontWeight: '700',
    color: '#000',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  recipient: {
    color: '#666',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  deliveryDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsContent: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    color: '#4CAF50',
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  locationText: {
    color: '#000',
    fontWeight: '500',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  timeText: {
    color: '#FF8C00',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  dateText: {
    color: '#666',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});