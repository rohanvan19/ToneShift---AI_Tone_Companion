import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../utils/auth';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useTheme } from '../utils/ThemeContext';

export default function Navigation() {
  const { isLoading, userToken } = useContext(AuthContext);
  const { theme } = useTheme(); // Use theme from context instead of static import

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}