import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../utils/ThemeContext';

const ToneSelector = ({ selectedTone, onSelectTone, onClose }) => {
  const { theme } = useTheme();
  const { colors, spacing, fonts, shadows, borderRadius } = theme;
  
  // Sample tones (in a real app, these would come from the API)
  const tones = [
    { name: 'Professional', icon: 'briefcase-outline' },
    { name: 'Casual', icon: 'coffee-outline' },
    { name: 'Friendly', icon: 'emoticon-happy-outline' },
    { name: 'Funny', icon: 'emoticon-cool-outline' },
    { name: 'Formal', icon: 'format-letter-case' },
    { name: 'Empathetic', icon: 'heart-outline' },
    { name: 'Direct', icon: 'arrow-right-bold' },
    { name: 'Enthusiastic', icon: 'star-outline' },
  ];

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.m,
      ...shadows.large,
      borderRadius: borderRadius.xl,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    toneRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.s,
      paddingVertical: spacing.m,
    },
    toneChip: {
      marginRight: spacing.s,
      marginBottom: spacing.s,
      backgroundColor: colors.cardAlt,
      borderRadius: borderRadius.large,
      height: 40,
      ...shadows.small,
    },
    selectedToneChip: {
      backgroundColor: colors.primary,
      elevation: 4,
    },
    toneText: {
      ...fonts.semiBold,
      color: colors.text,
      letterSpacing: 0.3,
    },
    selectedToneText: {
      color: '#fff',
    },
    helpText: {
      color: colors.textSecondary,
      fontSize: fonts.sizes.small,
      marginTop: spacing.s,
      ...fonts.regular,
      letterSpacing: 0.2,
    },
  });

  return (
    <Card style={styles.container}>
      <Card.Title 
        title="Select a Tone" 
        titleStyle={{ color: colors.text }}
        right={(props) => (
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        rightStyle={{ marginRight: spacing.m }}
      />
      <Card.Content>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.toneRow}>
            {tones.map((tone) => (
              <Chip
                key={tone.name}
                selected={selectedTone === tone.name}
                onPress={() => onSelectTone(tone.name)}
                style={[
                  styles.toneChip,
                  selectedTone === tone.name && styles.selectedToneChip
                ]}
                textStyle={[
                  styles.toneText,
                  selectedTone === tone.name && styles.selectedToneText
                ]}
                icon={tone.icon}
                mode={selectedTone === tone.name ? 'flat' : 'outlined'}
              >
                {tone.name}
              </Chip>
            ))}
          </View>
        </ScrollView>
        <Text style={styles.helpText}>
          Select a tone for your message response
        </Text>
      </Card.Content>
    </Card>
  );
};

export default ToneSelector;