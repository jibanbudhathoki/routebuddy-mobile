import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
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
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { authService } from "../services/auth.service";
import { getDeviceToken } from "../services/deviceToken";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import { loginSchema } from "../validations/auth";

type AuthScreenProps = {
  onAuthenticated: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
};

export function AuthScreen({
  onAuthenticated,
  onSignUp,
  onForgotPassword,
}: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const googleSignIn = useGoogleSignIn();
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  async function handleContinue() {
    setRequestError(undefined);
    setFieldErrors({});

    const validationResult = loginSchema.safeParse({
      email: email.trim(),
      password,
    });
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      return;
    }

    if (isSubmitting || googleSignIn.isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const deviceToken = await getDeviceToken();
      await authService.logIn({
        email: email.trim().toLowerCase(),
        password,
        deviceToken,
        platform: Platform.OS,
      });
      onAuthenticated();
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "We couldn't log you in. Please try again.",
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
          <View style={styles.keyboardView}>
            <WelcomeHero variant="flat" />
          </View>

          <View style={styles.bottomSheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back!</Text>
              <Text style={styles.description}>Log in to your account</Text>
            </View>

            <View style={styles.form}>
              <TextField
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
                placeholder="Email address"
                onChangeText={(text) => {
                  setEmail(text);
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                value={email}
                error={fieldErrors.email}
              />

              <TextField
                leftElement={
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={24}
                    color={styles.icon.color}
                    style={styles.inputIcon}
                  />
                }
                rightElement={
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={24}
                      color={styles.icon.color}
                    />
                  </Pressable>
                }
                autoCapitalize="none"
                autoComplete="password"
                placeholder="Password"
                secureTextEntry={!showPassword}
                onChangeText={(text) => {
                  setPassword(text);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                value={password}
                error={fieldErrors.password}
              />

              <Pressable onPress={onForgotPassword} accessibilityRole="button">
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </Pressable>

              {requestError ? (
                <Text accessibilityRole="alert" style={styles.requestError}>
                  {requestError}
                </Text>
              ) : null}

              <Button
                title="Log In"
                loading={isSubmitting}
                disabled={googleSignIn.isSubmitting}
                onPress={handleContinue}
                style={styles.button}
              />

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {googleSignIn.error ? (
                <Text accessibilityRole="alert" style={styles.requestError}>
                  {googleSignIn.error}
                </Text>
              ) : null}
              <GoogleSignInButton
                loading={googleSignIn.isSubmitting}
                onPress={async () => {
                  if (await googleSignIn.signIn()) {
                    onAuthenticated();
                  }
                }}
              />
            </View>

            <Text onPress={onSignUp} style={styles.footer}>
              <Text style={styles.footerText}>New to Route Buddy? </Text>
              <Text style={styles.footerLink}>Create an account</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -32,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl * 2,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "700",
  },
  description: {
    color: theme.colors.muted,
    fontSize: 16,
    marginTop: theme.spacing.xs,
  },
  form: {
    gap: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  icon: {
    color: theme.colors.muted,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginTop: -8,
    marginBottom: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.xs,
  },
  dividerContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: theme.spacing.xs,
  },
  dividerLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: theme.spacing.md,
  },
  footer: {
    marginTop: theme.spacing.xl,
    textAlign: "center",
  },
  footerText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  requestError: {
    color: theme.colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
}));
