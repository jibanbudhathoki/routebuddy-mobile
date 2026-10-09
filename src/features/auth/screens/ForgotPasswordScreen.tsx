import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppScreen } from '../../../shared/components/AppScreen';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/TextField';
import { useForgotPassword } from '../hooks/useForgotPassword';

type ForgotPasswordScreenProps = {
  onBack: () => void;
  onCodeSent: (email: string) => void;
};

export function ForgotPasswordScreen({
  onBack,
  onCodeSent,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const {
    clearFeedback,
    emailError,
    isSubmitting,
    sendResetCode,
  } = useForgotPassword();

  async function handleSendResetCode() {
    const sentEmail = await sendResetCode(email);
    if (sentEmail) {
      onCodeSent(sentEmail);
    }
  }

  return (
    <AppScreen>
      <View style={styles.screen}>
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={12}
          onPress={onBack}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color={styles.icon.color}
          />
        </Pressable>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.description}>
              No worries! Enter your email address and we’ll send you a code to
              reset your password.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Email address"
              leftElement={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color={styles.icon.color}
                  style={styles.inputIcon}
                />
              }
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Enter your email"
              returnKeyType="send"
              onChangeText={(value) => {
                setEmail(value);
                clearFeedback();
              }}
              value={email}
              error={emailError}
            />

            <Button
              title="Send reset code"
              accessibilityLabel="Send password reset code"
              loading={isSubmitting}
              onPress={handleSendResetCode}
              style={styles.submitButton}
            />

            <View style={styles.securityNote}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={34}
                color={styles.icon.color}
              />
              <Text style={styles.securityText}>
                For your security, never share your reset code with anyone.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={styles.icon.color}
            />
            <Text style={styles.loginButtonText}>Back to log in</Text>
            <View style={styles.loginButtonIconSpacer} />
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  backButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 44,
    width: 44,
  },
  content: {
    marginTop: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl * 1.5,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  icon: {
    color: theme.colors.text,
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  securityNote: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  securityText: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: theme.spacing.sm,
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  dividerLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: theme.colors.muted,
    fontSize: 13,
    paddingHorizontal: theme.spacing.md,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
  },
  loginButtonPressed: {
    opacity: 0.75,
  },
  loginButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  loginButtonIconSpacer: {
    width: 24,
  },
}));
