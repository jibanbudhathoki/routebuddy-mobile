import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWallet } from "../hooks/useWallet";
import { withdrawSchema } from "../validations/withdraw.schema";
import { getAuthSession } from "../../auth/services/authStorage";

export function WithdrawScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { balance, withdraw, isWithdrawing } = useWallet();

  const [email, setEmail] = useState("");
  const [amountStr, setAmountStr] = useState(
    balance.withdrawableBalance > 0 ? balance.withdrawableBalance.toFixed(2) : ""
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getAuthSession().then((session) => {
      if (isMounted && session?.user?.email) {
        setEmail(session.user.email);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const formattedWithdrawable = balance.withdrawableBalance.toFixed(2);

  const handleSendTransfer = async () => {
    setErrorMessage(null);
    const cleanEmail = email.trim();
    const parsedAmount = parseFloat(amountStr) || balance.withdrawableBalance;

    if (parsedAmount <= 0) {
      setErrorMessage("Withdrawal amount must be greater than $0.00");
      return;
    }

    if (parsedAmount > balance.withdrawableBalance) {
      setErrorMessage(
        `Amount cannot exceed your available balance of $${formattedWithdrawable}`
      );
      return;
    }

    const result = withdrawSchema.safeParse({
      email: cleanEmail,
      amount: parsedAmount,
    });
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message || "Please check your inputs"
      );
      return;
    }

    try {
      const res = await withdraw(cleanEmail, parsedAmount);
      router.replace({
        pathname: "/wallet/withdraw-success",
        params: {
          email: res.email,
          securityAnswer: res.securityAnswer,
          amount: res.amount.toString(),
        },
      });
    } catch {
      // Error handled by hook toast
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Withdraw</Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Headline & Description */}
          <View style={styles.headlineSection}>
            <Text style={styles.title}>Withdraw your earnings</Text>
            <Text style={styles.subtitle}>
              Enter your payout destination email and the amount you'd like to withdraw.
            </Text>
          </View>

          {/* Available to Withdraw Box */}
          <View style={styles.availableBox}>
            <View style={styles.availableTextCol}>
              <Text style={styles.availableLabel}>Available to withdraw</Text>
              <Text style={styles.availableAmount}>
                ${formattedWithdrawable}
              </Text>
            </View>

            <View style={styles.dollarCircle}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={34}
                color={theme.colors.success}
              />
            </View>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Amount input */}
            <View style={styles.amountHeaderRow}>
              <Text style={styles.inputLabel}>Withdrawal amount</Text>
              <TouchableOpacity
                onPress={() => setAmountStr(formattedWithdrawable)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.maxButtonText}>Use Max</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                placeholderTextColor={theme.colors.muted}
                value={amountStr}
                onChangeText={(text) => {
                  setAmountStr(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Email input */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: theme.spacing.md }}>
              <Text style={styles.inputLabel}>
                Destination Email (Interac e-Transfer)
              </Text>
              {email ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MaterialCommunityIcons name="check-decagram" size={14} color={theme.colors.success} />
                  <Text style={{ fontSize: 12, fontWeight: "600", color: theme.colors.success }}>Verified Account</Text>
                </View>
              ) : null}
            </View>
            <View
              style={[
                styles.inputWrapper,
                errorMessage ? styles.inputError : undefined,
              ]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color={theme.colors.text}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="recipient@example.com"
                placeholderTextColor={theme.colors.muted}
                value={email}
                editable={!email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.helperText}>
              An administrator will send the Interac e-Transfer to this registered account email.
            </Text>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </View>

          {/* Action CTA */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isWithdrawing ? styles.submitButtonDisabled : undefined,
              ]}
              onPress={handleSendTransfer}
              disabled={isWithdrawing}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Send via E-transfer"
            >
              {isWithdrawing ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.onPrimary}
                />
              ) : (
                <Text style={styles.submitButtonText}>Send via E-transfer</Text>
              )}
            </TouchableOpacity>

            <View style={styles.securityRow}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={20}
                color={theme.colors.text}
              />
              <Text style={styles.securityText}>
                For your security, the e-transfer will be sent to the email you
                provide.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl + 20,
    gap: theme.spacing.lg,
  },
  headlineSection: {
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  availableBox: {
    backgroundColor: theme.colors.successSoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availableTextCol: {
    gap: 4,
  },
  availableLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.success,
  },
  availableAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.success,
  },
  dollarCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    gap: 8,
  },
  amountHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  maxButtonText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginRight: 6,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: -2,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  inputWrapper: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: "500",
  },
  actionSection: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.muted,
    lineHeight: 18,
  },
}));
