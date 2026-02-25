import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ImageUploadField = ({
    value = true,            // selected image URI
    onChange,
    placeholder = 'Upload image',
    icon = 'image-outline',
    styles,
    containerStyle = {},
    fontSize = 14,
}) => {
    const pickImage = async () => {
        // if (Platform.OS === 'android') {
        //     StatusBar.setBackgroundColor('#ffffff');
        //     StatusBar.setStyle('dark');
        // }
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.7,
        });

        console.log('Picked image:', result);


        if (!result.canceled) {
            onChange(result.assets[0]);
        }
    };
    const closePreview = () => {
        onChange(null)
    }

    return (
        <View>
            <TouchableOpacity
                style={[styles.uploadContainer, containerStyle]}
                activeOpacity={0.7}
                onPress={pickImage}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                />

                <Text
                    style={[styles.uploadPlaceholder,
                    { fontSize },
                    value && { color: '#000' },
                    ]}
                >
                    {value ? 'Change image' : placeholder}
                </Text>
            </TouchableOpacity>

            {/* Preview */}
            {value && (
                <View style={styles.uploadPreview}>
                    <TouchableOpacity
                        onPress={closePreview}
                        style={styles.closePreview}
                    >
                        <Ionicons name='close' size={24} color='red' />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: value.uri }}
                        style={styles.imagePreview}
                    />
                </View>
            )}
        </View>
    );
};

export default ImageUploadField;

