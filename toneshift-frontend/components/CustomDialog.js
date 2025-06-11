import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { useTheme } from '../utils/ThemeContext';

const CustomDialog = ({ 
  visible, 
  onDismiss, 
  title, 
  content, 
  actions,
  children 
}) => {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius } = theme;

  if (!visible) return null;
  
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onDismiss}
      animationType="none" // No animation
    >
      <View style={styles.backdrop} onTouchEnd={onDismiss}>
        <Surface 
          style={[styles.dialog, { 
            backgroundColor: colors.surface,
            borderRadius: borderRadius.medium,
          }]}
          onTouchEnd={e => e.stopPropagation()}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.contentContainer}>
            {content || children}
          </View>
          <View style={styles.actionsContainer}>
            {actions}
          </View>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    maxWidth: 340,
    elevation: 24,
  },
  titleContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 16,
  },
  actionsContainer: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default CustomDialog;