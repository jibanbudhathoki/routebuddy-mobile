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
import { EmailVerificationModal } from "../components/EmailVerificationModal";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import { authService } from "../services/auth.service";
import { getDeviceToken } from "../services/deviceToken";
import { signUpSchema } from "../validations/auth";

type SignupScreenProps = {
  onEmailVerified: () => void;
  onAuthenticated: () => void;
  onLogIn: () => void;
};

export function SignupScreen({
  onEmailVerified,
  onAuthenticated,
  onLogIn,
}: SignupScreenProps) {
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
  const [verificationEmail, setVerificationEmail] = useState<string>();
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const googleSignIn = useGoogleSignIn();

  const validation = signUpSchema.safeParse({
    fullName,
    email,
    password,
    confirmPassword,
  });
  const fieldErrors = validation.success
    ? {}
    : validation.error.issues.reduce<Record<string, string>>((errors, issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
        return errors;
      }, {});

  async function handleCreateAccount() {
    setSubmitted(true);
    setRequestError(undefined);

    if (
      !validation.success ||
      !acceptedTerms ||
      isSubmitting ||
      googleSignIn.isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const deviceToken = await getDeviceToken();
      await authService.signUp({
        email: normalizedEmail,
        fullName: fullName.trim(),
        password,
        confirmPassword,
        termsAccepted: acceptedTerms,
        deviceToken,
        platform: Platform.OS,
      });
      setVerificationEmail(normalizedEmail);
      setIsVerificationVisible(true);
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
      <EmailVerificationModal
        email={verificationEmail ?? ""}
        visible={isVerificationVisible}
        onVerified={() => {
          setIsVerificationVisible(false);
          onEmailVerified();
        }}
      />
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
                    style={styles.inputIcon}
                  />
                }
                placeholder="Full Name"
                autoCapitalize="words"
                error={submitted ? fieldErrors.fullName : undefined}
                onChangeText={setFullName}
                value={fullName}
              />
              <TextField
                leftElement={
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={24}
                    color={styles.icon.color}
                    style={styles.inputIcon}
                  />
                }
                placeholder="Email address"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                error={submitted ? fieldErrors.email : undefined}
                onChangeText={setEmail}
                value={email}
              />
              <PasswordField
                placeholder="Password"
                value={password}
                visible={showPassword}
                error={submitted ? fieldErrors.password : undefined}
                onChangeText={setPassword}
                onToggle={() => setShowPassword((current) => !current)}
              />
              <PasswordField
                placeholder="Confirm password"
                value={confirmPassword}
                visible={showConfirmPassword}
                error={submitted ? fieldErrors.confirmPassword : undefined}
                onChangeText={setConfirmPassword}
                onToggle={() => setShowConfirmPassword((current) => !current)}
              />

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acceptedTerms }}
                onPress={() => {
                  setAcceptedTerms((current) => !current);
                  setRequestError(undefined);
                }}
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
              {submitted && !acceptedTerms ? (
                <Text accessibilityRole="alert" style={styles.requestError}>
                  Please accept the Terms of Service and Privacy Policy.
                </Text>
              ) : null}

              {requestError ? (
                <Text accessibilityRole="alert" style={styles.requestError}>
                  {requestError}
                </Text>
              ) : null}
              <Button
                title="Create Account"
                loading={isSubmitting}
                disabled={googleSignIn.isSubmitting}
                onPress={handleCreateAccount}
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
          style={styles.inputIcon}
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
  title: { color: theme.colors.text, fontSize: 27, fontWeight: "700" },
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    marginTop: theme.spacing.xs,
  },
  form: { gap: theme.spacing.md },
  icon: { color: theme.colors.text },
  inputIcon: { marginRight: theme.spacing.sm },
  termsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  termsIcon: { color: theme.colors.text },
  termsText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: { color: theme.colors.text, fontWeight: "600" },
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
  footer: { marginTop: theme.spacing.lg, paddingVertical: theme.spacing.xs },
  footerText: { color: theme.colors.muted, fontSize: 15, textAlign: "center" },
  footerLink: { color: theme.colors.text, fontWeight: "600" },
  requestError: {
    color: theme.colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
}));
