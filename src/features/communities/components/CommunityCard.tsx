import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Community } from "../types/community";

interface CommunityCardProps {
  community: Community;
  actionLabel?: string;
  actionLoading?: boolean;
  actionDisabled?: boolean;
  onAction?: () => void;
}

export function CommunityCard({
  community,
  actionLabel,
  actionLoading = false,
  actionDisabled = false,
  onAction,
}: CommunityCardProps) {
  const { theme } = useUnistyles();
  const statusLabel =
    community.status === "pending" ? "Pending approval" : community.type;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="account-group-outline"
          size={24}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.details}>
        <View style={styles.titleLine}>
          <Text style={styles.name}>{community.name}</Text>
          <View
            style={[
              styles.badge,
              community.status === "pending" && styles.pendingBadge,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                community.status === "pending" && styles.pendingBadgeText,
              ]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
        {community.city || community.province ? (
          <Text style={styles.location}>
            {[community.city?.name, community.province?.name]
              .filter(Boolean)
              .join(", ")}
          </Text>
        ) : null}
        {actionLabel && onAction ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{
              disabled: actionDisabled || actionLoading,
              busy: actionLoading,
            }}
            disabled={actionDisabled || actionLoading}
            onPress={onAction}
            style={[
              styles.actionButton,
              (actionDisabled || actionLoading) && styles.actionDisabled,
            ]}
          >
            <Text style={styles.actionText}>
              {actionLoading ? "Joining..." : actionLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  details: {
    flex: 1,
  },
  titleLine: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    justifyContent: "space-between",
  },
  name: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  badge: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  pendingBadge: {
    backgroundColor: theme.colors.secondarySoft,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  pendingBadgeText: {
    color: theme.colors.text,
    textTransform: "none",
  },
  location: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: theme.spacing.xs,
  },
  actionButton: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  actionDisabled: {
    opacity: 0.55,
  },
  actionText: {
    color: theme.colors.onPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
}));
