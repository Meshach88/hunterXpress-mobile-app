import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, StatusBar, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '@/hooks/useResponsiveness';
import { useAuth } from '@/hooks/useAuth';


export default function LoginScreen() {
    const router = useRouter();
    const { scale, spacing, fontSize, isTablet } = useResponsive();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth()

    // Form state
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!emailOrPhone.trim()) {
            newErrors.emailOrPhone = "Email or Phone number is required.";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required."
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLogin = async () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }
        setIsSubmitting(true);

        try {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            const result = await login(emailOrPhone, password)

            // console.log('Log in response', result);
            const userType = result.data.user.role == 'customer' ? 'User' : 'Courier';

            if (result.success) {
                router.push({
                    pathname: '/(tabs)/',
                    params: { userType }
                })
            } else {
                Alert.alert('Error', result.error || 'Failed to login. Please try again.')
            }

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
                    <View style={[styles.inputContainer, { marginTop: spacing.lg, borderColor: errors.emailOrPhone ? '#FF3B30' : '#E0E0E0' }]}>
                        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Email or Phone number"
                            value={emailOrPhone}
                            onChangeText={setEmailOrPhone}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.emailOrPhone && <Text style={styles.errorText}>{errors.emailOrPhone}</Text>}

                    {/* Password Input */}
                    <View style={[styles.inputContainer, { marginTop: spacing.md, borderColor: errors.password ? '#FF3B30' : '#E0E0E0' }]}>
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
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <View style={[styles.forgotPasswordContainer, { marginTop: spacing.xs }]}>
                        <TouchableOpacity>
                            <Text style={[styles.forgotPasswordText, { fontSize: fontSize.sm }]}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Log in Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, { marginTop: spacing.xl, height: scale(56) },
                        isSubmitting && styles.loginButtonDisabled,
                        ]}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
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
        color: '#000',
        fontFamily: 'Sora-Bold',
    },
    subtitle: {
        color: '#999',
        fontFamily: 'Sora-Regular',
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
        fontFamily: 'Sora-Regular',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
    },
    forgotPasswordText: {
        color: '#000000',
        fontFamily: 'Sora-Regular',
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
        fontFamily: 'Sora-Bold',
    },
    loginButtonDisabled: {
        backgroundColor: '#F17500',
        opacity: 0.5,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 16,
        fontFamily: 'Sora-Regular',
    },
    signupLink: {
        alignItems: 'center',
    },
    signupLinkText: {
        color: '#000',
        fontFamily: 'Sora-Regular',
    },
})