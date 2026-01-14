import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SelectField = ({
    value = null,
    onChange,
    options = [],
    placeholder = 'Select option',
    icon = 'bicycle-outline',
    containerStyle = {},
    styles,
    fontSize = 14,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <View>
            {/* Input */}
            <TouchableOpacity
                style={[styles.inputContainer, containerStyle]}
                activeOpacity={0.7}
                onPress={() => setShowDropdown(prev => !prev)}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                />

                <Text
                    style={[
                        styles.dropdownPlaceholder,
                        { fontSize },
                        value && { color: '#000' },
                    ]}
                >
                    {value || placeholder}
                </Text>

                <Ionicons
                    name={showDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#999"
                />
            </TouchableOpacity>

            {/* Dropdown */}
            {showDropdown && (
                <View style={styles.dropDown}>
                    {options.map(option => (
                        <TouchableOpacity
                            key={option}
                            style={styles.dropdownItem}
                            activeOpacity={0.7}
                            onPress={() => {
                                onChange(option);
                                setShowDropdown(false);
                            }}
                        >
                            <Text style={styles.dropdownText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginRight: 12,
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
})

export default SelectField;
