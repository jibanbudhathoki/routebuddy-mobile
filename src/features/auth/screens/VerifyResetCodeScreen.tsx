import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppScreen } from '../../../shared/components/AppScreen';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/TextField';
import { useResetPassword } from '../hooks/useResetPassword';

type VerifyResetCodeScreenProps = {
  email: string;
  onBack: () => void;
  onResetSuccess: () => void;
};

const codeLength = 6;

export function VerifyResetCodeScreen({
  email,
  onBack,
  onResetSuccess,
}: VerifyResetCodeScreenProps) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const codeInputRef = useRef<TextInput>(null);
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

          <View style={styles.card}>
            <View style={styles.emailIconCircle}>
              <MaterialCommunityIcons
                name="email-outline"
                size={38}
                color={styles.icon.color}
              />
            </View>

            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.description}>
              We’ve sent a 6-digit code to
            </Text>
            <Text style={styles.email}>{email}</Text>

            <Pressable
              accessibilityLabel={`Verification code, ${code.length} of ${codeLength} digits entered`}
              onPress={() => codeInputRef.current?.focus()}
              style={styles.codeEntry}
            >
              {Array.from({ length: codeLength }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.codeCell,
                    code.length === index && styles.activeCodeCell,
                    errors.code && styles.errorCodeCell,
                  ]}
                >
                  <Text style={styles.codeDigit}>{code[index] ?? ''}</Text>
                </View>
              ))}
              <TextInput
                ref={codeInputRef}
                accessibilityLabel="Enter the 6-digit verification code"
                autoComplete="one-time-code"
                keyboardType="number-pad"
                maxLength={codeLength}
                onChangeText={(value) => {
                  setCode(value.replace(/\D/g, '').slice(0, codeLength));
                  clearFieldError('code');
                }}
                style={styles.hiddenInput}
                textContentType="oneTimeCode"
                value={code}
              />
            </Pressable>
            {errors.code ? (
              <Text accessibilityRole="alert" style={styles.fieldError}>
                {errors.code}
              </Text>
            ) : null}

            <View style={styles.passwordFields}>
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
              accessibilityLabel="Verify code and reset password"
              loading={isSubmitting}
              disabled={
                code.length !== codeLength || !password || !confirmPassword
              }
              onPress={handleResetPassword}
              style={styles.verifyButton}
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
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    width: '100%',
  },
  emailIconCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 60,
    height: 84,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    width: 84,
  },
  title: {
    color: theme.colors.text,
    fontSize: 27,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  email: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  codeEntry: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    position: 'relative',
  },
  codeCell: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    height: 56,
    justifyContent: 'center',
    maxWidth: 58,
  },
  errorCodeCell: {
    borderColor: theme.colors.error,
  },
  activeCodeCell: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  codeDigit: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  passwordFields: {
    alignSelf: 'stretch',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  passwordToggle: {
    padding: theme.spacing.xs,
  },
  fieldError: {
    alignSelf: 'stretch',
    color: theme.colors.error,
    fontSize: 13,
    marginTop: theme.spacing.xs,
  },
  verifyButton: {
    marginTop: theme.spacing.md,
  },
  icon: {
    color: theme.colors.text,
  },
}));
