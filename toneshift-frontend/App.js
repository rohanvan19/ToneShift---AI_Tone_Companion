import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation';
import { AuthContext } from './utils/auth';
import { colors } from './utils/theme';

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isSignout: false,
    userToken: null,
    userData: null,
  });

  useEffect(() => {
    // Check for stored token and user data
    const bootstrapAsync = async () => {
      let userToken = null;
      let userData = null;
      
      try {
        userToken = await AsyncStorage.getItem('token');
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          userData = JSON.parse(storedUserData);
        }
      } catch (e) {
        console.log('Failed to get data from storage', e);
      }

      setState({ ...state, isLoading: false, userToken, userData });
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

  const theme = {
    colors: {
      primary: colors.primary,
      accent: colors.secondary,
      background: colors.background,
      surface: colors.surface,
      error: colors.error,
      text: colors.text,
      disabled: colors.textSecondary,
      placeholder: colors.textSecondary,
      backdrop: 'rgba(0, 0, 0, 0.5)',
    },
  };

  return (
    <AuthContext.Provider value={{ ...authContext, ...state }}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </SafeAreaProvider>
      </PaperProvider>
    </AuthContext.Provider>
  );
}