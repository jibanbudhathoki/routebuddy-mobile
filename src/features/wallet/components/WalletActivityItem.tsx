import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WalletActivity } from "../types/wallet.types";

interface WalletActivityItemProps {
  activity: WalletActivity;
}

export function WalletActivityItem({ activity }: WalletActivityItemProps) {
  const { theme } = useUnistyles();

  const isWithdrawal = activity.type === "withdrawal";
  const isPending = activity.status === "pending";

  const renderIcon = () => {
    if (isPending) {
      return (
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.colors.secondarySoft },
          ]}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            size={22}
            color={theme.colors.secondary}
          />
        </View>
      );
    }

    if (isWithdrawal) {
      return (
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.colors.primarySoft },
          ]}
        >
          <MaterialCommunityIcons
            name="bank-outline"
            size={22}
            color={theme.colors.primary}
          />
        </View>
      );
    }

    // Completed earnings
    return (
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: theme.colors.successSoft },
        ]}
      >
        <MaterialCommunityIcons
          name="arrow-bottom-left"
          size={22}
          color={theme.colors.success}
        />
      </View>
    );
  };

  const formattedAmount = `${activity.isPositive ? "+" : "-"}$${activity.amount.toFixed(2)}`;

  return (
    <View style={styles.cardContainer}>
      {renderIcon()}

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {activity.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {activity.date} · {activity.category}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            activity.isPositive && !isPending && { color: theme.colors.success },
          ]}
        >
          {formattedAmount}
        </Text>

        {isPending && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>Pending</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  cardContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
  },
  amountContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  amountText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  pendingBadge: {
    backgroundColor: theme.colors.secondarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.secondary,
  },
}));
