import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, StatusBar, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '@/hooks/use-responsiveness';
import SelectField from '@/components/form/SelectField';
import ImageUploadField from '@/components/form/ImageUploadField';
import { useAuth } from '@/hooks/useAuth';



export default function SignUpScreen() {
    const router = useRouter();
    const { signUp, sendOTP } = useAuth();
    const { scale, spacing, fontSize, isTablet } = useResponsive();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userType, setUserType] = useState('User');


    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        otp: '',
        password: '',
        role: '',
        // User specific
        pickupAddress: '',
        deliveryAddress: '',
        // Courier specific
        deliveryMethod: '',
        vehicleModel: '',
        vehiclePlate: '',
        vehicleColor: '',
        validId: '',
        proofOfAddress: '',
        payoutMethod: '',
        bankName: '',
        accountNumber: '',
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            role: userType === 'Courier' ? 'courier' : 'customer',
        }));
    }, [userType]);

    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length < 11) {
            newErrors.phone = 'Phone number is invalid';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleUserTypeChange = (type) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setUserType(type);
        // console.log(type)
    };

    const handleSendOtp = () => {
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setTimeout(() => {
            setOtpSent(!otpSent);
            console.log('OTP sent')
        }, 2000)
        // Add your OTP logic here
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleSignUp = async () => {
        // if (isSubmitting) return;
        if (!validateForm()) {
            Alert.alert('Error', 'Please fill in all required fields correctly');
            return;
        }
        setIsSubmitting(true);

        try {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
            }

            // Prepare data based on user type
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                otp: formData.otp,
                password: formData.password,
                role: formData.role
            };

            if (userType === 'User') {
                userData.pickUpAddress = formData.pickupAddress;
                userData.address = formData.deliveryAddress;
            } else if (userType === 'Courier') {
                userData.deliveryMethod = formData.deliveryMethod;
                userData.vehicleModel = formData.vehicleModel;
                userData.vehiclePlate = formData.vehiclePlate;
                userData.vehicleColor = formData.vehicleColor;
                userData.validId = formData.validId;
                userData.proofOfAddress = formData.proofOfAddress;
                userData.payoutMethod = formData.payoutMethod;
                userData.bankName = formData.bankName;
                userData.accountNumber = formData.accountNumber;
            }

            // console.log('Sign up clicked', formData, userData);

            const result = await signUp(userData, userType);
            console.log('Sign up response', result);
            if (result.success) {
                // Navigate to confirmation screen
                router.push({
                    pathname: '/(auth)/confirm',
                    params: { userType }
                });
            } else {
                Alert.alert('Error', result.error || 'Failed to sign up. Please try again.');
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
                        Create account
                    </Text>
                    <Text style={[styles.subtitle, { fontSize: fontSize.md, marginTop: spacing.xs }]}>
                        Sign up as a?
                    </Text>

                    {/* User Type Selector */}
                    <View style={[styles.userTypeContainer, { marginTop: spacing.md }]}>
                        <TouchableOpacity
                            style={[
                                styles.userTypeButton,
                                styles.userTypeButtonLeft,
                                userType === 'User' && styles.userTypeButtonActive,
                                { height: scale(50) }
                            ]}
                            onPress={() => handleUserTypeChange('User')}
                        >
                            <Text style={[
                                styles.userTypeText,
                                userType === 'User' && styles.userTypeTextActive,
                                { fontSize: fontSize.md }
                            ]}>
                                User
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.userTypeButton,
                                styles.userTypeButtonRight,
                                userType === 'Courier' && styles.userTypeButtonActive,
                                { height: scale(50) }
                            ]}
                            onPress={() => handleUserTypeChange('Courier')}
                        >
                            <Text style={[
                                styles.userTypeText,
                                userType === 'Courier' && styles.userTypeTextActive,
                                { fontSize: fontSize.md }
                            ]}>
                                Courier
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Name Input */}
                    <View style={[styles.inputContainer, { marginTop: spacing.lg, borderColor: errors.name ? '#FF3B30' : '#E0E0E0' }]}>
                        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Full Name"
                            value={formData.name}
                            onChangeText={(value) => updateFormData('name', value)}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}


                    {/* Email Input */}
                    <View style={[styles.inputContainer, { marginTop: spacing.md, borderColor: errors.email ? '#FF3B30' : '#E0E0E0' }]}>
                        <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Email address"
                            value={formData.email}
                            onChangeText={(value) => updateFormData('email', value)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    {/* Phone Number with OTP */}
                    <View style={[styles.phoneContainer, { marginTop: spacing.md }]}>
                        <View style={[styles.phoneInputWrapper, { borderColor: errors.phone ? '#FF3B30' : '#E0E0E0' }]}>
                            <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { fontSize: fontSize.md }]}
                                placeholder="Phone number"
                                value={formData.phone}
                                onChangeText={(value) => updateFormData('phone', value)}
                                keyboardType="phone-pad"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.sendOtpButton,
                                !formData.phone && { opacity: 0.5 },
                            ]}
                            disabled={!formData.phone}
                            onPress={handleSendOtp}
                        >
                            <Text style={[styles.sendOtpText, { fontSize: fontSize.sm }]}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                    {/* OTP Input */}
                    {otpSent && <View style={[styles.otpContainer, { marginTop: spacing.sm }]}>
                        <TextInput
                            style={[styles.otpInput, { fontSize: fontSize.md }]}
                            placeholder="Input otp"
                            value={formData.otp}
                            onChangeText={(value) => updateFormData('otp', value)}
                            keyboardType="number-pad"
                            maxLength={6}
                            placeholderTextColor="#999"
                        />
                        {otpSent && (
                            <View style={styles.otpVerifyIcon}>
                                <Ionicons name="arrow-back-circle" size={28} color="#8BC34A" />
                            </View>
                        )}
                    </View>}
                    {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

                    {/* Password Input */}
                    <View style={[styles.inputContainer, { marginTop: spacing.md, borderColor: errors.password ? '#FF3B30' : '#E0E0E0' }]}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Password"
                            value={formData.password}
                            onChangeText={(value) => updateFormData('password', value)}
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

                    {/* Conditional Fields based on User Type */}
                    {userType === 'User' ? (
                        // USER FIELDS
                        <>
                            {/* <View style={[styles.skipContainer, { marginTop: spacing.xs }]}>
                                <TouchableOpacity>
                                    <Text style={[styles.skipText, { fontSize: fontSize.sm }]}>Skip</Text>
                                </TouchableOpacity>
                            </View> */}

                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md }]}
                                    placeholder="Add default pickup address"
                                    value={formData.pickupAddress}
                                    onChangeText={(value) => updateFormData('pickupAddress', value)}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <Ionicons name="navigate-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md }]}
                                    placeholder="Add delivery address"
                                    value={formData.deliveryAddress}
                                    onChangeText={(value) => updateFormData('deliveryAddress', value)}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </>
                    ) : (
                        // COURIER FIELDS
                        <>
                            {/* <View style={[styles.skipContainer, { marginTop: spacing.xs }]}>
                                <TouchableOpacity>
                                    <Text style={[styles.skipText, { fontSize: fontSize.sm }]}>Skip</Text>
                                </TouchableOpacity>
                            </View> */}

                            {/* Delivery Method Dropdown */}
                            <SelectField
                                value={formData.deliveryMethod}
                                onChange={(value) => updateFormData('deliveryMethod', value)}
                                options={['Bicycle', 'Bike', 'Car', 'Bus']}
                                placeholder="Select delivery method"
                                icon="bicycle-outline"
                                containerStyle={{ marginTop: spacing.md }}
                                styles={styles}
                                fontSize={fontSize.md}
                            />

                            {/* Vehicle Model */}
                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md, paddingLeft: spacing.md }]}
                                    placeholder="Vehicle model"
                                    value={formData.vehicleModel}
                                    onChangeText={(value) => updateFormData('vehicleModel', value)}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Vehicle Plate Number */}
                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md, paddingLeft: spacing.md }]}
                                    placeholder="Vehicle plate number"
                                    value={formData.vehiclePlate}
                                    onChangeText={(value) => updateFormData('vehiclePlate', value)}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Color input */}
                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md, paddingLeft: spacing.md }]}
                                    placeholder='Color'
                                    value={formData.vehicleColor}
                                    onChangeText={(value) => updateFormData('vehicleColor', value)}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Valid ID Upload */}

                            <ImageUploadField
                                value={formData.validId}
                                onChange={(value) => updateFormData('validId', value)}
                                placeholder="Valid ID or License"
                                styles={styles}
                                fontSize={fontSize.md}
                                containerStyle={{ marginTop: spacing.md }}
                            />

                            {/* Proof of Address Upload */}
                            <ImageUploadField
                                value={formData.proofOfAddress}
                                onChange={(value) => updateFormData('proofOfAddress', value)}
                                placeholder="Proof of address"
                                styles={styles}
                                fontSize={fontSize.md}
                                containerStyle={{ marginTop: spacing.md }}
                            />

                            {/* 
                            <View style={[styles.skipContainer, { marginTop: spacing.xs }]}>
                                <TouchableOpacity>
                                    <Text style={[styles.skipText, { fontSize: fontSize.sm }]}>Skip</Text>
                                </TouchableOpacity>
                            </View> */}

                            {/* Payout Method Dropdown */}
                            <SelectField
                                value={formData.payoutMethod}
                                onChange={(value) => updateFormData('payoutMethod', value)}
                                options={['Bank Transfer', 'Card']}
                                placeholder="Add Payout method"
                                icon=""
                                containerStyle={{ marginTop: spacing.md }}
                                styles={styles}
                                fontSize={fontSize.md}
                            />

                            {/* Bank Name Dropdown */}
                            <SelectField
                                value={formData.bankName}
                                onChange={(value) => updateFormData('bankName', value)}
                                options={['First Bank', 'UBA', 'ABC Bank']}
                                placeholder="Bank Name"
                                icon=""
                                containerStyle={{ marginTop: spacing.md }}
                                styles={styles}
                                fontSize={fontSize.md}
                            />
                            {/* Account Number */}
                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md, paddingLeft: spacing.md }]}
                                    placeholder="Account number"
                                    value={formData.accountNumber}
                                    onChangeText={(value) => updateFormData('accountNumber', value)}
                                    keyboardType="number-pad"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </>
                    )}

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[styles.signupButton, { marginTop: spacing.xl, height: scale(56) },
                        isSubmitting && styles.signupButtonDisabled,
                        ]}
                        onPress={handleSignUp}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[styles.signupButtonText, { fontSize: fontSize.lg }]}>
                                Sign up
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Already Member */}
                    <TouchableOpacity
                        style={[styles.loginLink, { marginTop: spacing.lg, marginBottom: spacing.xl }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={[styles.loginLinkText, { fontSize: fontSize.md }]}>
                            Already member? Log in
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
    userTypeContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        // width: 250,
        borderColor: '#E0E0E0',
        // marginHorizontal: "auto"
    },
    userTypeButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    userTypeButtonLeft: {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    userTypeButtonRight: {
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    userTypeButtonActive: {
        backgroundColor: '#F17500',
    },
    userTypeText: {
        color: '#F17500',
        fontFamily: 'Sora-SemiBold',
    },
    userTypeTextActive: {
        color: '#fff',
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
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phoneInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        paddingHorizontal: 16,
        height: 56,
        marginRight: 8,
    },
    sendOtpButton: {
        paddingHorizontal: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 5
    },
    sendOtpText: {
        color: '#F17500',
        fontFamily: 'Sora-SemiBold',
    },
    otpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 12,
    },
    otpInput: {
        flex: 1,
        color: '#000',
        fontFamily: 'Sora-Regular',
    },
    otpVerifyIcon: {
        marginLeft: 8,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 16,
    },
    skipContainer: {
        alignItems: 'flex-end',
    },
    skipText: {
        color: '#FF8C00',
        fontWeight: '600',
        fontFamily: 'Sora-Regular',
    },
    dropdownPlaceholder: {
        flex: 1,
        color: '#999',
        fontFamily: 'Sora-Regular',
    },
    dropDown: {
        marginVertical: 8,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
    },
    dropdownItem: {
        marginBottom: 5,
        padding: 5
    },
    dropdownText: {
        fontSize: 16,
        color: '#111827'
    },
    uploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff',
    },
    uploadPlaceholder: {
        flex: 1,
        color: '#999',
        fontFamily: 'Sora-Regular',
    },
    signupButton: {
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
    signupButtonText: {
        color: '#fff',
        fontFamily: 'Sora-SemiBold',
    },
    signupButtonDisabled: {
        backgroundColor: '#F17500',
        opacity: 0.5,
    },
    appleButton: {
        backgroundColor: '#000',
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    appleButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    googleButton: {
        backgroundColor: '#F5F5F5',
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    googleButtonText: {
        color: '#000',
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    loginLink: {
        alignItems: 'center',
    },
    loginLinkText: {
        color: '#000',
        fontFamily: 'Sora-Regular',
    },
})