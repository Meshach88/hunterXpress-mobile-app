import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const lightTheme = {
    colors: {
        background: '#2C2C2C',
        card: '#FFFFFF',
        text: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        primary: '#8BC34A',
        secondary: '#FF8C00',
        border: 'rgba(255, 255, 255, 0.1)',
        tabBar: '#FFFFFF',
        tabBarInactive: '#BDBDBD',
        tabBarActive: '#8BC34A',
    },
};

const darkTheme = {
    colors: {
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.6)',
        primary: '#8BC34A',
        secondary: '#FF8C00',
        border: 'rgba(255, 255, 255, 0.1)',
        tabBar: '#1E1E1E',
        tabBarInactive: '#757575',
        tabBarActive: '#8BC34A',
    },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            } else {
                // Use system preference if no saved preference
                const colorScheme = Appearance.getColorScheme();
                setIsDark(colorScheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = !isDark;
            setIsDark(newTheme);
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, isLoading }}>
            {children}
        </ThemeContext.Provider>
    );
};
