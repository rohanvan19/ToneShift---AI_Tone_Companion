import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/theme';

// Import placeholder screens
import ConversationListScreen from '../screens/conversation/ConversationListScreen';
import ConversationDetailScreen from '../screens/conversation/ConversationDetailScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';

const Tab = createBottomTabNavigator();
const ConversationStack = createNativeStackNavigator();

// Create the conversation stack
const ConversationNavigator = () => {
  return (
    <ConversationStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      }}
    >
      <ConversationStack.Screen 
        name="ConversationsList" 
        component={ConversationListScreen} 
        options={{ title: 'Conversations' }}
      />
      <ConversationStack.Screen 
        name="ConversationDetail" 
        component={ConversationDetailScreen} 
        options={({ route }) => ({ title: route.params?.title || 'Conversation' })}
      />
    </ConversationStack.Navigator>
  );
};

// Main tab navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Conversations') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen 
        name="Conversations" 
        component={ConversationNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;