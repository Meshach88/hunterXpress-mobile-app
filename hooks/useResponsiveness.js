import { useState } from 'react';
import { useWindowDimensions, Platform } from 'react-native';

const BASE_WIDTH = 375;

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(useWindowDimensions());

  const { width, height } = dimensions;
  const isTablet = width >= 768;

  const scale = (size) => {
    const scaleFactor = width / BASE_WIDTH;
    return isTablet ? Math.min(size * scaleFactor, size * 1.3) : size * scaleFactor;
  };

  const spacing = {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
  };

  const fontSize = {
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
    isTablet,
    scale,
    spacing,
    fontSize,
  };
};