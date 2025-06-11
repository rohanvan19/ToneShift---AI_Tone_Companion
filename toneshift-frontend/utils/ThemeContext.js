import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { AuthContext } from './auth';
import { lightTheme, darkTheme } from './theme';

export const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const { userData, updateUserData } = useContext(AuthContext);
  const deviceColorScheme = useColorScheme();
  
  // Initialize with user preference or device setting
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (userData?.preferences?.darkMode !== undefined) {
      return userData.preferences.darkMode;
    }
    return deviceColorScheme === 'dark';
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Save preference if user is logged in
    if (userData) {
      const updatedPreferences = {
        ...userData.preferences,
        darkMode: newMode,
      };
      
      updateUserData({ 
        preferences: updatedPreferences 
      });
    }
  };

  // Update theme when user data changes
  useEffect(() => {
    if (userData?.preferences?.darkMode !== undefined) {
      setIsDarkMode(userData.preferences.darkMode);
    }
  }, [userData]);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);