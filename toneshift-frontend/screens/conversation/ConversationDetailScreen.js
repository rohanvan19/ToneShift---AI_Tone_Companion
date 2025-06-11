import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, TextInput, IconButton, Menu, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { conversationApi, responseApi } from '../../utils/api';
import MessageBubble from '../../components/conversation/MessageBubble';
import ToneSelector from '../../components/conversation/ToneSelector';
import CustomDialog from '../../components/CustomDialog';
import { useTheme } from '../../utils/ThemeContext';

const ConversationDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { colors, spacing, fonts, shadows, borderRadius } = theme;
  
  // Define styles at the top of the component
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoid: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    messageList: {
      padding: spacing.m,
      paddingBottom: spacing.xl,
    },
    inputContainer: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      padding: spacing.m,
      paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.m,
      ...shadows.medium,
    },
    toneContainer: {
      marginBottom: spacing.m,
    },
    toneLabel: {
      ...fonts.semiBold,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontSize: fonts.sizes.small,
    },
    toneScrollView: {
      flexDirection: 'row',
      paddingBottom: spacing.xs,
    },
    toneChip: {
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      borderRadius: borderRadius.round,
      marginRight: spacing.s,
      backgroundColor: colors.cardAlt,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
      marginBottom: spacing.xs,
      ...shadows.small,
    },
    selectedToneChip: {
      backgroundColor: colors.primary,
      borderColor: colors.primaryDark,
      elevation: 4,
    },
    toneChipText: {
      ...fonts.semiBold,
      color: colors.textSecondary,
      fontSize: fonts.sizes.small,
    },
    selectedToneChipText: {
      color: '#fff',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    input: {
      flex: 1,
      maxHeight: 120,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.large,
      paddingHorizontal: spacing.m,
      paddingTop: spacing.s,
      paddingBottom: spacing.s,
      color: colors.text,
      ...fonts.regular,
      fontSize: fonts.sizes.medium,
      ...shadows.small,
    },
    sendButton: {
      margin: 0,
      marginLeft: spacing.s,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.round,
      elevation: 4,
      ...shadows.small,
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  const { conversationId } = route.params;
  
  // State variables
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchConversation();
    fetchAvailableTones();
    
    // Set up navigation options
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setNewTitle(conversation?.title || '');
              setRenameDialogVisible(true);
            }}
            title="Rename Conversation"
            leadingIcon="pencil"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setDeleteDialogVisible(true);
            }}
            title="Delete Conversation"
            leadingIcon="delete"
          />
        </Menu>
      ),
    });
  }, [conversationId, menuVisible, conversation]);

  const fetchConversation = async () => {
    setLoading(true);
    try {
      const response = await conversationApi.getById(conversationId);
      setConversation(response.data.conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTones = async () => {
    try {
      // This would fetch tones from the API
      const response = await fetch('/api/tones');
      const data = await response.json();
      setAvailableTones(data.tones || []);
    } catch (error) {
      console.error('Error fetching tones:', error);
      // Fallback to default tones
      setAvailableTones([
        { name: 'Professional' },
        { name: 'Casual' },
        { name: 'Friendly' },
        { name: 'Direct' },
        { name: 'Empathetic' },
      ]);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message immediately for better UX
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...(conversation.messages || []), userMessage];
    setConversation({
      ...conversation,
      messages: updatedMessages,
    });
    setMessage('');

    // Now generate AI response
    setIsGenerating(true);
    try {
      const response = await responseApi.generateAndSave({
        message: message.trim(),
        tone: selectedTone,
        conversationId,
      });

      setConversation({
        ...conversation,
        messages: [...updatedMessages, response.data.aiMessage],
      });
    } catch (error) {
      console.error('Error generating response:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRenameConversation = async () => {
    if (!newTitle.trim()) {
      return;
    }
    
    try {
      await conversationApi.update(conversationId, {
        title: newTitle
      });
      
      // Update local state and navigation title
      setConversation({
        ...conversation,
        title: newTitle
      });
      
      navigation.setOptions({
        title: newTitle
      });
      
      // Set params to pass back the updated title to the list screen
      navigation.setParams({
        updatedConversation: {
          id: conversationId,
          title: newTitle
        }
      });
      
      setRenameDialogVisible(false);
    } catch (error) {
      console.error('Error renaming conversation:', error);
      Alert.alert('Error', 'Failed to rename conversation');
    }
  };
  
  const handleDeleteConversation = async () => {
    try {
      await conversationApi.delete(conversationId);
      setDeleteDialogVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      Alert.alert('Error', 'Failed to delete conversation');
    }
  };
  
  const renderMessage = ({ item }) => <MessageBubble message={item} />;

  if (!conversation && loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Replace Dialog components with CustomDialog */}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={conversation?.messages || []}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          onLayout={() => flatListRef.current?.scrollToEnd()}
        />

        {showToneSelector && (
          <ToneSelector
            selectedTone={selectedTone}
            onSelectTone={(tone) => {
              setSelectedTone(tone);
              setShowToneSelector(false);
            }}
            onClose={() => setShowToneSelector(false)}
          />
        )}

        <View style={styles.inputContainer}>
          <View style={styles.toneContainer}>
            <Text style={styles.toneLabel}>Tone:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.toneScrollView}
            >
              {['Professional', 'Casual', 'Friendly', 'Funny', 'Formal', 'Empathetic', 'Direct', 'Enthusiastic'].map((tone) => (
                <TouchableOpacity
                  key={tone}
                  style={[
                    styles.toneChip,
                    selectedTone === tone && styles.selectedToneChip
                  ]}
                  onPress={() => setSelectedTone(tone)}
                >
                  <Text 
                    style={[
                      styles.toneChipText,
                      selectedTone === tone && styles.selectedToneChipText
                    ]}
                  >
                    {tone}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
              style={styles.input}
              disabled={isGenerating}
            />
            <IconButton
              icon="send"
              size={24}
              color={colors.primary}
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!message.trim() || isGenerating}
              loading={isGenerating}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConversationDetailScreen;