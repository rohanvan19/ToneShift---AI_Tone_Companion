import * as Font from 'expo-font';
import { Platform } from 'react-native';

export const colors = {
  primary: '#6200ea',
  primaryLight: '#9d46ff',
  primaryDark: '#0a00b6',
  secondary: '#03dac6',
  secondaryLight: '#66fff9',
  secondaryDark: '#00a896',
  background: '#f5f5f5',
  surface: '#ffffff',
  error: '#b00020',
  text: '#121212',
  textSecondary: '#757575',
  border: '#e0e0e0',
  success: '#4CAF50',
  warning: '#FFC107',
};

export const fonts = {
  regular: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  medium: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  bold: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '700',
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

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xl: 20,
  round: 999,
};

export default {
  colors,
  fonts,
  spacing,
  shadows,
  borderRadius,
};