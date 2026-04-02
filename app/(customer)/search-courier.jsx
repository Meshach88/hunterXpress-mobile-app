import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Animated,
    Easing,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/use-responsiveness';
import api from '@/api/api';

export default function SearchingCourierScreen() {
    const router = useRouter();
    const { order } = useLocalSearchParams();
    const orderDetails = JSON.parse(order);
    const { user, authToken } = useAuth();
    const { scale, spacing, fontSize, isTablet } = useResponsive();

    const orderId = orderDetails._id;

    const [nearbyRouriers, setNearbyCouriers] = useState([]);
    const [searchStatus, setSearchStatus] = useState('searching'); // searching, found, failed
    // const [matchedCourier, setMatchedCourier] = useState(null);

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        startAnimations();
        searchForCouriers();

        return () => {
            // Cleanup animations
            pulseAnim.stopAnimation();
            rotateAnim.stopAnimation();
        };
    }, []);

    const startAnimations = () => {
        // Pulse animation for radar circles
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Fade in courier avatars
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            delay: 500,
            useNativeDriver: true,
        }).start();
    };

    const searchForCouriers = async () => {
        try {
            // Fetch nearby couriers
            const body = {
                latitude: orderDetails.pickup_address.lat,
                longitude: orderDetails.pickup_address.lng
            }

            const response = await api.post('/dispatch/nearby-couriers', body)

            const data = await response.data;
            console.log('Courier search result', data)

            if (data.success && data.couriers.length > 0) {
                setNearbyCouriers(data.couriers);

                const courier = data.couriers[0];
                // setMatchedCourier(courier);
                // setSearchStatus('found');

                if (Platform.OS === 'ios') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }

                // Navigate to courier found screen

                //     router.replace({
                //         pathname: '/courier-found',
                //         params: {
                //             orderId,
                //             courierId: courier.id,
                //             courierName: courier.name,
                //             courierImage: courier.image,
                //             courierRating: courier.rating,
                //             estimatedArrival: courier.estimatedArrival,
                //         },
                //     });
            } else {
                // No couriers available
                setSearchStatus('failed');
                if (Platform.OS === 'ios') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                }
            }
        } catch (error) {
            console.error('Error searching for couriers:', error);
            setSearchStatus('failed');
        }
    };

    const handleCancel = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        Alert.alert(
            'Cancel Search',
            'Are you sure you want to cancel the courier search?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        // Cancel the order
                        await cancelOrder();
                        router.back();
                    },
                },
            ]
        );
    };

    const cancelOrder = async () => {
        try {
            console.log(`Order with ID: ${orderId} cancelled.`)
            //TODO - set status of order (delivery) to cancelled on db

        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Mock courier data for demo
    const mockCouriers = [
        { id: 1, avatar: '👨‍💼', position: { top: 80, right: 50 } },
        { id: 2, avatar: '👨‍🦱', position: { bottom: 120, right: 60 } },
        { id: 3, avatar: '👩‍🦰', position: { bottom: 140, left: 50 } },
        // { id: 4, avatar: '👨‍🦳', position: { top: 100, left: 60 } },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, {
                    marginTop: spacing.md,
                    marginLeft: spacing.lg
                }]}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={[styles.title, {
                fontSize: isTablet ? fontSize.xxl * 1.2 : fontSize.xxl * 1.1,
                textAlign: 'center',
                marginTop: spacing.md,
                paddingHorizontal: spacing.lg,
            }]}>
                Searching For Courier
            </Text>

            {/* Radar Animation Container */}
            <View style={styles.radarContainer}>
                {/* Outer Circles (Radar Rings) */}
                <Animated.View
                    style={[
                        styles.radarCircle,
                        styles.radarCircle1,
                        {
                            transform: [{ scale: pulseAnim }],
                            opacity: pulseAnim.interpolate({
                                inputRange: [1, 1.2],
                                outputRange: [0.3, 0.1],
                            }),
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.radarCircle,
                        styles.radarCircle2,
                        {
                            transform: [{ scale: pulseAnim }],
                            opacity: 0.3,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.radarCircle,
                        styles.radarCircle3,
                        {
                            transform: [{ scale: pulseAnim }],
                            opacity: 0.4,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.radarCircle,
                        styles.radarCircle4,
                        {
                            transform: [{ scale: 1 }],
                            opacity: 0.4,
                        },
                    ]}
                />
                
                {/* Courier Avatars */}
                <Animated.View
                    style={[
                        styles.couriersContainer,
                        { opacity: fadeAnim },
                    ]}
                >
                    {mockCouriers.map((courier) => (
                        <View
                            key={courier.id}
                            style={[
                                styles.courierAvatar,
                                {
                                    position: 'absolute',
                                    ...courier.position,
                                },
                            ]}
                        >
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarEmoji}>{courier.avatar}</Text>
                            </View>
                            <View style={styles.checkmarkBadge}>
                                <Ionicons name="checkmark" size={12} color="#fff" />
                            </View>
                        </View>
                    ))}
                </Animated.View>
            </View>

            {/* Status Text */}
            {searchStatus === 'searching' && (
                <Text style={[styles.statusText, {
                    fontSize: fontSize.md,
                    marginBottom: spacing.md,
                }]}>
                    Looking for available couriers near you...
                </Text>
            )}

            {searchStatus === 'found' && (
                <Text style={[styles.statusText, styles.successText, {
                    fontSize: fontSize.md,
                    marginBottom: spacing.md,
                }]}>
                    ✓ Courier Found!
                </Text>
            )}

            {searchStatus === 'failed' && (
                <View style={styles.failedContainer}>
                    <Text style={[styles.statusText, { fontSize: fontSize.md * 0.95 }]}>
                        No couriers available at the moment
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryButton, { marginTop: spacing.md }]}
                        onPress={() => {
                            setSearchStatus('searching');
                            searchForCouriers();
                        }}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Cancel Button */}
            <View style={[styles.buttonContainer, { paddingHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.xl }]}>
                <TouchableOpacity
                    style={[styles.cancelButton, { height: scale(56) }]}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.cancelButtonText, { fontSize: fontSize.lg }]}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    title: {
        color: '#000',
        fontFamily: 'Sora-Bold',
    },
    radarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    radarCircle: {
        position: 'absolute',
        borderRadius: 1000,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    radarCircle1: {
        width: 320,
        height: 320,
    },
    radarCircle2: {
        width: 240,
        height: 240,
    },
    radarCircle3: {
        width: 160,
        height: 160,
    },
    radarCircle4: {
        width: 80,
        height: 80,
    },
    couriersContainer: {
        width: 320,
        height: 320,
        position: 'absolute',
    },
    courierAvatar: {
        width: 60,
        height: 60,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#8BC34A',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    avatarEmoji: {
        fontSize: 32,
    },
    checkmarkBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#8BC34A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    statusText: {
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 40,
        fontFamily: 'Sora-Medium',
    },
    successText: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    failedContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    retryButton: {
        backgroundColor: '#74BF22',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Sora-Bold'
    },
    buttonContainer: {
        paddingBottom: 40,
    },
    cancelButton: {
        backgroundColor: '#FF8C00',
        borderRadius: 28,
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
                elevation: 4,
            },
        }),
    },
    cancelButtonText: {
        color: '#fff',
        fontFamily: 'Sora-Bold',
    },
});