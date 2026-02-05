import { View, Text, TouchableOpacity, Platform, StyleSheet, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '@/hooks/useResponsiveness';
import * as Haptics from 'expo-haptics';



const TrackCourier = () => {
    const router = useRouter();
    const { scale, spacing, fontSize, isTablet } = useResponsive();
    const params = useLocalSearchParams();

    const handleBack = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.replace('/(tabs)/');
    };

    const { width } = useWindowDimensions()

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                {/* Back Button */}
                <TouchableOpacity
                    style={[styles.backButton, {
                        marginTop: spacing.md,
                        marginLeft: spacing.lg
                    }]}
                onPress={handleBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <View style={styles.topContainerText}>
                    <Text style={[styles.title, { fontSize: isTablet ? fontSize.xxl : fontSize.xl }]}>Track Courier</Text>
                </View>
            </View>
            <Image
                source={require('@/assets/images/track-map.png')}
                resizeMode='contain'
                style={[styles.map, { width: '100%' }]}
            />
            <View style={[styles.infoContainer]}>
                <View style={styles.infoLine}></View>
                <View style={styles.timeContainer}>
                    <Text style={{
                        color: '#27794D', fontSize: isTablet ? fontSize.md : fontSize.sm, fontFamily: 'Sora-Regular'
                    }}>Your courier is on the way!</Text>
                    <Text style={{ fontFamily: 'Sora-Regular', fontSize: 13 }}>2 mins away</Text>
                </View>
                <View style={styles.courierInfoContainer}>
                    <Ionicons name='person-circle-outline' size={60} color='#fff' />
                    <View style={{ marginLeft: -10 }}>
                        <Text style={[styles.infoText, { fontSize: isTablet ? fontSize.lg : fontSize.md }]}>Allan Smith</Text>
                        <Text style={[styles.infoText, { fontSize: isTablet ? fontSize.md : fontSize.sm, color: '#4F4F4F' }]}>124 Deliveries</Text>
                        <Text style={[styles.infoText, { fontSize: isTablet ? fontSize.md : fontSize.sm, color: '#4F4F4F' }]}>Ratings: 4.1</Text>
                    </View>
                    <View style={styles.callContainer}>
                        <Ionicons name='call' size={20} color='#74BF22' />
                    </View>
                    <View style={styles.callContainer}>
                        <Ionicons name='chatbox-ellipses-outline' size={20} color='#74BF22' />
                    </View>
                </View>
                <View style={styles.deliveryInfoContainer}>
                    <View>
                        <Text style={[styles.infoText, { fontSize: isTablet ? fontSize.md : fontSize.sm }]}>Delivery Type</Text>
                        <Text style={[styles.infoTextBold, { fontSize: isTablet ? fontSize.lg : fontSize.md }]}>Express Delivery</Text>
                    </View>
                    <View>
                        <Text style={[styles.infoText, { fontSize: isTablet ? fontSize.md : fontSize.sm }]}>Package Weight</Text>
                        <Text style={[styles.infoTextBold, { fontSize: isTablet ? fontSize.lg : fontSize.md }]}>4 kg</Text>
                    </View>
                </View>

            </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative'
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        zIndex: 5,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    topContainerText: {
        margin: 20,
        paddingLeft: 40,
    },
    title: {
        fontFamily: 'Sora-SemiBold',
    },
    map: {
        position: 'absolute',
        top: -320,
        zIndex: 1,
    },
    infoContainer: {
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        backgroundColor: '#fff',
        width: '100%',
        height: '45%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        })
    },
    infoLine: {
        backgroundColor: '#CBCDCC',
        width: '10%',
        height: 4,
        marginHorizontal: 'auto',
        marginTop: 20,
        borderRadius: 4,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 10,
    },
    courierInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '30%',
        backgroundColor: '#96B86F',
        borderRadius: 20,
        marginTop: 10,
        paddingHorizontal: 10,

    },
    infoText: {
        fontFamily: 'Sora-Regular',
    },
    infoTextBold: {
        fontFamily: 'Sora-SemiBold',
    },

    callContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    deliveryInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '30%',
        backgroundColor: '#D6EBC3',
        borderRadius: 20,
        marginTop: 10,
        paddingHorizontal: 20,
    },


})

export default TrackCourier