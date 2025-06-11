import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../utils/ThemeContext';

const QuickMenu = ({ visible, onDismiss, options, position = {} }) => {
  const { theme } = useTheme();
  const { colors, spacing, fonts, shadows, borderRadius } = theme;
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    menuContainer: {
      position: 'absolute',
      right: position.right || 10,
      top: position.top || 50,
      backgroundColor: colors.card,
      borderRadius: borderRadius.medium,
      ...shadows.large,
      width: 200,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.m,
    },
    menuText: {
      ...fonts.medium,
      fontSize: fonts.sizes.medium,
      color: colors.text,
      marginLeft: spacing.s,
    },
    iconContainer: {
      width: 24,
      alignItems: 'center',
    },
    divider: {
      backgroundColor: colors.border,
      height: 1,
      width: '100%',
    },
  });

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onDismiss}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.modalContainer}>
          <View style={[styles.menuContainer, position]}>
            {options.map((option, index) => (
              <React.Fragment key={option.id || index}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onDismiss();
                    option.onPress();
                  }}
                >
                  <View style={styles.iconContainer}>
                    <Icon name={option.icon} size={20} color={option.color || colors.text} />
                  </View>
                  <Text style={styles.menuText}>{option.title}</Text>
                </TouchableOpacity>
                {index < options.length - 1 && <Divider style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default QuickMenu;