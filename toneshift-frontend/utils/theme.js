import { Platform } from 'react-native';

// Common values shared by both themes
const fonts = {
  regular: {
    fontFamily: 'OpenSans-Regular',
    letterSpacing: 0.3,
  },
  medium: {
    fontFamily: 'OpenSans-Medium',
    letterSpacing: 0.3,
  },
  semiBold: {
    fontFamily: 'OpenSans-SemiBold',
    letterSpacing: 0.3,
  },
  bold: {
    fontFamily: 'OpenSans-Bold',
    letterSpacing: 0.3,
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
const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Border radiuses
const borderRadius = {
  small: 6,
  medium: 10,
  large: 16,
  xl: 24,
  round: 999,
};

// Light theme colors
const lightColors = {
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
  card: '#FFFFFF',
  cardAlt: '#F8F9FD',
  highlight: '#F0F4FF',
};

// Dark theme colors
const darkColors = {
  primary: '#7E7FEF', // Lighter for dark mode
  primaryLight: '#9E9FFF',
  primaryDark: '#4A4AB7',
  secondary: '#64DFDF',
  secondaryLight: '#80FFFF',
  secondaryDark: '#48B9B9',
  background: '#121212',
  surface: '#1E1E1E',
  error: '#FF5A5A',
  text: '#E9ECEF',
  textSecondary: '#ADB5BD',
  border: '#333333',
  success: '#52B788',
  warning: '#FFD166',
  accent: '#FF9F1C',
  card: '#252525',
  cardAlt: '#333333',
  highlight: '#333366',
};

// Enhanced shadows for modern look
const lightShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Darker shadows for dark mode
const darkShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Create complete themes
export const lightTheme = {
  colors: lightColors,
  fonts,
  spacing,
  shadows: lightShadows,
  borderRadius,
  dark: false,
};

export const darkTheme = {
  colors: darkColors,
  fonts,
  spacing,
  shadows: darkShadows,
  borderRadius,
  dark: true,
};

// For backward compatibility - default is light theme
export const colors = lightColors;
export const shadows = lightShadows;
export { fonts, spacing, borderRadius };

export default lightTheme;