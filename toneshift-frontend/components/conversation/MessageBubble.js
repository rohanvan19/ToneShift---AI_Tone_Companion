import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useTheme } from '../../utils/ThemeContext';

const MessageBubble = ({ message }) => {
  const { theme } = useTheme();
  const { colors, spacing, fonts, shadows, borderRadius } = theme;
  
  const isUser = message.sender === 'user';
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.m,
      maxWidth: '85%',
    },
    userContainer: {
      alignSelf: 'flex-end',
    },
    aiContainer: {
      alignSelf: 'flex-start',
    },
    bubble: {
      borderRadius: borderRadius.large,
      ...shadows.small,
    },
    contentPadding: {
      padding: spacing.s,
    },
    userBubble: {
      backgroundColor: colors.primary,
    },
    aiBubble: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    messageText: {
      ...fonts.regular,
      fontSize: fonts.sizes.medium,
      lineHeight: 22,
    },
    userText: {
      color: '#fff',
    },
    aiText: {
      color: colors.text,
    },
    timeContainer: {
      flexDirection: 'row',
      marginTop: spacing.xs,
      alignItems: 'center',
    },
    userTimeContainer: {
      justifyContent: 'flex-end',
    },
    aiTimeContainer: {
      justifyContent: 'flex-start',
    },
    timeText: {
      fontSize: fonts.sizes.xs,
      color: colors.textSecondary,
      ...fonts.regular,
    },
    toneText: {
      fontSize: fonts.sizes.xs,
      color: colors.secondary,
      marginRight: spacing.s,
      fontStyle: 'italic',
      ...fonts.medium,
    },
  });

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <Card style={[
        styles.bubble, 
        isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Card.Content style={styles.contentPadding}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
            {message.content}
          </Text>
        </Card.Content>
      </Card>
      <View style={[styles.timeContainer, isUser ? styles.userTimeContainer : styles.aiTimeContainer]}>
        {message.tone && (
          <Text style={styles.toneText}>
            {message.tone}
          </Text>
        )}
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>
    </View>
  );
};

export default MessageBubble;