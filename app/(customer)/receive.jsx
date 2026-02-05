import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/use-responsiveness';
import api from '@/api/api';


export default function SendItemScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { scale, spacing, fontSize, isTablet } = useResponsive();

  const [formData, setFormData] = useState({
    senderLocation: '',
    receiverLocation: '',
    description: '',
    photo: null,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Request location permissions on mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Location permission is needed to use current location feature'
      );
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const locationString = `${address[0].street || ''}, ${address[0].city || ''}, ${address[0].region || ''}`.trim();
        setFormData(prev => ({
          ...prev,
          receiverLocation: locationString,
        }));

        if (Platform.OS === 'ios') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera roll permission is needed to upload photos'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          photo: result.assets[0],
        }));

        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is needed to take photos'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          photo: result.assets[0],
        }));

        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePhotoAction = () => {
    Alert.alert(
      'Add Photo',
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

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
    }));

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.senderLocation.trim()) {
      newErrors.senderLocation = 'Sender location is required';
    }

    if (!formData.receiverLocation.trim()) {
      newErrors.receiverLocation = 'Receiver location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for API
      // const orderData = new FormData();
      // orderData.append('senderLocation', formData.senderLocation);
      // orderData.append('receiverLocation', formData.receiverLocation);
      // orderData.append('description', formData.description);
      //   orderData.append('userId', user?.id);

      // if (formData.photo) {
      //   orderData.append('photo', {
      //     uri: formData.photo.uri,
      //     type: 'image/jpeg',
      //     name: 'item-photo.jpg',
      //   });
      // }

      const orderData = {
        pickup_address: formData.senderLocation,
        dropoff_address: formData.receiverLocation,
        package_details: JSON.stringify({ description: formData.description }),
        price: 2000,
        distance_km: 10
      }

      const response = await api.post('/deliveries', orderData);

      const data = await response.data;

      console.log(data)

      if (data.success) {
        Alert.alert(
          'Success',
          'Your order has been placed successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.push({
                pathname: '/(customer)/payment',
                params: { order: JSON.stringify(data) }
              }),
            },
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
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
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, {
            fontSize: isTablet ? fontSize.xxxl * 1.3 : fontSize.xxxl * 1.2,
            marginTop: spacing.lg,
          }]}>
            Receive Item
          </Text>

          {/* Receiver's Location */}
          <View style={{ marginTop: spacing.xl }}>
            <TextInput
              style={[
                styles.input,
                {
                  fontSize: fontSize.md,
                  borderColor: errors.receiverLocation ? '#FF3B30' : '#E0E0E0',
                }
              ]}
              placeholder="Your location:"
              placeholderTextColor="#999"
              value={formData.receiverLocation}
              onChangeText={(value) => updateFormData('receiverLocation', value)}
              editable={!isSubmitting}
              multiline
            />
            {errors.receiverLocation && (
              <Text style={styles.errorText}>{errors.receiverLocation}</Text>
            )}

            {/* Use Current Location */}
            <TouchableOpacity
              style={[styles.useLocationButton, { marginTop: spacing.sm }]}
              onPress={getCurrentLocation}
              disabled={isLoadingLocation || isSubmitting}
            >
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#FF8C00" />
              ) : (
                <>
                  <Ionicons name="location" size={18} color="#FF8C00" />
                  <Text style={[styles.useLocationText, { fontSize: fontSize.sm }]}>
                    use current location
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Item Location */}
          <View style={{ marginTop: spacing.lg }}>
            <TextInput
              style={[
                styles.input,
                {
                  fontSize: fontSize.md,
                  borderColor: errors.senderLocation ? '#FF3B30' : '#E0E0E0',
                }
              ]}
              placeholder="Item's location:"
              placeholderTextColor="#999"
              value={formData.senderLocation}
              onChangeText={(value) => updateFormData('senderLocation', value)}
              editable={!isSubmitting}
              multiline
            />
            {errors.receiverLocation && (
              <Text style={styles.errorText}>{errors.senderLocation}</Text>
            )}
          </View>

          {/* Description */}
          <View style={{ marginTop: spacing.lg }}>
            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
                {
                  fontSize: fontSize.md,
                  borderColor: errors.description ? '#FF3B30' : '#E0E0E0',
                }
              ]}
              placeholder="Description:"
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              editable={!isSubmitting}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Add Photo */}
          <View style={{ marginTop: spacing.lg }}>
            <Text style={[styles.photoLabel, { fontSize: fontSize.md }]}>
              Add photo: <Text style={styles.optionalText}>(optional)</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.photoContainer,
                {
                  height: scale(150),
                  marginTop: spacing.sm,
                }
              ]}
              onPress={handlePhotoAction}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              {formData.photo ? (
                <View style={styles.photoPreviewContainer}>
                  <Image
                    source={{ uri: formData.photo.uri }}
                    style={styles.photoPreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={removePhoto}
                  >
                    <Ionicons name="close-circle" size={32} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="image-outline" size={scale(60)} color="#CCC" />
                  <Ionicons
                    name="add-circle"
                    size={scale(32)}
                    color="#999"
                    style={styles.addIcon}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              {
                marginTop: spacing.xl * 2,
                marginBottom: spacing.xl,
                height: scale(56),
              },
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handlePlaceOrder}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={[styles.placeOrderButtonText, { fontSize: fontSize.lg }]}>
                Place Order
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    color: '#000',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
    minHeight: 56,
  },
  descriptionInput: {
    minHeight: 120,
    paddingTop: 14,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  useLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  useLocationText: {
    color: '#FF8C00',
    textDecorationLine: 'underline',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  photoLabel: {
    color: '#999',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  optionalText: {
    color: '#999',
  },
  photoContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addIcon: {
    position: 'absolute',
    top: '55%',
    right: '42%',
  },
  photoPreviewContainer: {
    flex: 1,
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  placeOrderButton: {
    backgroundColor: '#FF8C00',
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
  placeOrderButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});