import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, FAB, ActivityIndicator, TextInput, Menu, IconButton, Button, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { conversationApi } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../utils/ThemeContext';
import CustomDialog from '../../components/CustomDialog';

const ConversationListScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, fonts, shadows, borderRadius } = theme;
  
  // Move the styles definition here, before they're used in any conditionals
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
      borderRadius: borderRadius.large,
      height: 50,
      ...shadows.small,
    },
    listContent: {
      padding: spacing.m,
      paddingBottom: spacing.xxxl, // Extra padding for FAB
    },
    card: {
      marginBottom: spacing.m,
      backgroundColor: colors.card,
      borderRadius: borderRadius.large,
      overflow: 'hidden',
      ...shadows.medium,
      borderWidth: 1,
      borderColor: colors.border,
    },
    conversationTitle: {
      ...fonts.semiBold,
      fontSize: fonts.sizes.large,
      marginBottom: spacing.xs,
      color: colors.text,
    },
    lastMessage: {
      ...fonts.regular,
      color: colors.textSecondary,
      marginBottom: spacing.s,
      lineHeight: 20,
    },
    timestamp: {
      ...fonts.medium,
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
      color: colors.text,
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
      borderRadius: borderRadius.round,
      ...shadows.large,
      width: 60,
      height: 60,
    },
  });
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');

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
  
  const handleConversationLongPress = (conversation, event) => {
    // Save the selected conversation and show menu
    setSelectedConversation(conversation);
    setMenuVisible(true);
  };
  
  const handleRenameConversation = async () => {
    if (!newTitle.trim() || !selectedConversation) {
      return;
    }
    
    try {
      await conversationApi.update(selectedConversation.id, {
        title: newTitle
      });
      
      // Update local state
      const updatedConversations = conversations.map(convo => 
        convo.id === selectedConversation.id 
          ? { ...convo, title: newTitle } 
          : convo
      );
      
      setConversations(updatedConversations);
      setFilteredConversations(
        updatedConversations.filter(convo => 
          convo.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      setRenameDialogVisible(false);
    } catch (error) {
      console.error('Error renaming conversation:', error);
      Alert.alert('Error', 'Failed to rename conversation');
    }
  };
  
  const handleDeleteConversation = async () => {
    if (!selectedConversation) {
      return;
    }
    
    try {
      await conversationApi.delete(selectedConversation.id);
      
      // Update local state
      const updatedConversations = conversations.filter(
        convo => convo.id !== selectedConversation.id
      );
      
      setConversations(updatedConversations);
      setFilteredConversations(
        updatedConversations.filter(convo => 
          convo.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      setDeleteDialogVisible(false);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      Alert.alert('Error', 'Failed to delete conversation');
    }
  };
  
  const handleCreateConversation = async () => {
    try {
      // Create a default title (can be updated later)
      const defaultTitle = `New Conversation ${new Date().toLocaleString()}`;
      
      // Create the conversation via API
      const response = await conversationApi.create({ 
        title: defaultTitle
      });
      
      // Navigate to the newly created conversation
      if (response.data && response.data.conversation) {
        const newConversation = response.data.conversation;
        
        // Add to state for immediate UI update
        const updatedConversations = [newConversation, ...conversations];
        setConversations(updatedConversations);
        setFilteredConversations(
          updatedConversations.filter(convo => 
            convo.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        
        // Navigate to the new conversation
        navigation.navigate('ConversationDetail', {
          conversationId: newConversation.id,
          title: newConversation.title
        });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert('Error', 'Failed to create a new conversation');
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
      <TouchableOpacity 
        onPress={() => handleConversationPress(item)}
        onLongPress={(event) => handleConversationLongPress(item, event)}
        delayLongPress={500}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.conversationTitle}>{item.title}</Text>
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={(event) => {
                  // Get the position of the touch event
                  const { pageX, pageY } = event.nativeEvent;
                  setMenuPosition({ x: pageX, y: pageY });
                  setSelectedConversation(item);
                  setMenuVisible(true);
                }}
              />
            </View>
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
      {/* Menu */}
      <Portal>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={menuPosition}
          contentStyle={{ marginTop: 30 }} // Add some margin to position it below button
        >
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              setNewTitle(selectedConversation?.title || '');
              setRenameDialogVisible(true);
            }} 
            title="Rename Conversation" 
            leadingIcon="pencil"
          />
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              setDeleteDialogVisible(true);
            }} 
            title="Delete Conversation" 
            leadingIcon="delete"
          />
        </Menu>
      </Portal>
      
      {/* Custom dialogs without animations */}
      <CustomDialog
        visible={renameDialogVisible}
        onDismiss={() => setRenameDialogVisible(false)}
        title="Rename Conversation"
        content={
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            style={{ marginTop: 10 }}
            mode="outlined"
          />
        }
        actions={
          <>
            <Button onPress={() => setRenameDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleRenameConversation}>Rename</Button>
          </>
        }
      />
      
      <CustomDialog
        visible={deleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
        title="Delete Conversation"
        content={
          <Text>Are you sure you want to delete this conversation? This action cannot be undone.</Text>
        }
        actions={
          <>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteConversation} color={colors.error}>Delete</Button>
          </>
        }
      />
      
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

export default ConversationListScreen;