import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '@/hooks/use-responsiveness';
import * as Haptics from 'expo-haptics';

const NotFound = () => {
    const router = useRouter();
    const { scale, spacing, fontSize, isTablet } = useResponsive();

    const handleGoHome = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.replace('/(tabs)/');
    };

    const handleGoBack = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* 404 Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons 
                        name="build-outline" 
                        size={isTablet ? 120 : 100} 
                        color="#E0E0E0" 
                    />
                </View>

                {/* 404 Text */}
                <Text style={[styles.errorCode, { fontSize: isTablet ? fontSize.xxxl * 2 : fontSize.xxxl * 1.5 }]}>
                    In Progress
                </Text>

                {/* Title */}
                <Text style={[styles.title, { fontSize: isTablet ? fontSize.xxl : fontSize.xl }]}>
                    Page Not Available Yet
                </Text>

                {/* Description */}
                <Text style={[styles.description, { fontSize: isTablet ? fontSize.lg : fontSize.md }]}>
                    This page will be available soon.
                </Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, {
                            height: scale(56),
                            marginTop: spacing.xl,
                        }]}
                        onPress={handleGoHome}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="home-outline" size={20} color="#fff" style={styles.buttonIcon} />
                        <Text style={[styles.primaryButtonText, { fontSize: isTablet ? fontSize.lg : fontSize.md }]}>
                            Go to Home
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, {
                            height: scale(56),
                            marginTop: spacing.md,
                        }]}
                        onPress={handleGoBack}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="arrow-back-outline" size={20} color="#F17500" style={styles.buttonIcon} />
                        <Text style={[styles.secondaryButtonText, { fontSize: isTablet ? fontSize.lg : fontSize.md }]}>
                            Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    iconContainer: {
        marginBottom: 20,
    },
    errorCode: {
        fontFamily: 'Sora-Bold',
        color: '#E0E0E0',
        marginBottom: 10,
    },
    title: {
        fontFamily: 'Sora-Bold',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontFamily: 'Sora-Regular',
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 400,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
        marginTop: 20,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#F17500',
        borderRadius: 28,
        flexDirection: 'row',
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
    primaryButtonText: {
        color: '#fff',
        fontFamily: 'Sora-SemiBold',
    },
    secondaryButton: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#F17500',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#F17500',
        fontFamily: 'Sora-SemiBold',
    },
    buttonIcon: {
        marginRight: 8,
    },
});

export default NotFound;