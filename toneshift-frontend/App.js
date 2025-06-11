import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import Navigation from './navigation';
import { AuthContext } from './utils/auth';
import { ThemeProvider } from './utils/ThemeContext';
import { useTheme } from './utils/ThemeContext';

// Create a themed component that will use the ThemeContext
const ThemedApp = () => {
  const { theme, isDarkMode } = useTheme();
  
  // Configure Paper theme based on our theme
  const paperTheme = isDarkMode ? {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: theme.colors.primary,
      onPrimary: '#FFFFFF',
      secondary: theme.colors.secondary,
      background: theme.colors.background,
      surface: theme.colors.surface,
      error: theme.colors.error,
      onBackground: theme.colors.text,
      onSurface: theme.colors.text,
      disabled: theme.colors.textSecondary,
      placeholder: theme.colors.textSecondary,
      backdrop: 'rgba(0, 0, 0, 0.5)',
    }
  } : {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: theme.colors.primary,
      onPrimary: '#FFFFFF',
      secondary: theme.colors.secondary,
      background: theme.colors.background,
      surface: theme.colors.surface,
      error: theme.colors.error,
      onBackground: theme.colors.text,
      onSurface: theme.colors.text,
      disabled: theme.colors.textSecondary,
      placeholder: theme.colors.textSecondary,
      backdrop: 'rgba(0, 0, 0, 0.4)',
    }
  };
  
  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <Navigation />
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isSignout: false,
    userToken: null,
    userData: null,
    fontsLoaded: false,
  });

  useEffect(() => {
    // Load fonts and check for stored token and user data
    const bootstrapAsync = async () => {
      let userToken = null;
      let userData = null;
      
      try {
        // Load all required fonts
        await Font.loadAsync({
          'MaterialCommunityIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
          'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
          'OpenSans-Medium': require('./assets/fonts/OpenSans-Medium.ttf'),
          'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
          'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
        });
        
        userToken = await AsyncStorage.getItem('token');
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          userData = JSON.parse(storedUserData);
        }
      } catch (e) {
        console.log('Failed to load resources', e);
      }

      setState({ ...state, isLoading: false, userToken, userData, fontsLoaded: true });
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (token, userData) => {
      try {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setState({ ...state, isSignout: false, userToken: token, userData });
      } catch (e) {
        console.log('Failed to save auth data', e);
      }
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userData');
        setState({ ...state, isSignout: true, userToken: null, userData: null });
      } catch (e) {
        console.log('Failed to remove auth data', e);
      }
    },
    updateUserData: async (updatedData) => {
      try {
        const newUserData = { ...state.userData, ...updatedData };
        await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
        setState({ ...state, userData: newUserData });
      } catch (e) {
        console.log('Failed to update user data', e);
      }
    },
  };

  if (!state.fontsLoaded) {
    return null; // You can also return a loading indicator here
  }

  return (
    <AuthContext.Provider value={{ ...authContext, ...state }}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}