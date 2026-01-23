import {
    Text, View, StyleSheet, TouchableOpacity, Image, StatusBar, Platform, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '@/hooks/use-responsiveness';



export default function WelcomeScreen() {

    const { width, height } = useWindowDimensions();
    const router = useRouter();
    const { scale, isTablet, spacing, fontSize } = useResponsive();

    const handlePress = (action) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        if (action === 'login') {
            router.push('/(auth)/login');
        } else if (action === 'signup') {
            router.push('/(auth)/signup');
        }
    };

    return <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.content}>
            {/* Bike Image Section */}
            <View style={[styles.imageSection, { height: isTablet ? height * 0.5 : height * 0.45 }]}>
                {/* Big orange circle */}
                <View style={[styles.orangeCircle, { width: isTablet ? scale(380) : scale(320), height: isTablet ? scale(380) : scale(320), right: scale(-60), top: '15%' }]}>
                    {/* Small decorative dot */}
                    <View style={[styles.smallDot, {
                        width: scale(12),
                        height: scale(12),
                        top: scale(20),
                        left: scale(-40),
                    }]} />
                </View>
                {/* Bike Image */}
                <Image
                    source={require('@/assets/images/bike.png')}
                    style={[styles.bikeImage, {
                        width: isTablet ? scale(380) : scale(320),
                        height: isTablet ? scale(380) : scale(320),
                        right: isTablet ? scale(-100) : scale(-60),
                        top: scale(20)
                    }]}
                    resizeMode='contain'
                />
            </View>

            {/* Text Section */}
            <View style={[styles.textSection, { paddingHorizontal: spacing.lg }]}>
                <Text style={[styles.title, { fontSize: isTablet ? fontSize.xxxl * 1.5 : fontSize.xxxl * 1.3 }]}>
                    Let's
                </Text>
                <Text style={[styles.title, { fontSize: isTablet ? fontSize.xxxl * 1.5 : fontSize.xxxl * 1.3 }]}>
                    get started
                </Text>
                <Text style={[styles.subtitle, {
                    fontSize: isTablet ? fontSize.lg : fontSize.md,
                    marginVertical: spacing.md,
                }]}>
                    Everything starts from here
                </Text>
            </View>

            {/* Button Section */}
            <View style={[styles.buttonsSection, { paddingHorizontal: spacing.lg }]}>
                {/* Log in Button (Outline) */}
                <TouchableOpacity
                    style={[styles.button, styles.loginButton, {
                        height: scale(56),
                        marginBottom: spacing.md,
                    }]}
                    onPress={() => handlePress('login')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.loginButtonText, { fontSize: fontSize.lg }]}>
                        Log in
                    </Text>
                </TouchableOpacity>

                {/* Sign up Button (Filled) */}
                <TouchableOpacity
                    style={[styles.button, styles.signupButton, {
                        height: scale(56),
                    }]}
                    onPress={() => handlePress('signup')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.signupButtonText, { fontSize: fontSize.lg }]}>
                        Sign up
                    </Text>
                </TouchableOpacity>
            </View>

        </View>

    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        justifyContent: 'space-around',
    },
    orangeCircle: {
        position: 'absolute',
        borderRadius: 1000,
        backgroundColor: '#F17500',
    },
    imageSection: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    smallDot: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: '#F17500',
    },
    bikeImage: {
        zIndex: 2,
    },
    textSection: {
        marginTop: 20,
    },
    title: {
        fontWeight: '700',
        color: '#F17500',
        lineHeight: 48,
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
    },
    subtitle: {
        fontWeight: '400',
        color: '#666',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
    },
    buttonsSection: {
        paddingBottom: 40,
    },
    button: {
        width: '100%',
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
    loginButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F17500',
    },
    loginButtonText: {
        color: '#F17500',
        fontWeight: '700',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
    },
    signupButton: {
        backgroundColor: '#F17500',
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
        }),
    },
})