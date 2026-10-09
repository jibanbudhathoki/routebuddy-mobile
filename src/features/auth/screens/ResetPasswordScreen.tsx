import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppScreen } from '../../../shared/components/AppScreen';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/TextField';
import { useResetPassword } from '../hooks/useResetPassword';

type ResetPasswordScreenProps = {
  email: string;
  code: string;
  onBack: () => void;
  onResetSuccess: () => void;
};

export function ResetPasswordScreen({
  email,
  code,
  onBack,
  onResetSuccess,
}: ResetPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { clearFieldError, errors, isSubmitting, resetPassword } =
    useResetPassword(email);

  async function handleResetPassword() {
    if (await resetPassword(code, password, confirmPassword)) {
      onResetSuccess();
    }
  }

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityLabel="Back to code verification"
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

          <View style={styles.card}>
            <View style={styles.lockIconCircle}>
              <MaterialCommunityIcons
                name="lock-reset"
                size={38}
                color={styles.icon.color}
              />
            </View>
            <Text style={styles.title}>Create a new password</Text>
            <Text style={styles.description}>
              Choose a new password for {email}.
            </Text>

            <View style={styles.fields}>
              <TextField
                label="New password"
                autoCapitalize="none"
                autoComplete="new-password"
                placeholder="Enter new password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  clearFieldError('password');
                }}
                error={errors.password}
                rightElement={
                  <Pressable
                    accessibilityLabel={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    accessibilityRole="button"
                    onPress={() => setShowPassword((visible) => !visible)}
                    style={styles.passwordToggle}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color={styles.icon.color}
                    />
                  </Pressable>
                }
              />

              <TextField
                label="Confirm new password"
                autoCapitalize="none"
                autoComplete="new-password"
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  clearFieldError('confirmPassword');
                }}
                error={errors.confirmPassword}
                rightElement={
                  <Pressable
                    accessibilityLabel={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                    accessibilityRole="button"
                    onPress={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    style={styles.passwordToggle}
                  >
                    <MaterialCommunityIcons
                      name={
                        showConfirmPassword
                          ? 'eye-outline'
                          : 'eye-off-outline'
                      }
                      size={22}
                      color={styles.icon.color}
                    />
                  </Pressable>
                }
              />
            </View>

            <Button
              title="Reset password"
              accessibilityLabel="Reset password"
              loading={isSubmitting}
              disabled={!password || !confirmPassword}
              onPress={handleResetPassword}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  backButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 44,
    width: 44,
  },
  card: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginTop: theme.spacing.xl * 1.5,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    width: '100%',
  },
  lockIconCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 60,
    height: 96,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    width: 96,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  fields: {
    alignSelf: 'stretch',
    gap: theme.spacing.md,
  },
  passwordToggle: {
    padding: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  icon: {
    color: theme.colors.text,
  },
}));
