import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { WelcomeHero } from "../components/WelcomeHero";
import { SignupForm } from "../components/SignupForm";
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

    if (!canContinue || isSubmitting) return;

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
            <SignupForm
              fullName={fullName}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              acceptedTerms={acceptedTerms}
              submitted={submitted}
              isSubmitting={isSubmitting}
              requestError={requestError}
              onFullNameChange={setFullName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onTermsChange={() => setAcceptedTerms((current) => !current)}
              onSubmit={handleCreateAccount}
              onLogIn={onLogIn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
}));
