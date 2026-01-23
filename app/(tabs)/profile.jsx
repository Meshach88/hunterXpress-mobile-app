// app/(tabs)/profile.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/use-responsiveness';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { scale, spacing, fontSize, isTablet } = useResponsive();

    const [profileImage, setProfileImage] = useState(
        user?.profileImage || 'https://i.pravatar.cc/300?img=33'
    );

    const menuItems = [
        {
            id: 'payments',
            icon: 'card-outline',
            label: 'Payments',
            route: '/payments',
        },
        {
            id: 'delivery-history',
            icon: 'time-outline',
            label: 'Delivery History',
            route: '/history',
        },
        {
            id: 'settings',
            icon: 'settings-outline',
            label: 'Settings',
            route: '/settings',
        },
        {
            id: 'support',
            icon: 'help-circle-outline',
            label: 'Support/FAQ',
            route: '/support',
        },
        {
            id: 'invite',
            icon: 'mail-outline',
            label: 'Invite Friends',
            route: '/invite',
        },
        {
            id: 'privacy',
            icon: 'shield-outline',
            label: 'Privacy Policy',
            route: '/privacy',
        },
    ];

    const handleEditPhoto = async () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        Alert.alert(
            'Change Profile Photo',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: takePhoto,
                },
                {
                    text: 'Choose from Library',
                    onPress: pickImage,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Camera permission is needed');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
                // Upload to server
                await uploadProfileImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Photo library permission is needed');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
                // Upload to server
                await uploadProfileImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const uploadProfileImage = async (image) => {
        try {
            const formData = new FormData();
            formData.append('profileImage', {
                uri: image.uri,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });

            // Replace with your actual API endpoint
            const response = await fetch(`https://your-api.com/api/user/profile-image`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                if (Platform.OS === 'ios') {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload profile image');
        }
    };

    const handleMenuPress = (item) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push(item.route);
    };

    const handleSignOut = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Text style={[styles.title, {
                    fontSize: isTablet ? fontSize.xxxl * 1.2 : fontSize.xxxl,
                    marginTop: spacing.lg,
                }]}>
                    Profile
                </Text>

                {/* Profile Section */}
                <View style={[styles.profileSection, { marginTop: spacing.xl }]}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: profileImage }}
                            style={[styles.avatar, {
                                width: scale(140),
                                height: scale(140),
                            }]}
                        />
                        <TouchableOpacity
                            style={[styles.editPhotoButton, {
                                width: scale(40),
                                height: scale(40),
                            }]}
                            onPress={handleEditPhoto}
                        >
                            <Ionicons name="pencil" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.userName, {
                        fontSize: isTablet ? fontSize.xxl : fontSize.xl,
                        marginTop: spacing.md,
                    }]}>
                        {user?.name || 'Davidson Edgar'}
                    </Text>

                    {/* Separator */}
                    <View style={[styles.separator, { marginTop: spacing.md }]} />
                </View>

                {/* Menu Items */}
                <View style={[styles.menuContainer, { marginTop: spacing.lg }]}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                {
                                    paddingVertical: spacing.lg,
                                    paddingHorizontal: spacing.lg,
                                }
                            ]}
                            onPress={() => handleMenuPress(item)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.iconContainer, {
                                    width: scale(48),
                                    height: scale(48),
                                }]}>
                                    <Ionicons name={item.icon} size={24} color="#999" />
                                </View>
                                <Text style={[styles.menuItemText, { fontSize: fontSize.md }]}>
                                    {item.label}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    style={[
                        styles.signOutButton,
                        {
                            marginTop: spacing.xl * 2,
                            marginBottom: spacing.xl,
                            height: scale(56),
                            marginHorizontal: spacing.lg,
                        }
                    ]}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.signOutButtonText, { fontSize: fontSize.lg }]}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    title: {
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    profileSection: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        borderRadius: 1000,
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F0F0F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    userName: {
        fontWeight: '700',
        color: '#000',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    separator: {
        width: '80%',
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    menuContainer: {
        paddingHorizontal: 0,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuItemText: {
        color: '#666',
        fontWeight: '500',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
    signOutButton: {
        backgroundColor: '#8BC34A',
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
    signOutButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    },
});