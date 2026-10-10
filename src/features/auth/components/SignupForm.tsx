import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { Button } from "../../../shared/components/Button";
import { TextField } from "../../../shared/components/TextField";

type SignupFormProps = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  submitted: boolean;
  isSubmitting: boolean;
  requestError?: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTermsChange: () => void;
  onSubmit: () => void;
  onLogIn: () => void;
};

export function SignupForm({
  fullName,
  email,
  password,
  confirmPassword,
  acceptedTerms,
  submitted,
  isSubmitting,
  requestError,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTermsChange,
  onSubmit,
  onLogIn,
}: SignupFormProps) {
  const { theme } = useUnistyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <View style={styles.form}>
        <TextField
          leftElement={
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color={theme.colors.text}
            />
          }
          placeholder="Full Name"
          autoCapitalize="words"
          error={
            submitted && !fullName.trim() ? "Enter your full name." : undefined
          }
          onChangeText={onFullNameChange}
          value={fullName}
        />
        <TextField
          leftElement={
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color={theme.colors.text}
            />
          }
          placeholder="Email address"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          error={
            submitted && !email.trim() ? "Enter your email address." : undefined
          }
          onChangeText={onEmailChange}
          value={email}
        />
        <PasswordField
          placeholder="Password"
          value={password}
          visible={showPassword}
          error={submitted && !password ? "Enter a password." : undefined}
          onChangeText={onPasswordChange}
          onToggle={() => setShowPassword((current) => !current)}
        />
        <PasswordField
          placeholder="Confirm password"
          value={confirmPassword}
          visible={showConfirmPassword}
          error={
            submitted && (!confirmPassword || password !== confirmPassword)
              ? "Passwords must match."
              : undefined
          }
          onChangeText={onConfirmPasswordChange}
          onToggle={() => setShowConfirmPassword((current) => !current)}
        />
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms }}
          onPress={onTermsChange}
          style={styles.termsRow}
        >
          <MaterialCommunityIcons
            name={
              acceptedTerms
                ? "checkbox-marked-outline"
                : "checkbox-blank-outline"
            }
            size={27}
            color={theme.colors.text}
          />
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms of Service</Text>{" "}
            and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Pressable>
        {requestError ? (
          <Text accessibilityRole="alert" style={styles.requestError}>
            {requestError}
          </Text>
        ) : null}
        <Button
          title="Create Account"
          loading={isSubmitting}
          onPress={onSubmit}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        <SocialButton title="Continue with Google" />
      </View>
      <Text onPress={onLogIn} style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.footerLink}>Log in</Text>
        </Text>
      </Text>
    </>
  );
}

function PasswordField({
  placeholder,
  value,
  visible,
  error,
  onChangeText,
  onToggle,
}: {
  placeholder: string;
  value: string;
  visible: boolean;
  error?: string;
  onChangeText: (value: string) => void;
  onToggle: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <TextField
      leftElement={
        <MaterialCommunityIcons
          name="lock-outline"
          size={24}
          color={theme.colors.text}
        />
      }
      rightElement={
        <Pressable
          accessibilityLabel={`Toggle ${placeholder.toLowerCase()}`}
          onPress={onToggle}
        >
          <MaterialCommunityIcons
            name={visible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color={theme.colors.text}
          />
        </Pressable>
      }
      placeholder={placeholder}
      secureTextEntry={!visible}
      error={error}
      onChangeText={onChangeText}
      value={value}
    />
  );
}

function SocialButton({ title }: { title: string }) {
  return (
    <Pressable style={styles.socialButton}>
      <Image
        source={require("../../../../assets/google-logo.png")}
        style={styles.socialIcon}
        resizeMode="contain"
      />
      <Text style={styles.socialButtonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  form: { gap: theme.spacing.md },
  termsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  termsText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: { color: theme.colors.text, fontWeight: "600" },
  requestError: {
    color: theme.colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  dividerContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: theme.spacing.xs,
  },
  dividerLine: { backgroundColor: theme.colors.border, flex: 1, height: 1 },
  dividerText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: theme.spacing.md,
  },
  socialButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 54,
    position: "relative",
  },
  socialIcon: {
    left: theme.spacing.lg,
    position: "absolute",
    width: 24,
    height: 24,
  },
  socialButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: { marginTop: theme.spacing.lg, paddingVertical: theme.spacing.xs },
  footerText: { color: theme.colors.muted, fontSize: 15, textAlign: "center" },
  footerLink: { color: theme.colors.text, fontWeight: "600" },
}));
