import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { changePasswordSchema } from "../validations/security.schema";
import { useChangePassword } from "../hooks/useSecurity";

export function ChangePasswordScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { changePassword, isLoading } = useChangePassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time criteria checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const isFormValid = hasMinLength && hasNumber && hasSymbol && isMatch;

  const handleSubmit = async () => {
    setTouched({ password: true, confirmPassword: true });

    const result = changePasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await changePassword({
      password: result.data.password,
      confirmPassword: result.data.confirmPassword,
    });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Compact Security Header */}
          <View style={styles.introSection}>
            <View style={styles.introBadge}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.introBadgeText}>Account Security</Text>
            </View>
            <Text style={styles.introSubtitle}>
              Set a strong password to protect your RouteBuddy account.
            </Text>
          </View>

          {/* New Password Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NEW PASSWORD</Text>
            <View
              style={[
                styles.inputWrapper,
                touched.password && errors.password
                  ? styles.inputWrapperError
                  : undefined,
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={theme.colors.muted}
                style={styles.leftIcon}
              />
              <TextInput
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (touched.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="Enter new password"
                placeholderTextColor={theme.colors.muted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.muted}
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            {/* Criteria Checklist */}
            <View style={styles.criteriaContainer}>
              <View style={styles.criteriaRow}>
                <MaterialCommunityIcons
                  name={hasMinLength ? "check-circle" : "checkbox-blank-circle-outline"}
                  size={16}
                  color={hasMinLength ? theme.colors.success : theme.colors.muted}
                />
                <Text
                  style={[
                    styles.criteriaText,
                    hasMinLength && styles.criteriaTextActive,
                  ]}
                >
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.criteriaRow}>
                <MaterialCommunityIcons
                  name={hasNumber ? "check-circle" : "checkbox-blank-circle-outline"}
                  size={16}
                  color={hasNumber ? theme.colors.success : theme.colors.muted}
                />
                <Text
                  style={[
                    styles.criteriaText,
                    hasNumber && styles.criteriaTextActive,
                  ]}
                >
                  Contains at least one number
                </Text>
              </View>
              <View style={styles.criteriaRow}>
                <MaterialCommunityIcons
                  name={hasSymbol ? "check-circle" : "checkbox-blank-circle-outline"}
                  size={16}
                  color={hasSymbol ? theme.colors.success : theme.colors.muted}
                />
                <Text
                  style={[
                    styles.criteriaText,
                    hasSymbol && styles.criteriaTextActive,
                  ]}
                >
                  Contains at least one symbol (!@#$%^&*)
                </Text>
              </View>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CONFIRM NEW PASSWORD</Text>
            <View
              style={[
                styles.inputWrapper,
                touched.confirmPassword && errors.confirmPassword
                  ? styles.inputWrapperError
                  : undefined,
              ]}
            >
              <MaterialCommunityIcons
                name="lock-check-outline"
                size={20}
                color={theme.colors.muted}
                style={styles.leftIcon}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (touched.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
                placeholder="Confirm new password"
                placeholderTextColor={theme.colors.muted}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.muted}
                />
              </TouchableOpacity>
            </View>
            {touched.confirmPassword && errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}

            {confirmPassword.length > 0 && !errors.confirmPassword && (
              <View style={styles.matchIndicatorRow}>
                <MaterialCommunityIcons
                  name={isMatch ? "check-circle" : "close-circle"}
                  size={16}
                  color={isMatch ? theme.colors.success : theme.colors.error}
                />
                <Text
                  style={[
                    styles.matchText,
                    {
                      color: isMatch ? theme.colors.success : theme.colors.error,
                    },
                  ]}
                >
                  {isMatch ? "Passwords match" : "Passwords do not match"}
                </Text>
              </View>
            )}
          </View>

          {/* Security Notice Card */}
          <View style={styles.noticeCard}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={theme.colors.primary}
              style={styles.noticeIcon}
            />
            <Text style={styles.noticeText}>
              After updating your password, your session on this device will stay
              active. Any other existing sessions may be required to sign in again.
            </Text>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Update Password"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={!isFormValid || isLoading}
            />
          </View>
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
  criteriaContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm + 2,
    gap: 6,
    marginTop: 4,
  },
  criteriaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  criteriaText: {
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: "500",
  },
  criteriaTextActive: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  matchIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "600",
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
  buttonContainer: {
    marginTop: theme.spacing.sm,
    paddingBottom: 20,
  },
}));
