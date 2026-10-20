import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useProfile } from "../hooks/useProfile";
import { useChangeEmail } from "../hooks/useSecurity";
import { changeEmailSchema } from "../validations/security.schema";

const CODE_LENGTH = 6;

export function ChangeEmailScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { profile, refetch } = useProfile();
  const {
    step,
    pendingEmail,
    isRequesting,
    isVerifying,
    countdown,
    requestEmailChange,
    resendVerificationCode,
    verifyEmailChange,
    editEmail,
  } = useChangeEmail(() => {
    refetch();
  });

  // Step 1 State
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  // Step 2 State
  const [otpCode, setOtpCode] = useState("");
  const otpInputRef = useRef<TextInput>(null);

  const currentEmail = profile?.email || "";

  // Handle Step 1 Submit
  const handleRequestCode = async () => {
    setEmailTouched(true);

    if (newEmail.trim().toLowerCase() === currentEmail.trim().toLowerCase()) {
      setEmailError("New email must be different from your current email.");
      return;
    }

    const result = changeEmailSchema.safeParse({ email: newEmail.trim() });
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message || "Invalid email address");
      return;
    }

    setEmailError("");
    const { success } = await requestEmailChange({ email: result.data.email });
    if (success) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 300);
    }
  };

  // Handle Step 2 Submit
  const handleVerifyCode = async () => {
    if (otpCode.length !== CODE_LENGTH) return;
    await verifyEmailChange({ code: otpCode });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              if (step === "verify") {
                editEmail();
              } else {
                router.back();
              }
            }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {step === "request" ? "Change Email" : "Verify New Email"}
            </Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {step === "request" ? (
            /* STEP 1: REQUEST EMAIL CHANGE */
            <>
              {/* Compact Security Badge */}
              <View style={styles.introSection}>
                <View style={styles.introBadge}>
                  <MaterialCommunityIcons
                    name="email-sync-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.introBadgeText}>Email Settings</Text>
                </View>
                <Text style={styles.introSubtitle}>
                  Update the email address associated with your RouteBuddy account.
                </Text>
              </View>

              {/* Current Email Display */}
              <View style={styles.currentEmailCard}>
                <View style={styles.currentEmailHeader}>
                  <Text style={styles.fieldLabel}>CURRENT EMAIL</Text>
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={14}
                      color={theme.colors.success}
                    />
                    <Text style={styles.verifiedBadgeText}>Verified</Text>
                  </View>
                </View>
                <Text style={styles.currentEmailText}>
                  {currentEmail || "Loading..."}
                </Text>
              </View>

              {/* New Email Input */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>NEW EMAIL ADDRESS</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    emailTouched && emailError
                      ? styles.inputWrapperError
                      : undefined,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color={theme.colors.muted}
                    style={styles.leftIcon}
                  />
                  <TextInput
                    value={newEmail}
                    onChangeText={(val) => {
                      setNewEmail(val);
                      if (emailTouched) {
                        setEmailError("");
                      }
                    }}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="Enter new email address"
                    placeholderTextColor={theme.colors.muted}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    style={styles.textInput}
                  />
                  {newEmail.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setNewEmail("")}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel="Clear email"
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={18}
                        color={theme.colors.muted}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {emailTouched && emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Security Hint */}
              <View style={styles.noticeCard}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.noticeIcon}
                />
                <Text style={styles.noticeText}>
                  Your current email address will remain active until you confirm
                  the 6-digit code sent to your new email.
                </Text>
              </View>

              {/* Submit Button Step 1 */}
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title="Send Verification Code"
                  onPress={handleRequestCode}
                  loading={isRequesting}
                  disabled={newEmail.trim().length === 0 || isRequesting}
                />
              </View>
            </>
          ) : (
            /* STEP 2: VERIFY 6-DIGIT OTP */
            <>
              <View style={styles.introSection}>
                <View style={styles.introBadge}>
                  <MaterialCommunityIcons
                    name="email-check-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.introBadgeText}>Verification Required</Text>
                </View>
                <Text style={styles.introSubtitle}>
                  Enter the 6-digit code sent to:
                </Text>
                <View style={styles.pendingEmailRow}>
                  <Text style={styles.pendingEmailText}>{pendingEmail}</Text>
                  <TouchableOpacity
                    onPress={editEmail}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel="Edit email address"
                  >
                    <Text style={styles.editEmailLink}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 6-Digit Code Entry */}
              <Pressable
                accessibilityLabel={`Verification code, ${otpCode.length} of ${CODE_LENGTH} digits entered`}
                onPress={() => otpInputRef.current?.focus()}
                style={styles.codeEntryContainer}
              >
                {Array.from({ length: CODE_LENGTH }, (_, index) => {
                  const digit = otpCode[index] ?? "";
                  const isActive = otpCode.length === index;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.codeCell,
                        isActive && styles.activeCodeCell,
                        digit ? styles.filledCodeCell : undefined,
                      ]}
                    >
                      <Text style={styles.codeDigit}>{digit}</Text>
                    </View>
                  );
                })}
                <TextInput
                  ref={otpInputRef}
                  accessibilityLabel="Enter the 6-digit verification code"
                  autoComplete="one-time-code"
                  keyboardType="number-pad"
                  maxLength={CODE_LENGTH}
                  onChangeText={(val) =>
                    setOtpCode(val.replace(/\D/g, "").slice(0, CODE_LENGTH))
                  }
                  style={styles.hiddenInput}
                  textContentType="oneTimeCode"
                  value={otpCode}
                />
              </Pressable>

              {/* Resend Section */}
              <View style={styles.resendSection}>
                <Text style={styles.resendHint}>Didn't receive the email?</Text>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>
                    Resend code in {countdown}s
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={resendVerificationCode}
                    disabled={isRequesting}
                    accessibilityRole="button"
                    accessibilityLabel="Resend code"
                  >
                    <Text style={styles.resendButtonText}>
                      {isRequesting ? "Sending..." : "Resend Code"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Submit Button Step 2 */}
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title="Verify & Update Email"
                  onPress={handleVerifyCode}
                  loading={isVerifying}
                  disabled={otpCode.length !== CODE_LENGTH || isVerifying}
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 60,
    gap: theme.spacing.md,
  },
  introSection: {
    alignItems: "flex-start",
    gap: 6,
    marginBottom: theme.spacing.xs,
  },
  introBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
  },
  introBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  introSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    lineHeight: 18,
  },
  currentEmailCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    gap: 6,
  },
  currentEmailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.success,
  },
  currentEmailText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.muted,
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    height: 52,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    height: "100%",
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: "500",
    marginTop: 2,
  },
  noticeCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: "flex-start",
  },
  noticeIcon: {
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.text,
  },
  pendingEmailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  pendingEmailText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  editEmailLink: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  codeEntryContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    position: "relative",
    marginVertical: theme.spacing.md,
  },
  codeCell: {
    alignItems: "center",
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    flex: 1,
    height: 54,
    justifyContent: "center",
    maxWidth: 50,
  },
  activeCodeCell: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  filledCodeCell: {
    borderColor: theme.colors.primaryRaised,
  },
  codeDigit: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  resendSection: {
    alignItems: "center",
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  resendHint: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  buttonContainer: {
    marginTop: theme.spacing.sm,
    paddingBottom: 20,
  },
}));
