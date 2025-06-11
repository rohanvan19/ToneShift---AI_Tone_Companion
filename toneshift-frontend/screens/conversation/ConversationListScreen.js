import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { conversationApi } from '../../utils/api';
import { colors, spacing, fonts, shadows, borderRadius } from '../../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConversationListScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Add this at the top of your component
  useEffect(() => {
    // Debug authentication
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log('Current auth token:', token ? 'Present' : 'Not found');
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      const filtered = conversations.filter(convo => 
        convo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const fetchConversations = async () => {
    setLoading(true);
    console.log('Fetching conversations...');
    try {
      const response = await conversationApi.getAll();
      console.log('API response:', response.data);
      setConversations(response.data.conversations || []);
      setFilteredConversations(response.data.conversations || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('ConversationDetail', { 
      conversationId: conversation.id,
      title: conversation.title
    });
  };

  const handleCreateConversation = async () => {
    try {
      // Create a new conversation with a default title
      // You could add a modal here to let the user enter a title
      const title = "New Conversation";
      const response = await conversationApi.create({
        title,
        context: '', // Optional context
      });
      
      console.log('Conversation created:', response.data);
      
      // Refresh the conversation list
      await fetchConversations();
      
      // Navigate to the new conversation
      if (response.data && response.data.conversation) {
        navigation.navigate('ConversationDetail', {
          conversationId: response.data.conversation.id,
          title: response.data.conversation.title
        });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Show error to user
      alert('Failed to create a new conversation. Please try again.');
    }
  };

  const renderConversationItem = ({ item }) => {
    // Get the last message if there are any
    const lastMessage = item.messages && item.messages.length > 0 
      ? item.messages[item.messages.length - 1] 
      : null;
    
    // Format the date
    const formattedDate = lastMessage 
      ? new Date(lastMessage.timestamp).toLocaleDateString() 
      : 'No messages yet';

    return (
      <TouchableOpacity onPress={() => handleConversationPress(item)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.conversationTitle}>{item.title}</Text>
            <Text style={styles.lastMessage}>
              {lastMessage ? lastMessage.content.substring(0, 60) + (lastMessage.content.length > 60 ? '...' : '') : 'No messages yet'}
            </Text>
            <Text style={styles.timestamp}>{formattedDate}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && conversations.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchConversations} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Replace the Searchbar with a custom search input */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search conversations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          left={<TextInput.Icon icon="magnify" />}
          mode="outlined"
        />
      </View>
      
      {filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search term' : 'Create a new conversation to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchConversations}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleCreateConversation}
        color="#fff"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  searchContainer: {
    margin: spacing.m,
  },
  searchBar: {
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  listContent: {
    padding: spacing.m,
    paddingBottom: spacing.xxl, // Extra padding for FAB
  },
  card: {
    marginBottom: spacing.m,
    ...shadows.small,
  },
  conversationTitle: {
    ...fonts.medium,
    fontSize: fonts.sizes.large,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: fonts.sizes.xs,
    alignSelf: 'flex-end',
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  retryButton: {
    padding: spacing.m,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
  },
  retryText: {
    color: '#fff',
    ...fonts.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  emptyText: {
    ...fonts.medium,
    fontSize: fonts.sizes.large,
    marginBottom: spacing.s,
  },
  emptySubtext: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: spacing.m,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default ConversationListScreen;