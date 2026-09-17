import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '../../../shared/components/Button';
import { AppScreen } from '../../../shared/components/AppScreen';
import { TextField } from '../../../shared/components/TextField';

type AuthScreenProps = {
  onAuthenticated: () => void;
};

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email.trim() ? 'Enter your email address.' : undefined;
  const passwordError = submitted && !password ? 'Enter your password.' : undefined;
  const canContinue = Boolean(email.trim() && password);

  function handleContinue() {
    setSubmitted(true);

    if (canContinue) {
      onAuthenticated();
    }
  }

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ROUTEBUDDY</Text>
          <Text style={styles.title}>Welcome back.</Text>
          <Text style={styles.description}>
            Sign in to keep your routes, places, and travel plans together.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Email address"
            placeholder="you@example.com"
            error={emailError}
            onChangeText={setEmail}
            value={email}
          />
          <TextField
            autoCapitalize="none"
            autoComplete="password"
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            error={passwordError}
            onChangeText={setPassword}
            value={password}
          />
          <Button title="Continue" onPress={handleContinue} style={styles.button} />
        </View>

        <Text style={styles.footer}>New to RouteBuddy? Create an account</Text>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  keyboardView: {
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: theme.spacing.md,
  },
  form: {
    gap: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: theme.spacing.xl,
    textAlign: 'center',
  },
}));