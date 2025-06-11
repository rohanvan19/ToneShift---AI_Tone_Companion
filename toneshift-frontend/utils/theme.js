import { Platform } from 'react-native';

export const colors = {
  // Modern color palette
  primary: '#5E60CE',
  primaryLight: '#7E7FEF',
  primaryDark: '#4A4AB7',
  secondary: '#64DFDF',
  secondaryLight: '#80FFFF',
  secondaryDark: '#48B9B9',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  error: '#FF5A5A',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  success: '#52B788',
  warning: '#FFD166',
  accent: '#FF9F1C',
};

// Updated font configuration with Open Sans
export const fonts = {
  regular: {
    fontFamily: 'OpenSans-Regular',
    letterSpacing: 0.2,
  },
  medium: {
    fontFamily: 'OpenSans-Medium',
    letterSpacing: 0.2,
  },
  semiBold: {
    fontFamily: 'OpenSans-SemiBold',
    letterSpacing: 0.2,
  },
  bold: {
    fontFamily: 'OpenSans-Bold',
    letterSpacing: 0.2,
  },
  sizes: {
    xs: 12,
    small: 14,
    medium: 16,
    large: 18,
    xl: 22,
    xxl: 26,
    xxxl: 32,
  },
};

// Modern spacing
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Enhanced shadows for modern look
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Modern border radiuses
export const borderRadius = {
  small: 6,
  medium: 10,
  large: 16,
  xl: 24,
  round: 999,
};

export default {
  colors,
  fonts,
  spacing,
  shadows,
  borderRadius,
};