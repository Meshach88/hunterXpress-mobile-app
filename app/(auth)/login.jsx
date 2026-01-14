import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, StatusBar, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '@/hooks/useResponsiveness';


export default function LoginScreen() {
    const router = useRouter();
    const { scale, spacing, fontSize, isTablet } = useResponsive();
    const [isSubmitting, setIsSubmitting] = useState(false);



    // Form state
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const isFormValid = emailOrPhone && password;

    const handleLogin = async () => {
        if (!isFormValid || isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Handle log in logic
            router.push('/')
            console.log('Logged in', { emailOrPhone, password });

        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#ffffff" barStyle='dark-content' />
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.lg }]}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={[styles.backButton, { marginTop: spacing.md }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    {/* Header */}
                    <Text style={[styles.title, { fontSize: isTablet ? fontSize.xxxl * 1.2 : fontSize.xxxl * 1.1, marginTop: spacing.lg }]}>
                        Welcome back
                    </Text>
                    <Text style={[styles.subtitle, { fontSize: fontSize.md, marginTop: spacing.xs }]}>
                        Enter your credential to continue
                    </Text>


                    {/* Email or Phone Input */}
                    <View style={[styles.inputContainer, { marginTop: spacing.lg }]}>
                        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Email or Phone number"
                            value={emailOrPhone}
                            onChangeText={setEmailOrPhone}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.forgotPasswordContainer, { marginTop: spacing.xs }]}>
                        <TouchableOpacity>
                            <Text style={[styles.forgotPasswordText, { fontSize: fontSize.sm }]}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Log in Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, { marginTop: spacing.xl, height: scale(56) },
                        (!isFormValid || isSubmitting) && styles.loginButtonDisabled,
                        ]}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[styles.loginButtonText, { fontSize: fontSize.lg }]}>
                                Log in
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Don't have account */}
                    <TouchableOpacity
                        style={[styles.signupLink, { marginTop: spacing.lg, marginBottom: spacing.xl }]}
                        onPress={() => router.push('/(auth)/signup')}
                    >
                        <Text style={[styles.signupLinkText, { fontSize: fontSize.md, marginTop: 40 }]}>
                            Don't have account? Sign up
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    title: {
        fontWeight: '700',
        color: '#000',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    subtitle: {
        color: '#999',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#000',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },

    forgotPasswordContainer: {
        alignItems: 'flex-end',
    },
    forgotPasswordText: {
        color: '#000000',
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },

    loginButton: {
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
    loginButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    loginButtonDisabled: {
        backgroundColor: '#F17500',
        opacity: 0.5,
    },
    signupLink: {
        alignItems: 'center',
    },
    signupLinkText: {
        color: '#000',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
})