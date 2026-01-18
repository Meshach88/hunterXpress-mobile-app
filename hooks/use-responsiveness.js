import { useState, useEffect } from 'react';
import { Dimensions, Platform, useWindowDimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const useResponsive = () => {
    const [dimensions, setDimensions] = useState({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions({
                width: window.width,
                height: window.height,
            });
        });

        return () => subscription?.remove();
    }, []);

    const { width, height } = dimensions;

    // Determine device type
    const isSmallDevice = width < 375;
    const isTablet = width >= 768;
    const isLargeTablet = width >= 1024;

    // Scaling functions
    const scale = (size) => {
        const scaleFactor = width / BASE_WIDTH;
        const newSize = size * scaleFactor;

        // Limit scaling on tablets
        if (isTablet) {
            return Math.min(newSize, size * 1.3);
        }

        return newSize;
    };

    const verticalScale = (size) => {
        const scaleFactor = height / BASE_HEIGHT;
        return size * scaleFactor;
    };

    const moderateScale = (size, factor = 0.5) => {
        return size + (scale(size) - size) * factor;
    };

    // Responsive values based on device type
    const getResponsiveValue = (small, medium, large) => {
        if (isLargeTablet) return large;
        if (isTablet) return medium;
        return small;
    };

    // Platform-specific utilities
    const isIOS = Platform.OS === 'ios';
    const isAndroid = Platform.OS === 'android';

    // Spacing utilities
    const spacing = {
        xs: scale(4),
        sm: scale(8),
        md: scale(16),
        lg: scale(24),
        xl: scale(32),
        xxl: scale(48),
    };

    // Font sizes
    const fontSize = {
        xs: scale(10),
        sm: scale(12),
        md: scale(16),
        lg: scale(18),
        xl: scale(20),
        xxl: scale(24),
        xxxl: scale(32),
    };

    return {
        width,
        height,
        isSmallDevice,
        isTablet,
        isLargeTablet,
        isIOS,
        isAndroid,
        scale,
        verticalScale,
        moderateScale,
        getResponsiveValue,
        spacing,
        fontSize,
    };
};