import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ImageUploadField = ({
    value = null,            // selected image URI
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
            onChange(result.assets[0].uri);
        }
    };

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
                    style={[
                        styles.uploadPlaceholder,
                        { fontSize },
                        value && { color: '#000' },
                    ]}
                >
                    {value ? 'Change image' : placeholder}
                </Text>
            </TouchableOpacity>

            {/* Preview */}
            {value && (
                <Image
                    source={{ uri: value }}
                    style={styles.uploadPreview}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
    inputIcon: {
        marginRight: 12,
    },
    uploadPreview: {
        marginTop: 10,
        width: '100%',
        height: 180,
        borderRadius: 10,
        resizeMode: 'cover',
    },

})

export default ImageUploadField;

