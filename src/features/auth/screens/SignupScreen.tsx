import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { Button } from "../../../shared/components/Button";
import { TextField } from "../../../shared/components/TextField";
import { WelcomeHero } from "../components/WelcomeHero";
import { authService } from "../services/auth.service";

type SignupScreenProps = {
  onAuthenticated: () => void;
  onLogIn: () => void;
};

export function SignupScreen({ onAuthenticated, onLogIn }: SignupScreenProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const canContinue = Boolean(
    fullName.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    acceptedTerms,
  );

  async function handleCreateAccount() {
    setSubmitted(true);
    setRequestError(undefined);

    if (!canContinue || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.signUp({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        password,
      });
      onAuthenticated();
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "We couldn't create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <WelcomeHero variant="flat" />

          <View style={styles.bottomSheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.description}>
                Join your community and start helping your neighbours.
              </Text>
            </View>

            <View style={styles.form}>
              <TextField
                leftElement={
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={24}
                    color={styles.icon.color}
                  />
                }
                placeholder="Full Name"
                autoCapitalize="words"
                error={
                  submitted && !fullName.trim()
                    ? "Enter your full name."
                    : undefined
                }
                onChangeText={setFullName}
                value={fullName}
              />
              <TextField
                leftElement={
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={24}
                    color={styles.icon.color}
                  />
                }
                placeholder="Email address"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                error={
                  submitted && !email.trim()
                    ? "Enter your email address."
                    : undefined
                }
                onChangeText={setEmail}
                value={email}
              />
              <PasswordField
                placeholder="Password"
                value={password}
                visible={showPassword}
                error={submitted && !password ? "Enter a password." : undefined}
                onChangeText={setPassword}
                onToggle={() => setShowPassword((current) => !current)}
              />
              <PasswordField
                placeholder="Confirm password"
                value={confirmPassword}
                visible={showConfirmPassword}
                error={
                  submitted &&
                  (!confirmPassword || password !== confirmPassword)
                    ? "Passwords must match."
                    : undefined
                }
                onChangeText={setConfirmPassword}
                onToggle={() => setShowConfirmPassword((current) => !current)}
              />

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acceptedTerms }}
                onPress={() => setAcceptedTerms((current) => !current)}
                style={styles.termsRow}
              >
                <MaterialCommunityIcons
                  name={
                    acceptedTerms
                      ? "checkbox-marked-outline"
                      : "checkbox-blank-outline"
                  }
                  size={27}
                  color={styles.termsIcon.color}
                />
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
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
                onPress={handleCreateAccount}
              />

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <SocialButton icon="google" title="Continue with Google" />
            </View>

            <Text onPress={onLogIn} style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.footerLink}>Log in</Text>
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

type PasswordFieldProps = {
  placeholder: string;
  value: string;
  visible: boolean;
  error?: string;
  onChangeText: (value: string) => void;
  onToggle: () => void;
};

function PasswordField({
  placeholder,
  value,
  visible,
  error,
  onChangeText,
  onToggle,
}: PasswordFieldProps) {
  return (
    <TextField
      leftElement={
        <MaterialCommunityIcons
          name="lock-outline"
          size={24}
          color={styles.icon.color}
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
            color={styles.icon.color}
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

type SocialButtonProps = {
  icon: "facebook" | "google";
  title: string;
};

function SocialButton({ icon, title }: SocialButtonProps) {
  return (
    <Pressable style={styles.socialButton}>
      {icon === "google" ? (
        <Image
          source={require("../../../../assets/google-logo.png")}
          style={[styles.socialIcon, { width: 24, height: 24 }]}
          resizeMode="contain"
        />
      ) : (
        <MaterialCommunityIcons
          name={icon}
          size={26}
          color={styles.facebookIcon.color}
          style={styles.socialIcon}
        />
      )}
      <Text style={styles.socialButtonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { backgroundColor: theme.colors.surface, flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  bottomSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    marginTop: -32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  header: { marginBottom: theme.spacing.lg },
  title: { color: theme.colors.primary, fontSize: 27, fontWeight: "700" },
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    marginTop: theme.spacing.xs,
  },
  form: { gap: theme.spacing.md },
  icon: { color: theme.colors.primary },
  termsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  termsIcon: { color: theme.colors.primary },
  termsText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: { color: theme.colors.primary, fontWeight: "600" },
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
  socialIcon: { left: theme.spacing.lg, position: "absolute" },
  facebookIcon: { color: theme.colors.facebook },
  googleIcon: { color: theme.colors.google },
  socialButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: { marginTop: theme.spacing.lg, paddingVertical: theme.spacing.xs },
  footerText: { color: theme.colors.muted, fontSize: 15, textAlign: "center" },
  footerLink: { color: theme.colors.primary, fontWeight: "600" },
  requestError: {
    color: theme.colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
}));
