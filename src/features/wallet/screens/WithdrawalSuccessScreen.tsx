import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWallet } from "../hooks/useWallet";

export function WithdrawalSuccessScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { email = "john.doe@email.com", securityAnswer = "91210204" } =
    useLocalSearchParams<{ email: string; securityAnswer: string }>();

  const { resendLink, isResending } = useWallet();

  const handleResend = async () => {
    await resendLink(email);
  };

  const handleBackToWallet = () => {
    router.replace("/wallet");
  };

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Centered Graphic Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.circleBg}>
              <MaterialCommunityIcons
                name="email-outline"
                size={64}
                color={theme.colors.primary}
              />
              <View style={styles.checkBadge}>
                <MaterialCommunityIcons
                  name="check"
                  size={22}
                  color={theme.colors.white}
                />
              </View>
            </View>
          </View>

          {/* Title & Sent Email */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Withdrawal Request Submitted</Text>
            <Text style={styles.subtitle}>
              Your request is pending manual processing. An administrator will send an Interac e-Transfer to:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* Security Answer Box */}
          <View style={styles.securityBox}>
            <View style={styles.securityHeaderRow}>
              <MaterialCommunityIcons
                name="information-outline"
                size={22}
                color={theme.colors.text}
                style={styles.infoIcon}
              />
              <Text style={styles.securityNoticeText}>
                If you don't have Auto Deposit enabled, please use this security answer:
              </Text>
            </View>

            <Text style={styles.securityCodeText}>{securityAnswer}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleBackToWallet}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Back to Wallet"
          >
            <Text style={styles.resendButtonText}>Back to Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.md,
  },
  circleBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.success,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  titleSection: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: "center",
  },
  emailText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  securityBox: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  securityHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
  },
  infoIcon: {
    marginTop: 2,
  },
  securityNoticeText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
    fontWeight: "500",
  },
  securityCodeText: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: 1.5,
    marginLeft: 30,
  },
  bottomActions: {
    width: "100%",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  resendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  backLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 4,
  },
  backLinkText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.text,
  },
}));
