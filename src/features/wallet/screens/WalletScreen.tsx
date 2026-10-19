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
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWallet } from "../hooks/useWallet";
import { WalletBalanceCard } from "../components/WalletBalanceCard";
import { PendingFundsNotice } from "../components/PendingFundsNotice";
import { WalletActivityItem } from "../components/WalletActivityItem";
import { WithdrawalRequestsCard } from "../components/WithdrawalRequestsCard";

export function WalletScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { balance, activities, withdrawalRequests, isLoading } = useWallet();

  const formattedWithdrawable = balance.withdrawableBalance.toFixed(2);

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

        <Text style={styles.headerTitle}>Wallet</Text>

        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Balance Card */}
          <WalletBalanceCard balance={balance} />

          {/* Withdraw CTA */}
          <View style={styles.withdrawSection}>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => router.push("/wallet/withdraw")}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Withdraw"
            >
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={20}
                color={theme.colors.onPrimary}
                style={styles.withdrawIcon}
              />
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>

            <Text style={styles.withdrawNoticeText}>
              Up to ${formattedWithdrawable} · processed via Interac e-Transfer
            </Text>
          </View>

          {/* Pending Funds Notice */}
          <PendingFundsNotice />

          {/* Withdrawal Requests */}
          <WithdrawalRequestsCard requests={withdrawalRequests} />

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="View all recent activity"
              >
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <WalletActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No recent activity yet.</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  withdrawSection: {
    gap: theme.spacing.sm,
  },
  withdrawButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  withdrawIcon: {
    marginRight: theme.spacing.sm,
  },
  withdrawButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  withdrawNoticeText: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: "center",
  },
  activitySection: {
    gap: theme.spacing.md,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  activityList: {
    gap: theme.spacing.sm,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
}));
