// app/confirmation.js
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '@/hooks/use-responsiveness';

export default function ConfirmationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { scale, spacing, fontSize, isTablet } = useResponsive();

    // Get user type from params (default to 'Sender')
    const userType = params?.userType || 'Sender';
    console.log(params)
    console.log(userType)

    // Animation values
    const scaleAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Trigger haptic feedback on mount
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Animate the checkmark
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleConfirm = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        // Navigate to main app or dashboard
        router.replace('/(auth)/login');
    };

    const handleBack = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.back();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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

            {/* Content */}
            <View style={styles.content}>
                {/* Success Checkmark with Circles */}
                <Animated.View
                    style={[
                        styles.checkmarkContainer,
                        {
                            transform: [{ scale: scaleAnim }],
                        }
                    ]}
                >
                    {/* Outer light green circle */}
                    <View style={[
                        styles.outerCircle,
                        {
                            width: scale(280),
                            height: scale(280),
                        }
                    ]} />

                    {/* Middle green circle */}
                    <View style={[
                        styles.middleCircle,
                        {
                            width: scale(220),
                            height: scale(220),
                        }
                    ]} />

                    {/* Inner dark green circle with checkmark */}
                    <View style={[
                        styles.innerCircle,
                        {
                            width: scale(160),
                            height: scale(160),
                        }
                    ]}>
                        <Ionicons name="checkmark" size={scale(80)} color="#fff" />
                    </View>
                </Animated.View>

                {/* Text Content */}
                <Animated.View
                    style={[
                        styles.textContainer,
                        {
                            opacity: fadeAnim,
                            marginTop: spacing.xl * 2,
                        }
                    ]}
                >
                    <Text style={[
                        styles.title,
                        {
                            fontSize: isTablet ? fontSize.xxxl * 1.2 : fontSize.xxxl,
                            marginBottom: spacing.md,
                        }
                    ]}>
                        You're good to go!
                    </Text>

                    <Text style={[
                        styles.subtitle,
                        {
                            fontSize: isTablet ? fontSize.lg : fontSize.md,
                        }
                    ]}>
                        Confirm you're signing up as a {userType}
                    </Text>
                </Animated.View>

                {/* Confirm Button */}
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: fadeAnim,
                            paddingHorizontal: spacing.lg,
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            {
                                height: scale(56),
                                marginTop: spacing.xl * 2,
                            }
                        ]}
                        onPress={handleConfirm}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.confirmButtonText,
                            { fontSize: fontSize.lg }
                        ]}>
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
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
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    checkmarkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    outerCircle: {
        position: 'absolute',
        borderRadius: 1000,
        backgroundColor: '#E8F5E9',
    },
    middleCircle: {
        position: 'absolute',
        borderRadius: 1000,
        backgroundColor: '#A9E56A',
    },
    innerCircle: {
        borderRadius: 1000,
        backgroundColor: '#8FD63A',
        justifyContent: 'center',
        alignItems: 'center',
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
        }),
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
    },
    subtitle: {
        color: '#666',
        textAlign: 'center',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
    },
    buttonContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 40,
    },
    confirmButton: {
        width: '100%',
        backgroundColor: '#F17500',
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
                elevation: 3,
            },
        }),
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
    },
});