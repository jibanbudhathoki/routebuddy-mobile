import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { WithdrawalRequestItem } from "../types/wallet.types";

interface WithdrawalRequestsCardProps {
  requests: WithdrawalRequestItem[];
}

export function WithdrawalRequestsCard({ requests }: WithdrawalRequestsCardProps) {
  const { theme } = useUnistyles();

  if (!requests || requests.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Withdrawal Requests</Text>
        <Text style={styles.countBadge}>{requests.length}</Text>
      </View>

      <View style={styles.list}>
        {requests.map((item) => {
          const isPending = item.status === "pending";
          const isPaid = item.status === "paid";
          const isFailed = item.status === "failed";

          let statusLabel = "Pending Review";
          let statusBg: string = theme.colors.secondarySoft;
          let statusTextColor: string = theme.colors.secondary;
          let statusIcon: keyof typeof MaterialCommunityIcons.glyphMap = "clock-outline";

          if (isPaid) {
            statusLabel = "Paid";
            statusBg = theme.colors.successSoft;
            statusTextColor = theme.colors.success;
            statusIcon = "check-circle-outline";
          } else if (isFailed) {
            statusLabel = "Failed / Returned";
            statusBg = theme.colors.primarySoft;
            statusTextColor = theme.colors.error;
            statusIcon = "alert-circle-outline";
          }

          let formattedDate = "Recent";
          if (item.requestedAt) {
            try {
              formattedDate = new Date(item.requestedAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              );
            } catch {
              formattedDate = "Recent";
            }
          }

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.amountText}>
                    ${item.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.destinationText}>
                    {item.destinationEmail}
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: statusBg }]}>
                  <MaterialCommunityIcons
                    name={statusIcon}
                    size={14}
                    color={statusTextColor}
                    style={styles.badgeIcon}
                  />
                  <Text style={[styles.badgeText, { color: statusTextColor }]}>
                    {statusLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardBottom}>
                <Text style={styles.dateText}>Requested on {formattedDate}</Text>
                {isPending ? (
                  <Text style={styles.infoNote}>
                    Manual payout in review
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  countBadge: {
    backgroundColor: theme.colors.primarySoft,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.lg,
  },
  list: {
    gap: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  amountText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  destinationText: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    alignItems: "center",
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: theme.spacing.sm,
  },
  cardBottom: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  infoNote: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
}));
