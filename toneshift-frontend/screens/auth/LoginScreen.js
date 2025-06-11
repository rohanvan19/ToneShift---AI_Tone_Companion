import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../utils/api';
import { AuthContext } from '../../utils/auth';
import { colors, spacing, fonts, shadows, borderRadius } from '../../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const { signIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      setVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const { token, user } = response.data;
      console.log('Login successful, token received:', token ? 'YES' : 'NO');
      await signIn(token, user);
      // After login, verify token was stored
      const storedToken = await AsyncStorage.getItem('token');
      console.log('Token stored successfully:', storedToken ? 'YES' : 'NO');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Failed to login. Please try again.'
      );
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ToneShift</Text>
            <Text style={styles.tagline}>Your AI Tone Companion</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.l,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    ...fonts.bold,
    fontSize: 36,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...fonts.medium,
    fontSize: fonts.sizes.medium,
    color: colors.textSecondary,
  },
  formContainer: {
    ...shadows.medium,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: spacing.l,
  },
  input: {
    marginBottom: spacing.m,
    backgroundColor: colors.surface,
  },
  button: {
    marginTop: spacing.m,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.l,
  },
  footerText: {
    ...fonts.regular,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  linkText: {
    ...fonts.medium,
    color: colors.primary,
  },
  snackbar: {
    backgroundColor: colors.error,
  },
});

export default LoginScreen;