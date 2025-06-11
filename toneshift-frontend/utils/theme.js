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

// Modern spacing with more breathing room
const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Enhanced border radiuses for more modern look
const borderRadius = {
  small: 8,
  medium: 12,
  large: 20,
  xl: 28,
  round: 999,
};

// Light theme colors with better contrast and vibrancy
const lightColors = {
  primary: '#6366F1',       // Indigo for a more modern look
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#06B6D4',     // Cyan
  secondaryLight: '#22D3EE',
  secondaryDark: '#0891B2',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  error: '#EF4444',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  accent: '#F97316',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  highlight: '#EEF2FF',
};

// Dark theme colors with better contrast
const darkColors = {
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#4F46E5',
  secondary: '#22D3EE',
  secondaryLight: '#67E8F9',
  secondaryDark: '#0891B2',
  background: '#0F172A',
  surface: '#1E293B',
  error: '#EF4444',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  accent: '#F97316',
  card: '#1E293B',
  cardAlt: '#334155',
  highlight: '#312E81',
};

// Enhanced shadows for more depth
const lightShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Darker shadows for dark mode
const darkShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
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