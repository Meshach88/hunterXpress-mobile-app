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

export default function LocationsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { scale, spacing, fontSize, isTablet } = useResponsive();

    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setIsLoading(true);

            // Replace with your actual API endpoint
            const response = await fetch(`https://your-api.com/api/deliveries/locations/${user?.id}`);
            const data = await response.json();

            if (response.ok) {
                setLocations(data.locations || getMockLocations());
            } else {
                setLocations(getMockLocations());
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLocations(getMockLocations());
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchLocations();
        setIsRefreshing(false);
    };

    const getMockLocations = () => [
        {
            id: '1',
            type: 'Drop off',
            address: '21b, Karimu Kotun Street, Victoria Island',
            estimatedTime: '20 mins to delivery location',
            status: 'in_progress',
            orderId: 'ORDB1234',
        },
        {
            id: '2',
            type: 'Drop off',
            address: 'Maryland bustop, Anthony Ikeja',
            date: '12 January 2020, 2:43pm',
            status: 'completed',
            orderId: 'ORDB1235',
        },
        {
            id: '3',
            type: 'Drop off',
            address: 'Maryland bustop, Anthony Ikeja',
            date: '12 January 2020, 2:43pm',
            status: 'completed',
            orderId: 'ORDB1236',
        },
        {
            id: '4',
            type: 'Drop off',
            address: 'Maryland bustop, Anthony Ikeja',
            date: '12 January 2020, 2:43pm',
            status: 'completed',
            orderId: 'ORDB1237',
        },
        {
            id: '5',
            type: 'Drop off',
            address: 'Maryland bustop, Anthony Ikeja',
            date: '12 January 2020, 2:43pm',
            status: 'completed',
            orderId: 'ORDB1238',
        },
        {
            id: '6',
            type: 'Drop off',
            address: 'Maryland bustop, Anthony Ikeja',
            date: '12 January 2020, 2:43pm',
            status: 'completed',
            orderId: 'ORDB1239',
        },
    ];

    const handleDetailsPress = (location) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push(`/delivery/${location.orderId}`);
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
                    Locations
                </Text>
            </View>

            {/* Locations List */}
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
                {locations.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="location-outline" size={scale(80)} color="#CCC" />
                        <Text style={[styles.emptyText, { fontSize: fontSize.lg, marginTop: spacing.lg }]}>
                            No locations found
                        </Text>
                        <Text style={[styles.emptySubtext, { fontSize: fontSize.sm, marginTop: spacing.sm }]}>
                            Your delivery locations will appear here
                        </Text>
                    </View>
                ) : (
                    locations.map((location, index) => (
                        <View
                            key={location.id}
                            style={[
                                styles.locationCard,
                                {
                                    marginTop: index === 0 ? spacing.lg : 0,
                                    marginBottom: index === locations.length - 1 ? spacing.xl : spacing.md,
                                }
                            ]}
                        >
                            {/* Location Details */}
                            <View style={styles.locationContent}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="bicycle-outline" size={28} color="#666" />
                                </View>

                                <View style={styles.detailsContainer}>
                                    <View style={styles.locationRow}>
                                        <Ionicons name="location" size={16} color="#4CAF50" />
                                        <Text style={[styles.locationLabel, { fontSize: fontSize.xs }]}>
                                            {location.type}
                                        </Text>
                                    </View>

                                    <Text style={[styles.address, { fontSize: fontSize.md, marginTop: spacing.xs }]}>
                                        {location.address}
                                    </Text>

                                    {location.status === 'in_progress' && location.estimatedTime && (
                                        <Text style={[styles.timeText, { fontSize: fontSize.sm, marginTop: spacing.xs }]}>
                                            {location.estimatedTime}
                                        </Text>
                                    )}

                                    {location.status === 'completed' && location.date && (
                                        <Text style={[styles.dateText, { fontSize: fontSize.sm, marginTop: spacing.xs }]}>
                                            {location.date}
                                        </Text>
                                    )}
                                </View>

                                {/* Details Button */}
                                <TouchableOpacity
                                    style={[styles.detailsButton, { height: scale(36) }]}
                                    onPress={() => handleDetailsPress(location)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.detailsButtonText, { fontSize: fontSize.sm }]}>
                                        Details
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Separator */}
                            {index < locations.length - 1 && (
                                <View style={[styles.separator, { marginTop: spacing.md }]} />
                            )}
                        </View>
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
    locationCard: {
        backgroundColor: '#fff',
    },
    locationContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 4,
    },
    detailsContainer: {
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
    address: {
        color: '#000',
        fontWeight: '500',
        lineHeight: 22,
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    timeText: {
        color: '#8BC34A',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    dateText: {
        color: '#999',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    detailsButton: {
        backgroundColor: '#8BC34A',
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    detailsButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
});