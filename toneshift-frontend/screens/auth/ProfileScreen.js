import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput, Avatar, Card, Divider, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../utils/auth';
import { authApi } from '../../utils/api';
import { colors, spacing, fonts, shadows, borderRadius } from '../../utils/theme';

const ProfileScreen = () => {
  const { userData, updateUserData, signOut } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setEmail(userData.email || '');
      setNotificationsEnabled(userData.preferences?.notifications !== false);
      setDarkModeEnabled(userData.preferences?.darkMode === true);
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    if (!username || !email) return;
    
    setIsSaving(true);
    try {
      const updatedData = {
        username,
        email,
        preferences: {
          ...userData.preferences,
          notifications: notificationsEnabled,
          darkMode: darkModeEnabled
        }
      };
      
      await authApi.updateProfile(updatedData);
      updateUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Avatar.Text 
            size={80} 
            label={getInitials(userData.username)} 
            backgroundColor={colors.primary}
          />
          <Text style={styles.name}>{userData.username}</Text>
        </View>

        <Card style={styles.card}>
          <Card.Title title="Profile Information" />
          <Card.Content>
            {isEditing ? (
              <>
                <TextInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                />
                <View style={styles.buttonRow}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setIsEditing(false)}
                    style={styles.button}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={handleSaveProfile}
                    style={styles.button}
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    Save
                  </Button>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Username:</Text>
                  <Text style={styles.value}>{userData.username}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{userData.email}</Text>
                </View>
                <Button 
                  mode="contained" 
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Preferences" />
          <Card.Content>
            <View style={styles.preferenceRow}>
              <Text>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={colors.primary}
              />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.preferenceRow}>
              <Text>Dark Mode</Text>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        <Button 
          mode="outlined" 
          onPress={signOut}
          style={styles.logoutButton}
          icon="logout"
        >
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.m,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  name: {
    ...fonts.bold,
    fontSize: fonts.sizes.xl,
    marginTop: spacing.m,
    color: colors.text,
  },
  card: {
    marginBottom: spacing.m,
    ...shadows.medium,
  },
  input: {
    marginBottom: spacing.m,
    backgroundColor: colors.surface,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.s,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  editButton: {
    marginTop: spacing.m,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  label: {
    ...fonts.medium,
    color: colors.textSecondary,
    width: 100,
  },
  value: {
    flex: 1,
    color: colors.text,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
  },
  divider: {
    marginVertical: spacing.xs,
  },
  logoutButton: {
    marginTop: spacing.l,
    marginBottom: spacing.xxl,
    borderColor: colors.error,
    borderWidth: 1,
  },
});

export default ProfileScreen;