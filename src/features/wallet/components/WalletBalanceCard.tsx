import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WalletBalance } from "../types/wallet.types";

interface WalletBalanceCardProps {
  balance: WalletBalance;
}

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
  const { theme } = useUnistyles();

  const formattedTotal = balance.totalBalance.toFixed(2);
  const formattedWithdrawable = balance.withdrawableBalance.toFixed(2);
  const formattedEscrow = balance.escrowBalance.toFixed(2);

  return (
    <View style={styles.cardContainer}>
      {/* Top Header inside Card */}
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={22}
            color={theme.colors.white}
          />
        </View>
        <View style={styles.topTextCol}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.walletNameLabel}>Route Buddy Wallet</Text>
        </View>
      </View>

      {/* Hero Balance Amount */}
      <Text style={styles.heroAmount}>${formattedTotal}</Text>

      {/* Two Sub-cards */}
      <View style={styles.subCardsRow}>
        {/* Withdrawable */}
        <View style={styles.subCard}>
          <View style={styles.subCardHeader}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: theme.colors.success },
              ]}
            />
            <Text style={styles.subCardTitle}>Withdrawable</Text>
          </View>
          <Text style={styles.subCardAmount}>${formattedWithdrawable}</Text>
        </View>

        {/* Pending in Escrow */}
        <View style={styles.subCard}>
          <View style={styles.subCardHeader}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: theme.colors.secondary },
              ]}
            />
            <Text style={styles.subCardTitle}>Pending in escrow</Text>
          </View>
          <Text style={styles.subCardAmount}>${formattedEscrow}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  cardContainer: {
    backgroundColor: theme.colors.cardVisa,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  topTextCol: {
    marginLeft: theme.spacing.md,
  },
  totalBalanceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.white,
  },
  walletNameLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  heroAmount: {
    fontSize: 42,
    fontWeight: "800",
    color: theme.colors.white,
    letterSpacing: -0.5,
  },
  subCardsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  subCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  subCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  subCardAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 6,
  },
}));
