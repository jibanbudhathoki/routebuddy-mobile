import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '../../../shared/components/Button';
import { useVerifyEmail } from '../hooks/useVerifyEmail';

type EmailVerificationModalProps = {
  email: string;
  visible: boolean;
  onVerified: () => void;
};

const codeLength = 6;

export function EmailVerificationModal({
  email,
  visible,
  onVerified,
}: EmailVerificationModalProps) {
  const [code, setCode] = useState('');
  const codeInputRef = useRef<TextInput>(null);
  const { isSubmitting, verifyEmail } = useVerifyEmail(email);

  async function handleVerify() {
    if (code.length !== codeLength || isSubmitting) {
      return;
    }

    if (await verifyEmail(code)) {
      onVerified();
    }
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={() => undefined}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="email-check-outline"
              size={66}
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
              onChangeText={(value) =>
                setCode(value.replace(/\D/g, '').slice(0, codeLength))
              }
              style={styles.hiddenInput}
              textContentType="oneTimeCode"
              value={code}
            />
          </Pressable>

          <Text style={styles.helperText}>
            Didn’t get a code? Check your spam or junk folder.
          </Text>

          <Button
            title="Verify"
            accessibilityLabel="Verify email address"
            disabled={code.length !== codeLength}
            loading={isSubmitting}
            onPress={handleVerify}
            style={styles.verifyButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    maxWidth: 440,
    padding: theme.spacing.lg,
    width: '100%',
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 64,
    height: 104,
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    width: 104,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  email: {
    color: theme.colors.text,
    fontSize: 15,
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
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    height: 54,
    justifyContent: 'center',
    maxWidth: 54,
  },
  activeCodeCell: {
    borderWidth: 2,
  },
  codeDigit: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '600',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  helperText: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: theme.spacing.lg,
  },
  icon: {
    color: theme.colors.text,
  },
}));
