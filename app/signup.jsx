import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, StatusBar, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
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
    const {signUp, sendOTP, isLoadiing} = useAuth();
    const { scale, spacing, fontSize, isTablet } = useResponsive();
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Form state
    const [userType, setUserType] = useState('User'); // 'User' or 'Courier'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);


    // Courier specific fields
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleColor, setvehicleColor] = useState('');
    const [validId, setValidId] = useState(null);
    const [proofOfAddress, setProofOfAddress] = useState(null);
    const [payoutMethod, setPayoutMethod] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    // User specific fields
    const [pickupAddress, setPickupAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const isUserFormValid =
        name &&
        email &&
        phone &&
        password &&
        (otpSent ? otp.length === 6 : true);

    const isCourierFormValid =
        isUserFormValid &&
        deliveryMethod &&
        vehicleModel &&
        vehiclePlate &&
        vehicleColor &&
        validId &&
        proofOfAddress &&
        payoutMethod &&
        bankName &&
        accountNumber;

    const isFormValid =
        userType === 'User' ? isUserFormValid : isCourierFormValid;


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

    const handleSignUp = async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);

        try {
            if (Platform.OS === 'ios') {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
            }

            const result = await signUp()

            // simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Sign up clicked', {
                userType,
                name,
                email,
                phone,
                validId,
                password,
                bankName,
                proofOfAddress,
                vehicleColor,
                vehicleModel,
                vehiclePlate,
                payoutMethod,
                otp,
            });
            // router.replace('/(auth)/login');
            router.push({
                pathname: '/(auth)/confirm',
                params: { userType } // or 'Courier' or 'User'
            });

            // router.replace('/(auth)/verify'); // example
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialSignUp = (provider) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        console.log(`Sign up with ${provider}`);
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
                    <View style={[styles.inputContainer, { marginTop: spacing.lg }]}>
                        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Email Input */}
                    <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                        <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { fontSize: fontSize.md }]}
                            placeholder="Email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Phone Number with OTP */}
                    <View style={[styles.phoneContainer, { marginTop: spacing.md }]}>
                        <View style={styles.phoneInputWrapper}>
                            <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { fontSize: fontSize.md }]}
                                placeholder="Phone number"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.sendOtpButton,
                                !phone && { opacity: 0.5 },
                            ]}
                            disabled={!phone}
                            onPress={handleSendOtp}
                        >
                            <Text style={[styles.sendOtpText, { fontSize: fontSize.sm }]}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>

                    {/* OTP Input */}
                    {otpSent && <View style={[styles.otpContainer, { marginTop: spacing.sm }]}>
                        <TextInput
                            style={[styles.otpInput, { fontSize: fontSize.md }]}
                            placeholder="Input otp"
                            value={otp}
                            onChangeText={setOtp}
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
                                    value={pickupAddress}
                                    onChangeText={setPickupAddress}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <Ionicons name="navigate-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md }]}
                                    placeholder="Add delivery address"
                                    value={deliveryAddress}
                                    onChangeText={setDeliveryAddress}
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
                                value={deliveryMethod}
                                onChange={setDeliveryMethod}
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
                                    value={vehicleModel}
                                    onChangeText={setVehicleModel}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Vehicle Plate Number */}
                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md, paddingLeft: spacing.md }]}
                                    placeholder="Vehicle plate number"
                                    value={vehiclePlate}
                                    onChangeText={setVehiclePlate}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Color input */}
                            <View style={[styles.inputContainer, { marginTop: spacing.md }]}>
                                <TextInput
                                    style={[styles.input, { fontSize: fontSize.md, paddingLeft: spacing.md }]}
                                    placeholder='Color'
                                    value={vehicleColor}
                                    onChangeText={setvehicleColor}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Valid ID Upload */}

                            <ImageUploadField
                                value={validId}
                                onChange={setValidId}
                                placeholder="Valid ID or License"
                                styles={styles}
                                fontSize={fontSize.md}
                                containerStyle={{ marginTop: spacing.md }}
                            />

                            {/* Proof of Address Upload */}
                            <ImageUploadField
                                value={proofOfAddress}
                                onChange={setProofOfAddress}
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
                                value={payoutMethod}
                                onChange={setPayoutMethod}
                                options={['Bank Transfer', 'Card']}
                                placeholder="Add Payout method"
                                icon=""
                                containerStyle={{ marginTop: spacing.md }}
                                styles={styles}
                                fontSize={fontSize.md}
                            />

                            {/* Bank Name Dropdown */}
                            <SelectField
                                value={bankName}
                                onChange={setBankName}
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
                                    value={accountNumber}
                                    onChangeText={setAccountNumber}
                                    keyboardType="number-pad"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </>
                    )}

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[styles.signupButton, { marginTop: spacing.xl, height: scale(56) },
                        (!isFormValid || isSubmitting) && styles.signupButtonDisabled,
                        ]}
                        onPress={handleSignUp}
                        activeOpacity={0.8}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[styles.signupButtonText, { fontSize: fontSize.lg }]}>
                                Sign up
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Apple Sign Up */}
                    {/* <TouchableOpacity
                        style={[styles.appleButton, { marginTop: spacing.md, height: scale(56) }]}
                        onPress={() => handleSocialSignUp('Apple')}
                    >
                        <Ionicons name="logo-apple" size={24} color="#fff" />
                        <Text style={[styles.appleButtonText, { fontSize: fontSize.md }]}>
                            Sign up using Apple
                        </Text>
                    </TouchableOpacity> */}

                    {/* Google Sign Up */}
                    {/* <TouchableOpacity
                        style={[styles.googleButton, { marginTop: spacing.md, height: scale(56) }]}
                        onPress={() => handleSocialSignUp('Google')}
                    >
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                        <Text style={[styles.googleButtonText, { fontSize: fontSize.md }]}>
                            Sign up using Google
                        </Text>
                    </TouchableOpacity> */}

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
        fontWeight: '700',
        color: '#000',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    subtitle: {
        color: '#999',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
        fontWeight: '700',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
        fontWeight: '700',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    otpVerifyIcon: {
        marginLeft: 8,
    },
    skipContainer: {
        alignItems: 'flex-end',
    },
    skipText: {
        color: '#FF8C00',
        fontWeight: '600',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    dropdownPlaceholder: {
        flex: 1,
        color: '#999',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
        fontWeight: '700',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
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
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
})